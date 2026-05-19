import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-hospitallist',
  templateUrl: './hospitallist.page.html',
  styleUrls: ['./hospitallist.page.scss'],
})
export class HospitallistPage implements OnInit {
  values: any; donorslist: any; UserDetails: any; userdetail: any;
  accordionState: any; opend: any; name: any; hspatals: any;
    hospitalName: any;
    address: any;
    hospitaladdress: any;
    hospitalAddress: any;

  constructor(private navCtrl: NavController,private router: Router,public activeRoute: ActivatedRoute, public general: GeneralService, private navctrl: NavController)
  {
    this.values = this.activeRoute.snapshot.paramMap.get("id");
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
  }

  ngOnInit() {
    this.gethspatldetails();
  }

  gethspatldetails() {
    if (this.UserDetails[0].RegId) {
      const obj = [{
        RegId: this.UserDetails[0].RegId,
        CreatedBy: this.UserDetails[0].RegId,
        TokenId: this.UserDetails[0].TokenId,
      }];

      const UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "8");
      const url = "api/BG/HospitalDetails_CRUD";

      this.general.PostData(url, UploadFile).subscribe((data: any) => {
        this.hspatals = data;

        this.hspatals.forEach((hospital: any) => {
          if (hospital.HsptAddress) {
            let hospitalName = '';
            let address = '';

            const parts = hospital.HsptAddress.split(',');

            if (parts.length > 1) {
              hospitalName = parts[0].trim(); // The first part is the hospital name
              address = hospital.HsptAddress.substring(hospitalName.length + 1).trim(); // Rest is the address
            } else {
              hospitalName = hospital.HsptAddress; // If no comma, assume entire string is the name
              address = ''; // No valid address
            }

            hospital.HospitalName = hospitalName;
            hospital.HospitalAddress = address;

            this.hospitalName = hospital.HospitalName;
            this.hospitalAddress = hospital.HospitalAddress;

          }
        });
});
    }
  }




  hspatldetails20() {
    
    if (this.UserDetails[0].RegId) {
      var obj = [{
        RegId: this.UserDetails[0].RegId,
        TokenId: this.UserDetails[0].TokenId,
        CreatedBy: this.UserDetails[0].RegId
      }];

      var UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "8");
      var url = "api/BG/HospitalDetails_CRUD";

      this.general.PostData(url, UploadFile).subscribe((data: any) => {
        
        this.hspatals = data;

        //window.location.reload();
      });
  }
  }

  
  next() {
    this.navCtrl.navigateForward(['/hospitaldetails']);
  }



  GetHsptals() {
    var url = "api/BG/Get_Hospitaldetails_mobile";
    this.general.GetData(url).subscribe((data: any) => {
      this.hspatals = data;

      this.hspatals.forEach((hospital: any) => {
        if (hospital.HospitalAddress) {
          let hospitalName = '';
          let address = '';

          // Split the hospital name and address based on different formats
          if (hospital.HospitalAddress.includes('|')) {
            // If the address contains '|', split by the first occurrence
            [hospitalName, address] = hospital.HospitalAddress.split('|').map((part: any) => part.trim());
          } else {
            // If no '|', assume it's just a plain address or incomplete data
            const parts = hospital.HospitalAddress.split(',', 2); // Split by commas (can be adjusted as needed)
            if (parts.length === 2) {
              hospitalName = parts[0].trim();
              address = hospital.HospitalAddress.substring(hospitalName.length + 1).trim();
            } else {
              // If we don't have a proper format, consider the first part as the name
              hospitalName = hospital.HospitalAddress;
            }
          }

          // Update the hospital object
          hospital.HospitalName = hospitalName;
          hospital.HospitalAddress = address;

          // Optional: Assign to variables in your component if needed
          this.hospitalName = hospital.HospitalName;
          this.hospitaladdress = hospital.HospitalAddress;

          
        }
      });
    });
  }



  GetHsptalsold() {
    
    var url = "api/BG/Get_Hospitaldetails_mobile";
    this.general.GetData(url).subscribe((data: any) => {
      
      this.hspatals = data;

      
      this.hspatals.forEach((hospital: any) => {
        if (hospital.HospitalAddress) {
          // Split the address at the first '|'
          const [hospitalName, address] = hospital.HospitalAddress.split('|').map((part: any) => part.trim());

          // Update the object with separate name and address
          hospital.HospitalName = hospitalName;
          hospital.HospitalAddress = address;
          this.hospitalName = hospital.HospitalName
          this.hospitaladdress = hospital.HospitalAddress
         
        }

      });
    });
      }
}
