import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { IonAccordionGroup } from '@ionic/angular';
import { NavController } from '@ionic/angular';
//import { DatePipe } '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  userdetails1: any;
  UserDetails: any;
  notification: any;
  accordionState: any;
  showExtraContent: boolean = false;
  activeAccordion: number | null = null;
  @ViewChild('notificationAccordionGroup', { static: false }) notificationAccordionGroup!: IonAccordionGroup;
  constructor(public general: GeneralService, private navCtrl: NavController) {
    this.userdetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetails1);
    if (this.UserDetails[0].Status == false) {
     // this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");


    }
    else {
      this.updateNotificationStatus();
      this.getnotification();
    }
  }

  ngOnInit() {

  }

  updateNotificationStatus() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId);
    uploadfile.append("Param2", '1');
    var url = "api/BG/UpdateNotificationstatus";

    this.general.PostData(url, uploadfile).subscribe((data: any) => {
    }, (error) => {
      console.error("Error updating notification status:", error);
    });
  }

  getnotification() {  
    var uploadfile = new FormData();
    uploadfile.append("Param", this.UserDetails[0].RegId);
    var url = "api/BG/Get_Notification_basedon_UserId";
    
    this.general.PostData(url, uploadfile).subscribe(
      (data: any) => {       
        this.notification = data || [];
        this.accordionState = Array(this.notification.length).fill(false);
        this.activeAccordion = null;
        
        if (!this.notification || this.notification.length === 0) {
        } else {
          // Log each notification
          this.notification.forEach((notif: any, index: number) => {
          });
        }
      },
      (error: any) => {
        console.error("Error fetching notifications:", error);
        this.notification = [];
        this.accordionState = [];
        this.activeAccordion = null;
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
    debugger

    this.accordionState = Array(this.notification.length).fill(state === 0 ? false : true);
    //this.donorslist

  }
  navigate() {
    this.navCtrl.navigateForward('/home');
  }
}
