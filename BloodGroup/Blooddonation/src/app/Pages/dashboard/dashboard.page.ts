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
  }

  ngOnInit() {
    this.getdashboard();
  }
  getdashboard() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", this.UserDetails[0].Reffercode);
    var url = 'api/BG/MobileDashboardcount';
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.mydashboard = data
      //.donorcount = this.mydashboard.filter((rol:any)=>rol)
    });
  }

  next(val:any) {
    this.nav.navigateForward(['/dashboarddetails', {id:val}])
  }
}
