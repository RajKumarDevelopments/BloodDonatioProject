import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, ImageOptions, } from '@capacitor/camera'
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
//import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'

import { UserService } from '../../Services/user/user.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
declare var google: any;
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-requsetform',
  templateUrl: './requsetform.page.html',
  styleUrls: ['./requsetform.page.scss'],
})
export class RequsetformPage implements OnInit {
  map: any;


  UserDetails1: any; UserDetails: any;
  dateList: any;
  time: any;
  date: any;
  patientname: any;
  Genders: any;
  BloodGroups: any; BloodUnits: any;
  BloodRequestForm: FormGroup;
  selectedBloodType: any; BloodGroupID: any;
  selectedBloodUnit: any; BloodUnitID: any;
  selectedGender: any;
  Distict: any;
  country: any;
  state: any;
  pincode: any;
  area: any;
  city: any;
  selectedpincode: any;
  selectedarea: any;
  latitude: any;
  longitude: any;
  searchValue: any;
  DistrictsID1: any;
  CityID1: any;
  selectedCity1: any;
  selectedDistrict1: any;
  selectedState1: any;
  DistrictID1: any;
  selectedImage: any;
  HomeUrl: any;
  Cities1: any;
  selectedCitiesid: any;
  Districts: any;
  Districts1: any;
  selecteddistid: any;
  StateID: any;
  States: any;
  States1: any;
  selectedstateid: any;
  CityID: any;
  selectedtype: any;
  selectedDate: string = new Date().toISOString(); // Initialize with current date
  formattedSelectedDate: string = this.formatDate(new Date());
    selectedCity: any;
    selectedState: any;
    selectedDistrict: any;
    Cities: any;
    CatID: any;
    Catname: any;
    DistrictID: any;
  distictids: any; test: any = [];
  selectedTime: any;
  selectedtime: any; types: any;
  InviteCode: any; TandC: any; Policy: any;
  TandCValue: any;
  PolicyValue: any;
  data1: any;
  mydata: any;
  FullName: any;
  Age: any;
  Gender: any;
  BloodGroup: any;
  BloodUnit: any;
  Reason: any;
  Pincode: any;
  RequiredDate: any;
  ContactName: any;
  ContactNumber: any;
  HospitalName: any; flags: any; Requireddate: any;
  Address: any; CurrentAddress: any;
  placeService: any; autocomplete: any; searchQuery: any;
  selectedLocation: string = 'address'; // Default location
  marker: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  predictions: any;
    StateID1: any;
    distictids1: any;
    CityIDs1: any;
  opend: any;
  
  constructor(private photoViewer: PhotoViewer,public general: GeneralService, private modal: ModalController, private fb: FormBuilder,
  private nav: NavController, private loadingController: LoadingController, public actionSheetController: ActionSheetController, private alert: AlertController,
    private http: HttpClient, public activeRoute: ActivatedRoute, public user: UserService) {
   
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.HomeUrl = localStorage.getItem("URL")
    
  
    this.BloodRequestForm = this.fb.group({
      //FullName: ['', Validators.required],

      FullName: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],
      Age: ['', Validators.compose([Validators.required, Validators.pattern(/^\d+$/)])],
      Gender: ['', Validators.required],
      BloodGroup: ['', Validators.required],
      BloodUnit: ['', Validators.required],
      Reason: ['', Validators.required],
     // Pincode: ['', Validators.required],
      RequiredDate: ['', Validators.required],
      ContactName: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],
      ContactNumber: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.required])],
     // HospitalName: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],
      //area: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],

    })

    this.Genders = [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Others', label: 'Others' },
    ],
      this.types = [
      { value: 'Whole Blood', label: 'Whole Blood' },
      { value: 'Platelets', label: 'Platelets' },
      { value: 'Plasma', label: 'Plasma' },
      ]


    this.data1 = this.activeRoute.snapshot.paramMap.get("objs");
    this.mydata = JSON.parse(this.data1);
    this.TandCValue = this.activeRoute.snapshot.paramMap.get("TandCValue");
    if (this.TandCValue == 1) {
      this.TandC = true;
      this.getdata();
    }
    this.PolicyValue = this.activeRoute.snapshot.paramMap.get("PolicyValue");

    if (this.PolicyValue == 1) {
      this.Policy = true;
      this.getdata1();
    }
    if (this.PolicyValue == 1 && this.TandCValue == 1) {
      this.Policy = true;
      this.TandC = true;
      this.getdata();
    }
  }

  ngOnInit() {

    //this.getCurrentLocation();
    this.GetStates();
    this.GetBloodGroups();
    this.GetBloodUnits();
    this.loadMap();

  }
 
 
  


  loadMap1() {
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps JavaScript API is not loaded.');
      return;
    }

    const mapOptions = {
      center: new google.maps.LatLng(20.5937, 78.9629), // Default center location (India)
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if (this.mapElement && this.mapElement.nativeElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Initialize the Places Service
      this.placeService = new google.maps.places.PlacesService(this.map);

      // Initialize the Autocomplete Service
      this.autocomplete = new google.maps.places.AutocompleteService();
    } else {
      console.error('Map element is not properly initialized.');
    }
  }

  loadMap() {
    const mapOptions = {
      center: new google.maps.LatLng(0, 0),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      disableDefaultUI: true
    };

    if (this.mapElement && this.mapElement.nativeElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Initialize the Places Service
      this.placeService = new google.maps.places.PlacesService(this.map);

      // Initialize the Autocomplete Service
      this.autocomplete = new google.maps.places.AutocompleteService();
    } else {
      console.error('Map element is not properly initialized.');
    }
  }




  onSearchInput() {
   
    if (this.searchQuery.length > 2) {
      this.autocomplete.getPlacePredictions({
        input: this.searchQuery,
        componentRestrictions: { country: 'IN' } // Restrict results to India
      }, (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.predictions = predictions || [];
        } else {
          console.error('Error fetching place predictions:', status);
          this.predictions = [];
        }
      });
    } else {
      this.predictions = [];
    }
  }

  selectPrediction(prediction: any) {
  
    this.searchQuery = prediction.description;
    const descriptionParts = prediction.description.split(',');
    const hospitalName = descriptionParts[0].trim(); this.predictions = [];
    this.BloodRequestForm.controls['HospitalName'].setValue(hospitalName);

    this.getPlaceDetails(prediction.place_id);
  }
 

 



  getPlaceDetails(placeId: string) {
    const request = {
      placeId: placeId,
      fields: ['address_components', 'formatted_address', 'geometry']
    };

    this.placeService.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Extract latitude and longitude from geometry
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);

        // Set the map to the place location
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);

        // Remove previous marker if exists
        if (this.marker) {
          this.marker.setMap(null);
        }

        // Add a new marker at the place location
        this.marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name || ''
        });

        // Optionally, you can call a method to fetch nearby places
        this.fetchNearbyPlaces(place.geometry.location);

        // Bind address components to form fields or handle them as needed
        

        // You can now pass the latitude and longitude to any other method if needed
        this.getCityAndArea(latitude, longitude); // For example, passing it to your custom method
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }



  fetchNearbyPlaces(location: any) {
    
    const request = {
      location: location,
      radius: '1500', // Radius in meters
      type: ['restaurant', 'hospital'] // Types of places to search
    };

    this.placeService.nearbySearch(request, (results: any[], status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place: any) => {
          new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name
          });
        });
        console.log('loc:', this.placeService )
        //this.handlePlacePredictions(predictions[0].place_id);

      } else {
        console.error('Error fetching nearby places:', status);
      }
    });
  }

 
  
  searchLocation() {
    if (this.searchQuery) {
      this.autocomplete.getPlacePredictions({ input: this.searchQuery }, (predictions:any, status:any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Handle predictions
          if (predictions.length > 0) {
            this.handlePlacePredictions(predictions[0].place_id);
          }
        } else {
          console.error('Autocomplete request failed due to', status);
        }
      });
    }
  }



  handlePlacePredictions(predictions:any) {
    if (predictions.length > 0) {
      const placeId = predictions[0].place_id;
      this.placeService.getDetails({ placeId }, (place:any, status:any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Bind state, city, and area
          this.bindLocationDetails(place);
        } else {
          console.error('Place details request failed due to', status);
        }
      });
    }
  }

  bindLocationDetails(place: any) {
   
    const addressComponents = place.address_components;

    // Extract location details using helper function
    this.city = this.getAddressComponent(addressComponents, 'locality') ||
      this.getAddressComponent(addressComponents, 'administrative_area_level_2') || '';

    this.area = this.getAddressComponent(addressComponents, 'sublocality') ||
      this.getAddressComponent(addressComponents, 'sublocality_level_1') ||
      this.getAddressComponent(addressComponents, 'neighborhood') || '';

    this.pincode = this.getAddressComponent(addressComponents, 'postal_code') || '';

    this.state = this.getAddressComponent(addressComponents, 'administrative_area_level_1') || '';

    this.country = this.getAddressComponent(addressComponents, 'country') || '';

    // Update the form fields with the extracted details
    this.BloodRequestForm.controls['area'].setValue(this.area);
    this.BloodRequestForm.controls['Pincode'].setValue(this.pincode);
    this.BloodRequestForm.controls['state'].setValue(this.state);
    this.BloodRequestForm.controls['city'].setValue(this.city);

    console.log('Details:', {
      city: this.city,
      area: this.area,
      pincode: this.pincode,
      state: this.state,
      country: this.country
    });
  }

  




  getCityAndArea(lat: number, lng: number) {
  
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`; // Replace with your API key
    this.http.get(url).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];
        this.latitude = lat;
        this.longitude = lng;
        this.city = this.getAddressComponent(result.address_components, 'locality');
        this.selectedCity = this.city
        this.area = this.getAddressComponent(result.address_components, 'sublocality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.selectedarea = this.area
        this.pincode = this.getAddressComponent(result.address_components, 'postal_code');
        this.selectedpincode = this.pincode
        this.state = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedState = this.state
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.Distict
        this.BloodRequestForm.controls['area'].setValue(this.area);
        this.BloodRequestForm.controls['Pincode'].setValue(this.pincode);

        this.StateID1 = this.States1.filter((id: any) => id.StateName == this.selectedState)
        this.StateID = this.StateID1[0].StateId
        this.distictids1 = this.Districts1.filter((id: any) => id.DistrictName == this.selectedDistrict)
        this.distictids = this.distictids1[0].DistrictId
        this.CityIDs1 = this.Cities1.filter((id: any) => id.CityName == this.selectedCity)
        this.CityID1 = this.CityIDs1[0].CityId
        console.log('Distict:', this.Distict, 'City:', this.city, 'Area:', this.area, 'Pincode:', this.pincode, 'State:', this.state, 'Country:', this.country);
      } else {
        console.log('No results found');
      }
    }, (error: any) => {
      console.error('Error getting geocode', error);
    });
  }




  updateMapLocation(lat: number, lng: number) {
    const location = new google.maps.LatLng(lat, lng);
    this.map.setCenter(location);
    this.map.setZoom(15);
  }

  open1(state: number) {
    this.opend = state; // Set the state to 1 to open, and 0 to close
  }


  getdata() {
   
    this.flags = 3
    this.TandC = true;
    const data = this.mydata[0];
    this.BloodRequestForm.controls['FullName'].setValue(data.FullName);
    this.BloodRequestForm.controls['Age'].setValue(data.age);
    this.BloodRequestForm.controls['Gender'].setValue(data.Gender);
    this.BloodRequestForm.controls['BloodGroup'].setValue(data.BloodGroupId);
    this.BloodRequestForm.controls['BloodUnit'].setValue(data.UnitsofBloodId);
    //this.BloodRequestForm.controls['Typesofblood'].setValue(data.Typesofblood);
    this.BloodRequestForm.controls['Reason'].setValue(data.Purpose);
    this.BloodRequestForm.controls['Pincode'].setValue(data.Pincode);
    this.BloodRequestForm.controls['RequiredDate'].setValue(data.BloodRequestDate);
    this.Requireddate= data.BloodRequestDate;
    this.BloodRequestForm.controls['ContactName'].setValue(data.ContactPerson);
    this.BloodRequestForm.controls['ContactNumber'].setValue(data.ContactMobile);
    this.BloodRequestForm.controls['HospitalName'].setValue(data.HospitalName);
    this.BloodRequestForm.controls['area'].setValue(data.HospitalAddress);
    this.selectedBloodUnit = data.selectedBloodUnit,
    this.selectedBloodType = data.selectedBloodType,
      this.selectedtype = data.Typesofblood,
      this.selectedImage = data.Receiptimage
    //this.BloodRequestForm.controls['Email'].setValue(data.Email);
    //this.selectState(data.StateId);
    //this.selectDistrict(data.DistrictId);
    //this.state(data.CityId);

  }
  getdata1() {
    
    this.flags = 3;
    this.TandC = true;
    this.Policy = true;

    const data = this.mydata[0];
    this.BloodRequestForm.controls['FullName'].setValue(data.FullName);
    this.BloodRequestForm.controls['Age'].setValue(data.age);
    this.BloodRequestForm.controls['Gender'].setValue(data.Gender);
    this.BloodRequestForm.controls['BloodGroup'].setValue(data.BloodGroupId);
    this.BloodRequestForm.controls['BloodUnit'].setValue(data.UnitsofBloodId);
    //this.BloodRequestForm.controls['Typesofblood'].setValue(data.Typesofblood);
    this.BloodRequestForm.controls['Reason'].setValue(data.Purpose);
    this.BloodRequestForm.controls['Pincode'].setValue(data.Pincode);
    this.BloodRequestForm.controls['RequiredDate'].setValue(data.BloodRequestDate);
    this.Requireddate= data.BloodRequestDate;
    this.BloodRequestForm.controls['ContactName'].setValue(data.ContactPerson);
    this.BloodRequestForm.controls['ContactNumber'].setValue(data.ContactMobile);
    this.BloodRequestForm.controls['HospitalName'].setValue(data.HospitalName);
    this.BloodRequestForm.controls['area'].setValue(data.HospitalAddress);
    this.selectedBloodUnit = data.selectedBloodUnit,
    this.selectedBloodType = data.selectedBloodType,
      this.selectedtype = data.Typesofblood,
      this.selectedImage = data.Receiptimage

    //this.BloodRequestForm.controls['Email'].setValue(data.Email);
    //this.selectState(data.StateId);
    //this.selectDistrict(data.DistrictId);
    //this.state(data.CityId);

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
  GetBloodUnits() {
   
    var obj = [{}]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/UnitsofBlood_CRUD";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
    
      this.BloodUnits = data;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  reg() {
    this.modal.dismiss();
  }
  selectGender(val: any) {

    this.selectedGender = val;
    this.BloodRequestForm.controls['Gender'].setValue(this.selectedGender);
    this.reg();
  } selectblood(val: any) {
    
    this.selectedtype = val;
    this.BloodRequestForm.controls['Gender'].setValue(this.selectedGender);
    this.reg();
  }
  selectBloodGroup(val: any) {
    
    this.BloodGroupID = val.BLGId;
    this.selectedBloodType = val.BLGName;
    this.BloodRequestForm.controls['BloodGroup'].setValue(this.BloodGroupID);
    this.reg();
  }
  selectBloodUnit(val: any) {
   
    this.BloodUnitID = val.UnitsofBloodId;
    this.selectedBloodUnit = val.UnitsofBlood;
    this.BloodRequestForm.controls['BloodUnit'].setValue(this.BloodUnitID);
    this.reg();
  }

  AddRequestForm() {
    debugger
    const contactNumber = this.BloodRequestForm.value.ContactNumber;

    // Check if contact number is exactly 10 digits
    if (!/^\d{10}$/.test(contactNumber)) {
      this.general.presentToastt("Please enter exactly 10 digits for Contact Number.", "warning");
      return; // Stop execution
    }

    if (this.BloodRequestForm.valid) {   
        var selectedDateTime = this.BloodRequestForm.value.RequiredDate;
        var selectedDate = selectedDateTime.split('T')[0];
        var selectedTime = selectedDateTime.split('T')[1];
        this.selectedtime = selectedTime
        var obj = [{
          RegId: this.UserDetails[0].RegId,
          FullName: this.BloodRequestForm.value.FullName,
          age: this.BloodRequestForm.value.Age,
          Gender: this.selectedGender,
          BloodGroupId: this.BloodRequestForm.value.BloodGroup,
          UnitsofBloodId: this.BloodRequestForm.value.BloodUnit,
          BloodRequestDate: selectedDate,
          RequestTime: selectedTime,
          Purpose: this.BloodRequestForm.value.Reason,
          Typesofblood: this.selectedtype,
          requestid: 1,
          StateId: this.StateID,
          DistrictId: this.distictids,
          CityId: this.CityID1,
          newStatename: this.mydata[0].newStatename,
          newDistrictname: this.mydata[0].newDistrictname,
          newCityname: this.mydata[0].newCityname ,

          HospitalName: this.mydata[0].HospitalName,
          HsptName: this.mydata[0].HospitalName,
         // HospitalAddress: this.BloodRequestForm.value.area,
          HospitalAddress: this.mydata[0].HospitalAddress,
          ContactPerson: this.BloodRequestForm.value.ContactName,
          ContactMobile: this.BloodRequestForm.value.ContactNumber,
          Pincode: this.mydata[0].Pincode,
          //Receiptimage: this.mydata[0].selectedImage,
           Receiptimage: this.mydata[0].Receiptimage,
          Requestedby: this.UserDetails[0].RegId,
          CreatedBy: this.UserDetails[0].RegId,
          latitude: this.mydata[0].latitude,
          longitude: this.mydata[0].longitude,
          Status: true,

        }]
        var UploadFile = new FormData()
        UploadFile.append("Param", JSON.stringify(obj));
        UploadFile.append("Flag", '2');
        var url = "api/BG/Insert_Update_requestForm";
        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          
          if (data == "SUCCESS") {
           // this.Sendmailfromadmin()
           // this.sendnotification(this.BloodRequestForm.value.Pincode);
            this.selectedGender = undefined;
            this.selectedBloodType = undefined;
            this.selectedBloodUnit = undefined;
            this.BloodRequestForm.reset();
            this.nav.navigateForward(['/home'])
            this.general.presentAlert("SUCCESS", "Blood request raised succesfully. Please wait untill admin approve..!");
          }
        })
    } else {
      this.general.presentToast("Please enter all fields to raise a blood request..!");

      }
    }
    

  tac() {
    if (this.TandCValue) {
      const data = this.mydata[0];
      var selectedDateTime = this.BloodRequestForm.value.RequiredDate;
      var selectedDate = selectedDateTime.split('T')[0];
      var selectedTime = selectedDateTime.split('T')[1];
      this.selectedtime = selectedTime
      var obj = [{
        FullName: data.FullName,
        age: data.age,
        Gender: data.Gender,
        UnitsofBloodId: data.UnitsofBloodId,
        selectedBloodType: data.selectedBloodType,
        selectedBloodUnit: data.selectedBloodUnit,

        BloodRequestDate: data.selectedDate,
        Purpose: data.Purpose,
        StateId: data.StateID,
        DistrictId: data.distictids,
        CityId: data.CityID1,
        HospitalName: data.HospitalName,
        HospitalAddress: data.area,
        ContactPerson: data.ContactName,
        ContactMobile: data.ContactNumber,
        Pincode: data.Pincode,
        Email: this.UserDetails[0].Email,
       // Email: 'ramakrishna.y@gagriglobal.com',
        BloodGroupId: data.BloodGroup,

        Typesofblood: data.selectedtype,
        Receiptimage: data.selectedImage


      }]
      this.nav.navigateForward(['/termsofusedisclaimer', { data: JSON.stringify(obj) }])
    } else {
      var selectedDateTime = this.BloodRequestForm.value.RequiredDate;
      var selectedDate = selectedDateTime.split('T')[0];
      var selectedTime = selectedDateTime.split('T')[1];
      this.selectedtime = selectedTime
      var obj = [{
        FullName: this.BloodRequestForm.value.FullName,
        age: this.BloodRequestForm.value.Age,
        Gender: this.selectedGender,
        UnitsofBloodId: this.BloodRequestForm.value.BloodUnit,
        selectedBloodType: this.selectedBloodType,
        selectedBloodUnit: this.selectedBloodUnit,

        BloodRequestDate: selectedDate,
        Purpose: this.BloodRequestForm.value.Reason,
        StateId: this.StateID,
        DistrictId: this.distictids,
        CityId: this.CityID1,
        HospitalName: this.BloodRequestForm.value.HospitalName,
        HospitalAddress: this.BloodRequestForm.value.area,
        ContactPerson: this.BloodRequestForm.value.ContactName,
        ContactMobile: this.BloodRequestForm.value.ContactNumber,
        Pincode: this.BloodRequestForm.value.Pincode,
        Email: this.UserDetails[0].Email,
       // Email: 'ramakrishna.y@gagriglobal.com',
        BloodGroupId: this.BloodRequestForm.value.BloodGroup,

        Typesofblood: this.selectedtype,
        Receiptimage: this.selectedImage


      }]
      this.nav.navigateForward(['/termsofusedisclaimer', { data: JSON.stringify(obj) }])
    }
    

  }

  policy() {
    
    if (this.PolicyValue) {
      const data = this.mydata[0];
      var selectedDateTime = this.BloodRequestForm.value.RequiredDate;
      var selectedDate = selectedDateTime.split('T')[0];
      var selectedTime = selectedDateTime.split('T')[1];
      this.selectedtime = selectedTime
      var obj = [{
        FullName: data.FullName,
        age: data.age,
        Gender: data.Gender,
        UnitsofBloodId: data.UnitsofBloodId,
        selectedBloodType: data.selectedBloodType,
        selectedBloodUnit: data.selectedBloodUnit,

        BloodRequestDate: data.selectedDate,
        Purpose: data.Purpose,
        StateId: data.StateID,
        DistrictId: data.distictids,
        CityId: data.CityID1,
        HospitalName: data.HospitalName,
        HospitalAddress: data.area,
        ContactPerson: data.ContactName,
        ContactMobile: data.ContactNumber,
        Pincode: data.Pincode,
        Email: this.UserDetails[0].Email,
       // Email: 'ramakrishna.y@gagriglobal.com',
        BloodGroupId: data.BloodGroup,

        Typesofblood: data.selectedtype,
        Receiptimage: data.selectedImage
      }]
      this.nav.navigateForward(['/privacypolicy', { data: JSON.stringify(obj) }])
    } else {
      var selectedDateTime = this.BloodRequestForm.value.RequiredDate;
      var selectedDate = selectedDateTime.split('T')[0];
      var selectedTime = selectedDateTime.split('T')[1];
      this.selectedtime = selectedTime
      var obj = [{
        FullName: this.BloodRequestForm.value.FullName,
        age: this.BloodRequestForm.value.Age,
        Gender: this.selectedGender,
        UnitsofBloodId: this.BloodRequestForm.value.BloodUnit,
        selectedBloodType: this.selectedBloodType,
        selectedBloodUnit: this.selectedBloodUnit,

        BloodRequestDate: selectedDate,
        Purpose: this.BloodRequestForm.value.Reason,
        StateId: this.StateID,
        DistrictId: this.distictids,
        CityId: this.CityID1,
        HospitalName: this.BloodRequestForm.value.HospitalName,
        HospitalAddress: this.BloodRequestForm.value.area,
        ContactPerson: this.BloodRequestForm.value.ContactName,
        ContactMobile: this.BloodRequestForm.value.ContactNumber,
        Pincode: this.BloodRequestForm.value.Pincode,
        Email: this.UserDetails[0].Email,
       // Email: 'ramakrishna.y@gagriglobal.com',
        BloodGroupId: this.BloodRequestForm.value.BloodGroup,

        Typesofblood: this.selectedtype,
        Receiptimage: this.selectedImage


      }]
      this.nav.navigateForward(['/privacypolicy', { data: JSON.stringify(obj) }])
    }
    
  }
  
  Sendmailfromadmin() {
   debugger
    var selectedDateTime = this.BloodRequestForm.value.RequiredDate;
    var selectedDate = selectedDateTime.split('T')[0];
    var selectedTime = selectedDateTime.split('T')[1];
    this.selectedtime = selectedTime
    var obj = [{
        FullName: this.BloodRequestForm.value.FullName,
        age: this.BloodRequestForm.value.Age,
      Gender: this.selectedGender,
      BLGName: this.selectedBloodType,
        UnitsofBloodId: this.BloodRequestForm.value.BloodUnit,
        BloodRequestDate: selectedDate,
        RequestTime: selectedTime,
        Purpose: this.BloodRequestForm.value.Reason,
      StateName: this.mydata[0].newStatename,
      DistrictName: this.mydata[0].newDistrictname,
      CityName: this.mydata[0].newCityname,
      HospitalName: this.mydata[0].HospitalName,
      HospitalAddress: this.mydata[0].HospitalAddress,
        ContactPerson: this.BloodRequestForm.value.ContactName,
        ContactMobile: this.BloodRequestForm.value.ContactNumber,
      Pincode: this.mydata[0].Pincode,
      Email: this.UserDetails[0].Email,
      //Email:'Mail.raajk@gmail.com'
      //Email: 'surajpatnaik091@gmail.com'
        
    }]
    var UploadFile = new FormData();
    UploadFile.append("Email", JSON.stringify(obj));

    var url = "api/BG/EnquiryMailTo_Bloodrequest";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
     
    //  this.general.presentAlert("SUCCESS", "Send mail succesfully.");
      this.nav.navigateForward('/home')
      
    }, err => {
     // this.general.presentToast("something went wrong");
    })
  }



  sendnotification(Pincode: any) {
    
    var path = "requsetform";
    const massege = "The request " + this.selectedBloodType + ".comes from " + this.BloodRequestForm.value.HospitalName + ", located at " + this.BloodRequestForm.value.area + " .They are looking for donors who can come in at " + this.selectedtime + ", For more information, you can contact " + this.BloodRequestForm.value.ContactName + ".at " + this.BloodRequestForm.value.ContactNumber + " ";
    this.user.getAdmin().subscribe((data: any) => {
    
      for (var i = 0; i < data.length; i++) {
      
        var UploadFile = new FormData();
        UploadFile.append("deviceToken", data[i].Devicetoken);
        UploadFile.append("message", massege);
        UploadFile.append("senderName", "BloodGroup");
        UploadFile.append("Path", path);
        var notificationUrl = "api/BG/sendNotification";
        this.general.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
       

          this.test.push({
            RegID: data[0].RegId,          
            NotificationsDesc: massege,
            CreatedBy: this.UserDetails[0].RegId,
            NotiRecevieID: this.UserDetails[0].RegId// asif
          });

          var notificationsUrl = "api/BG/Crud_Notifications";
          var notificationsUploadFile = new FormData();
          notificationsUploadFile.append("Param", JSON.stringify(this.test));
          notificationsUploadFile.append("Flag", "1");

          this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
            this.nav.navigateForward(['/home'])
          });
        });
      }
    });
  }

  Date(item: any) {
   
    this.time = item.detail.value
  }


  SearchStates() {
   
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.States = this.States1;
    } else {
      this.States = this.States1.filter((BG: any) => {
        return (
          BG.StateName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }

  SearchDistricts() {
    
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Districts = this.Districts1;
    } else {
      this.Districts = this.Districts1.filter((BG: any) => {
        return (
          BG.DistrictName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }

  SearchCities() {
    
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Cities = this.Cities1;
    } else {
      this.Cities = this.Cities1.filter((BG: any) => {
        return (
          BG.CityName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }
  selectcat(val: any) {
    
    this.CatID = val.Categoryid;
    this.Catname = val.categoryname;
  }

  selectState(val: any) {
   
    this.StateID = val.StateId;
    this.selectedState = val.StateName;
    this.selectedState1 = val.StateName;
    this.GetDistricts(this.StateID);
    this.reg();
  }
  selectDistrict(val: any) {
    
    this.DistrictID = val.DistrictID;
    this.DistrictID1 = val.DistrictID;
    this.selectedDistrict = val.DistrictName;
    this.selectedDistrict1 = val.DistrictName;
    this.GetCities(this.DistrictID1);
    this.reg();
  }
  selectCity(val: any) {
 
    this.CityID1 = val.CityId;
    this.selectedCity = val.CityName;
    this.selectedCity1 = val.CityName;
    this.reg();
  }

  getAddressComponent(components: any[], type: string) {
    for (const component of components) {
      if (component.types.includes(type)) {
        return component.long_name;
      }
    }
    return null;
  }
  getAddressComponent1(components: any[], type: string): string | null {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : null;
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
      if (this.selectedState1) {
        this.StateID = this.StateID
        this.GetDistricts(this.StateID);
      }
      else {
        this.selectedstateid = this.States1.filter((id: any) => id.StateName == this.selectedState)
        this.StateID = this.selectedstateid[0].StateId
        this.GetDistricts(this.StateID);
      }

      // console.log('State:', this.StateID)


    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  GetDistricts(selectstate: any) {
   
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      StateId: selectstate
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/DistrictMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
     
      this.Districts = data;
      this.Districts1 = data;


      if (this.selectedDistrict1) {
        this.DistrictsID1 = this.DistrictID1;
        this.distictids = this.DistrictID1
        this.GetCities(this.DistrictsID1);
      }
      else {
        this.selecteddistid = this.Districts1.filter((id: any) => id.DistrictName == this.Distict)
        this.DistrictsID1 = this.selecteddistid[0].DistrictID
        this.distictids = this.DistrictID1
        this.GetCities(this.DistrictsID1);
      }


    }, err => {
      this.general.presentToast("something went wrong");
    })
  }


  GetCities(selectdist: any) {
    
    this.distictids = selectdist;

    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      DistrictId: selectdist
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/CitiesMaster_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
     

      this.Cities = data;
      this.Cities1 = data;
      if (this.selectedCity1) {
        this.CityID1 = this.CityID1
      }
      else {
        this.selectedCitiesid = this.Cities1.filter((id: any) => id.CityName == this.city)

        this.CityID1 = this.Cities1[0].CityId

      }
      // this.CityID1 = this.selectedCitiesid[0].CityId
      // console.log('ct:', this.cityID)
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  
  public async selectImage() {
    try {
      const actionSheet = await this.actionSheetController.create({
        header: 'Select Image Source',
        buttons: [
          {
            text: 'Gallery',
            icon: 'images',
            handler: () => this.takePicture(CameraSource.Photos)
          },
          {
            text: 'Camera',
            icon: 'camera',
            handler: () => this.takePicture(CameraSource.Camera)
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel'
          }
        ]
      });
      await actionSheet.present();
    } catch (err) {
      console.error('Error opening action sheet', err);
      this.general.presentToast('Could not open image selector.');
    }
  }

  // Capture or select image and upload
  async takePicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        source,
        resultType: CameraResultType.Uri,
        quality: 60,
        width: 1000,
        correctOrientation: true
      });

      if (!image || !image.webPath) {
        this.general.presentToast('No image selected.');
        return;
      }

      // Convert webPath to blob
      const response = await fetch(image.webPath);
      const blob = await response.blob();

      // Extract original file name if possible
      let originalFileName = 'image'; // default name
      if (image.path) {
        const pathParts = image.path.split('/');
        originalFileName = pathParts[pathParts.length - 1].split('.')[0]; // remove extension
      }

      // Add timestamp
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15); // YYYYMMDD_HHmmss
      const ext = blob.type.split('/')[1] || 'jpeg';
      const fileName = `${originalFileName}_${timestamp}.${ext}`;

      // Create form data
      const formData = new FormData();
      formData.append('PostedFile', blob, fileName);

      // Upload to backend
      const uploadUrl = `${this.HomeUrl}api/BG/UploadRecieptImages`;
      this.http.post(uploadUrl, formData, { responseType: 'text' }).subscribe({
        next: (res: any) => {
          res = res.replace(/"/g, '');
          if (res.startsWith('ERROR')) {
            this.general.presentToast(res);
            return;
          }

          this.selectedImage = res;
          this.general.presentAlert('SUCCESS', 'Receipt image uploaded successfully.');
          console.log('Uploaded Image Path:', `${this.HomeUrl}${res}`);
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.general.presentToast('Image upload failed. Try again.');
        }
      });

    } catch (err) {
      console.error('Error capturing image:', err);
      this.general.presentToast('Image capture failed.');
    }
  }




  createFileName() {
    const timestamp = new Date().getTime();
    return `${timestamp}.jpg`;
  }
  formatDate(date: Date): string {
    // Format the date to 'DD-MM-YYYY'
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  public async Photozoom(url: any) {
    
    this.photoViewer.show(url, 'Image Zoom', { share: true });

    const options = {
      share: true, // default is false
      closeButton: true, // default is true
      copyToReference: true, // default is false
      headers: "",  // If it is not provided, it will trigger an exception
      piccasoOptions: {} // If it is not provided, it will trigger an exception
    };
    //var url = this.HomeUrl;
    this.photoViewer.show(url, "", options);
  }


  ///location////

  getnavigation() {
    this.nav.navigateForward('/searchlocation')

  }
  allowOnlyDigits(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, ''); // Removes anything that's not 0-9
  }

}
