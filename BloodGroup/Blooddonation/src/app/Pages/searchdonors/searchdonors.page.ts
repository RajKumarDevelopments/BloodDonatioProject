import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ModalController, NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-searchdonors',
  templateUrl: './searchdonors.page.html',
  styleUrls: ['./searchdonors.page.scss'],
})
export class SearchdonorsPage implements OnInit {
  BloodGroups: any; States: any; Districts: any; Cities: any; Pincodes: any;
  States1: any; Districts1: any; Cities1: any; Pincodes1: any;
  StateID: any; DistrictID: any; CityID: any;
  selectedBloodType: any; BloodGroupID: any;
  selectedPincode: any;
  selectedState: any; selectedDistrict: any; selectedCity: any;
  searchState: any; searchDistrict: any; searchCity: any; searchPincode: any;
  BloodType: any;
  userdetail: any;
  UserDetails: any;

  constructor(public general: GeneralService, private modal: ModalController,
    public navCtrl: NavController, private alertController: AlertController,)
  {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
    if (this.UserDetails[0].Status == false) {
   //   this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");
      
    }
    else {
      this.GetBloodGroups();
    //  this.GetStates();
      this.GetPincodes();
    }
  }

  ngOnInit() {
    
    
  }

  GetBloodGroups() {
    
    var obj = [{}]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/BloodGroupMaster_CRUD";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
      this.BloodGroups = data;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  //GetStates() {
    
  //  var obj = [{
  //    RegId: 1,
  //    TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544"
  //  }]
  //  var UploadFile = new FormData();
  //  UploadFile.append("Param", JSON.stringify(obj));
  //  UploadFile.append("Flag", "4");
  //  var url = "api/BG/StatesMaster_crud";
  //  this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
  //    this.States = data;
  //    this.States1 = data;
  //  }, err => {
  //    this.general.presentToast("something went wrong");
  //  })
  //}
  //GetDistricts() {
    
  //  var obj = [{
  //    RegId: 1,
  //    TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
  //    StateId: this.StateID
  //  }]
  //  var UploadFile = new FormData();
  //  UploadFile.append("Param", JSON.stringify(obj));
  //  UploadFile.append("Flag", "5");
  //  var url = "api/BG/DistrictMaster_crud";
  //  this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
  //    this.Districts = data;
  //    this.Districts1 = data;
  //  }, err => {
  //    this.general.presentToast("something went wrong");
  //  })
  //}
  //GetCities() {
    
  //  var obj = [{
  //    RegId: 1,
  //    TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
  //    DistrictId: this.DistrictID
  //  }]
  //  var UploadFile = new FormData();
  //  UploadFile.append("Param", JSON.stringify(obj));
  //  UploadFile.append("Flag", "5");
  //  var url = "api/BG/CitiesMaster_Crud";
  //  this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
  //    this.Cities = data;
  //    this.Cities1 = data;
  //  }, err => {
  //    this.general.presentToast("something went wrong");
  //  })
  //}
  GetPincodes() {
        
    var url = "api/BG/Get_PincodeDropdown";
    this.general.GetData(url).subscribe((data: any) => {
      
      this.Pincodes = data;
      this.Pincodes1 = data;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }

  //SearchStates() {
    
  //  const searchQuery = this.searchState.trim().toLowerCase();
  //  if (searchQuery === '') {
  //    this.States = this.States1;
  //  } else {
  //    this.States = this.States1.filter((BG: any) => {
  //      return (
  //        BG.StateName.toLowerCase().includes(searchQuery)
  //      );
  //    });
  //  }
  //}
  //SearchDistricts() {
    
  //  const searchQuery = this.searchDistrict.trim().toLowerCase();
  //  if (searchQuery === '') {
  //    this.Districts = this.Districts1;
  //  } else {
  //    this.Districts = this.Districts1.filter((BG: any) => {
  //      return (
  //        BG.DistrictName.toLowerCase().includes(searchQuery)
  //      );
  //    });
  //  }
  //}
  //SearchCities() {
    
  //  const searchQuery = this.searchCity.trim().toLowerCase();
  //  if (searchQuery === '') {
  //    this.Cities = this.Cities1;
  //  } else {
  //    this.Cities = this.Cities1.filter((BG: any) => {
  //      return (
  //        BG.CityName.toLowerCase().includes(searchQuery)
  //      );
  //    });
  //  }
  //}
  SearchPincodes() {
    
    const searchQuery = this.searchPincode.trim().toLowerCase();
    if (searchQuery === '') {
      this.Pincodes = this.Pincodes1;
    } else {
      this.Pincodes = this.Pincodes1.filter((BG: any) => {
        return (
          BG.Pincode.toLowerCase().includes(searchQuery)
        );
      });
    }
  }

  reg() {
    this.modal.dismiss();
  }
 

  selectBloodGroup(val: any) {
    
    this.BloodGroupID = val.BLGId;
    this.selectedBloodType = val.BLGName;
    this.reg();
  }
  selectState(val: any) {
    
    this.StateID = val.StateId;
    this.selectedState = val.StateName;
   // this.GetDistricts();
    this.reg();    
  }
  selectDistrict(val: any) {
    
    this.DistrictID = val.DistrictID;
    this.selectedDistrict = val.DistrictName;    
 //   this.GetCities();
    this.reg();
  }
  selectCity(val: any) {
    
    this.CityID = val.CityId;
    this.selectedCity = val.CityName;
    this.reg();
  }
  selectPincode(val: any) {
    
    //this.BloodGroupID = val.BLGId;
    this.selectedPincode = val.Pincode;
    this.reg();
  }


  Clear() {
    this.selectedBloodType = '';
    this.selectedPincode = '';
  }
  async GotoDonors() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit',
      message: 'Are you sure you want to close and go back to the home page?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, Go',
          handler: () => {
            this.navCtrl.navigateForward('/home');
          },
        },
      ],
    });

    await alert.present();
  }

  validatePincode(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.selectedPincode = input.value;
  }

  async ApplyFilter() {

    if (!this.selectedBloodType || this.selectedBloodType == '') {

      const alert = await this.alertController.create({
        header: 'Required',
        message: 'Please select Blood Type',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    if (!this.selectedPincode || this.selectedPincode == '') {

      const alert = await this.alertController.create({
        header: 'Required',
        message: 'Please enter Pincode',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    //  Pincode length validation (PUT YOUR CODE HERE)
    if (this.selectedPincode.length != 6) {

      const alert = await this.alertController.create({
        header: 'Invalid',
        message: 'Pincode must be 6 digits',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    // If both fields available
    var Filterobj = [{
      BloodGroup: this.selectedBloodType,
      Pincode: this.selectedPincode
    }];

    this.navCtrl.navigateForward(['/donordetails', { FilterObject: JSON.stringify(Filterobj) }]);

  }

}
