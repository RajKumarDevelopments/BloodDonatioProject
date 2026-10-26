import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private navCtrl: NavController,
    private general: GeneralService,
    private activeRoute: ActivatedRoute
  ) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    if (this.UserDetails1) {
      try {
        this.UserDetails = JSON.parse(this.UserDetails1);
      } catch (e) {
        console.error(e);
      }
    }
  }

  ngOnInit() {
    this.getAvailablestatus();
  }

  goBack() {
    const fromParam = this.activeRoute.snapshot.paramMap.get('from');
    if (fromParam === 'home') {
      this.navCtrl.navigateBack(['/home']);
    } else {
      this.navCtrl.navigateBack(['/leaders']);
    }
  }

  routing(val: any) {
    if (val == 3) {
      this.rd1 = true;
      this.navCtrl.navigateForward(['/supportletshelp', { id: 3 }]);
    } else {
      this.navCtrl.navigateForward(['/eligibilitycriteria']);
    }
  }

  getAvailablestatus() {
    const user = Array.isArray(this.UserDetails) ? this.UserDetails[0] : this.UserDetails;
    if (!user || !user.RegId) return;
    var uploadfile = new FormData();
    uploadfile.append("Param1", user.RegId);
    uploadfile.append("Param2", '1');
    var url = "api/BG/Get_RoleforRolechange";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.Role = data;
      if (this.Role && this.Role.length > 0) {
        this.status = this.Role[0].Availablestatus;
      }
    }, (error) => {
      console.error('Error fetching role:', error);
    });
  }
}
