import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-leaders',
  templateUrl: './leaders.page.html',
  styleUrls: ['./leaders.page.scss'],
})
export class LeadersPage implements OnInit {
  titleText: string = 'Join as a Leader'; // default
    Role: any;
    status: any;
    parsedData: any;

  constructor(
    private navCtrl: NavController,
    public activeRoute: ActivatedRoute,
    private general: GeneralService
  ) {

  }

  ngOnInit() {
    const userData = localStorage.getItem('UserDetails');

    if (userData) {
      this.parsedData = JSON.parse(userData);

      // Sometimes data is stored as an array → handle both
      const user = Array.isArray(this.parsedData) ? this.parsedData[0] : this.parsedData;

      // Check RoleStatus and update title accordingly
      if (user?.Rolestatus === true) {
        this.titleText = 'Leaders Page';
      } else {
        this.titleText = 'Join as a Leader';
      }
    }
    this.getAvailablestatus();
  }

  AddDonor() {
    this.navCtrl.navigateForward(['/signup', { DonorFlag: 1 }]);
  }

  back(val: any) {
    this.navCtrl.navigateForward(['/myprofile']);
  }

  getAvailablestatus() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.parsedData[0].RegId)
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
