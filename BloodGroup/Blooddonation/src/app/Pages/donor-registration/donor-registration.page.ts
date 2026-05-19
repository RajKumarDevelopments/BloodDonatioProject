import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ActionSheetController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ModalController, IonModal, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-donor-registration',
  templateUrl: './donor-registration.page.html',
  styleUrls: ['./donor-registration.page.scss'],
})
export class DonorRegistrationPage implements OnInit {
  @ViewChild('modal1', { static: false }) modal1: IonModal | undefined;
  @ViewChild('modal2', { static: false }) modal2: IonModal | undefined;
  @ViewChild('modal3', { static: false }) modal3: IonModal | undefined;
  @ViewChild('modal11', { static: false }) modal11: IonModal | undefined;
  @ViewChild('modal4', { static: false }) modal4: IonModal | undefined;
  @ViewChild('modal5', { static: false }) modal5: IonModal | undefined;
  @ViewChild('modal7', { static: false }) modal7: IonModal | undefined;
  @ViewChild('modal17', { static: false }) modal17: IonModal | undefined;


  UserDetails1: any; UserDetails: any;
  UserID: any;
  Email: any; Password: any;
  registrationForm: FormGroup;
  /*  selectedGender: string = '';*/
  selectedDonation: string = ''; // Added for donation selection
  selectedGender: string = '';
  showGenderOptions: boolean = false;
  dateList: any;
  time: any;
  date: any;
  patientname: any;
  Genders: any; BloodGroups: any; States: any; Districts: any; Cities: any;
  FirstName: any; LastName: any; Gender: any;
  Age: any; TodayDate: any; Weight: any; WeightKgs: any;
  BloodType: any;
  selectedBloodType: any; BloodGroupID: any;
  selectedState: any; selectedDistrict: any; selectedCity: any;
  StateID: any; DistrictID: any; CityID: any;
  DOB: any; LastDonationDate: any;
  UserAddress: any; Area: any; Pincode: any;
  Mobile: any; OTP: any; UserName: any; InviteCode: any;
  DonorFlag: any; RegFlag: any;
  latitude: any; longitude: any;
  States1: any; Districts1: any; Cities1: any;
  dateAfter18Years: any;
  private timeoutId: any = null; private debounceTimer: any;
  searchValue: any;
    email: any;
  constructor(private formBuilder: FormBuilder, private modal: ModalController, public datePipe: DatePipe,
    public general: GeneralService, public navCtrl: NavController, public activeRoute: ActivatedRoute,
    public http: HttpClient) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.required])],
      Weight: ['', Validators.compose([Validators.maxLength(3), Validators.minLength(2), Validators.required])],
      address: [''],
      Email: [''],
      area: [''],
      pincode: ['']
    });
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.UserName = this.activeRoute.snapshot.paramMap.get("UserName");
    this.Mobile = this.activeRoute.snapshot.paramMap.get("Mobile");
    this.InviteCode = this.activeRoute.snapshot.paramMap.get("InviteCode");
    this.FirstName = this.registrationForm.controls['firstName'].setValue(this.UserName);
    this.DonorFlag = this.activeRoute.snapshot.paramMap.get("DonorFlag");
    this.RegFlag = this.activeRoute.snapshot.paramMap.get("RegFlag");
    if (this.RegFlag == 1) {
      this.FirstName = this.UserDetails[0].FullName;
      this.Mobile = this.UserDetails[0].Phonenumber;
      this.registrationForm.controls['firstName'].setValue(this.FirstName);
    }
    var date = new Date();
    this.TodayDate = this.datePipe.transform(date, 'yyyy-MM-dd');

    this.Genders = [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Others', label: 'Others' },
    ]

    this.dateAfter18Years = "2020-03-25";
    this.reg();
  }

  ngOnInit() {
    this.GetCurrentLocation();
    this.GetBloodGroups();
    this.GetStates();
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
  GetStates() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544"
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/StatesMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.States = data;
      this.States1 = data;
      var selectedstateid = this.States1.filter((id: any) => id.StateName == this.selectedState)
      this.StateID = selectedstateid[0].StateId
      this.GetDistricts();
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  GetDistricts() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      StateId: this.StateID
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/DistrictMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Districts = data;
      this.Districts1 = data;
      var selectdistrictid = this.Districts1.filter((id: any) => id.DistrictName == this.selectedDistrict)
      this.DistrictID = selectdistrictid[0].DistrictID
      this.GetCities();
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  GetCities() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      DistrictId: this.DistrictID
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/CitiesMaster_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Cities = data;
      this.Cities1 = data;
      var selectcityid = this.Cities1.filter((id: any) => id.CityName == this.selectedCity)
      this.CityID = selectcityid[0].CityId
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }

  onManualAreaInput(event: any) {
    const val = event.target.value;
    this.Area = val;
    this.registrationForm.controls['area'].setValue(val);
  }

  onManualPincodeInput(event: any) {
    const val = event.target.value;
    this.Pincode = val;
    this.registrationForm.controls['pincode'].setValue(val);
  }

  reg() {
    this.FirstName = this.registrationForm.get('firstName')?.value;
    this.Email = this.registrationForm.get('Email')?.value;
    this.Weight = this.registrationForm.get('Weight')?.value;
    if (this.Weight != "") {
      this.WeightKgs = this.Weight + " " + "kgs";
    }
    this.UserAddress = this.registrationForm.get('address')?.value;
    
    // Only update from form if form has value, otherwise keep current variable value (from ngModel)
    const formArea = this.registrationForm.get('area')?.value;
    if (formArea) this.Area = formArea;
    
    const formPincode = this.registrationForm.get('pincode')?.value;
    if (formPincode) this.Pincode = formPincode;
    this.Gender = this.selectedGender;
    this.BloodType = this.selectedBloodType;
    this.modal.dismiss();
  }

  selectGender(val: any) {
    this.selectedGender = val;
    this.reg();
  }
  selectBloodGroup(val: any) {
    this.BloodGroupID = val.BLGId;
    this.selectedBloodType = val.BLGName;
    this.reg();
  }
  selectState(val: any) {
    this.StateID = val.StateId;
    this.selectedState = val.StateName;
    this.reg();
    this.GetDistricts();
  }
  selectDistrict(val: any) {
    this.DistrictID = val.DistrictID;
    this.selectedDistrict = val.DistrictName;
    this.reg();
    this.GetCities();
  }
  selectCity(val: any) {
    this.CityID = val.CityId;
    this.selectedCity = val.CityName;
    this.reg();
  }

  DateofBirth(item: any) {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Set a new timeout to delay processing
    this.timeoutId = setTimeout(() => {
      if (item.detail == 1) {
        this.DOB = this.TodayDate;
        this.calculateAge();
      } else {
        this.DOB = item.detail.value
        this.DOB = this.DOB.split('T')[0];
        this.calculateAge();
      }
    }, 10000); // 10 seconds delay
  }

  LastDonation(item: any) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Set a new timeout to delay processing
    this.timeoutId = setTimeout(() => {
      if (this.DOB != null) {
        if (item.detail == 1) {
          this.LastDonationDate = this.TodayDate;
        } else {
          this.LastDonationDate = item.detail.value
          this.LastDonationDate = this.LastDonationDate.split('T')[0];
        }
        var dateAfter18Years = this.addYears(this.DOB, 18);
        this.dateAfter18Years = this.datePipe.transform(dateAfter18Years, 'yyyy-MM-dd');
      } else {
        this.general.presentToast('Please select Date of Birth..!');
      }
    }, 10000); // 10 seconds delay
    //this.reg();
  }
  addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  calculateAge() {
    const today = new Date();
    const birthDate = new Date(this.DOB);
    // Calculate age
    const diff = today.getTime() - birthDate.getTime();
    this.Age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // Approximate calculation in years
    if (this.Age < 18) {
      this.general.presentAlert("Alert", "You are below 18 yrs. So you are not eligible to register.");
    }
    this.reg();
  }




  AddDonorbyLeader(value:any) {
    this.email = value.Email
    if (this.registrationForm.valid && this.selectedState && this.selectedDistrict && this.selectedCity && this.Area && this.Pincode) {
      if (this.Age >= 18) {
        var obj = [{
          Gender: this.selectedGender,
          Email: this.email,
          Password: this.UserDetails[0].Password,
          FullName: this.FirstName,
          Phonenumber: this.Mobile,
          Age: this.Age,
          DOB: this.DOB,
          Weight: this.Weight,
          BloodGroupId: this.BloodGroupID,
          Lastdonatedate: this.LastDonationDate,
          StateId: this.StateID,
          DistrictId: this.DistrictID,
          newStatename: this.selectedState,
          newDistrictname: this.selectedDistrict,
          newCityname: this.selectedCity,
          CityId: this.CityID,
          RoleId: 2,
          UserAddress: this.UserAddress,
          Area: this.Area,
          Pincode: this.Pincode,
          Status: true,
          Statusphn: true,
          Rolestatus: false,
          CreatedBy: this.UserDetails[0].RegId
        }]
        var UploadFile = new FormData();
        UploadFile.append("Param", JSON.stringify(obj));
        UploadFile.append("Flag", "1");
        var url = "api/BG/Insert_Update_DonersForm";
        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          if (data == "SUCCESS") {
            this.general.presentAlert("SUCCESS", "You added a donor successfully.");
            this.navCtrl.navigateForward(['/home']);
           // window.location.reload();
          } else {
            this.general.presentToast('Something went wrong. Please try again later.');
          }
        })
      } else {
        this.general.presentToast("Donor is below 18 yrs. So not eligible to register.");
      }
    } else {
      this.general.presentToast('Please enter all fields.');
    }
  }


  toggleGenderOptions() {
    this.showGenderOptions = !this.showGenderOptions;
  }

  selectDonation(donation: string) {
    this.selectedDonation = donation;
    this.registrationForm.patchValue({ donation });
  }
  updateFirstName() {
    if (this.registrationForm.get('firstName')?.valid) {
      this.FirstName = this.registrationForm.get('firstName')?.value;
      this.modal1?.dismiss();
    }
  }

  updateWeight() {
    if (this.registrationForm.get('Weight')?.valid) {
      this.Weight = this.registrationForm.get('Weight')?.value;
      this.WeightKgs = this.Weight + ' kg';
      this.modal11?.dismiss();
    }
  }



  async openModal(modalId: string) {
    const modal = await this.modal.getTop();
    if (modal) {
      modal.dismiss();
    }
    switch (modalId) {
      case 'modal1':
        this.modal1?.present();
        break;
      case 'modal2':
        this.modal2?.present();
        break;
      case 'modal3':
        this.modal3?.present();
        break;
      case 'modal11':
        this.modal11?.present();
        break;
      case 'modal4':
        this.modal4?.present();
        break;
      case 'modal5':
        this.modal5?.present();
        break;
      case 'modal7':
        this.modal7?.present();
        break;
      case 'modal17':
        this.modal17?.present();
        break;
    }
  }



  async openModal1() {
    const modal = await this.modal.create({
      component: '',
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5,
    });
    return await modal.present();
  }

  async closeModal() {
    await this.modal.dismiss();
  }

  async GetCurrentLocation() {
    try {
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          this.general.presentAlert("Location Permission", "Please enable location permission to automatically fetch your address. You can also enter it manually.");
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Current position:', position);
      this.getCityAndArea(this.latitude, this.longitude);
    } catch (error: any) {
      console.error('Error getting location', error);
      if (error.code === 1 || error.message?.includes('denied')) {
        this.general.presentAlert("Permission Denied", "Location access was denied. Please enable it in your device settings to use this feature.");
      } else {
        this.general.presentAlert("Location Error", "Unable to fetch location. Please ensure GPS is on and try again, or enter details manually.");
      }
    }
  }

  getCityAndArea(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`;
    this.http.get(url).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];
        this.selectedState = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedDistrict = this.getAddressComponent(result.address_components, 'administrative_area_level_3') ||
          this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.selectedCity = this.getAddressComponent(result.address_components, 'locality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.Area = this.getAddressComponent(result.address_components, 'sublocality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.Pincode = this.getAddressComponent(result.address_components, 'postal_code');
        this.registrationForm.controls['area'].setValue(this.Area);
        this.registrationForm.controls['pincode'].setValue(this.Pincode);
        
        this.syncLocationWithDropdowns();
      } else {
        console.log('No results found');
      }
    }, error => {
      console.error('Error getting geocode', error);
    });
  }

  getAddressComponent(components: any[], type: string): string | null {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : null;
  }

  syncLocationWithDropdowns() {
    // Sync State
    if (this.selectedState && this.States1) {
      const state = this.States1.find((s: any) => s.StateName.toLowerCase() === this.selectedState?.toLowerCase());
      if (state) {
        this.StateID = state.StateId;
        this.GetDistricts(); // Load districts for this state
      }
    }
  }
}
