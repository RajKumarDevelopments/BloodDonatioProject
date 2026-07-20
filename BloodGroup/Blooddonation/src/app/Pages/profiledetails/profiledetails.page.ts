import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, AlertController, IonModal, Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

declare var google: any;

@Component({
  selector: 'app-profiledetails',
  templateUrl: './profiledetails.page.html',
  styleUrls: ['./profiledetails.page.scss'],
})
export class ProfiledetailsPage implements OnInit {
  activePicker: 'dob' | 'gender' | 'blood' | 'lastDonation' | null = null;
  isSubmitting: boolean = false;
  initialStateStr: string = '';
  backButtonSubscription: any;

  ProfileForm: FormGroup;
  UserDetails: any;
  UserID: any;
  UserName: any;
  Email: any;
  Mobile: any;

  // Profile Variables
  Gender: any;
  selectedGender: any;
  BloodType: any;
  selectedBloodType: any;
  BloodGroupID: any;
  DOB: any;
  Age: any;
  Weight: any;
  LastDonationValue: any;

  // Location Variables
  selectedState: any;
  selectedDistrict: any;
  selectedCity: any;
  StateID: any;
  DistrictID: any;
  CityID: any;
  Area: any;
  Pincode: any;
  UserAddress: any;
  latitude: any;
  longitude: any;

  // Toggle Statuses
  Rolestatus: boolean = false;
  Availablestatus: boolean = false;
  Activestatus: boolean = true;

  // Master Data
  BloodGroups: any[] = [];
  Genders = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
  ];

  date: string = new Date().toISOString();
  TodayDate: any;
  maxDate: string = new Date().toISOString();

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
      this.ProfileForm.get('firstName')?.setErrors({ pattern: true });
      this.ProfileForm.get('firstName')?.markAsTouched();
    }
  }

  onPasteSanitize(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    if (/[^a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
      this.ProfileForm.get('firstName')?.setErrors({ pattern: true });
      this.ProfileForm.get('firstName')?.markAsTouched();
    }
  }

  onFirstNameInput(event: any) {
    let value = event.target.value;
    if (/[^a-zA-Z]/.test(value)) {
      const sanitized = value.replace(/[^a-zA-Z]/g, '');
      this.ProfileForm.get('firstName')?.setValue(sanitized, { emitEvent: false });
      event.target.value = sanitized;
      this.ProfileForm.get('firstName')?.setErrors({ pattern: true });
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    public general: GeneralService,
    public navCtrl: NavController,
    private alertController: AlertController,
    public datePipe: DatePipe,
    private http: HttpClient,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform
  ) {
    this.TodayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    // Load User Data
    const data = localStorage.getItem("UserDetails");
    if (data) {
      this.UserDetails = JSON.parse(data);
      this.UserID = this.UserDetails[0]?.RegId;
      this.UserName = this.UserDetails[0]?.FullName;
      this.Email = this.UserDetails[0]?.Email;
      this.Mobile = this.UserDetails[0]?.Phonenumber;
    }

    // Initialize Form
    this.ProfileForm = this.formBuilder.group({
      firstName: [this.UserDetails?.[0]?.FirstName || this.UserName || '', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/), this.restrictedNameValidator]],
      middleName: [this.UserDetails?.[0]?.MiddleName || ''],
      surName: [this.UserDetails?.[0]?.SurName || ''],
      weight: [this.UserDetails?.[0]?.Weight || '', [Validators.required]]
    });

    // Initialize Other Fields
    if (this.UserDetails && this.UserDetails[0]) {
      const u = this.UserDetails[0];
      this.Gender = u.Gender;
      this.selectedGender = u.Gender;
      this.BloodType = u.BLGName;
      this.selectedBloodType = u.BLGName;
      this.BloodGroupID = u.BLGId;
      this.DOB = u.DOB;
      this.Weight = u.Weight;
      this.LastDonationValue = u.Lastdonatedate;

      this.selectedState = u.StateName || u.newStatename;
      this.selectedDistrict = u.DistrictName || u.newDistrictname;
      this.selectedCity = u.CityName || u.newCityname;
      this.StateID = u.StateId;
      this.DistrictID = u.DistrictId || u.DistrictID;
      this.CityID = u.CityId;
      this.Area = u.Area;
      this.Pincode = u.Pincode;
      this.UserAddress = u.UserAddress;

      this.Rolestatus = u.Rolestatus;
      this.Availablestatus = u.Availablestatus;
      this.Activestatus = u.Status;
    }

    this.captureInitialState();
  }

  ngOnInit() {
    this.GetBloodGroups();
    // Only fetch current location if it's a new profile or location is missing
    if (!this.selectedState || !this.selectedDistrict || !this.selectedCity) {
      this.GetCurrentLocation();
    }
  }

  ionViewDidEnter() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.checkUnsavedChangesAndGoBack(processNextHandler);
    });
  }

  ionViewWillLeave() {
    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  captureInitialState() {
    this.initialStateStr = this.getCurrentState();
  }

  getCurrentState() {
    return JSON.stringify({
      form: this.ProfileForm.value,
      gender: this.Gender || '',
      bloodType: this.BloodType || '',
      dob: this.DOB || '',
      lastDonation: this.LastDonationValue || '',
      state: this.selectedState || '',
      district: this.selectedDistrict || '',
      city: this.selectedCity || '',
      area: this.Area || '',
      pincode: this.Pincode || '',
      role: !!this.Rolestatus,
      available: !!this.Availablestatus
    });
  }

  hasUnsavedChanges(): boolean {
    return this.initialStateStr !== this.getCurrentState();
  }

  goBack() {
    this.checkUnsavedChangesAndGoBack();
  }

  async checkUnsavedChangesAndGoBack(processNextHandler?: any) {
    if (this.hasUnsavedChanges()) {
      const alert = await this.alertController.create({
        header: 'Unsaved Changes',
        message: 'You have unsaved changes. Do you want to save them before leaving this page?',
        buttons: [
          {
            text: 'Discard',
            role: 'cancel',
            handler: () => {
              if (processNextHandler) {
                processNextHandler();
              } else {
                this.navCtrl.navigateBack('/home');
              }
            }
          },
          {
            text: 'Save',
            handler: () => {
              this.UserRegistration(this.ProfileForm.value);
            }
          }
        ]
      });
      await alert.present();
    } else {
      if (processNextHandler) {
        processNextHandler();
      } else {
        this.navCtrl.navigateBack('/home');
      }
    }
  }

  GetBloodGroups() {
    const obj = [{}];
    const UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    const url = "api/BG/BloodGroupMaster_CRUD";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.BloodGroups = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        this.BloodGroups = data.data;
      } else {
        this.BloodGroups = [
          { BLGId: 1, BLGName: 'A+' }, { BLGId: 2, BLGName: 'A-' },
          { BLGId: 3, BLGName: 'B+' }, { BLGId: 4, BLGName: 'B-' },
          { BLGId: 5, BLGName: 'O+' }, { BLGId: 6, BLGName: 'O-' },
          { BLGId: 7, BLGName: 'AB+' }, { BLGId: 8, BLGName: 'AB-' }
        ];
      }
    }, (error) => {
      console.error("Error fetching blood groups:", error);
      // Fallback
      this.BloodGroups = [
        { BLGId: 1, BLGName: 'A+' }, { BLGId: 2, BLGName: 'A-' },
        { BLGId: 3, BLGName: 'B+' }, { BLGId: 4, BLGName: 'B-' },
        { BLGId: 5, BLGName: 'O+' }, { BLGId: 6, BLGName: 'O-' },
        { BLGId: 7, BLGName: 'AB+' }, { BLGId: 8, BLGName: 'AB-' }
      ];
    });
  }

  async GetCurrentLocation(forceOverwrite: boolean = false) {
    if (!forceOverwrite && this.Pincode) return;
    try {
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

      this.getGeoLocation(this.latitude, this.longitude, forceOverwrite);
    } catch (error: any) {
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
          }
          if (!this.Pincode) this.Pincode = this.getAddressComponent(components, 'postal_code');
        }
      }
    });
  }

  getAddressComponent(components: any[], type: string): string | null {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : null;
  }

  DateofBirth(event: any) {
    if (event.detail.value) {
      this.DOB = event.detail.value.split('T')[0];
      this.calculateAge();
      this.closePicker();
    }
  }

  LastDonationDateChanged(event: any) {
    if (event.detail.value) {
      this.LastDonationValue = event.detail.value.split('T')[0];
      this.closePicker();
    }
  }

  setLastDonationOption(option: string) {
    this.LastDonationValue = option;
    this.closePicker();
  }

  formatDate(dateStr: any) {
    if (!dateStr || dateStr === 'N/A' || dateStr === 'I Never Donate' || dateStr === 'I Don’t Remember') return dateStr;
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

  calculateAge() {
    if (!this.DOB) return;
    const today = new Date();
    const birthDate = new Date(this.DOB);
    const diff = today.getTime() - birthDate.getTime();
    this.Age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (this.Age < 18) {
      this.general.presentAlert("Alert", "You are below 18 yrs.");
    }
  }

  selectGender(val: any) {
    this.selectedGender = val;
    this.Gender = val;
    this.closePicker();
  }

  selectBloodGroup(val: any) {
    this.BloodGroupID = val.BLGId;
    this.selectedBloodType = val.BLGName;
    this.BloodType = val.BLGName;
    this.closePicker();
  }

  openPicker(pickerType: any) {
    this.activePicker = pickerType;
    if (pickerType === 'lastDonation') {
      if (this.LastDonationValue && this.LastDonationValue !== 'I Never Donate' && this.LastDonationValue !== 'I Dont Remember' && this.LastDonationValue !== 'I Don’t Remember') {
        this.date = this.LastDonationValue;
      } else {
        this.date = '';
      }
    } else if (pickerType === 'dob') {
      if (this.DOB) {
        this.date = this.DOB;
      } else {
        this.date = '';
      }
    }
  }

  closePicker() {
    this.activePicker = null;
  }

  async openModal(modalId: string) {
    if (modalId === 'modal2') this.openPicker('dob');
    if (modalId === 'modal3') this.openPicker('gender');
    if (modalId === 'modal4') this.openPicker('blood');
    if (modalId === 'modal5') this.openPicker('lastDonation');
  }

  async availabilityChanged(event: any) {
    if (event.detail.checked === false) {
      const alert = await this.alertController.create({
        header: 'Are you sure?',
        message: 'Are you sure you want to stop availability? If you turn off availability, you will not receive any updates from the app until you turn availability back ON.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // Revert the toggle back to its previous state (ON)
              this.Availablestatus = true;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              // Update and save the availability status (OFF)
              this.Availablestatus = false;
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.Availablestatus = true;
    }
  }

  UserRegistration(val: any) {
    if (this.ProfileForm.valid) {
      const obj = [{
        RegId: this.UserID,
        FullName: val.firstName,
        MiddleName: val.middleName,
        SurName: val.surName,
        Email: this.Email,
        Weight: val.weight ?? this.Weight,
        Gender: this.Gender,
        BloodGroupId: this.BloodGroupID,
        DOB: this.DOB,
        StateId: this.StateID || 0,
        DistrictId: this.DistrictID || 0,
        CityId: this.CityID || 0,
        newStatename: this.selectedState || "",
        newDistrictname: this.selectedDistrict || "",
        newCityname: this.selectedCity || "",
        Area: this.Area || "",
        Pincode: this.Pincode || "",
        UserAddress: this.UserAddress,
        Rolestatus: this.Rolestatus,
        RoleId: this.Rolestatus ? 4 : 2,
        Availablestatus: this.Availablestatus,
        Status: this.Activestatus,
        Lastdonatedate: this.LastDonationValue,
        Phonenumber: this.Mobile
      }];

      const UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "3");
      const url = "api/BG/Insert_Update_DonersForm";

      this.isSubmitting = true;
      this.general.present('Saving your details, please wait...');
      this.general.PostData(url, UploadFile).subscribe((res: any) => {
        if (res === "SUCCESS") {
          this.refreshUserData().subscribe((result: any) => {
            this.isSubmitting = false;
            this.general.dismiss();
            if (result && result !== "NOTEXIST") {
              localStorage.setItem("UserDetails", JSON.stringify(result));
            }
            this.general.presentToast("Profile updated successfully!");
            this.navCtrl.navigateRoot('/home');
          }, () => {
            // Fallback in case of error fetching refreshed data
            this.isSubmitting = false;
            this.general.dismiss();
            this.general.presentToast("Profile updated successfully!");
            this.navCtrl.navigateRoot('/home');
          });
        } else {
          this.isSubmitting = false;
          this.general.dismiss();
          this.general.presentToast("Update failed. Please try again.");
        }
      }, error => {
        this.isSubmitting = false;
        this.general.dismiss();
        this.general.presentToast("Connection error. Please check your network.");
      });
    } else {
      if (this.ProfileForm.get('firstName')?.invalid) {
        this.general.presentToast('First Name cannot contain caste names, spaces, special characters, or numbers.');
      } else {
        this.general.presentToast("Please fill all required fields.");
      }
    }
  }

  refreshUserData() {
    const uploadFile = new FormData();
    uploadFile.append("Mobile", this.Mobile);
    return this.general.PostData('api/BG/checking_Mobile', uploadFile);
  }
}
