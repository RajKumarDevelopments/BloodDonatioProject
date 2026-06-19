import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-donor-registration',
  templateUrl: './donor-registration.page.html',
  styleUrls: ['./donor-registration.page.scss'],
})
export class DonorRegistrationPage implements OnInit {
  activePicker: 'dob' | 'gender' | 'blood' | 'lastDonation' | null = null;
  maxDate: string = new Date().toISOString();
  maxDOB: string = '';

  openPicker(pickerType: any) {
    this.activePicker = pickerType;
  }

  closePicker() {
    this.activePicker = null;
  }

  formatDate(dateStr: any) {
    if (!dateStr || dateStr === 'N/A' || dateStr === 'I Never Donate' || dateStr === 'I Don’t Remember' || dateStr === "I Dont Remember") return dateStr;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  }

  UserDetails1: any; UserDetails: any;
  UserID: any;
  Email: any; Password: any;
  registrationForm: FormGroup;
  searchValue: any;
  email: any;
  selectedDonation: string = '';
  isSubmitting: boolean = false;

  showGenderOptions: boolean = false;
  dateList: any;
  time: any;
  date: any;
  patientname: any;
  BloodGroups: any; States: any; Districts: any; Cities: any;
  FirstName: any; MiddleName: any; SurName: any; LastName: any;
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
  private debounceTimer: any;
  isLoadingLocation: boolean = false;

  Gender: string | null = null;
  selectedGender: string | null = null;

  Genders = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
  ];

  restrictedNameValidator = (control: any) => {
    if (!control.value) return null;
    const lowerName = control.value.toLowerCase().trim();
    const restricted = this.general.restrictedCasts || [];
    if (restricted.includes(lowerName)) {
      return { restrictedName: true };
    }
    return null;
  }

  preventInvalidChars(event: KeyboardEvent) {
    if (event.key.length === 1 && !/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      this.registrationForm.get('firstName')?.setErrors({ pattern: true });
      this.registrationForm.get('firstName')?.markAsTouched();
    }
  }

  onPasteSanitize(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    if (/[^a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
      this.registrationForm.get('firstName')?.setErrors({ pattern: true });
      this.registrationForm.get('firstName')?.markAsTouched();
    }
  }

  onFirstNameInput(event: any) {
    let value = event.target.value;
    if (/[^a-zA-Z]/.test(value)) {
      const sanitized = value.replace(/[^a-zA-Z]/g, '');
      this.registrationForm.get('firstName')?.setValue(sanitized, { emitEvent: false });
      event.target.value = sanitized;
      this.registrationForm.get('firstName')?.setErrors({ pattern: true });
    }
    this.reg();
  }

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private modal: ModalController,
    public datePipe: DatePipe,
    public general: GeneralService,
    public navCtrl: NavController,
    public activeRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.maxLength(50), Validators.minLength(3), Validators.required, Validators.pattern(/^[a-zA-Z]+$/), this.restrictedNameValidator]],
      middleName: [''],
      surName: [''],
      Email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      Weight: ['', Validators.compose([Validators.maxLength(3), Validators.minLength(2), Validators.required])],
      address: [''],
      area: [''],
      pincode: ['']
    });

    const todayDate = new Date();
    const minAgeDate = new Date(todayDate.getFullYear() - 18, todayDate.getMonth(), todayDate.getDate());
    this.maxDOB = minAgeDate.toISOString();

    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.UserName = this.activeRoute.snapshot.paramMap.get("UserName");
    this.Mobile = this.activeRoute.snapshot.paramMap.get("Mobile");
    this.InviteCode = this.activeRoute.snapshot.paramMap.get("InviteCode");
    
    this.FirstName = this.UserName;
    this.registrationForm.controls['firstName'].setValue(this.FirstName);
    
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

  async GetCurrentLocation(forceOverwrite: boolean = false) {
    if (forceOverwrite) {
      this.general.present();
    }
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          if (forceOverwrite) this.general.dismiss();
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true
      });

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      
      if (forceOverwrite) {
        this.general.dismiss();
      }
      this.getCityAndArea(this.latitude, this.longitude);
      
      if (forceOverwrite) {
        this.general.presentToast("Location fetched from GPS!");
      }
    } catch (error) {
      if (forceOverwrite) {
        this.general.dismiss();
        this.general.presentToast("Error getting location. Please check GPS settings.");
      }
      console.error('Location error', error);
    }
  }

  async checkAndGetLocation() {
    try {
      this.isLoadingLocation = true;
      const position = await Geolocation.getCurrentPosition({
        timeout: 3000,
        enableHighAccuracy: false
      });

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.getCityAndArea(this.latitude, this.longitude);

    } catch (error: any) {
      this.isLoadingLocation = false;
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
          role: 'cancel'
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
      this.getCityAndArea(this.latitude, this.longitude);

    } catch (error) {
      this.isLoadingLocation = false;
      this.general.presentToast('Could not get location. Please enter details manually.');
    }
  }

  selectGender(value: string) {
    this.selectedGender = value;
    this.confirmGender();
  }

  confirmGender() {
    this.Gender = this.selectedGender;
    this.closePicker();
  }

  GetBloodGroups() {
    var obj = [{}]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/BloodGroupMaster_CRUD";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.BloodGroups = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        this.BloodGroups = data.data;
      }
    }, err => {
      this.general.presentToast("something went wrong");
    });
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

        this.loadAndMatchLocation();
      } else {
        this.isLoadingLocation = false;
      }
    }, error => {
      this.isLoadingLocation = false;
      console.error('Error getting geocode', error);
    });
  }

  loadAndMatchLocation() {
    var obj = [{ RegId: 1, TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544" }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/StatesMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.States = data;
      this.States1 = data;
      if (this.selectedState) {
        var selectedstateid = this.States1.filter((id: any) => id.StateName.toLowerCase() === this.selectedState.toLowerCase());
        if (selectedstateid && selectedstateid.length > 0) {
          this.StateID = selectedstateid[0].StateId;
          this.loadAndMatchDistricts();
        } else {
          this.isLoadingLocation = false;
        }
      } else {
        this.isLoadingLocation = false;
      }
    }, err => {
      this.isLoadingLocation = false;
    });
  }

  loadAndMatchDistricts() {
    var obj = [{ RegId: 1, TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544", StateId: this.StateID }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/DistrictMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Districts = data;
      this.Districts1 = data;
      if (this.selectedDistrict) {
        var selectdistrictid = this.Districts1.filter((id: any) => id.DistrictName.toLowerCase() === this.selectedDistrict.toLowerCase());
        if (selectdistrictid && selectdistrictid.length > 0) {
          this.DistrictID = selectdistrictid[0].DistrictID;
          this.loadAndMatchCities();
        } else {
          this.isLoadingLocation = false;
        }
      } else {
        this.isLoadingLocation = false;
      }
    }, err => {
      this.isLoadingLocation = false;
    });
  }

  loadAndMatchCities() {
    var obj = [{ RegId: 1, TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544", DistrictId: this.DistrictID }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/CitiesMaster_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Cities = data;
      this.Cities1 = data;
      if (this.selectedCity) {
        var selectcityid = this.Cities1.filter((id: any) => id.CityName.toLowerCase() === this.selectedCity.toLowerCase());
        if (selectcityid && selectcityid.length > 0) {
          this.CityID = selectcityid[0].CityId;
        }
      }
      this.isLoadingLocation = false;
    }, err => {
      this.isLoadingLocation = false;
    });
  }

  getAddressComponent(components: any[], type: string): string | null {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : null;
  }

  reg() {
    this.FirstName = this.registrationForm.get('firstName')?.value;
    this.MiddleName = this.registrationForm.get('middleName')?.value;
    this.SurName = this.registrationForm.get('surName')?.value;
    this.Email = this.registrationForm.get('Email')?.value;
    this.Weight = this.registrationForm.get('Weight')?.value;
    if (this.Weight != "") {
      this.WeightKgs = this.Weight + " " + "kgs";
    }
    this.UserAddress = this.registrationForm.get('address')?.value;
    
    const formArea = this.registrationForm.get('area')?.value;
    if (formArea) this.Area = formArea;
    
    const formPincode = this.registrationForm.get('pincode')?.value;
    if (formPincode) this.Pincode = formPincode;

    this.Gender = this.selectedGender;
    this.BloodType = this.selectedBloodType;
    this.closePicker();
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

  LastDonation(item: any) {
    if (this.DOB != null) {
      if (item.detail == 1) {
        this.LastDonationDate = this.TodayDate;
      } else {
        this.LastDonationDate = item.detail.value;
        this.LastDonationDate = this.LastDonationDate.split('T')[0];
      }
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
    if (!this.DOB) return;
    try {
      const parts = this.DOB.split('-');
      const birthYear = parseInt(parts[0], 10);
      const birthMonth = parseInt(parts[1], 10) - 1;
      const birthDay = parseInt(parts[2], 10);
      
      const today = new Date();
      let age = today.getFullYear() - birthYear;
      const monthDiff = today.getMonth() - birthMonth;
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
        age--;
      }
      
      this.Age = age;
      if (this.Age < 18) {
        this.general.presentAlert("Alert", "You are below 18 yrs. So you are not eligible to register.");
        this.DOB = null;
        this.Age = null;
      }
    } catch (e) {
      console.error("Error calculating age:", e);
    }
    this.reg();
  }

  donation(value: string) {
    this.LastDonationDate = value;
  }

  AddDonorbyLeader(value:any) {
    this.email = value.Email;
    
    if (!this.LastDonationDate || this.LastDonationDate === '') {
      this.general.presentToast('Please select Last Donation Date.');
      return;
    }

    if (this.DOB) {
      try {
        const parts = this.DOB.split('-');
        const birthYear = parseInt(parts[0], 10);
        const birthMonth = parseInt(parts[1], 10) - 1;
        const birthDay = parseInt(parts[2], 10);
        const today = new Date();
        let age = today.getFullYear() - birthYear;
        const monthDiff = today.getMonth() - birthMonth;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
          age--;
        }
        this.Age = age;
      } catch (e) {
        console.error("Error parsing age in UserRegistration:", e);
      }
    }

    if (this.registrationForm.valid && this.selectedState && this.selectedDistrict && this.selectedCity && this.Area && this.Pincode) {
      if (this.Age >= 18) {
        var obj = [{
          Gender: this.selectedGender,
          Email: this.email,
          Password: this.UserDetails[0].Password,
          FullName: this.FirstName,
          MiddleName: this.MiddleName,
          SurName: this.SurName,
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
          CreatedBy: this.UserDetails[0].RegId,
          DonorAddByLeader: this.UserDetails[0].Reffercode
        }]
        var UploadFile = new FormData();
        UploadFile.append("Param", JSON.stringify(obj));
        UploadFile.append("Flag", "1");
        var url = "api/BG/Insert_Update_DonersForm";
        this.isSubmitting = true;
        this.general.present('Registering your account, please wait...');
        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          this.isSubmitting = false;
          this.general.dismiss();
          if (data == "SUCCESS") {
            this.general.presentAlert("SUCCESS", "You added a donor successfully.");
            this.navCtrl.navigateForward(['/home']);
          } else {
            this.general.presentToast('Something went wrong. Please try again later.');
          }
        }, (err: any) => {
          this.isSubmitting = false;
          this.general.dismiss();
          this.general.presentToast('Something went wrong. Please try again later.');
        });
      } else {
        this.general.presentToast("Donor is below 18 yrs. So not eligible to register.");
      }
    } else {
      if (this.registrationForm.get('firstName')?.invalid) {
        this.general.presentToast('First Name cannot contain caste names, spaces, special characters, or numbers.');
      } else {
        this.general.presentToast('Please enter all fields.');
      }
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
