import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
})
export class MyprofilePage implements OnInit {
  rd1: boolean = false;
  UserDetails1: any;
  UserDetails: any;
  Role: any;
  status: any;

  constructor(private navCtrl: NavController, private general: GeneralService) {

    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
  }

  ngOnInit() {
    this.getAvailablestatus();
  }
  routing(val: any) {
    
    if (val == 3) {
      this.rd1 = true
      this.navCtrl.navigateForward(['/supportletshelp', { id: 3 }])

    } else {
      this.navCtrl.navigateForward(['/eligibilitycriteria'])
    }
  }

  getAvailablestatus() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId)
    uploadfile.append("Param2", '1')
    var url = "api/BG/Get_RoleforRolechange";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.Role = data;
      this.status = this.Role[0].Availablestatus;
    }, (error) => {
      console.error('Error fetching role:', error);
    });
  }
}
