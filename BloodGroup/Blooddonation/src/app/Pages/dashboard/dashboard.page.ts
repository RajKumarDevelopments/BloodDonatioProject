import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  UserDetails1: any;
  UserDetails: any;
  mydashboard: any; Rolestatus: any;
  constructor(public general: GeneralService, private nav: NavController) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    if (this.UserDetails != null) {
      if (this.UserDetails[0].Rolestatus == true) {
        this.Rolestatus = true;
      }
    }   
    
    // Optimization: Initialize mydashboard instantly to prevent UI rendering delay
    const cachedData = localStorage.getItem('dashboard_counts');
    if (cachedData) {
      this.mydashboard = JSON.parse(cachedData);
    } else {
      this.mydashboard = [{
        Presentationcount: 0,
        Bannercount: 0,
        Referalcount: 0,
        Dotationcount: 0,
        Adddonorscount: 0,
        LeadPresentationcount: 0
      }];
    }
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getdashboard();
  }
  getdashboard() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", this.UserDetails[0].Reffercode);
    var url = 'api/BG/MobileDashboardcount';
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data) {
        this.mydashboard = Array.isArray(data) ? data : [data];
        localStorage.setItem('dashboard_counts', JSON.stringify(this.mydashboard));
      } else {
        this.mydashboard = [];
      }
    });
  }

  next(val:any) {
    this.nav.navigateForward(['/dashboarddetails', {id:val}])
  }
}
