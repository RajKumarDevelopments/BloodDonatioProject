import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { AlertController, IonAccordionGroup, IonItemSliding, NavController } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, OnDestroy {
  userdetails1: any;
  UserDetails: any;
  notification: any;
  accordionState: any;
  showExtraContent: boolean = false;
  activeAccordion: number | null = null;
  @ViewChild('notificationAccordionGroup', { static: false }) notificationAccordionGroup!: IonAccordionGroup;

  private refreshTimer: any = null;
  private isAppActive: boolean = true;
  private appStateListener: any = null;
  private isFetching: boolean = false;

  constructor(
    public general: GeneralService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.loadUserData();
    if (this.UserDetails && this.UserDetails[0] && this.UserDetails[0].Status == false) {
      // this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");
    } else if (this.UserDetails && this.UserDetails[0]) {
      this.updateNotificationStatus();
      this.getnotification();
    }
  }

  ngOnInit() {
    this.setupAppVisibilityListeners();
  }

  ionViewDidEnter() {
    this.loadUserData();
    this.startAutoRefresh();
  }

  ionViewWillLeave() {
    this.stopAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
    this.cleanupAppVisibilityListeners();
  }

  loadUserData() {
    this.userdetails1 = localStorage.getItem("UserDetails");
    if (this.userdetails1) {
      try {
        this.UserDetails = JSON.parse(this.userdetails1);
      } catch (e) {
        console.error("Error parsing UserDetails:", e);
      }
    }
  }

  setupAppVisibilityListeners() {
    // 1. Browser visibility change (tab hidden/shown, minimized)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    // 2. Capacitor App state change (for mobile app active/background)
    try {
      App.addListener('appStateChange', (state: any) => {
        this.isAppActive = state?.isActive !== false;
        if (!this.isAppActive) {
          this.stopAutoRefresh();
        } else {
          this.startAutoRefresh();
        }
      }).then((handle: any) => {
        this.appStateListener = handle;
      }).catch(() => {});
    } catch (e) {
      // Fallback for non-Capacitor environments
    }
  }

  onVisibilityChange = () => {
    if (typeof document !== 'undefined' && document.hidden) {
      this.isAppActive = false;
      this.stopAutoRefresh();
    } else {
      this.isAppActive = true;
      this.startAutoRefresh();
    }
  };

  cleanupAppVisibilityListeners() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
    if (this.appStateListener && typeof this.appStateListener.remove === 'function') {
      this.appStateListener.remove();
    }
  }

  startAutoRefresh() {
    this.stopAutoRefresh();
    const isVisible = typeof document === 'undefined' || !document.hidden;
    if (!this.isAppActive || !isVisible) {
      return;
    }
    this.refreshTimer = setInterval(() => {
      const activeAndVisible = this.isAppActive && (typeof document === 'undefined' || !document.hidden);
      if (activeAndVisible) {
        if (this.UserDetails && this.UserDetails[0] && this.UserDetails[0].RegId) {
          this.getnotification(true);
        }
      }
    }, 10000);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  trackByNotificationId(index: number, item: any): any {
    return item?.NotificationsID || index;
  }

  updateNotificationStatus() {
    if (!this.UserDetails || !this.UserDetails[0] || !this.UserDetails[0].RegId) {
      return;
    }
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId);
    uploadfile.append("Param2", '1');
    var url = "api/BG/UpdateNotificationstatus";

    this.general.PostData(url, uploadfile).subscribe((data: any) => {
    }, (error) => {
      console.error("Error updating notification status:", error);
    });
  }

  getnotification(isAutoRefresh: boolean = false) {  
    if (this.isFetching) {
      return;
    }
    if (!this.UserDetails || !this.UserDetails[0] || !this.UserDetails[0].RegId) {
      return;
    }

    this.isFetching = true;
    var uploadfile = new FormData();
    uploadfile.append("Param1", "1");
    uploadfile.append("Param2", this.UserDetails[0].RegId);
    var url = "api/BG/Get_Notification_basedon_UserId";
    
    this.general.PostData(url, uploadfile).subscribe(
      (data: any) => {       
        this.isFetching = false;
        const newNotifications = data || [];

        // If an accordion was open during auto-refresh, keep it open if it still exists
        if (isAutoRefresh && this.activeAccordion !== null && this.notification && this.notification[this.activeAccordion]) {
          const currentOpenId = this.notification[this.activeAccordion].NotificationsID;
          const newIndex = newNotifications.findIndex((item: any) => item.NotificationsID === currentOpenId);
          if (newIndex !== -1) {
            this.activeAccordion = newIndex;
          } else {
            this.activeAccordion = null;
          }
        } else if (!isAutoRefresh) {
          this.activeAccordion = null;
        }

        this.notification = newNotifications;
        this.accordionState = Array(this.notification.length).fill(false);
      },
      (error: any) => {
        this.isFetching = false;
        console.error("Error fetching notifications:", error);
        if (!isAutoRefresh) {
          this.notification = [];
          this.accordionState = [];
          this.activeAccordion = null;
        }
      }
    );
  }

  async confirmDelete(row: any, slidingItem?: IonItemSliding, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this notification?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            if (slidingItem) {
              slidingItem.close();
            }
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (slidingItem) {
              slidingItem.close();
            }
            this.deleteNotification(row);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteNotification(row: any) {
    var uploadfile = new FormData();
    uploadfile.append("Param1", "2");
    uploadfile.append("Param2", row.NotificationsID);
    var url = "api/BG/Get_Notification_basedon_UserId";

    this.general.PostData(url, uploadfile).subscribe(
      (data: any) => {
        if (this.notification && Array.isArray(this.notification)) {
          this.notification = this.notification.filter((item: any) => item.NotificationsID !== row.NotificationsID);
          this.accordionState = Array(this.notification.length).fill(false);
          if (this.activeAccordion !== null && this.activeAccordion >= this.notification.length) {
            this.activeAccordion = null;
          }
        }
        this.getnotification();
      },
      (error: any) => {
        console.error("Error deleting notification:", error);
        this.getnotification();
      }
    );
  }

  onAccordionChange(event: any) {
    const value = event?.detail?.value;
    if (value === null || value === undefined || value === '') {
      this.activeAccordion = null;
      return;
    }
    const index = parseInt(value, 10);
    if (!isNaN(index)) {
      this.activeAccordion = index;
    }
  }

  closeAccordion() {
    this.activeAccordion = null;
    if (this.notificationAccordionGroup) {
      this.notificationAccordionGroup.value = null;
    }
  }

  toggleContent() {
    this.showExtraContent = !this.showExtraContent;
  }

  open1(state: number) {
    this.accordionState = Array(this.notification.length).fill(state === 0 ? false : true);
  }

  navigate() {
    this.navCtrl.navigateForward('/home');
  }
}
