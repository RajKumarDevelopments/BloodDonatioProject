import { Injectable, NgZone } from '@angular/core';
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { NotificationcountService } from '../notificationcount/notificationcount.service';
import { NavController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { GeneralService } from '../Generalservice/generalservice.service';

export interface TokenDiagnosticResult {
  token: string | null;
  stage: 'CACHED' | 'SUCCESS' | 'PLATFORM_NOT_SUPPORTED' | 'PERMISSION_DENIED' | 'REGISTRATION_CALL_FAILED' | 'FCM_REGISTRATION_ERROR' | 'TIMEOUT_NO_RESPONSE';
  errorDetails: string | null;
  fullReport: string;
}

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {
  private notificationEnabled: boolean = true;
  private listenersAdded: boolean = false;

  public diagLogs: string[] = [];
  public lastRegistrationError: string | null = null;
  public lastRegistrationToken: string | null = null;
  public lastPermissionStatus: string | null = null;
  public lastChannelStatus: string | null = null;

  constructor(
    private NavCtrl: NavController,
    public notificationService: NotificationcountService,
    private alertCtrl: AlertController,
    private zone: NgZone,
    private general: GeneralService
  ) { }

  private logDiag(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${msg}`;
    this.diagLogs.push(entry);
    console.log(`[PushDiag] ${entry}`);
  }



  async scheduleNotification(interval: 'oneday' | 'oneweek' | 'daily' | 'monthly') {
    console.log(`Turning off notifications for ${interval}`);

    this.notificationEnabled = false;
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] }); // Stop notifications

    // Save the disabled state and timestamp
    await Preferences.set({ key: 'notificationDisabled', value: 'true' });
    await Preferences.set({ key: 'disableTimestamp', value: Date.now().toString() });
    await this.openNotificationSettings();

    let timeDelay = this.getInterval(interval);

    setTimeout(async () => {
      const storedValue = await Preferences.get({ key: 'notificationDisabled' });
      if (storedValue.value === 'true') {
        this.enableNotifications();
      }
    }, timeDelay);
  }

  private getInterval(interval: string): number {
    switch (interval) {
      case 'oneday': return 24 * 60 * 60 * 1000;
      case 'oneweek': return 7 * 24 * 60 * 60 * 1000;
      case 'daily': return 24 * 60 * 60 * 1000;
      case 'monthly': return 30 * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  }

  async enableNotifications() {
    this.notificationEnabled = true;
    await Preferences.set({ key: 'notificationDisabled', value: 'false' });
    console.log("Re-enabling notifications...");

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Reminder',
          body: 'Your notifications are now enabled!',
          schedule: { at: new Date(new Date().getTime() + 5000) },
        },
      ],
    });
    console.log("Notification scheduled successfully!");
  }

  async openNotificationSettings() {
    if (Capacitor.getPlatform() === 'android') {
      await Browser.open({ url: 'android.settings.APP_NOTIFICATION_SETTINGS' });
    } else if (Capacitor.getPlatform() === 'ios') {
      await Browser.open({ url: 'app-settings:' });
    }
  }



  getStoredToken(): string | null {
    const raw = localStorage.getItem("Token");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  async getDeviceToken(): Promise<string | null> {
    const diag = await this.getDeviceTokenWithDiagnostics();
    return diag.token;
  }

  private generateDiagnosticReport(stage: string, token: string | null, error: string | null): string {
    const lines = [
      `Stage: ${stage}`,
      `Platform: ${Capacitor.getPlatform()} (Native: ${Capacitor.isNativePlatform()})`,
      `Permission Status: ${this.lastPermissionStatus || 'Not Checked'}`,
      `Channel Status: ${this.lastChannelStatus || 'Not Created'}`,
      `FCM Token: ${token ? (token.substring(0, 30) + '... [Total length: ' + token.length + ']') : 'null'}`,
      `Registration Error: ${error || this.lastRegistrationError || 'None'}`,
      ``,
      `Step-by-Step Diagnostic Logs:`,
      ...this.diagLogs.map(l => `  ${l}`)
    ];
    return lines.join('\n');
  }

  async getDeviceTokenWithDiagnostics(): Promise<TokenDiagnosticResult> {
    this.diagLogs = [];
    this.lastRegistrationError = null;
    this.logDiag('Starting FCM Token Diagnostic Run');

    // 1. Check existing stored token
    const existingToken = this.getStoredToken();
    if (existingToken) {
      this.lastRegistrationToken = existingToken;
      this.logDiag(`Found cached token in localStorage: ${existingToken.substring(0, 25)}...`);
      return {
        token: existingToken,
        stage: 'CACHED',
        errorDetails: null,
        fullReport: this.generateDiagnosticReport('CACHED', existingToken, null)
      };
    }

    // 2. Check platform
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    this.logDiag(`Platform check -> ${platform} (isNative: ${isNative})`);

    if (!isNative) {
      const errorMsg = `App is running on "${platform}" platform. Capacitor PushNotifications plugin is ONLY implemented for native Android and iOS devices or emulators. In a web browser (Chrome / localhost), FCM native token cannot be generated and will always return null.`;
      this.logDiag(`ERROR: ${errorMsg}`);
      return {
        token: null,
        stage: 'PLATFORM_NOT_SUPPORTED',
        errorDetails: errorMsg,
        fullReport: this.generateDiagnosticReport('PLATFORM_NOT_SUPPORTED', null, errorMsg)
      };
    }

    // 3. Ensure listeners are added
    this.logDiag('Ensuring notification listeners are registered...');
    await this.addListeners();

    // 4. Permission check & request
    try {
      this.logDiag('Checking push notification permission...');
      let permStatus = await PushNotifications.checkPermissions();
      this.lastPermissionStatus = permStatus.receive;
      this.logDiag(`Current permission status: ${permStatus.receive}`);

      if (permStatus.receive === 'prompt') {
        this.logDiag('Prompting user for notification permission...');
        permStatus = await PushNotifications.requestPermissions();
        this.lastPermissionStatus = permStatus.receive;
        this.logDiag(`User responded to permission prompt: ${permStatus.receive}`);
      }

      if (permStatus.receive !== 'granted') {
        const errorMsg = `Notification permission was not granted (Status: "${permStatus.receive}"). Android requires notifications to be allowed.`;
        this.logDiag(`ERROR: ${errorMsg}`);
        return {
          token: null,
          stage: 'PERMISSION_DENIED',
          errorDetails: errorMsg,
          fullReport: this.generateDiagnosticReport('PERMISSION_DENIED', null, errorMsg)
        };
      }
    } catch (permErr: any) {
      const errorMsg = `Exception during permission check/request: ${permErr?.message || JSON.stringify(permErr)}`;
      this.logDiag(`ERROR: ${errorMsg}`);
      return {
        token: null,
        stage: 'PERMISSION_DENIED',
        errorDetails: errorMsg,
        fullReport: this.generateDiagnosticReport('PERMISSION_DENIED', null, errorMsg)
      };
    }

    // 5. Trigger register()
    try {
      this.logDiag('Calling PushNotifications.register()...');
      await PushNotifications.register();
      this.logDiag('PushNotifications.register() call completed without throwing.');
    } catch (regErr: any) {
      const errorMsg = `Exception while calling PushNotifications.register(): ${regErr?.message || JSON.stringify(regErr)}`;
      this.lastRegistrationError = errorMsg;
      this.logDiag(`ERROR: ${errorMsg}`);
      return {
        token: null,
        stage: 'REGISTRATION_CALL_FAILED',
        errorDetails: errorMsg,
        fullReport: this.generateDiagnosticReport('REGISTRATION_CALL_FAILED', null, errorMsg)
      };
    }

    // 6. Wait for registration or registrationError callback
    this.logDiag('Waiting for Firebase to return token (listening for "registration" or "registrationError" event)...');
    const maxWaitMs = 5000;
    const intervalMs = 250;
    let elapsed = 0;

    while (elapsed < maxWaitMs) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      elapsed += intervalMs;

      // Check if registrationError was received
      if (this.lastRegistrationError) {
        this.logDiag(`Registration failed via "registrationError" event after ${elapsed}ms: ${this.lastRegistrationError}`);
        return {
          token: null,
          stage: 'FCM_REGISTRATION_ERROR',
          errorDetails: this.lastRegistrationError,
          fullReport: this.generateDiagnosticReport('FCM_REGISTRATION_ERROR', null, this.lastRegistrationError)
        };
      }

      // Check if registration token was received
      const token = this.getStoredToken() || this.lastRegistrationToken;
      if (token) {
        this.logDiag(`FCM token successfully received after ${elapsed}ms! Token: ${token.substring(0, 25)}...`);
        return {
          token: token,
          stage: 'SUCCESS',
          errorDetails: null,
          fullReport: this.generateDiagnosticReport('SUCCESS', token, null)
        };
      }
    }

    // 7. Timeout handling
    const timeoutMsg = `Timed out after ${maxWaitMs / 1000}s waiting for Firebase response. ` +
      `Neither "registration" nor "registrationError" was fired by Google Play Services / Firebase. ` +
      `Common causes: (1) Device has no internet or Firebase servers are blocked, ` +
      `(2) Google Play Services is missing or out-of-date on emulator/device, ` +
      `(3) SHA-1 / SHA-256 fingerprint missing in Firebase Console, ` +
      `(4) google-services.json package name does not match applicationId.`;
    this.logDiag(`TIMEOUT: ${timeoutMsg}`);

    return {
      token: null,
      stage: 'TIMEOUT_NO_RESPONSE',
      errorDetails: timeoutMsg,
      fullReport: this.generateDiagnosticReport('TIMEOUT_NO_RESPONSE', null, timeoutMsg)
    };
  }

  syncDeviceTokenToDb(token: string) {
    if (!token) return;
    try {
      const userDetailsStr = localStorage.getItem("UserDetails");
      if (userDetailsStr) {
        const userDetails = JSON.parse(userDetailsStr);
        if (userDetails && userDetails.length > 0 && userDetails[0].RegId) {
          const regId = userDetails[0].RegId;
          const array = [{
            RegId: regId,
            Devicetoken: token
          }];
          const formData = new FormData();
          formData.append('tokenDetails', JSON.stringify(array));
          this.general.PostData("api/BG/UpdateDeviceToken", formData).subscribe(
            (data: any) => {
              console.log('FCM token auto-synced to database successfully:', data);
            },
            (err: any) => {
              console.error('Failed to auto-sync FCM token to database:', err);
            }
          );
        }
      }
    } catch (e) {
      console.error('Error while checking UserDetails for token sync:', e);
    }
  }

  async addListeners() {
    if (this.listenersAdded) {
      return;
    }
    this.listenersAdded = true;

    if (!Capacitor.isNativePlatform()) {
      this.logDiag('PushNotifications listeners skipped: not on a native platform.');
      return;
    }

    try {
      await PushNotifications.createChannel({
        description: 'General Notifications',
        id: 'PushDefaultForeground',
        importance: 5,
        name: 'My notification channel',
        sound: 'mymusic.mp3',
        vibration: true,
        visibility: 1
      });
      this.lastChannelStatus = 'Created (PushDefaultForeground)';
      this.logDiag('Notification channel "PushDefaultForeground" created successfully.');
    } catch (error: any) {
      this.lastChannelStatus = `Error: ${error?.message || JSON.stringify(error)}`;
      this.logDiag(`Push channel creation warning: ${this.lastChannelStatus}`);
    }

    try {
      await PushNotifications.addListener('registration', (token: any) => {
        this.logDiag(`EVENT "registration": token received: ${token?.value ? token.value.substring(0, 25) + '...' : 'EMPTY'}`);
        if (token && token.value) {
          this.lastRegistrationToken = token.value;
          this.lastRegistrationError = null;
          localStorage.setItem("Token", JSON.stringify(token.value));
          this.syncDeviceTokenToDb(token.value);
        }
      });
      this.logDiag('Listener for "registration" registered successfully.');
    } catch (err: any) {
      this.logDiag(`Error attaching "registration" listener: ${err?.message || JSON.stringify(err)}`);
    }

    try {
      await PushNotifications.addListener('registrationError', (err: any) => {
        const errorMsg = err?.error || err?.message || JSON.stringify(err);
        this.lastRegistrationError = errorMsg;
        this.logDiag(`EVENT "registrationError": ${errorMsg}`);
      });
      this.logDiag('Listener for "registrationError" registered successfully.');
    } catch (err: any) {
      this.logDiag(`Error attaching "registrationError" listener: ${err?.message || JSON.stringify(err)}`);
    }

    await PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      this.zone.run(() => {
        console.log('Push notification received: ', notification);
        const currentCount = this.notificationService.getnotificationCount();
        this.notificationService.updateNotificationCount(currentCount + 1);
        console.log('count', currentCount);
      });
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      this.zone.run(() => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
        if (notification.actionId === 'tap') {
          if (notification.notification.data?.clickAction != "PlayStore") {
            let clickAction = notification.notification.data.clickAction;
            if (clickAction && clickAction.includes(';')) {
              let parts = clickAction.split(';');
              let route = parts[0];
              let params: any = {};
              for (let i = 1; i < parts.length; i++) {
                let [key, val] = parts[i].split('=');
                params[key] = val;
              }
              if (notification.notification.data.BookingID) {
                params['BookingID'] = JSON.stringify(notification.notification.data.BookingID);
              }
              this.NavCtrl.navigateForward([route, params]);
            } else {
              this.NavCtrl.navigateForward([clickAction, { BookingID: JSON.stringify(notification.notification.data.BookingID) }]);
            }
          } else if (notification.notification.data?.clickAction == "PlayStore") {
            window.location.href = "https://play.google.com/store/apps/details?id=com.gg.Bloodgroup";
          }
        }
      });
    });
  }

  async registerNotifications(): Promise<{ granted: boolean; error?: string }> {
    if (!Capacitor.isNativePlatform()) {
      const msg = 'PushNotifications registration skipped: not on a native platform.';
      this.logDiag(msg);
      return { granted: false, error: msg };
    }
    try {
      this.logDiag('Checking permissions in registerNotifications()...');
      let permStatus = await PushNotifications.checkPermissions();
      this.lastPermissionStatus = permStatus.receive;
      if (permStatus.receive === 'prompt') {
        this.logDiag('Requesting permissions in registerNotifications()...');
        permStatus = await PushNotifications.requestPermissions();
        this.lastPermissionStatus = permStatus.receive;
      }
      if (permStatus.receive !== 'granted') {
        const errorMsg = `Push notification permission denied by user, status: ${permStatus.receive}`;
        this.logDiag(errorMsg);
        return { granted: false, error: errorMsg };
      }
      this.logDiag('Calling PushNotifications.register()...');
      await PushNotifications.register();
      this.logDiag('PushNotifications.register() completed.');
      return { granted: true };
    } catch (err: any) {
      const errorMsg = `Error in registerNotifications(): ${err?.message || JSON.stringify(err)}`;
      this.lastRegistrationError = errorMsg;
      this.logDiag(errorMsg);
      return { granted: false, error: errorMsg };
    }
  }
  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
}
