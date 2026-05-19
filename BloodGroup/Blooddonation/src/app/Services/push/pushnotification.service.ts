import { Injectable } from '@angular/core';
import { PushNotificationSchema, PushNotifications, Token, ActionPerformed } from '@capacitor/push-notifications';
import { NotificationcountService } from '../notificationcount/notificationcount.service';
import { NavController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {
  private notificationEnabled: boolean = true;

  constructor(private NavCtrl: NavController, public notificationService: NotificationcountService, private alertCtrl: AlertController) { }



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



  async addListeners() {
    
    PushNotifications.createChannel({
      description: 'General Notifications',
      id: 'PushDefaultForeground',
      importance: 5,
      name: 'My notification channel',
      sound: 'mymusic.mp3',
      vibration: true,
      //defaultSound:false,
      visibility: 1
    }).then(() => {
      console.log('push channel created: ');
    }).catch((error:any) => {
      console.error('push channel error: ', error);
    });

    await PushNotifications.addListener('registration', (token: any) => {
      console.log('Registration token: ', token.value);
      localStorage.setItem("Token", JSON.stringify(token.value))
    });
    await PushNotifications.addListener('registrationError', (err:any) => {
      console.error('Registration error: ', err.error);
    });
    await PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      
      console.log('Push notification received: ', notification);
      // Increment the notification count when a push notification is received

      const currentCount = this.notificationService.getnotificationCount();
      this.notificationService.updateNotificationCount(currentCount + 1);
      console.log('count', currentCount);
      // Trigger a change detection cycle to update the UI
      // this.cdr.detectChanges();
      //if (notification.data ?.clickAction === 'bookings') {
      //  // Navigate to the 'bookings' page
      //  this.NavCtrl.navigateForward('/bookings');
      //}

    });
    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      // Check the actionId to determine the action
      if (notification.actionId === 'tap') {
        
        if (notification.notification.data?.clickAction != "PlayStore") {
          // Navigate to the 'bookings' page



          this.NavCtrl.navigateForward([notification.notification.data.clickAction, { BookingID: JSON.stringify(notification.notification.data.BookingID) }]);
        } else if (notification.notification.data?.clickAction == "PlayStore") {
          window.location.href = "https://play.google.com/store/apps/details?id=com.gg.yklabs";
        }
      }
    });
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }
    await PushNotifications.register();
  }
  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
}
