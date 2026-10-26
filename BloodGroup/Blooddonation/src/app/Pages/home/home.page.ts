import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, ModalController, MenuController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Swiper } from 'swiper';
import { Share } from '@capacitor/share';
//import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
import { Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  UserDetails1: any; UserDetails: any;
  NewBloodDonateDate: any; Today: any; HomeUrL: any;
  banners: any;
  @ViewChild('swiper') swiperRef!: ElementRef;

  swiper: Swiper | undefined;
  NextEligibleDonateDate: any;
  Count: any;
  Counts: any;
  isLeader: boolean = false;

  constructor(private alertController: AlertController, public general: GeneralService, public navCtrl: NavController, public datePipe: DatePipe,
    private socialSharing: SocialSharing, private menuCtrl: MenuController) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    if (this.UserDetails1) {
      try {
        this.UserDetails = JSON.parse(this.UserDetails1);
      } catch (e) {
        console.error(e);
      }
    }
    this.HomeUrL = localStorage.getItem("URL");
    this.checkLeaderStatus();
  }

  ngOnInit() {
  
  }
  ionViewWillEnter() {  
    this.UserDetails1 = localStorage.getItem("UserDetails");
    if (this.UserDetails1) {
      try {
        this.UserDetails = JSON.parse(this.UserDetails1);
      } catch (e) {
        console.error(e);
      }
    }
    this.checkLeaderStatus();
    this.getNotificationCount();
    this.getdonatelast();
    this.GetBanners();
  }
  ngAfterViewInit() {
    this.swiper = new Swiper(this.swiperRef.nativeElement, {
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      }
    });
  }

  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }
  nav() {
    this.navCtrl.navigateForward('/home');
  }
  goToProfile() {
    this.navCtrl.navigateForward('/profiledetails');
  }
  goToNotifications() {
    this.navCtrl.navigateForward('/notifications');
  }
  openMenu() {
    this.menuCtrl.enable(true);
    this.menuCtrl.open('end');
  }
  goNext() {
    this.swiper?.slideNext();
  }

  goPrev() {
    this.swiper?.slidePrev();
  }

  GetBanners() {
    var url = "api/BG/GetBanners"
    this.general.GetData(url).subscribe((data: any) => {
      this.banners = data
    })
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  async InviteFrinds() {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    if (this.UserDetails1) {
      try {
        this.UserDetails = JSON.parse(this.UserDetails1);
      } catch (e) {
        console.error(e);
      }
    }

    if (!this.UserDetails) {
      this.general.presentToast('Please login to invite friends.');
      return;
    }

    const userObj = Array.isArray(this.UserDetails) ? this.UserDetails[0] : this.UserDetails;
    if (!userObj) {
      this.general.presentToast('Please login to invite friends.');
      return;
    }

    if (userObj.Status === false) {
      this.general.presentAlert(
        "Alert",
        "Please activate the mail and proceed with the other operations in the application..."
      );
      return;
    }

    const RefferCode = userObj.Reffercode || userObj.RefferCode || userObj.ReferralCode || userObj.Reffer_Code || '';
    const baseUrl = "https://play.google.com/store/apps/details?id=com.gg.Bloodgroup";
    const shareUrl = RefferCode
      ? `${baseUrl}&referrer=${encodeURIComponent('referral_code=' + RefferCode)}`
      : baseUrl;

    const text = `Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it’s giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe.

Use my referral code: ${RefferCode}
Download App: ${shareUrl}`;

    try {
      await Share.share({
        title: 'Lets Help - Blood Donation',
        text: text,
        dialogTitle: 'Share with your friends'
      });
    } catch (error) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Lets Help - Blood Donation',
            text: text
          });
          return;
        } catch (e) {
          console.log('Navigator share cancelled/failed:', e);
        }
      }

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
          this.general.presentToast('Referral invitation link copied to clipboard!');
        } catch (e) {
          console.log('Clipboard error:', e);
        }
      }
    }
  }



  back(val: any) {
    this.navCtrl.navigateForward(['/multipledonors', { id: val }])
  }

  organisePresentation() {
    this.navCtrl.navigateForward(['/myprofile', { from: 'home' }]);
  }

  getUser(): any {
    if (!this.UserDetails) return null;
    return Array.isArray(this.UserDetails) ? this.UserDetails[0] : this.UserDetails;
  }

  checkLeaderStatus() {
    const user = this.getUser();
    if (!user) {
      this.isLeader = false;
      return;
    }

    const roleId = Number(user.RoleId);
    const hasLeaderRole =
      roleId === 4 ||
      user.Rolestatus === true ||
      user.Rolestatus === 'true' ||
      user.Rolestatus === 1 ||
      user.Rolestatus === '1' ||
      user.RoleStatus === true ||
      user.RoleStatus === 'true' ||
      user.RoleStatus === 1 ||
      user.RoleStatus === '1';

    this.isLeader = !!hasLeaderRole;

    if (user.RegId) {
      this.getLeaderStatusFromServer(user.RegId);
    }
  }

  getLeaderStatusFromServer(regId: any) {
    const uploadfile = new FormData();
    uploadfile.append("Param1", regId);
    uploadfile.append("Param2", '1');
    const url = "api/BG/Get_RoleforRolechange";
    this.general.PostData(url, uploadfile).subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          const serverRoleId = Number(data[0].RoleId);
          if (serverRoleId === 4 || data[0].Rolestatus === true || data[0].RoleStatus === true) {
            this.isLeader = true;
          } else if (serverRoleId === 2 && !data[0].Rolestatus && !data[0].RoleStatus) {
            const user = this.getUser();
            if (user && Number(user.RoleId) !== 4 && user.Rolestatus !== true && user.Rolestatus !== 'true') {
              this.isLeader = false;
            }
          }
        }
      },
      (error: any) => {
        console.error('Error fetching role for leader status:', error);
      }
    );
  }

  getdonatelast() {
    const user = this.getUser();
    if (!user || !user.RegId) return;
    var uploadfile = new FormData();
    uploadfile.append("Param1", user.RegId);
    uploadfile.append("Param2", '2');
    var url = "api/BG/Get_RoleforRolechange";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.NextEligibleDonateDate = data[0].NextEligibleDonateDate;
      } else {
        this.NextEligibleDonateDate = null;
      }
    }, (error) => {
      console.error('Error fetching role:', error);
    });
  }

  getNotificationCount() {
    const user = this.getUser();
    if (!user || !user.RegId) return;
    var uploadfile = new FormData();
    uploadfile.append("Param1", user.RegId);
    uploadfile.append("Param2", '2');
    var url = "api/BG/UpdateNotificationstatus";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.Counts = data;
      if (this.Counts && this.Counts.length > 0) {
        this.Count = this.Counts[0].Count;
      } else {
        this.Count = 0;
      }
    }, (error) => {
      console.error("Error updating notification status:", error);
    });
  }
}
