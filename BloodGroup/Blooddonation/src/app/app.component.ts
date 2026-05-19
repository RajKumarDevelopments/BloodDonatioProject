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
  constructor(private alertController: AlertController,private languageService: LanguageTranslatorService,
private geolocationService: GeolocationserviceService,private permissionService: PermissionService, private androidFullScreen: AndroidFullScreen, public navCtrl: NavController,
    private menu: MenuController, private router: Router,
    private push: PushnotificationService, private platform: Platform, private general: GeneralService) {
    this.androidFullScreen.isImmersiveModeSupported()
    //.then(() => this.androidFullScreen.immersiveMode())
    //.catch(err => console.log(err));
    this.initializeApp();
    this.Navigation();

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

  Logout() {  
    localStorage.removeItem("UserDetails");
    localStorage.removeItem("City");
    localStorage.removeItem("Distict");
    localStorage.removeItem("State");
    localStorage.removeItem("URL");
    localStorage.removeItem("selectedTab");
    localStorage.removeItem("URL");
    this.navCtrl.navigateForward('/login');
    window.location.reload();
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
      this.UserDetails = localStorage.getItem("UserDetails");
      this.UserDetails = JSON.parse(this.UserDetails);
      if (this.UserDetails == null) {
        this.navCtrl.navigateForward('/language');
      } else if (this.UserDetails != null) {
        if (this.UserDetails[0].Status == false) {
          this.navCtrl.navigateForward(['/registration', { RegFlag: 1 }]);
          //this.showLocationAlert();
        } else {
          this.navCtrl.navigateForward('/home');
          //this.showLocationAlert();
        }
        //this.navCtrl.navigateForward('/home');
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

  initializeApp() {
    this.platform.ready().then(() => {
      // Ensure dark mode is turned off by removing any dark mode classes
      document.body.classList.remove('dark');

      // Optionally, you can ensure that light mode styles are always applied
      document.body.style.setProperty('--ion-background-color', '#ffffff');
      document.body.style.setProperty('--ion-text-color', '#000000');
      // Add any other light mode styles you want to enforce
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

