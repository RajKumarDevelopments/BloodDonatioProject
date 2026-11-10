package com.gg.Bloodgroup;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.common.api.CommonStatusCodes;
import com.google.android.gms.common.api.Status;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name = "SmsReceiverPlugin")
public class SmsReceiverPlugin extends Plugin {
    private static final String TAG = "SmsReceiverPlugin";
    private BroadcastReceiver smsConsentReceiver = null;
    private boolean isListening = false;
    private PluginCall activeCall = null;

    @PluginMethod
    public void startListening(PluginCall call) {
        try {
            stopListeningInternal();
            this.activeCall = call;

            // Start Google Play Services SMS User Consent (no permissions needed in Manifest)
            SmsRetrieverClient client = SmsRetriever.getClient(getContext());
            client.startSmsUserConsent(null)
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "Google Play Services SMS User Consent started successfully");
                    registerConsentReceiver();
                    JSObject ret = new JSObject();
                    ret.put("status", "LISTENING");
                    call.resolve(ret);
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to start SMS User Consent", e);
                    // Resolve gracefully so app flow is never interrupted
                    JSObject ret = new JSObject();
                    ret.put("status", "FAILED");
                    ret.put("error", e.getMessage());
                    call.resolve(ret);
                });
        } catch (Exception e) {
            Log.e(TAG, "Error in startListening", e);
            JSObject ret = new JSObject();
            ret.put("status", "ERROR");
            call.resolve(ret);
        }
    }

    private synchronized void registerConsentReceiver() {
        if (isListening && smsConsentReceiver != null) {
            return;
        }

        smsConsentReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent == null || !SmsRetriever.SMS_RETRIEVED_ACTION.equals(intent.getAction())) {
                    return;
                }

                Bundle extras = intent.getExtras();
                if (extras == null) {
                    return;
                }

                Status status = (Status) extras.get(SmsRetriever.EXTRA_STATUS);
                if (status == null) {
                    return;
                }

                switch (status.getStatusCode()) {
                    case CommonStatusCodes.SUCCESS:
                        Intent consentIntent = extras.getParcelable(SmsRetriever.EXTRA_CONSENT_INTENT);
                        try {
                            if (consentIntent != null && activeCall != null) {
                                startActivityForResult(activeCall, consentIntent, "consentCallback");
                            }
                        } catch (Exception e) {
                            Log.e(TAG, "Error launching consent intent", e);
                        }
                        break;
                    case CommonStatusCodes.TIMEOUT:
                        Log.d(TAG, "SMS User Consent timed out");
                        stopListeningInternal();
                        break;
                }
            }
        };

        IntentFilter filter = new IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                getContext().registerReceiver(smsConsentReceiver, filter, Context.RECEIVER_EXPORTED);
            } else {
                getContext().registerReceiver(smsConsentReceiver, filter);
            }
            isListening = true;
            Log.d(TAG, "SMS Consent Receiver registered successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error registering SMS Consent Receiver", e);
        }
    }

    @ActivityCallback
    private void consentCallback(PluginCall call, ActivityResult result) {
        if (result == null) {
            return;
        }

        if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
            String message = result.getData().getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE);
            Log.d(TAG, "SMS Consent received message: " + message);

            if (message != null) {
                String otp = extractOtp(message);
                if (otp != null && !otp.isEmpty()) {
                    Log.d(TAG, "Extracted OTP: " + otp);

                    JSObject ret = new JSObject();
                    ret.put("otp", otp);
                    ret.put("message", message);
                    notifyListeners("otpReceived", ret);

                    // Also dispatch DOM CustomEvent for seamless Angular capture
                    getBridge().executeOnMainThread(() -> {
                        if (getBridge() != null && getBridge().getWebView() != null) {
                            String js = "try { "
                                      + "  window.dispatchEvent(new CustomEvent('otpReceived', { detail: '" + otp + "' })); "
                                      + "} catch(e) { console.error('Error dispatching otpReceived', e); }";
                            getBridge().getWebView().evaluateJavascript(js, null);
                        }
                    });

                    stopListeningInternal();
                }
            }
        } else {
            Log.d(TAG, "SMS Consent rejected or canceled by user");
        }
    }

    @PluginMethod
    public void stopListening(PluginCall call) {
        stopListeningInternal();
        JSObject ret = new JSObject();
        ret.put("status", "STOPPED");
        call.resolve(ret);
    }

    private synchronized void stopListeningInternal() {
        if (isListening && smsConsentReceiver != null) {
            try {
                getContext().unregisterReceiver(smsConsentReceiver);
            } catch (Exception e) {
                Log.w(TAG, "Error unregistering SMS consent receiver", e);
            }
            smsConsentReceiver = null;
            isListening = false;
            Log.d(TAG, "SMS consent receiver unregistered");
        }
    }

    private String extractOtp(String message) {
        if (message == null || message.trim().isEmpty()) {
            return null;
        }

        // 1. Keyword followed by 4 digits: "OTP is 1234", "code: 1234", "verification code 1234"
        Pattern keywordPattern = Pattern.compile("(?i)(?:otp|code|verification|passcode|pin|login)[^0-9]{0,20}(\\b\\d{4}\\b)");
        Matcher keywordMatcher = keywordPattern.matcher(message);
        if (keywordMatcher.find()) {
            return keywordMatcher.group(1);
        }

        // 2. 4 digits followed by OTP/code: "1234 is your OTP"
        Pattern reversePattern = Pattern.compile("(?i)(\\b\\d{4}\\b)[^0-9]{0,20}(?:is your|otp|code|verification)");
        Matcher reverseMatcher = reversePattern.matcher(message);
        if (reverseMatcher.find()) {
            return reverseMatcher.group(1);
        }

        // 3. Fallback: match any standalone 4-digit number
        Pattern standalonePattern = Pattern.compile("\\b(\\d{4})\\b");
        Matcher standaloneMatcher = standalonePattern.matcher(message);
        if (standaloneMatcher.find()) {
            return standaloneMatcher.group(1);
        }

        return null;
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        stopListeningInternal();
    }
}
