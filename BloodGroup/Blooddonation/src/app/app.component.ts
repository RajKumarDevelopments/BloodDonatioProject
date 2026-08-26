import { Component } from '@angular/core';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx'
import { NavController } from '@ionic/angular';
import { PushnotificationService } from '../app/Services/push/pushnotification.service'
//RambabuP
import { Platform, AlertController } from '@ionic/angular';
//import { register } from 'swiper/element/bundle';
import { GeneralService } from './Services/Generalservice/generalservice.service';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { PermissionService } from './Services/permission/permission.service';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { GeolocationserviceService } from './Services/locationservice/geolocationservice.service'
//register();
import { LanguageTranslatorService } from './Services/LanguageServices/language-translator.service'
import { App } from '@capacitor/app';

//==============
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  UserDetails: any;
  UserDetails1: any;
  expiryCallstatus: any;
  Flag: any;
  ids: any=1;
  currentLanguage = 'English';
  todaydate: any;
  WeeklyTimes2: any;
    expirystatus: any;
    expirydates: any;
    expiryNotificationstatus: any;
    expirySmsstatus: any;
    expiryEmailstatus: any;
    expiryWhatsappstatus: any;
  UnlimiteTimes: any;
  WeeklyTimes  :any;
  MonthlyTimes :any;
  dailyTimes   :any;
  onedayTimes: any;
  MonthlyTimes2: any; dailyTimes2: any; onedayTimes2: any;
  UnlimiteTimes2: any;
    Noticeids: any;
  Expirys: any;
  Expirydays1: any; Expirydays: any;
    Role: any;

  lastBackTime: number = 0;
  isExitAlertOpen: boolean = false;

  constructor(private alertController: AlertController,private languageService: LanguageTranslatorService,
private geolocationService: GeolocationserviceService,private permissionService: PermissionService, private androidFullScreen: AndroidFullScreen, public navCtrl: NavController,
    private menu: MenuController, private router: Router,
    private push: PushnotificationService, private platform: Platform, private general: GeneralService) {
    this.androidFullScreen.isImmersiveModeSupported()
    //.then(() => this.androidFullScreen.immersiveMode())
    //.catch(err => console.log(err));
    this.initializeApp();
    this.Navigation();
    this.setupBackButtonHandler();

    this.push.addListeners();
    this.push.registerNotifications();
    this.push.getDeliveredNotifications();
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);

    this.Expirydays1 = localStorage.getItem("Expiry");
    this.Expirydays = JSON.parse(this.Expirydays1);
    if (this.Expirydays != null) {
      setInterval(() => {
        this.currentdate()

        // this.loadUserDetails();
      }, 10000);
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menu.close();  // Close the menu on navigation
      }
    });

  }
  activeMenu: string = 'settings';  // Set the default active menu

  toggleActive(menu: string) {
    this.activeMenu = this.activeMenu === menu ? '' : menu;
  }

  setupBackButtonHandler() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, async () => {
        const currentUrl = (this.router.url || '').split(';')[0].split('?')[0];
        const isRootPage = currentUrl === '/home' || currentUrl === '/login' || currentUrl === '/language' || currentUrl === '/';
        const currentTime = new Date().getTime();

        if (this.isExitAlertOpen) {
          return;
        }

        if (currentTime - this.lastBackTime < 2000 || (isRootPage && this.lastBackTime > 0 && currentTime - this.lastBackTime < 3000)) {
          this.showExitConfirmAlert();
        } else {
          this.lastBackTime = currentTime;

          if (isRootPage) {
            this.general.presentToast('Press back again to exit');
          } else {
            this.navCtrl.back();
          }
        }
      });
    });
  }

  async showExitConfirmAlert() {
    if (this.isExitAlertOpen) return;
    this.isExitAlertOpen = true;

    const alert = await this.alertController.create({
      header: 'Exit App',
      message: 'Are you sure you want to close the app?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.isExitAlertOpen = false;
            this.lastBackTime = 0;
          }
        },
        {
          text: 'Yes / Close',
          handler: () => {
            this.isExitAlertOpen = false;
            try {
              App.exitApp();
            } catch (e) {
              if ((navigator as any)['app']) {
                (navigator as any)['app'].exitApp();
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async Logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            const apiUrl = localStorage.getItem('URL') || "https://letshelp.in/webservices/";
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('URL', apiUrl);
            this.navCtrl.navigateRoot('/login');
            window.location.reload();
          }
        }
      ]
    });
    await alert.present();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.menu.close();  // Ensure the menu closes when a link is clicked
  }
  opn(id:any) {
    this.ids=id
  }
   ngOnInit() {
    this.languageService.initGoogleTranslate();

    this.languageService.languageChanged.subscribe((language: any) => {
      this.currentLanguage = language;

    });
     this.getRole();
  }

  async showLocationAlert() {
    // Step 1: Show a custom alert asking for location permission
    const alert = await this.alertController.create({
      header: 'Location Access Required',
      message: 'This app needs access to your location. Please enable location services to proceed.',
      buttons: [
        {
          text: 'Deny',
          role: 'cancel',
          handler: () => {
            console.log('Location permission denied');
            this.general.presentToast('You have denied location access. Some features may not work.');
          }
        },
        {
          text: 'Allow',
          handler: async () => {
            console.log('Location permission allowed');
            await this.checkLocationServices();
          }
        }
      ]
    });

    await alert.present();
  }
  async checkLocationServices() {
    try {
      const permissionStatus = await this.geolocationService.getCurrentLocation();
      if (!permissionStatus) {
        // Handle permission denied scenario, you can show an alert or a toast
        this.general.presentToast('Location services are required for this app. Please enable them in settings.');
      }
    } catch (error) {
      console.error('Error checking location services:', error);
      this.general.presentToast('An error occurred while checking location services.');
    }
  }


  Navigation() {
    this.platform.ready().then(() => {
      const storedUser = localStorage.getItem("UserDetails");
      const apiUrl = localStorage.getItem('URL') || "https://letshelp.in/webservices/";
      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem('URL', apiUrl);
        this.navCtrl.navigateRoot('/login');
      } else {
        try {
          this.UserDetails = JSON.parse(storedUser);
          if (!this.UserDetails || !Array.isArray(this.UserDetails) || this.UserDetails.length === 0) {
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('URL', apiUrl);
            this.navCtrl.navigateRoot('/login');
          } else if (this.UserDetails[0].Status == false) {
            this.navCtrl.navigateRoot(['/registration', { RegFlag: 1 }]);
          } else {
            this.navCtrl.navigateRoot('/home');
          }
        } catch (e) {
          localStorage.clear();
          sessionStorage.clear();
          localStorage.setItem('URL', apiUrl);
          this.navCtrl.navigateRoot('/login');
        }
      }
    });
  }

  loadUserDetails() {
    let uploadFile = new FormData();
    uploadFile.append("Mobile", this.UserDetails[0].Phonenumber);
    var url = 'api/BG/checking_Mobile';
    this.general.PostData(url, uploadFile).subscribe((result: any) => {
      if (result != "NOTEXIST") {
        localStorage.setItem("UserDetails", JSON.stringify(result));
       // this.statusupdate();
      }
    })
  }

  statusupdate() {
    if (this.UserDetails[0].Status == false) {
      this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
  }

  extractAndStoreReferralCode(urlString: string) {
    if (!urlString) return;
    try {
      let code = '';
      const match = urlString.match(/[?&](?:referral_code|ref|invite_code|code)=([^&#]+)/i);
      if (match && match[1]) {
        code = decodeURIComponent(match[1]);
      } else {
        const referrerMatch = urlString.match(/[?&]referrer=([^&#]+)/i);
        if (referrerMatch && referrerMatch[1]) {
          const decoded = decodeURIComponent(referrerMatch[1]);
          const subMatch = decoded.match(/referral_code=([^&]+)/i);
          code = subMatch && subMatch[1] ? decodeURIComponent(subMatch[1]) : decoded;
        }
      }

      if (code && code.trim()) {
        localStorage.setItem('pendingReferralCode', code.trim());
        sessionStorage.setItem('pendingReferralCode', code.trim());
        console.log('Saved pending referral code from URL:', code.trim());
      }
    } catch (e) {
      console.error('Error extracting referral code:', e);
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Ensure dark mode is turned off by removing any dark mode classes
      document.body.classList.remove('dark');

      // Optionally, you can ensure that light mode styles are always applied
      document.body.style.setProperty('--ion-background-color', '#ffffff');
      document.body.style.setProperty('--ion-text-color', '#000000');
      // Add any other light mode styles you want to enforce

      // Listen for Deep Links / App URL Open (Capacitor)
      try {
        App.addListener('appUrlOpen', (event: any) => {
          if (event?.url) {
            console.log('App opened with URL:', event.url);
            this.extractAndStoreReferralCode(event.url);
          }
        });
      } catch (e) {
        console.error('Error attaching appUrlOpen listener:', e);
      }

      // Check current window URL / referrer for referral parameters
      if (typeof window !== 'undefined' && window.location) {
        this.extractAndStoreReferralCode(window.location.href);
        if (document.referrer) {
          this.extractAndStoreReferralCode(document.referrer);
        }
      }
    });
  }

  alrt() {
    if (this.UserDetails[0].Status == false) {
      //this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
  }
  currentdate() {
    let start = new Date(); // Today's date
    let endDate = new Date(start);
    const todayDateOnly = new Date().toLocaleDateString('en-CA'); // Also gives "2025-04-21"
    this.todaydate = todayDateOnly

    console.log('dat', this.todaydate)
   // this.getstatus();
  }

  getRole() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId)
    uploadfile.append("Param2", '1')
    var url = "api/BG/Get_RoleforRolechange";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.Role = data;
      // handle response here
    }, (error) => {
      console.error('Error fetching role:', error);
    });
  }



   



}

