import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { PermissionService } from '../../Services/permission/permission.service';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
import { Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  @ViewChild('modal2') modal2: any;
  @ViewChild('modal3') modal3: any;
  @ViewChild('modal4') modal4: any;
  @ViewChild('modal11') modal11: any;
  @ViewChild('modal6') modal6: any;
  @ViewChild('modal7') modal7: any;
  @ViewChild('modal8') modal8: any;
  UserDetails1: any; UserDetails: any;
  UserID: any;
  Email: any; Password: any;
  registrationForm: FormGroup; searchValue: any;
  selectedDonation: string = ''; // Added for donation selection

  showGenderOptions: boolean = false;
  dateList: any;
  time: any;
  date: any;
  patientname: any;
  BloodGroups: any; States: any; Districts: any; Cities: any;
  FirstName: any; LastName: any;
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
  private timeoutId: any = null;
  private debounceTimer: any; // To manage the debounce
  isLoadingLocation: boolean = false;

  Gender: string | null = null;
  selectedGender: string | null = null;

  Genders = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
  ];

  constructor(
    private alertController: AlertController,
    private geolocationService: GeolocationserviceService,
    private formBuilder: FormBuilder,
    private modal: ModalController,
    public datePipe: DatePipe,
    public general: GeneralService,
    public navCtrl: NavController,
    public activeRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.required])],
      Weight: ['', Validators.compose([Validators.maxLength(3), Validators.minLength(2), Validators.required])],
      address: [''],
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
    this.dateAfter18Years = "2020-03-25";
    this.reg();
  }

  ngOnInit() {
    this.checkAndGetLocation();
    this.GetBloodGroups();
    this.GetStates();
  }

  async checkAndGetLocation() {
    try {
      this.isLoadingLocation = true;
      // Silently try to get current position (like Google Maps does)
      const position = await Geolocation.getCurrentPosition({
        timeout: 3000,
        enableHighAccuracy: false
      });

      // Success! Location is ON - use it automatically
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Location detected:', position);
      this.getCityAndArea(this.latitude, this.longitude);

    } catch (error: any) {
      this.isLoadingLocation = false;
      console.log('Location not available, asking user...', error);

      // Location is OFF or denied - ask user like Google does
      this.showLocationPermissionAlert();
    }
  }

  async showLocationPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Use your location',
      message: 'This app wants to use your location to auto-fill address details.',
      buttons: [
        {
          text: 'No, thanks',
          role: 'cancel',
          handler: () => {
            console.log('User declined location - will enter manually');
            // Simply skip - user will fill form manually
          }
        },
        {
          text: 'OK',
          handler: async () => {
            await this.tryGetLocation();
          }
        }
      ]
    });

    await alert.present();
  }

  async tryGetLocation() {
    try {
      this.isLoadingLocation = true;
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Location obtained:', position);
      this.getCityAndArea(this.latitude, this.longitude);

    } catch (error) {
      this.isLoadingLocation = false;
      console.error('Could not get location:', error);
      this.general.presentToast('Could not get location. Please enter details manually.');
    }
  }

  selectGender(value: string) {
    this.selectedGender = value;
    this.confirmGender();
  }

  confirmGender() {
    this.Gender = this.selectedGender;
    this.modal3.dismiss();
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

  // Removed Search methods as dropdowns are removed.

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

  getCityAndArea(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`;

    this.http.get(url).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];

        // Extract location data with fallbacks
        this.selectedState = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedDistrict = this.getAddressComponent(result.address_components, 'administrative_area_level_3') ||
          this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.selectedCity = this.getAddressComponent(result.address_components, 'locality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.Area = this.getAddressComponent(result.address_components, 'sublocality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.Pincode = this.getAddressComponent(result.address_components, 'postal_code');

        // Update form immediately
        this.registrationForm.controls['area'].setValue(this.Area);
        this.registrationForm.controls['pincode'].setValue(this.Pincode);

        // Load and match states
        this.loadAndMatchLocation();

      } else {
        this.isLoadingLocation = false;
        console.log('No results found');
      }
    }, error => {
      this.isLoadingLocation = false;
      console.error('Error getting geocode', error);
    });
  }

  loadAndMatchLocation() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544"
    }];

    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/StatesMaster_crud";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.States = data;
      this.States1 = data;

      // Match state
      if (this.selectedState) {
        var selectedstateid = this.States1.filter((id: any) =>
          id.StateName.toLowerCase() === this.selectedState.toLowerCase()
        );

        if (selectedstateid && selectedstateid.length > 0) {
          this.StateID = selectedstateid[0].StateId;

          // Load districts immediately
          this.loadAndMatchDistricts();
        } else {
          this.isLoadingLocation = false;
          console.log('State not found in database');
        }
      } else {
        this.isLoadingLocation = false;
      }
    }, err => {
      this.isLoadingLocation = false;
      this.general.presentToast("something went wrong");
    });
  }

  loadAndMatchDistricts() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      StateId: this.StateID
    }];

    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/DistrictMaster_crud";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Districts = data;
      this.Districts1 = data;

      // Match district
      if (this.selectedDistrict) {
        var selectdistrictid = this.Districts1.filter((id: any) =>
          id.DistrictName.toLowerCase() === this.selectedDistrict.toLowerCase()
        );

        if (selectdistrictid && selectdistrictid.length > 0) {
          this.DistrictID = selectdistrictid[0].DistrictID;

          // Load cities immediately
          this.loadAndMatchCities();
        } else {
          this.isLoadingLocation = false;
          console.log('District not found in database');
        }
      } else {
        this.isLoadingLocation = false;
      }
    }, err => {
      this.isLoadingLocation = false;
      this.general.presentToast("something went wrong");
    });
  }

  loadAndMatchCities() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      DistrictId: this.DistrictID
    }];

    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/CitiesMaster_Crud";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Cities = data;
      this.Cities1 = data;

      // Match city
      if (this.selectedCity) {
        var selectcityid = this.Cities1.filter((id: any) =>
          id.CityName.toLowerCase() === this.selectedCity.toLowerCase()
        );

        if (selectcityid && selectcityid.length > 0) {
          this.CityID = selectcityid[0].CityId;
        } else {
          console.log('City not found in database');
        }
      }

      this.isLoadingLocation = false;
      console.log('Location binding completed');

    }, err => {
      this.isLoadingLocation = false;
      this.general.presentToast("something went wrong");
    });
  }

  getAddressComponent(components: any[], type: string): string | null {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : null;
  }

  reg() {
    this.FirstName = this.registrationForm.get('firstName')?.value;
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
    this.modal2?.dismiss();
    this.modal3?.dismiss();
    this.modal4?.dismiss();
    this.modal11?.dismiss();
    this.modal6?.dismiss();
    this.modal7?.dismiss();
    this.modal8?.dismiss();
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

  DateofBirth(event: any) {
    const value = event.detail.value;
    this.DOB = value.split('T')[0];
  }

  openDOBModal() {
    this.modal2.present();
  }

  closeDOBModal() {
    this.modal2.dismiss();
    this.calculateAge();
  }

  LastDonation(item: any) {
    if (this.DOB != null) {
      if (item.detail == 1) {
        this.LastDonationDate = this.TodayDate;
      } else {
        this.LastDonationDate = item.detail.value;
        this.LastDonationDate = this.LastDonationDate.split('T')[0];
      }

      // Calculate 18 years after DOB
      var dateAfter18Years = this.addYears(this.DOB, 18);
      this.dateAfter18Years = this.datePipe.transform(dateAfter18Years, 'yyyy-MM-dd');
    }
    else {
      this.general.presentToast('Please select Date of Birth..!');
    }
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
    this.Age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (this.Age < 18) {
      this.general.presentAlert("Alert", "You are below 18 yrs. So you are not eligible to register.");
    }
    this.reg();
  }

  donation(value: string) {
    this.LastDonationDate = value;
  }

  UserRegistration() {
    // ── Mandatory: Last Donation ──────────────────────────────────────────────
    if (!this.LastDonationDate || this.LastDonationDate === '') {
      this.general.presentToast('Please select Last Donation Date.');
      return;
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (this.registrationForm.valid && this.selectedState && this.selectedDistrict && this.selectedCity && this.Area && this.Pincode) {
      if (this.Age >= 18) {
        var obj = [{
          RegId: this.UserDetails[0].RegId,
          Email: this.UserDetails[0].Email,
          Password: this.UserDetails[0].Password,
          FullName: this.FirstName,
          Phonenumber: this.Mobile,
          Age: this.Age,
          DOB: this.DOB,
          Gender: this.selectedGender,
          Weight: this.Weight,
          BloodGroupId: this.BloodGroupID,
          Lastdonatedate: this.LastDonationDate,
          StateId: this.StateID,
          DistrictId: this.DistrictID,
          CityId: this.CityID,
          newStatename: this.selectedState,
          newDistrictname: this.selectedDistrict,
          newCityname: this.selectedCity,
          RoleId: 2,
          UserAddress: this.UserAddress,
          Area: this.Area,
          Pincode: this.Pincode,
          Status: true,
          Statusphn: true,
        }]
        var UploadFile = new FormData();
        UploadFile.append("Param", JSON.stringify(obj));
        UploadFile.append("Flag", "2");
        var url = "api/BG/Insert_Update_DonersForm";
        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          if (data == "SUCCESS") {
            let uploadFile = new FormData();
            uploadFile.append("Mobile", this.Mobile);
            var url = 'api/BG/checking_Mobile';
            this.general.PostData(url, uploadFile).subscribe((result: any) => {
              if (result != "NOTEXIST") {
                localStorage.setItem("UserDetails", JSON.stringify(result));
                this.general.presentAlert("SUCCESS", "Your registration has been completed successfully.");
                this.navCtrl.navigateForward(['/home']);
              }
            })
          } else {
            this.general.presentToast('Something went wrong. Please try again later.');
          }
        })
      } else {
        this.general.presentToast("You are below 18 yrs. So you are not eligible to register.");
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
}
