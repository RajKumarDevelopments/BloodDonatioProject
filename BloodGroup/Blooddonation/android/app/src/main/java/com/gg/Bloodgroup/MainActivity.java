package com.gg.Bloodgroup;

import android.os.Bundle;
import android.util.Log;
import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    private InstallReferrerClient referrerClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkInstallReferrer();
    }

    private void checkInstallReferrer() {
        try {
            referrerClient = InstallReferrerClient.newBuilder(this).build();
            referrerClient.startConnection(new InstallReferrerStateListener() {
                @Override
                public void onInstallReferrerSetupFinished(int responseCode) {
                    if (responseCode == InstallReferrerClient.InstallReferrerResponse.OK) {
                        try {
                            ReferrerDetails response = referrerClient.getInstallReferrer();
                            String referrerUrl = response.getInstallReferrer();
                            Log.d(TAG, "Install Referrer URL: " + referrerUrl);
                            if (referrerUrl != null && !referrerUrl.isEmpty()) {
                                handleReferrer(referrerUrl);
                            }
                            referrerClient.endConnection();
                        } catch (Exception e) {
                            Log.e(TAG, "Error getting install referrer details", e);
                        }
                    } else {
                        Log.d(TAG, "Install Referrer setup failed with response code: " + responseCode);
                    }
                }

                @Override
                public void onInstallReferrerServiceDisconnected() {
                    Log.d(TAG, "Install Referrer service disconnected");
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error starting install referrer client", e);
        }
    }

    private void handleReferrer(String referrer) {
        try {
            String code = null;
            String decoded = java.net.URLDecoder.decode(referrer, "UTF-8");
            
            if (decoded.contains("referral_code=")) {
                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("referral_code=([^&]+)", java.util.regex.Pattern.CASE_INSENSITIVE);
                java.util.regex.Matcher matcher = pattern.matcher(decoded);
                if (matcher.find()) {
                    code = matcher.group(1);
                }
            } else if (decoded.contains("ref=")) {
                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("ref=([^&]+)", java.util.regex.Pattern.CASE_INSENSITIVE);
                java.util.regex.Matcher matcher = pattern.matcher(decoded);
                if (matcher.find()) {
                    code = matcher.group(1);
                }
            } else if (decoded.contains("InviteCode=")) {
                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("InviteCode=([^&]+)", java.util.regex.Pattern.CASE_INSENSITIVE);
                java.util.regex.Matcher matcher = pattern.matcher(decoded);
                if (matcher.find()) {
                    code = matcher.group(1);
                }
            }

            if (code != null && !code.trim().isEmpty() && !"utm_source=google-play".equalsIgnoreCase(code.trim())) {
                final String referralCode = code.trim();
                runOnUiThread(() -> {
                    if (getBridge() != null && getBridge().getWebView() != null) {
                        String js = "try { "
                                  + "  localStorage.setItem('pendingReferralCode', '" + referralCode + "'); "
                                  + "  sessionStorage.setItem('pendingReferralCode', '" + referralCode + "'); "
                                  + "  window.dispatchEvent(new CustomEvent('referralCodeReceived', { detail: '" + referralCode + "' })); "
                                  + "} catch(e) { console.error('Error storing referral code', e); }";
                        getBridge().getWebView().evaluateJavascript(js, null);
                    }
                });
            }
        } catch (Exception e) {
            Log.e(TAG, "Error handling referrer", e);
        }
    }
}
