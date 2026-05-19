import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-leaderguide',
  templateUrl: './leaderguide.page.html',
  styleUrls: ['./leaderguide.page.scss'],
})
export class LeaderguidePage implements OnInit {
  userdetail: any;
  UserDetails: any;
  constructor(private nav: NavController, private general: GeneralService, ) {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
  }

  ngOnInit() {
  }
  Go()
  {
    debugger
    
    var obj = [{
      RegId: this.UserDetails[0].RegId,
      FullName: this.UserDetails[0].FullName,
      Email: this.UserDetails[0].Email,
      DOB: this.UserDetails[0].DOB,
      Gender: this.UserDetails[0].Gender,
      BloodGroupId:  this.UserDetails[0].BLGId,
      Lastdonatedate:  this.UserDetails[0].Lastdonatedate,
      CityId:  this.UserDetails[0].CityId,
      RoleId: 4,
      Status: this.UserDetails[0].Activestatus,
      Statusphn: true,
      Rolestatus: true,
      status:true,
      Pincode: this.UserDetails[0].Pincode,
      Availablestatus: this.UserDetails[0].Availablestatus
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "3");
    var url = "api/BG/Insert_Update_DonersForm";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
      if (data == "SUCCESS") {
        let uploadFile = new FormData();
        uploadFile.append("Mobile", this.UserDetails[0].Phonenumber || this.UserDetails[0].Email);
        var url = 'api/BG/checking_Mobile';
        this.general.PostData(url, uploadFile).subscribe((result: any) => {
          
          if (result != "NOTEXIST") {
            localStorage.removeItem('UserDetails');
            localStorage.setItem("UserDetails", JSON.stringify(result));
            this.general.presentAlert("SUCCESS", "Your profile has been updated successfully.");
            this.nav.navigateForward(['/home']);
            window.location.reload();
          }
        })
        //this.general.presentAlert("SUCCESS", "Your registration has been completed successfully.");
        //this.navCtrl.navigateForward(['/home']);
        //window.location.reload();
      } else {
        this.general.presentToast('Something went wrong. Please try again later.');
      }
    })
  } 
  
}
