import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx'
import { NavController } from '@ionic/angular';
import { PushnotificationService } from '../app/Services/push/pushnotification.service'
//RambabuP
import { Platform, AlertController } from '@ionic/angular';
//import { register } from 'swiper/element/bundle';
import { GeneralService } from './Services/Generalservice/generalservice.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
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
  ids: any = this.getSavedAccordionId();

  getSavedAccordionId(): any {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const saved = sessionStorage.getItem('side_menu_accordion_id');
        return saved !== null && saved !== undefined && saved !== '' ? Number(saved) : null;
      }
    } catch (e) {
      // ignore
    }
    return null;
  }
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
  WeeklyTimes: any;
  MonthlyTimes: any;
  dailyTimes: any;
  onedayTimes: any;
  MonthlyTimes2: any; dailyTimes2: any; onedayTimes2: any;
  UnlimiteTimes2: any;
  Noticeids: any;
  Expirys: any;
  Expirydays1: any; Expirydays: any;
  Role: any;

  lastBackTime: number = 0;
  isExitAlertOpen: boolean = false;
  openedFromSideMenu: boolean = false;
  urlBeforeSideMenu: string = '/home';
  currentSideMenuTarget: string = '';
  showSplashScreen: boolean = true;
  splashFading: boolean = false;
  isNavigatingAway: boolean = false;
  Version: string = '';
  showUpdateModal: boolean = false;
  installedVersion: string = '';
  latestVersion: string = '';
  isUpdating: boolean = false;
  updateReleaseNotes: string[] = [
    'Bug fixes and overall performance improvements',
    'Enhanced OTP auto-read & instant autofill verification',
    'Improved user interface styling, stability, and speed'
  ];
  constructor(private alertController: AlertController, private languageService: LanguageTranslatorService,
    private geolocationService: GeolocationserviceService, private permissionService: PermissionService, private androidFullScreen: AndroidFullScreen, public navCtrl: NavController,
    private menu: MenuController, private router: Router,
    private push: PushnotificationService, private platform: Platform, private general: GeneralService,
    private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    this.androidFullScreen.isImmersiveModeSupported()
    //.then(() => this.androidFullScreen.immersiveMode())
    //.catch(err => console.log(err));
    this.initializeApp();
    this.initSplashScreen();
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
      if (event instanceof NavigationStart) {
        const targetUrl = (event.url || '').split(';')[0].split('?')[0];
        if (targetUrl === '/home' || targetUrl === '/') {
          const wasOpen = sessionStorage.getItem('side_menu_was_open') === 'true';
          if (wasOpen) {
            this.ids = this.getSavedAccordionId();
            this.openMenuInstant();
          }
        } else {
          this.closeMenuInstant();
        }
      } else if (event instanceof NavigationEnd) {
        const destUrl = (event.urlAfterRedirects || event.url || '').split(';')[0].split('?')[0];

        // If user navigated to a page from the side menu and has now come back
        if (this.openedFromSideMenu && this.currentSideMenuTarget && destUrl !== this.currentSideMenuTarget) {
          const originUrl = this.urlBeforeSideMenu || '/home';
          this.openedFromSideMenu = false;
          this.currentSideMenuTarget = '';

          // If the page navigated to /home but originated from another page, return to origin
          if (destUrl === '/home' && originUrl !== '/home') {
            this.navCtrl.navigateBack(originUrl);
          }
        }

        if (destUrl === '/home' || destUrl === '/') {
          const wasOpen = sessionStorage.getItem('side_menu_was_open') === 'true';
          if (wasOpen) {
            if (this.ids == null) {
              this.ids = this.getSavedAccordionId();
            }
            this.openMenuInstant();
          }
        } else {
          this.closeMenuInstant();
        }
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
        if (this.isExitAlertOpen) {
          return;
        }

        try {
          const isMenuOpen = await this.menu.isOpen();
          if (isMenuOpen) {
            await this.menu.close();
            return;
          }
        } catch (e) {
          // ignore menu check error
        }

        const currentUrl = (this.router.url || '').split(';')[0].split('?')[0];
        const isHomePage = currentUrl === '/home' || currentUrl === '/';

        if (isHomePage) {
          this.showExitConfirmAlert();
        } else {
          this.lastBackTime = 0;
          this.navCtrl.back();
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

    alert.onDidDismiss().then(() => {
      this.isExitAlertOpen = false;
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

  onMenuOpened() {
    try {
      sessionStorage.setItem('side_menu_was_open', 'true');
    } catch (e) { }
  }

  onMenuClosed() {
    if (!this.isNavigatingAway) {
      try {
        sessionStorage.setItem('side_menu_was_open', 'false');
      } catch (e) { }
    }
  }

  async openMenuInstant() {
    try {
      this.menu.enable(true, 'end');
      const menuEl = await this.menu.get('end');
      if (menuEl) {
        await menuEl.setOpen(true, false);
      } else {
        await this.menu.open('end');
      }
    } catch (e) {
      try {
        await this.menu.open('end');
      } catch (err) { }
    }
  }

  async closeMenuInstant() {
    try {
      const menuEl = await this.menu.get('end');
      if (menuEl) {
        await menuEl.setOpen(false, false);
      } else {
        await this.menu.close('end');
      }
    } catch (e) {
      try {
        await this.menu.close('end');
      } catch (err) { }
    }
  }

  navigateFromMenu(path: string) {
    if (!path) return;
    const currentUrl = (this.router.url || '').split(';')[0].split('?')[0];
    this.urlBeforeSideMenu = currentUrl || '/home';
    this.currentSideMenuTarget = path.split(';')[0].split('?')[0];
    this.openedFromSideMenu = true;
    this.isNavigatingAway = true;
    try {
      sessionStorage.setItem('side_menu_was_open', 'true');
      if (this.ids != null) {
        sessionStorage.setItem('side_menu_accordion_id', String(this.ids));
      }
    } catch (e) { }
    // Close menu instantly so destination page is displayed without side menu overlay
    this.closeMenuInstant();
    this.navCtrl.navigateForward(path);
    setTimeout(() => {
      this.isNavigatingAway = false;
    }, 400);
  }

  navigateTo(path: string) {
    this.navigateFromMenu(path);
  }
  opn(id: any) {
    this.ids = this.ids == id ? null : id;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (this.ids != null) {
          sessionStorage.setItem('side_menu_accordion_id', String(this.ids));
        } else {
          sessionStorage.removeItem('side_menu_accordion_id');
        }
      }
    } catch (e) { }
  }
  ngOnInit() {
    if (this.ids == null) {
      this.ids = this.getSavedAccordionId();
    }
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
      // Ensure side menu is enabled and swipeable across all pages
      this.menu.enable(true, 'end');
      this.menu.swipeGesture(true, 'end');

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

      // Check app version and check for updates
      this.getAppVersion();

      // Listen for app resuming from background (e.g. after Google Play Store update)
      try {
        App.addListener('appStateChange', async (state: any) => {
          if (state && state.isActive && this.isUpdating) {
            this.isUpdating = false;
            await this.verifyUpdatedVersion();
          }
        });
      } catch (e) {
        console.error('Error attaching appStateChange listener:', e);
      }

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', async () => {
          if (!document.hidden && this.isUpdating) {
            this.isUpdating = false;
            await this.verifyUpdatedVersion();
          }
        });
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

  initSplashScreen() {
    setTimeout(() => {
      this.splashFading = true;
      setTimeout(() => {
        this.showSplashScreen = false;
      }, 600);
    }, 2400);
  }

  /**
   * Navigate to social media profile.
   * Attempts to open the installed native app on mobile first; falls back to browser if not installed.
   * Dummy links are used as placeholders and can be replaced with production account URLs/handles.
   */
  openSocialLink(platform: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const socialProfiles: Record<string, { appUrl: string; webUrl: string }> = {
      facebook: {
        appUrl: 'fb://facewebmodal/f?href=https://www.facebook.com/people/Lets-Help-Fdn/61591979917716/',
        webUrl: 'https://www.facebook.com/people/Lets-Help-Fdn/61591979917716/'
      },
      instagram: {
        appUrl: 'instagram://user?username=letshelp_fdn',
        webUrl: 'https://www.instagram.com/letshelp_fdn?mdxt=N2F0NjFpNmdyaXZ4'
      },
      threads: {
        appUrl: 'barcelona://user?username=letshelp_fdn',
        webUrl: 'https://www.threads.com/@letshelp_fdn'
      },
      twitter: {
        appUrl: 'twitter://user?screen_name=letshelp_Fdn',
        webUrl: 'https://x.com/letshelp_Fdn'
      },
      linkedin: {
        appUrl: 'linkedin://company/letshelpfoundation',
        webUrl: 'https://www.linkedin.com/company/letshelpfoundation/'
      }
    };

    const target = socialProfiles[platform];
    if (!target) return;

    const isNativeMobile = this.platform.is('hybrid') || this.platform.is('cordova') || this.platform.is('capacitor');

    if (isNativeMobile) {
      let appOpened = false;

      const visibilityHandler = () => {
        if (document.hidden) {
          appOpened = true;
        }
      };

      document.addEventListener('visibilitychange', visibilityHandler, { once: true });

      try {
        window.open(target.appUrl, '_system');
      } catch (e) {
        window.open(target.webUrl, '_system');
        return;
      }

      setTimeout(() => {
        document.removeEventListener('visibilitychange', visibilityHandler);
        if (!appOpened && !document.hidden) {
          window.open(target.webUrl, '_system');
        }
      }, 900);
    } else {
      window.open(target.webUrl, '_blank', 'noopener,noreferrer');
    }
  }
  cleanVersionString(ver: any): string {
    if (ver === null || ver === undefined) return '';
    const str = String(ver).trim();
    // Look for semantic version pattern first: e.g. 9.1.4 or 10.0.0
    const semverMatch = str.match(/\b\d+(\.\d+)+\b/);
    if (semverMatch) {
      return semverMatch[0];
    }
    const generalMatch = str.match(/\d+/);
    return generalMatch ? generalMatch[0] : str;
  }

  compareVersions(v1: string, v2: string): number {
    const clean1 = this.cleanVersionString(v1);
    const clean2 = this.cleanVersionString(v2);
    if (!clean1 && !clean2) return 0;
    if (!clean1) return -1;
    if (!clean2) return 1;

    const p1 = clean1.split('.').map(p => parseInt(p, 10) || 0);
    const p2 = clean2.split('.').map(p => parseInt(p, 10) || 0);
    const maxLen = Math.max(p1.length, p2.length);

    for (let i = 0; i < maxLen; i++) {
      const num1 = p1[i] !== undefined ? p1[i] : 0;
      const num2 = p2[i] !== undefined ? p2[i] : 0;
      if (num1 < num2) return -1;
      if (num1 > num2) return 1;
    }
    return 0;
  }

  getAppVersion() {
    try {
      var url = "api/BG/BG_APPVersion";
      this.general.GetData(url).subscribe(async (data: any) => {
        this.Version = data;
        console.log('AppUpdate -> Raw Version API response:', data);

        // 1. Safely parse JSON if response is a string
        let rawData = data;
        if (typeof rawData === 'string') {
          try {
            const parsed = JSON.parse(rawData);
            if (parsed) rawData = parsed;
          } catch (e) {
            // Keep as string
          }
        }

        // 2. Extract VersionCode and release notes
        let verCode = '';
        let notes: string[] = [];

        if (Array.isArray(rawData) && rawData.length > 0) {
          const item = rawData[0];
          if (typeof item === 'object' && item !== null) {
            verCode = item.VersionCode || item.versionCode || item.versioncode || item.Version || item.version || item.VCode || '';
            const rawNotes = item.ReleaseNotes || item.Notes || item.Description || item.changes;
            if (rawNotes) {
              notes = Array.isArray(rawNotes) ? rawNotes : [rawNotes];
            }
          } else if (typeof item === 'string' || typeof item === 'number') {
            verCode = String(item);
          }
        } else if (typeof rawData === 'object' && rawData !== null) {
          verCode = rawData.VersionCode || rawData.versionCode || rawData.versioncode || rawData.Version || rawData.version || rawData.VCode || '';
          const rawNotes = rawData.ReleaseNotes || rawData.Notes || rawData.Description || rawData.changes;
          if (rawNotes) {
            notes = Array.isArray(rawNotes) ? rawNotes : [rawNotes];
          }
        } else if (typeof rawData === 'string' || typeof rawData === 'number') {
          verCode = String(rawData);
        }

        if (verCode) {
          this.latestVersion = this.cleanVersionString(verCode);
        }

        if (notes && notes.length > 0) {
          this.updateReleaseNotes = notes;
        }

        // 3. Retrieve currently installed app version
        try {
          const info = await App.getInfo();
          if (info && info.version) {
            this.installedVersion = this.cleanVersionString(info.version);
          }
        } catch (e) {
          console.warn('Error reading installed app info:', e);
        }

        console.log('AppUpdate -> Installed:', this.installedVersion, '| Latest from API:', this.latestVersion);

        // 4. Compare installed version with latest version and update UI inside NgZone
        this.ngZone.run(() => {
          if (this.latestVersion && this.installedVersion) {
            const cmp = this.compareVersions(this.installedVersion, this.latestVersion);
            console.log('AppUpdate -> compareVersions result (negative means update available):', cmp);
            if (cmp < 0) {
              this.showUpdateModal = true;
              this.showSplashScreen = false;
            } else {
              this.showUpdateModal = false;
            }
          }
          this.cdr.detectChanges();
        });
      }, (error) => {
        console.error('Error fetching app version:', error);
      });
    } catch (e) {
      console.log('Error', e);
    }
  }

  async verifyUpdatedVersion() {
    try {
      const info = await App.getInfo();
      if (info && info.version) {
        this.installedVersion = this.cleanVersionString(info.version);
        if (this.latestVersion && this.compareVersions(this.installedVersion, this.latestVersion) >= 0) {
          this.ngZone.run(() => {
            this.showUpdateModal = false;
            this.cdr.detectChanges();
          });
          window.location.reload();
          return;
        }
      }
    } catch (e) {
      console.warn('Error verifying updated version:', e);
    }
    this.getAppVersion();
  }

  openPlayStore() {
    this.isUpdating = true;
    const packageName = 'com.gg.Bloodgroup';
    const marketUrl = `market://details?id=${packageName}`;
    const webUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

    try {
      if (this.platform.is('capacitor') || this.platform.is('android')) {
        window.open(marketUrl, '_system');
      } else {
        window.open(webUrl, '_system');
      }
    } catch (e) {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  }
}

