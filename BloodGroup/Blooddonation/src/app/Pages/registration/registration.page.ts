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
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

declare var google: any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  activePicker: 'dob' | 'gender' | 'blood' | 'lastDonation' | null = null;
  maxDate: string = new Date().toISOString();
  maxDOB: string = '';

  openPicker(pickerType: any) {
    this.activePicker = pickerType;
    if (pickerType === 'lastDonation') {
      if (this.LastDonationDate && this.LastDonationDate !== 'I Never Donate' && this.LastDonationDate !== 'I Dont Remember' && this.LastDonationDate !== 'I Don’t Remember') {
        this.date = this.LastDonationDate;
      } else {
        this.date = undefined;
      }
    } else if (pickerType === 'dob') {
      if (this.DOB) {
        this.date = this.DOB;
      } else {
        this.date = undefined;
      }
    }
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
  private debounceTimer: any; // To manage the debounce
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
    private geolocationService: GeolocationserviceService,
    private formBuilder: FormBuilder,
    private modal: ModalController,
    public datePipe: DatePipe,
    public general: GeneralService,
    public navCtrl: NavController,
    public activeRoute: ActivatedRoute,
    public http: HttpClient,
    private locationAccuracy: LocationAccuracy
  ) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.maxLength(50), Validators.minLength(3), Validators.required, Validators.pattern(/^[a-zA-Z]+$/), this.restrictedNameValidator]],
      middleName: [''],
      surName: [''],
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
    const passedFirstName = this.activeRoute.snapshot.paramMap.get("FirstName");
    const passedMiddleName = this.activeRoute.snapshot.paramMap.get("MiddleName");
    const passedSurName = this.activeRoute.snapshot.paramMap.get("SurName");
    this.Mobile = this.activeRoute.snapshot.paramMap.get("Mobile");
    this.InviteCode = this.activeRoute.snapshot.paramMap.get("InviteCode");
    
    this.FirstName = passedFirstName || this.UserName;
    this.MiddleName = passedMiddleName;
    this.SurName = passedSurName;
    
    this.registrationForm.controls['firstName'].setValue(this.FirstName);
    this.registrationForm.controls['middleName'].setValue(this.MiddleName);
    this.registrationForm.controls['surName'].setValue(this.SurName);
    this.DonorFlag = this.activeRoute.snapshot.paramMap.get("DonorFlag");
    this.RegFlag = this.activeRoute.snapshot.paramMap.get("RegFlag");

    if (this.RegFlag == 1) {
      this.FirstName = this.UserDetails[0].FirstName || this.UserDetails[0].FullName;
      this.MiddleName = this.UserDetails[0].MiddleName;
      this.SurName = this.UserDetails[0].SurName;
      this.Mobile = this.UserDetails[0].Phonenumber;
      this.registrationForm.controls['firstName'].setValue(this.FirstName);
      this.registrationForm.controls['middleName'].setValue(this.MiddleName);
      this.registrationForm.controls['surName'].setValue(this.SurName);
    }

    var date = new Date();
    this.TodayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    this.dateAfter18Years = "2020-03-25";
    this.reg();
  }

  ngOnInit() {
    // Only fetch location if not already fetched
    if (!this.Pincode) {
      this.GetCurrentLocation(false);
    }
    this.GetBloodGroups();
    this.GetStates();
  }

  async GetCurrentLocation(forceOverwrite: boolean = false) {
    if (!forceOverwrite && this.Pincode) return;
    try {
      this.isLoadingLocation = true;
      if (forceOverwrite) {
        this.general.present();
      }
      
      const position = await Geolocation.getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 0
      });
      
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      
      if (forceOverwrite) {
        this.general.dismiss();
      }
      this.getGeoLocation(this.latitude, this.longitude, forceOverwrite);
      
      if (forceOverwrite) {
        this.general.presentToast("Location fetched successfully!");
      }
    } catch (error: any) {
      this.isLoadingLocation = false;
      if (forceOverwrite) {
        this.general.dismiss();
      }
      console.log('Location not available, showing custom prompt...', error);
      this.showLocationPermissionAlert();
    }
  }

  async showLocationPermissionAlert() {
    const alert = await this.alertController.create({
      header: 'Location Access Needed',
      message: 'We need your location to automatically fill in your address details. Please enable Location Services in your device settings. You can also skip this and enter your address manually.',
      buttons: [
        {
          text: 'Skip',
          role: 'cancel',
          handler: () => {
            // User skipped, allow manual entry without blocking
          }
        },
        {
          text: 'Go to Settings',
          handler: () => {
            this.openLocationSettings();
          }
        }
      ]
    });
    await alert.present();
  }

  openLocationSettings() {
    NativeSettings.open({ 
      optionAndroid: AndroidSettings.Location,
      optionIOS: IOSSettings.LocationServices 
    });
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
      console.log("BloodGroups Data in Registration:", data);
      if (Array.isArray(data)) {
        this.BloodGroups = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        this.BloodGroups = data.data;
      } else {
        console.warn("Unexpected blood groups format in registration, using fallback");
        this.BloodGroups = [
          { BLGId: 1, BLGName: 'A+' }, { BLGId: 2, BLGName: 'A-' },
          { BLGId: 3, BLGName: 'B+' }, { BLGId: 4, BLGName: 'B-' },
          { BLGId: 5, BLGName: 'O+' }, { BLGId: 6, BLGName: 'O-' },
          { BLGId: 7, BLGName: 'AB+' }, { BLGId: 8, BLGName: 'AB-' }
        ];
      }
    }, err => {
      console.error("Error fetching blood groups in registration, using fallback:", err);
      this.BloodGroups = [
        { BLGId: 1, BLGName: 'A+' }, { BLGId: 2, BLGName: 'A-' },
        { BLGId: 3, BLGName: 'B+' }, { BLGId: 4, BLGName: 'B-' },
        { BLGId: 5, BLGName: 'O+' }, { BLGId: 6, BLGName: 'O-' },
        { BLGId: 7, BLGName: 'AB+' }, { BLGId: 8, BLGName: 'AB-' }
      ];
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
  
  getGeoLocation(lat: any, lng: any, forceOverwrite: boolean = false) {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    geocoder.geocode({ 'location': latlng }, (results: any, status: any) => {
      if (forceOverwrite) {
        this.general.dismiss();
      }
      
      if (status === 'OK' && results[0]) {
        const result = results[0];
        const components = result.address_components;

        // Reset IDs if manually refreshing
        if (forceOverwrite) {
          this.StateID = 0;
          this.DistrictID = 0;
          this.CityID = 0;
          
          this.selectedState = this.getAddressComponent(components, 'administrative_area_level_1');
          this.selectedDistrict = this.getAddressComponent(components, 'administrative_area_level_3') || 
                                   this.getAddressComponent(components, 'administrative_area_level_2');
          this.selectedCity = this.getAddressComponent(components, 'locality') || 
                               this.getAddressComponent(components, 'sublocality_level_1');
          this.Area = this.getAddressComponent(components, 'sublocality') || 
                      this.getAddressComponent(components, 'sublocality_level_1');
          this.Pincode = this.getAddressComponent(components, 'postal_code');
          
          // Update form immediately
          this.registrationForm.controls['area'].setValue(this.Area);
          this.registrationForm.controls['pincode'].setValue(this.Pincode);
          
          this.general.presentToast("Location fetched from GPS!");
        } else {
          // Automatic fetch - only set if empty
          if (!this.selectedState) this.selectedState = this.getAddressComponent(components, 'administrative_area_level_1');
          if (!this.selectedDistrict) {
            this.selectedDistrict = this.getAddressComponent(components, 'administrative_area_level_3') || 
                                   this.getAddressComponent(components, 'administrative_area_level_2');
          }
          if (!this.selectedCity) {
            this.selectedCity = this.getAddressComponent(components, 'locality') || 
                                 this.getAddressComponent(components, 'sublocality_level_1');
          }
          if (!this.Area) {
            this.Area = this.getAddressComponent(components, 'sublocality') || 
                        this.getAddressComponent(components, 'sublocality_level_1');
            this.registrationForm.controls['area'].setValue(this.Area);
          }
          if (!this.Pincode) {
            this.Pincode = this.getAddressComponent(components, 'postal_code');
            this.registrationForm.controls['pincode'].setValue(this.Pincode);
          }
        }

        // Now that fields are populated, trigger matching
        this.loadAndMatchLocation();

      } else {
        if (forceOverwrite) {
          this.general.presentToast("Could not determine address from location.");
        }
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  fallbackGeocode(lat: number, lng: number) {
    const fallbackUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    this.http.get(fallbackUrl).subscribe((response: any) => {
      if (response && response.principalSubdivision) {
        this.selectedState = response.principalSubdivision;
        this.selectedDistrict = response.city || response.locality;
        this.selectedCity = response.locality || response.city;
        this.Area = response.locality || '';
        this.Pincode = response.postcode || '';

        this.registrationForm.controls['area'].setValue(this.Area);
        this.registrationForm.controls['pincode'].setValue(this.Pincode);

        this.loadAndMatchLocation();
      } else {
        this.isLoadingLocation = false;
        console.log('No results found in fallback');
      }
    }, err => {
      this.isLoadingLocation = false;
      console.error('Error getting fallback geocode', err);
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
    this.MiddleName = this.registrationForm.get('middleName')?.value;
    this.SurName = this.registrationForm.get('surName')?.value;
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
    try { this.modal?.dismiss(); } catch(e){}
    try { this.modal2?.dismiss(); } catch(e){}
    try { this.modal3?.dismiss(); } catch(e){}
    try { this.modal4?.dismiss(); } catch(e){}
    try { this.modal11?.dismiss(); } catch(e){}
    try { this.modal6?.dismiss(); } catch(e){}
    try { this.modal7?.dismiss(); } catch(e){}
    try { this.modal8?.dismiss(); } catch(e){}
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

  UserRegistration() {
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
          RegId: this.UserDetails[0].RegId,
          Email: this.UserDetails[0].Email,
          Password: this.UserDetails[0].Password,         
          FullName: this.FirstName,
          MiddleName: this.MiddleName,
          SurName: this.SurName,
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
        this.isSubmitting = true;
        this.general.present('Registering your account, please wait...');
        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          if (data == "SUCCESS") {
            let uploadFile = new FormData();
            uploadFile.append("Mobile", this.Mobile);
            var url2 = 'api/BG/checking_Mobile';
            this.general.PostData(url2, uploadFile).subscribe((result: any) => {
              this.isSubmitting = false;
              this.general.dismiss();
              if (result != "NOTEXIST") {
                localStorage.setItem("UserDetails", JSON.stringify(result));
                this.general.presentAlert("SUCCESS", "Your registration has been completed successfully.");
                this.navCtrl.navigateForward(['/home']);
              }
            }, (err: any) => {
              this.isSubmitting = false;
              this.general.dismiss();
              this.general.presentToast('Something went wrong. Please try again later.');
            });
          } else {
            this.isSubmitting = false;
            this.general.dismiss();
            this.general.presentToast('Something went wrong. Please try again later.');
          }
        }, (err: any) => {
          this.isSubmitting = false;
          this.general.dismiss();
          this.general.presentToast('Something went wrong. Please try again later.');
        });
      } else {
        this.general.presentToast("You are below 18 yrs. So you are not eligible to register.");
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
