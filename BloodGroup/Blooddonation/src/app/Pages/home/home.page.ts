import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
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

  constructor(private alertController: AlertController, public general: GeneralService, public navCtrl: NavController, public datePipe: DatePipe,
    private socialSharing: SocialSharing) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.HomeUrL = localStorage.getItem("URL");
    if (this.UserDetails != null) {
     
    };
  }

  ngOnInit() {
  
  }
  ionViewWillEnter() {  
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
    if (this.UserDetails[0].Status == false) {
      this.general.presentAlert(
        "Alert",
        "Please activate the mail and proceed with the other operations in the application..."
      );
      return;
    }

    const RefferCode = this.UserDetails[0].Reffercode;
    const baseUrl = "https://letshelp.breakingindiaapp.com";  
    const text = `Blood donation is the real act of humanity. It costs nothing but saves a life.Donating blood is not just giving blood, it’s giving life.Every drop of blood is like a breath for someone out there. Donate and let them breathe.
 Use my referral code: ${RefferCode}
 Join now: ${baseUrl}`;

    try {
      await Share.share({
        title: 'Lets Help',
        text: text,
        url: baseUrl,
        dialogTitle: 'Share with your friends'
      });
    } catch (error) {      
    }
  }



  back(val: any) {
    this.navCtrl.navigateForward(['/multipledonors', { id: val }])
  }

  getdonatelast() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId)
    uploadfile.append("Param2", '2')
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
    debugger
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId);
    uploadfile.append("Param2", '2');
    var url = "api/BG/UpdateNotificationstatus";
    debugger
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
