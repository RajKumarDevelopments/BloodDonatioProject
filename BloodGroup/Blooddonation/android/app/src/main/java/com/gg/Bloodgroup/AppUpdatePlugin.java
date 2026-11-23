package com.gg.Bloodgroup;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.model.ActivityResult;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.android.gms.tasks.Task;

@CapacitorPlugin(name = "AppUpdatePlugin", requestCodes = {AppUpdatePlugin.UPDATE_REQUEST_CODE})
public class AppUpdatePlugin extends Plugin {
    private static final String TAG = "AppUpdatePlugin";
    public static final int UPDATE_REQUEST_CODE = 9001;
    private AppUpdateManager appUpdateManager;
    private boolean autoUpdateDismissed = false;

    @Override
    public void load() {
        super.load();
        try {
            appUpdateManager = AppUpdateManagerFactory.create(getContext());
        } catch (Exception e) {
            Log.e(TAG, "Error initializing AppUpdateManager in load", e);
        }
    }

    @PluginMethod
    public void checkAndStartUpdate(PluginCall call) {
        if (autoUpdateDismissed) {
            Log.d(TAG, "Automatic update was already dismissed by user in this session. Skipping.");
            JSObject res = new JSObject();
            res.put("status", "AUTO_UPDATE_DISMISSED");
            call.resolve(res);
            return;
        }

        if (appUpdateManager == null) {
            try {
                appUpdateManager = AppUpdateManagerFactory.create(getContext());
            } catch (Exception e) {
                JSObject res = new JSObject();
                res.put("status", "UNAVAILABLE");
                res.put("error", e.getMessage());
                call.resolve(res);
                return;
            }
        }

        try {
            Task<AppUpdateInfo> appUpdateInfoTask = appUpdateManager.getAppUpdateInfo();
            appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
                int updateAvailability = appUpdateInfo.updateAvailability();
                Log.d(TAG, "Google Play Update Availability: " + updateAvailability);

                if (updateAvailability == UpdateAvailability.UPDATE_AVAILABLE
                        && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                    // Google Play automatic in-app update available -> start immediate update
                    try {
                        AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build();
                        appUpdateManager.startUpdateFlowForResult(
                                appUpdateInfo,
                                getActivity(),
                                options,
                                UPDATE_REQUEST_CODE
                        );
                        JSObject res = new JSObject();
                        res.put("status", "IN_APP_UPDATE_STARTED");
                        res.put("availableVersionCode", appUpdateInfo.availableVersionCode());
                        call.resolve(res);
                    } catch (IntentSender.SendIntentException e) {
                        Log.e(TAG, "Failed to start Google Play update flow", e);
                        JSObject res = new JSObject();
                        res.put("status", "ERROR");
                        res.put("error", e.getMessage());
                        call.resolve(res);
                    }
                } else if (updateAvailability == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                    // Resume ongoing in-app update
                    try {
                        AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build();
                        appUpdateManager.startUpdateFlowForResult(
                                appUpdateInfo,
                                getActivity(),
                                options,
                                UPDATE_REQUEST_CODE
                        );
                        JSObject res = new JSObject();
                        res.put("status", "IN_APP_UPDATE_RESUMED");
                        call.resolve(res);
                    } catch (Exception e) {
                        JSObject res = new JSObject();
                        res.put("status", "ERROR");
                        call.resolve(res);
                    }
                } else {
                    JSObject res = new JSObject();
                    res.put("status", "NO_GOOGLE_PLAY_UPDATE");
                    res.put("updateAvailability", updateAvailability);
                    call.resolve(res);
                }
            }).addOnFailureListener(e -> {
                Log.w(TAG, "Google Play getAppUpdateInfo not available or failed: " + e.getMessage());
                JSObject res = new JSObject();
                res.put("status", "FAILED");
                res.put("error", e.getMessage());
                call.resolve(res);
            });
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error in checkAndStartUpdate", e);
            JSObject res = new JSObject();
            res.put("status", "ERROR");
            res.put("error", e.getMessage());
            call.resolve(res);
        }
    }

    @Override
    protected void handleOnActivityResult(int requestCode, int resultCode, Intent data) {
        super.handleOnActivityResult(requestCode, resultCode, data);
        if (requestCode == UPDATE_REQUEST_CODE) {
            Log.d(TAG, "In-app update onActivityResult: resultCode=" + resultCode);
            JSObject res = new JSObject();
            if (resultCode == Activity.RESULT_OK) {
                res.put("status", "UPDATE_ACCEPTED");
            } else if (resultCode == Activity.RESULT_CANCELED) {
                autoUpdateDismissed = true;
                res.put("status", "UPDATE_CANCELED");
            } else if (resultCode == ActivityResult.RESULT_IN_APP_UPDATE_FAILED) {
                autoUpdateDismissed = true;
                res.put("status", "UPDATE_FAILED");
            } else {
                autoUpdateDismissed = true;
                res.put("status", "UPDATE_NOT_COMPLETED");
                res.put("resultCode", resultCode);
            }
            notifyListeners("onUpdateResult", res);

            try {
                final String statusStr = res.getString("status");
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        if (getBridge() != null && getBridge().getWebView() != null) {
                            String js = "try { window.dispatchEvent(new CustomEvent('appUpdateResult', { detail: { status: '"
                                    + statusStr + "', resultCode: " + resultCode + " } })); } catch(e) {}";
                            getBridge().getWebView().evaluateJavascript(js, null);
                        }
                    });
                }
            } catch (Exception e) {
                Log.e(TAG, "Error evaluating JS event", e);
            }
        }
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        if (autoUpdateDismissed) {
            Log.d(TAG, "Automatic update previously dismissed by user in this session. Skipping onResume check.");
            return;
        }
        if (appUpdateManager != null) {
            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
                if (appUpdateInfo.updateAvailability() == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                    try {
                        AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build();
                        appUpdateManager.startUpdateFlowForResult(
                                appUpdateInfo,
                                getActivity(),
                                options,
                                UPDATE_REQUEST_CODE
                        );
                    } catch (Exception e) {
                        Log.e(TAG, "Error resuming update flow in handleOnResume", e);
                    }
                }
            });
        }
    }

    @PluginMethod
    public void resetAutoUpdateDismissed(PluginCall call) {
        autoUpdateDismissed = false;
        call.resolve();
    }
}
