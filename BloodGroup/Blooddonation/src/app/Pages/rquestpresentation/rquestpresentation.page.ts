import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, AlertController, IonRouterOutlet, PopoverController, Platform, NavController, LoadingController, ActionSheetController, ModalController, IonAccordionGroup } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/user/user.service';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';

import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
import { firstValueFrom } from 'rxjs';
declare var google: any;

@Component({
  selector: 'app-rquestpresentation',
  templateUrl: './rquestpresentation.page.html',
  styleUrls: ['./rquestpresentation.page.scss'],
})
export class RquestpresentationPage implements OnInit {
  activeAccordion: number | null = null;
  activeAccordionOpen: number | null = null;
  activeAccordionClosed: number | null = null;
  isModalOpen: boolean = false;
  Rescheduledate: any;
  message: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  @ViewChild('openAccordionGroup', { static: false }) openAccordionGroup!: IonAccordionGroup;
  @ViewChild('closedAccordionGroup', { static: false }) closedAccordionGroup!: IonAccordionGroup;
  Myrequsest: any;
  closedrec: any;
  selectedTab: string = 'open';
  placeService: any;
  opening: boolean = true;
  closed: boolean = false;
  UserDetails1: any;
  UserDetails: any;
  RequestForm: FormGroup;
  StatesList: any;
  DistrictsList: any;
  CitiesList: any;
  StateID: any;
  DistrictID: any;
  CityID: any;
  selectedCity: any;
  test: any = [];
  DistrictId: any;
  venueslist: any;
  States: any;
  States1: any;
  Districts: any;
  Districts1: any;
  Cities: any;
  Cities1: any;
  searchValue: any;
  selectedState: any;
  selectedDistrict: any;
  venueslist1: any;
  selectedPlace: any;
  WorkID: any;
  setid: any;
  HomeURL: any;
  Photo: any;
  currentposition: any;
  latitude: any;
  longitude: any;
  city: any;
  area: any;
  pincode: any;
  state: any;
  country: any; district: any; Pincode1: any;
  address: any;
  Alldet: any;
  leadersonly: any;
  leadersPincode: any;
  ourleaderspincode: any;
  CurrentPincode: any;
  requests: any;
  currentrequest: any;
  mycurrentpincode: any;
  custmer: any;
  Admindevicetoken: any;
  AdminPincode: any;
  AdminDeviceid: any;
  AdminsPincode: any;
  leaderdevicetoken: any;
  leadersId: any;
  ourleadresids: any;
  Ourrequests: any;
  Rk: any;
  map: any;
  predictions: any;
  marker: any;
  autocomplete: any; searchQuery: any;
  first: boolean = true;
  venue: any;
  flags: any;
  Reschedule: any;
  RequestDate: any;
  RequiredDate: any;
  accordionState: any;
  openIndex: number = -1;
  expirelist: any;
  expiredlist: any;
  values: any;
  requests1: any;
  MyClosedrequsest: any;
  SelectedvenuName: any;
  Selectedarea: any;
  venuepincode: any;
  SelectedAddress: any;
  curnt: boolean = false;
  myPincode: any;
  daterqst: any;
  form: any;
  showVirtual = true;
  showInPerson = true;
  selectedItem: any;

  minDateTime: string = '';
  count: any;
  presentationResult: any;
  constructor(
    private Fb: FormBuilder,
    public platform: Platform,

    public locationservice: GeolocationserviceService,
    private modal: ModalController,
    public datePipe: DatePipe,
    public general: GeneralService, private launchNavigator: LaunchNavigator,
    public navCtrl: NavController, public http: HttpClient, public activeRoute: ActivatedRoute,
    public user: UserService, private alertController: AlertController) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.state = localStorage.getItem("State");
    this.district = localStorage.getItem("Distict");
    this.city = localStorage.getItem("City");
    if (this.UserDetails[0].Status == false) {
      // this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
    else {
      this.GetStates();
      this.Getvenues();
    }

    this.setid = this.activeRoute.snapshot.paramMap.get("id");
    this.Rk = this.activeRoute.snapshot.paramMap.get("rk");
    this.venue = this.activeRoute.snapshot.paramMap.get("venu");
    this.venuepincode = this.activeRoute.snapshot.paramMap.get("pincode");
    if (this.venue) {
      const parts = this.venue.split(" | ");

      // Extract values
      const venuName = parts[0]?.trim() || "";
      this.SelectedvenuName = venuName
      const area = parts[1]?.trim() || "";
      this.Selectedarea = area

      const description = parts[2]?.trim() || "";
      this.SelectedAddress = description
    }
    //this.selectedPlace = this.venue
    if (this.setid == 1) {
      //this.back()
    }
    this.RequestForm = this.Fb.group({
      Mode: ["",],
      Audiance: ["",],
      Venue: ["",],
      Venue_name: ["",],
      Address: ["",],
      Area: ["",],
      StateId: ["",],
      DistrictId: ["",],
      CityId: ["",],
      Pincode: ["",],
      Contact_name: ["",],
      Contact_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Message: ["",],
      RequiredDate: ["",],

    });
  }

  // ngOnInit() {
  ///*   this.getCurrentLocation();*/
  //   this.getall();
  //   this.AllRequestdetails();

  //   // Restore selected tab from local storage BEFORE fetching data
  //   // Use localStorage instead of sessionStorage so it persists across page reloads
  //   const savedTab = localStorage.getItem('selectedTab');
  //   if (savedTab) {
  //     this.selectedTab = savedTab;
  //     console.log('Restored tab from localStorage:', this.selectedTab);
  //   } else {
  //     this.selectedTab = 'open'; // Default to Active tab
  //     console.log('No saved tab, defaulting to Active tab');
  //   }

  //   // Fetch data and update view
  //   this.loadAndDisplayData();
  // }

  ngOnInit() {
    // Set minimum date to current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Set default value for RequiredDate
    this.RequestForm.patchValue({
      RequiredDate: this.minDateTime
    });

    this.getall();
    this.AllRequestdetails();

    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      this.selectedTab = savedTab;
      console.log('Restored tab from localStorage:', this.selectedTab);
    } else {
      this.selectedTab = 'open';
      console.log('No saved tab, defaulting to Active tab');
    }

    this.loadAndDisplayData();
    // this.GetCounts(); // Removed static call
  }

  // Ionic lifecycle hook - called every time view is about to enter
  // This ensures data is refreshed when navigating back to this page
  ionViewWillEnter() {
    // Refresh request data to get latest Active/Closed requests
    // Only refresh if component is already initialized to avoid double calls
    if (this.UserDetails && this.UserDetails.length > 0) {
      this.loadAndDisplayData();
    }
  }

  // Load data and display the correct tab
  loadAndDisplayData() {
    this.GetRequestpresantaions();
  }

  onAudienceChange(value: string) {
    if (value === 'Less than 50') {
      this.showVirtual = true;
      this.showInPerson = false;

      // Optional: reset Mode if it’s not Virtual
      if (this.form.get('Mode')?.value !== 'Virtual') {
        this.form.get('Mode')?.setValue('Virtual');
      }
    } else {
      this.showVirtual = true;
      this.showInPerson = true;
    }
  }

  getall() {
    this.RequestForm.controls['Venue_name'].setValue(this.SelectedvenuName);
    this.RequestForm.controls['Area'].setValue(this.Selectedarea);
    this.RequestForm.controls['Address'].setValue(this.SelectedAddress);
    this.RequestForm.controls['Pincode'].setValue(this.venuepincode);
    this.GetStates();

  }
  back(val: any) {
    this.navCtrl.navigateForward(['/multipledonors', { id: val }])

    //this.navCtrl.navigateForward('/home')
  }
  Request() {
    this.first = true
  }
  toggleAccordion(index: number, tab: 'open' | 'closed') {
    if (tab === 'open') {
      this.activeAccordionOpen = this.activeAccordionOpen === index ? null : index;
      if (this.openAccordionGroup) {
        this.openAccordionGroup.value = this.activeAccordionOpen !== null ? this.activeAccordionOpen.toString() : null;
      }
    } else {
      this.activeAccordionClosed = this.activeAccordionClosed === index ? null : index;
      if (this.closedAccordionGroup) {
        this.closedAccordionGroup.value = this.activeAccordionClosed !== null ? this.activeAccordionClosed.toString() : null;
      }
    }
  }

  onOpenAccordionChange(event: any) {
    const value = event?.detail?.value;
    if (value === null || value === undefined || value === '') {
      this.activeAccordionOpen = null;
      return;
    }
    const index = parseInt(value, 10);
    if (!isNaN(index)) {
      this.activeAccordionOpen = index;
    }
  }

  onClosedAccordionChange(event: any) {
    const value = event?.detail?.value;
    if (value === null || value === undefined || value === '') {
      this.activeAccordionClosed = null;
      return;
    }
    const index = parseInt(value, 10);
    if (!isNaN(index)) {
      this.activeAccordionClosed = index;
    }
  }

  closeAccordion(tab: 'open' | 'closed') {
    if (tab === 'open') {
      this.activeAccordionOpen = null;
      if (this.openAccordionGroup) {
        this.openAccordionGroup.value = null;
      }
    } else {
      this.activeAccordionClosed = null;
      if (this.closedAccordionGroup) {
        this.closedAccordionGroup.value = null;
      }
    }
  }

  //async checkLocationServices() {
  //  try {
  //    const permissionStatus = await this.locationservice.getCurrentLocation();
  //    if (!permissionStatus) {
  //      // Handle permission denied scenario, you can show an alert or a toast
  //      this.general.presentToast('Location services are required for this app. Please enable them in settings.');
  //    }
  //  } catch (error) {
  //    console.error('Error checking location services:', error);
  //    this.general.presentToast('An error occurred while checking location services.');
  //  }
  //}


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

  upd(vals: any) {
    this.Rescheduledate = this.Reschedule
    this.isModalOpen = false;
    this.UpdateReschedule(vals, 1)
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
    const Venue = descriptionParts[0].trim(); this.predictions = [];
    this.RequestForm.controls['Venue_name'].setValue(Venue);

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
        // Set the map to the place location
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);
        if (this.marker) {
          this.marker.setMap(null);
        }
        this.marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name || ''
        });

        // Optionally, you can call a method to fetch nearby places
        this.fetchNearbyPlaces(place.geometry.location);
        this.getCityAndArea(latitude, longitude);
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }



  fetchNearbyPlaces(location: any) {

    const request = {
      location: location,
      radius: '5000',
      type: ['restaurant', 'hospital', 'hotels', 'colleges', 'school'] // Types of places to search
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
        //this.handlePlacePredictions(predictions[0].place_id);

      } else {
        console.error('Error fetching nearby places:', status);
      }
    });
  }

  //async getCurrentLocation() {
  //  try {
  //    const position = await Geolocation.getCurrentPosition();
  //    this.latitude = position.coords.latitude;
  //    this.longitude = position.coords.longitude;
  //    this.getCityAndArea(this.latitude, this.longitude);
  //  } catch (error) {
  //    console.error('Error getting location', error);
  //  }
  //}

  searchLocation() {
    if (this.searchQuery) {
      this.autocomplete.getPlacePredictions({ input: this.searchQuery }, (predictions: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Handle predictions
          if (predictions.length > 0) {
            this.handlePlacePredictions(predictions[0].place_id);
          }
        } else {
        }
      });
    }
  }



  handlePlacePredictions(predictions: any) {
    if (predictions.length > 0) {
      const placeId = predictions[0].place_id;
      this.placeService.getDetails({ placeId }, (place: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Bind state, city, and area
          this.bindLocationDetails(place);
        } else {
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
    this.RequestForm.controls['area'].setValue(this.area);
    this.RequestForm.controls['Pincode'].setValue(this.pincode);
    this.RequestForm.controls['state'].setValue(this.state);
    this.RequestForm.controls['city'].setValue(this.city);

  }

  getCityAndArea(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`; // Replace with your API key
    this.http.get(url).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];
        this.city = this.getAddressComponent(result.address_components, 'locality');
        this.selectedCity = this.city
        this.area = this.getAddressComponent(result.address_components, 'sublocality');
        //  this.RequestForm.controls['Area'].setValue(this.area);

        this.address = this.getAddressComponent(result.address_components, 'sublocality_level_1');
        // this.RequestForm.controls['Address'].setValue(this.address);

        this.pincode = this.getAddressComponent(result.address_components, 'postal_code');
        //this.RequestForm.controls['Pincode'].setValue(this.pincode);
        this.mycurrentpincode = this.pincode
        this.state = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedState = this.state
        this.district = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.district
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.GetRequestpresantaions(this.mycurrentpincode);

        if (this.UserDetails[0].RoleId == 4) {

        }


      } else {
        console.log('No results found');
      }
    }, error => {
      console.error('Error getting geocode', error);
    });
  }

  getAddressComponent(components: any[], type: string): string | null {
    const component = components.find(c => c.types.includes(type));
    if (!component) {
      console.warn(`Address component of type '${type}' not found in`, components);
    }
    return component ? component.long_name : null;
  }



  Getvenues() {

    this.flags = 3

    var obj = [{
      RegId: 1,

    }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/BG_Work_Place_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.venueslist = data;
      this.venueslist1 = data;
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
      var selectedstateid = this.States1.filter((id: any) => id.StateName == this.selectedState);
      if (selectedstateid.length > 0) {
        this.StateID = selectedstateid[0].StateId;
        this.GetDistricts();
      } else {
        this.StateID = null;
      }

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

  Searchplaces() {

    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.venueslist = this.venueslist1;
    } else {
      this.venueslist = this.venueslist1.filter((BG: any) => {
        return (
          BG.CityName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }


  reg() {
    this.modal.dismiss();
  }


  selectState(val: any) {
    this.StateID = val.StateId;
    this.selectedState = val.StateName;
    this.GetDistricts();
    this.reg();
  }
  selectDistrict(val: any) {
    this.DistrictID = val.DistrictID;
    this.selectedDistrict = val.DistrictName;
    this.GetCities();
    this.reg();
  }
  selectCity(val: any) {
    this.CityID = val.CityId;
    this.selectedCity = val.CityName;
    this.reg();
  }

  selectPlace(val: any) {
    this.WorkID = val.WorkId;
    this.selectedPlace = val.WorkPlace;
    this.reg();
  }


  AllRequestdetails() {
    // Check if all required fields are present
    var obj = [{

    }];

    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "6");

    var url = "api/BG/Register_User_Curd";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Alldet = data
      //this.leadersonly = this.Alldet.filter((led: any) => led.RoleId == 4 && led.RegId !== this.UserDetails[0].RegId)
      this.leadersonly = this.Alldet.filter((led: any) => led.RoleId == 4 && led.RegId !== this.UserDetails[0].RegId)

    });

  }


  Requestdetails(val: any) {

    this.CurrentPincode = val.Pincode;
    this.myPincode = val.Pincode;

    if (
      (this.UserDetails && this.UserDetails.length > 0) ||
      this.StateID ||
      this.DistrictID ||
      this.CityID
    ) {

      let obj: any[] = [];
      this.leadersId = [];

      if (this.leadersonly && this.leadersonly.length > 0) {

        for (let i = 0; i < this.leadersonly.length; i++) {

          let leaderRegID = this.leadersonly[i].RegId;
          this.leadersId.push(leaderRegID);

          obj.push({
            RegId: this.UserDetails[0].RegId,
            CreatedBy: this.UserDetails[0].RegId,
            Requestedto: leaderRegID,

            TokenId: this.UserDetails[0].TokenId,
            Mode: val.Mode,
            Audiance: val.Audiance,
            Venue: this.selectedPlace,
            Venue_name: val.Venue_name,
            Address: val.Address,
            Area: val.Area,
            StateId: this.StateID,
            DistrictId: this.DistrictID,
            CityId: this.CityID,
            newStatename: this.state,
            newDistrictname: this.district,
            newCityname: this.city,
            Pincode: val.Pincode,
            Contact_name: val.Contact_name,
            Contact_number: val.Contact_number,
            Message: val.Message,

            RequestDate: val.RequiredDate,
            RequestAcceptStatus: null,
            Latitude: this.latitude,
            Longitude: this.longitude
          });
        }

      }

      else {

        obj.push({
          RegId: this.UserDetails[0].RegId,
          CreatedBy: this.UserDetails[0].RegId,
          Requestedto: null,

          TokenId: this.UserDetails[0].TokenId,
          Mode: val.Mode,
          Audiance: val.Audiance,
          Venue: this.selectedPlace,
          Venue_name: val.Venue_name,
          Address: val.Address,
          Area: val.Area,
          StateId: this.StateID,
          DistrictId: this.DistrictID,
          CityId: this.CityID,
          newStatename: this.state,
          newDistrictname: this.district,
          newCityname: this.city,
          Pincode: val.Pincode,
          Contact_name: val.Contact_name,
          Contact_number: val.Contact_number,
          Message: val.Message,

          RequestDate: val.RequiredDate,
          RequestAcceptStatus: null,
          Latitude: this.latitude,
          Longitude: this.longitude
        });

      }

      let UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "1");

      let url = "api/BG/Insert_Update_Requestpresent";

      this.general.PostData(url, UploadFile).subscribe((data: any) => {

        if (data === "SUCCESS") {
          if (this.leadersonly && this.leadersonly.length > 0) {

            if (this.UserDetails[0].RoleId !== 4) {

              this.leadersPincode = [];

              for (let i = 0; i < this.Alldet.length; i++) {
                this.leadersPincode.push(this.Alldet[i].Pincode);
              }

              this.sendnotification(this.leadersPincode);

            } else {
              this.sendnotification(val.Pincode);
            }

          }

          this.general.presentAlert(
            "SUCCESS",
            "Thank you for taking the initiative. Once we reconfirm with the Leaders in your area, we’ll share their contact numbers so you can coordinate the presentation."
          );

          this.navCtrl.navigateForward(["/home"]);

        } else {
          this.general.presentToast("Something went wrong. Please try again later.");
        }

      });

    } else {
      this.general.presentToast("Please enter all fields.");
    }
  }




  GetRequestpresantaions() {

    const formData = new FormData();
    formData.append("Param2", "1");
    formData.append("Param1", this.UserDetails[0].RegId);
    formData.append("Param3", this.UserDetails[0].RegId);
    const url = "api/BG/Get_RequestPresentation";

    this.general.PostData(url, formData).subscribe((raw: any[]) => {
      const currentUser = this.UserDetails[0].RegId;

      if (!Array.isArray(raw)) raw = [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const processed = raw.map(req => {
        const rDate = new Date(req.RequestDate);
        rDate.setHours(0, 0, 0, 0);

        if (rDate < today && req.RequestAcceptStatus != 4) {
          return { ...req, RequestAcceptStatus: 4 };
        }
        return req;
      });

      this.requests = processed.filter(req =>
        req.RequestAcceptStatus != 4 && req.CreatedBy != currentUser
      );

      this.closedrec = processed.filter(req =>
        req.RequestAcceptStatus == 4 && req.CreatedBy != currentUser
      );

      this.Myrequsest = processed.filter(req =>
        (req.CreatedBy == currentUser || req.Requestedto == currentUser) &&
        req.RequestAcceptStatus != 4
      );

      this.MyClosedrequsest = processed.filter(req =>
        (req.CreatedBy == currentUser || req.Requestedto == currentUser) &&
        req.RequestAcceptStatus == 4
      );

      // Fetch counts for each request
      this.Myrequsest.forEach((item: any) => this.GetCounts(item));
      this.MyClosedrequsest.forEach((item: any) => this.GetCounts(item));

      this.currentrequest = processed.filter(req =>
        req.Requestedto == currentUser && req.RequestAcceptStatus != 4
      );

      this.expiredlist = processed
        .filter(req => {
          const rDate = new Date(req.RequestDate);
          rDate.setHours(0, 0, 0, 0);
          return rDate < today;
        })
        .map(req => ({
          ...req,
          formattedDate: this.formatDate(req.RequestDate)
        }));

      const maxLength = Math.max(
        this.requests.length,
        this.closedrec.length,
        this.Myrequsest.length,
        this.MyClosedrequsest.length,
        this.currentrequest.length
      );

      this.accordionState = Array(Math.max(maxLength + 10, 50)).fill(false);

      setTimeout(() => this.updateTabView(), 50);
    }, err => {
      this.Myrequsest = [];
      this.MyClosedrequsest = [];
      this.requests = [];
      this.closedrec = [];
      this.currentrequest = [];
      this.expiredlist = [];
      this.curnt = false;
      this.general.presentToast("something went wrong");
    });
  }




  Accept(values: any) {
    this.custmer = this.Alldet.filter((cust: any) => cust.RegId == values.CreatedBy)
    this.test.push({
      RegID: values.RegId,
      Requestedto: 1
    });

    var notificationsUrl = "api/BG/Crud_Notifications";
    var notificationsUploadFile = new FormData();
    notificationsUploadFile.append("Param", JSON.stringify(this.test));
    notificationsUploadFile.append("Flag", "6");

    this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
      this.updateRequestdetails(values.Pincode);
      this.Acceptsendnotification(values.Pincode);

    });
  }

  Reject(values: any) {
    this.custmer = this.Alldet.filter((cust: any) => cust.RegId == values.CreatedBy)
    this.test.push({
      RegID: values.RegId,
      Requestedto: 2
    });

    var notificationsUrl = "api/BG/Crud_Notifications";
    var notificationsUploadFile = new FormData();
    notificationsUploadFile.append("Param", JSON.stringify(this.test));
    notificationsUploadFile.append("Flag", "6");

    this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
      this.updateRequestdetails(values.Pincode);
      this.general.presentAlert("REJECTED", "You have rejected this request.");

    });
  }
  formatDate(date: any): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }



  openmap(Latitude: any, Longitude: any) {
    // Check if the browser supports geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let options: LaunchNavigatorOptions = {
            app: this.launchNavigator.APP.GOOGLE_MAPS
          };
          var coordinates = [Latitude, Longitude];
          this.launchNavigator.navigate(coordinates, options)
            .then(
              (success: any) => console.log('Launched navigator'),
              (error: any) => console.log('Error launching navigator', error)
            );
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert('Please enable location services and grant permission to access your location.');
            this.openLocationSettings();
          } else {
            console.log('Error getting location', error);
            alert('An error occurred while trying to access your location.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  openLocationSettings() {
    if (this.platform.is('android')) {
      this.launchNavigator.navigate('geo:0,0?q=0,0', { app: this.launchNavigator.APP.SETTINGS });
    } else if (this.platform.is('ios')) {
      this.launchNavigator.navigate('app-settings:', { app: this.launchNavigator.APP.SETTINGS });
    }
  }
  openModal(item: any) {
    this.selectedItem = item;
    this.isModalOpen = true;
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) {
      return '';
    }

    const dateObj = new Date(dateTimeString);

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const milliseconds = String(dateObj.getMilliseconds()).padStart(3, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  res(item: any) {
    if (!item) {
      this.general.presentToast("No item selected");
      return;
    }

    this.daterqst = this.formatDateTime(this.Reschedule);
    this.UpdateReschedule(item, 1);
    this.isModalOpen = false;
  }

  UpdateReschedule(values: any, val: any) {
    this.test = [{

      RequestDate: this.Reschedule,

      RPId: values.RPId,
    }];


    let UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(this.test));
    UploadFile.append("Flag", "4");

    let url = "api/BG/Insert_Update_Requestpresent";
    this.general.PostData(url, UploadFile).subscribe(
      (response: any) => {
        this.Reschudlesendnotification(this.pincode);
        this.general.presentAlert("SUCCESS", "Your request as been closed.");
        this.ngOnInit();


      },
      (error: any) => {
      }
    );
  }

  async closereqst(rqst: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Close',
      message: 'Are you sure you want to close this request?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Yes, Close',
          handler: () => {
            this.ClosedRequest(rqst);
          }
        }
      ]
    });

    await alert.present();
  }



  ClosedRequest(value: any) {
    let obj = [];
    obj.push({
      RequestAcceptStatus: 4,
      RPId: value.RPId,
    });
    let UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");

    let url = "api/BG/Insert_Update_Requestpresent";
    this.general.PostData(url, UploadFile).subscribe(
      (response: any) => {
        setTimeout(() => {
          this.GetRequestpresantaions();
          this.ExpiredAcceptsendnotification(this.expiredlist);
          setTimeout(() => {
            this.setTab('closed');
          }, 100);
        }, 500);

        this.general.presentAlert("SUCCESS", "Your request has been closed.");
      },
      (error: any) => {
        console.error("Error closing request:", error);
      }
    );
  }




  Accepted(values: any, val: any) {
    if (!Array.isArray(values) || values.length === 0) {
      return;
    }
    this.test = values.map(value => ({
      CreatedBy: this.UserDetails[0].RegId,
      TokenId: this.UserDetails[0].TokenId,
      Mode: value.Mode,
      Audiance: value.Audiance,
      Venue: value.selectedPlace,
      Venue_name: value.Venue_name,
      Address: value.Address,
      Area: value.Area,
      StateId: value.StateID,
      DistrictId: value.DistrictID,
      CityId: value.CityID,
      Pincode: value.Pincode,
      Contact_name: value.Contact_name,
      Contact_number: value.Contact_number,
      Message: value.Message,
      RequestDate: value.RequiredDate,
      RequestAcceptStatus: val,
      Latitude: this.latitude,
      Longitude: this.longitude,
      RPId: value.RPId,
      ModifiedBy: this.UserDetails[0].RegId
    }));
    if (values.length > 0) {
    }
    const jsonData = JSON.stringify(this.test);
    let UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(this.test));
    UploadFile.append("Flag", "2");

    let url = "api/BG/Insert_Update_Requestpresent";
    this.general.PostData(url, UploadFile).subscribe(
      (response: any) => {
        this.ExpiredAcceptsendnotification(this.expiredlist);
        // Refresh data after update to ensure no duplicates
        setTimeout(() => {
          this.GetRequestpresantaions();
        }, 500);
      },
      (error: any) => {
        console.error("Error in API call:", error);
      }
    );
  }

  updateRequestdetails(val: any) {
    let leaderRegID = val.leaderRegID;
    let obj = {
      CreatedBy: this.UserDetails[0].RegId,
      Requestedto: 0,
    };

    let UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "3");

    let url = "api/BG/Insert_Update_Requestpresent";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data === "SUCCESS") {

      }
    });
  }

  updateTabView() {
    this.opening = false;
    this.closed = false;
    this.curnt = false;
    if (this.selectedTab === 'open') {
      if (this.Myrequsest && this.Myrequsest.length > 0) {
        this.opening = true;
        this.curnt = true;
      } else {
        this.opening = true;
        this.curnt = false;
        this.message = "You don't have any active requests";
      }
    } else if (this.selectedTab === 'closed') {
      if (this.MyClosedrequsest && this.MyClosedrequsest.length > 0) {
        this.closed = true;
        this.curnt = true;
      } else {
        this.closed = true;
        this.curnt = false;
        this.message = "You don't have any closed requests";
      }
    }
  }

  setTab(tab: string) {
    // Update selected tab
    this.selectedTab = tab;
    localStorage.setItem('selectedTab', tab);
    this.activeAccordionOpen = null;
    this.activeAccordionClosed = null;
    if (this.openAccordionGroup) {
      this.openAccordionGroup.value = null;
    }
    if (this.closedAccordionGroup) {
      this.closedAccordionGroup.value = null;
    }
    this.GetRequestpresantaions();
  }

  ExpiredAcceptsendnotification(expired: any[]) {
    if (!Array.isArray(expired) || expired.length === 0) {
      console.error("Invalid input: expired should be a non-empty array.");
      return;
    }

    let path = "rquestpresentation";

    const message = `Dear ${this.custmer[0].FullName}, your request has been accepted by our leader, ${this.UserDetails[0].FullName}, for the special blood donation presentation at ${this.selectedPlace}. We would be thrilled to have you join us and contribute to this noble cause.`;


    this.user.getusersData(this.custmer[0].Pincode).subscribe((data: any) => {
      let uploadFile = new FormData();
      uploadFile.append("deviceId", this.custmer[0].Devicetoken);
      uploadFile.append("message", message);
      uploadFile.append("senderName", "BloodGroup");
      uploadFile.append("Path", path);

      let notificationUrl = "api/BG/sendNotification";
      this.general.PostData(notificationUrl, uploadFile).subscribe((notificationData: any) => {

        // Push notification details into `test` array
        this.test.push({
          RegID: this.custmer[0].RegId,
          NotificationsDesc: message,
          CreatedBy: this.UserDetails[0].RegId
        });

        let notificationsUrl = "api/BG/Crud_Notifications";
        let notificationsUploadFile = new FormData();
        notificationsUploadFile.append("Param", JSON.stringify(this.test));
        notificationsUploadFile.append("Flag", "1");

        this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
        });
      });
    });
    //}
  }

  Acceptsendnotification(Pincode: any) {
    let targetPincode = Pincode; // Use the function parameter

    var path = "rquestpresentation";
    //const message =  `Dear ${this.custmer[0].FullName }, Your request has been Accepted by ${this.UserDetails[0].FullName}, to a special blood donation presentation happening at ${this.selectedPlace}. We would be thrilled to have you join us and learn more about how you can contribute to this noble cause.`;
    const message = `Dear ${this.custmer[0].FullName}, your request has been accepted by our leader, ${this.UserDetails[0].FullName}, for the special blood donation presentation at ${this.selectedPlace}. We would be thrilled to have you join us and contribute to this noble cause.`;

    // Fetch user data based on the correct Pincode
    this.user.getusersData(targetPincode).subscribe((data: any) => {
      var UploadFile = new FormData();
      UploadFile.append("deviceId", this.custmer[0].Devicetoken);
      UploadFile.append("message", message);
      UploadFile.append("senderName", "BloodGroup");
      UploadFile.append("Path", path);

      var notificationUrl = "api/BG/sendNotification";
      this.general.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
        this.test.push({
          RegID: this.custmer[0].RegId, // Fixed incorrect index
          NotificationsDesc: message,
          CreatedBy: this.UserDetails[0].RegId
        });

        var notificationsUrl = "api/BG/Crud_Notifications";
        var notificationsUploadFile = new FormData();
        notificationsUploadFile.append("Param", JSON.stringify(this.test));
        notificationsUploadFile.append("Flag", "1");

        this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
        });
      });

    });
  }




  sendnotification(Pincode: any) {

    const targetPincode = Pincode;
    const path = "eligibilitycriteria";

    const message = `We are excited to invite ${this.UserDetails[0].FullName} to a blood donation presentation at ${this.selectedPlace}. Your presence can help save lives.`;

    // Filter leaders by PINCODE
    const matchedLeaders = this.leadersonly.filter(
      (l: any) => l.RoleId === 4 && l.Pincode === this.CurrentPincode
    );

    if (!matchedLeaders || matchedLeaders.length === 0) {
      console.log("No leaders found for this pincode");
      return;
    }

    matchedLeaders.forEach((leader: any) => {

      const uploadFile = new FormData();
      uploadFile.append("deviceId", leader.Devicetoken);
      uploadFile.append("message", message);
      uploadFile.append("senderName", "BloodGroup");
      uploadFile.append("Path", path);

      this.general.PostData("api/BG/sendNotification", uploadFile).subscribe(() => {

        const notificationObj = [{
          RegID: leader.RegId,
          NotiRecevieID: leader.RegId,
          NotificationsDesc: message,
          CreatedBy: this.UserDetails[0].RegId
        }];

        const dbUpload = new FormData();
        dbUpload.append("Param", JSON.stringify(notificationObj));
        dbUpload.append("Flag", "1");

        this.general.PostData("api/BG/Crud_Notifications", dbUpload).subscribe();
      });
    });

    //Send admin notification (PINCODE MATCH)
    this.Adminsendnotification(targetPincode);
  }
  Reschudlesendnotification(Pincode: any) {

    const targetPincode = Pincode;
    const path = "eligibilitycriteria";

    const message = `Dear ${this.UserDetails[0].FullName}, the presentation at ${this.selectedPlace} has been rescheduled to ${this.daterqst} at ${this.Reschedule}. Thank you for your support.`;

    // Filter leaders by PINCODE
    const matchedLeaders = this.leadersonly.filter(
      (l: any) => l.RoleId === 4 && l.Pincode == this.CurrentPincode
    );

    if (!matchedLeaders || matchedLeaders.length === 0) {
      console.log("No leaders found for reschedule");
      return;
    }

    matchedLeaders.forEach((leader: any) => {

      const uploadFile = new FormData();
      uploadFile.append("deviceId", leader.Devicetoken);
      uploadFile.append("message", message);
      uploadFile.append("senderName", "BloodGroup");
      uploadFile.append("Path", path);

      this.general.PostData("api/BG/sendNotification", uploadFile).subscribe(() => {

        const notificationObj = [{
          RegID: leader.RegId,
          NotiRecevieID: leader.RegId,
          NotificationsDesc: message,
          CreatedBy: this.UserDetails[0].RegId
        }];

        const dbUpload = new FormData();
        dbUpload.append("Param", JSON.stringify(notificationObj));
        dbUpload.append("Flag", "1");

        this.general.PostData("api/BG/Crud_Notifications", dbUpload).subscribe();
      });
    });

    // Notify Admin also
    this.Adminsendnotification(targetPincode);
  }

  Adminsendnotification(Pincode: any) {

    const targetPincode = Pincode;
    const path = "eligibilitycriteria";

    const message = `Dear Admin, I am ${this.UserDetails[0].FullName}. I would like to conduct a blood donation presentation at ${this.selectedPlace}. Kindly review and approve.`;

    // Filter Admin by PINCODE
    const matchedAdmins = this.Alldet.filter(
      (a: any) => a.RoleId === 1 && a.Pincode == this.CurrentPincode
    );

    if (!matchedAdmins || matchedAdmins.length === 0) {
      console.log("No admin found for this pincode");
      return;
    }

    matchedAdmins.forEach((admin: any) => {

      const uploadFile = new FormData();
      uploadFile.append("deviceId", admin.Devicetoken);
      uploadFile.append("message", message);
      uploadFile.append("senderName", "BloodGroup");
      uploadFile.append("Path", path);

      this.general.PostData("api/BG/sendNotification", uploadFile).subscribe(() => {

        const notificationObj = [{
          RegID: admin.RegId,
          NotiRecevieID: admin.RegId,
          NotificationsDesc: message,
          CreatedBy: this.UserDetails[0].RegId
        }];

        const dbUpload = new FormData();
        dbUpload.append("Param", JSON.stringify(notificationObj));
        dbUpload.append("Flag", "1");

        this.general.PostData("api/BG/Crud_Notifications", dbUpload).subscribe(() => {
          this.general.present();
          this.navCtrl.navigateForward(['/home']);
          this.general.dismiss();
        });
      });
    });
  }

  open1(state: number) {
    if (this.activeAccordion === state) {
      this.activeAccordion = null;
    }
  }

  // TrackBy function for ngFor to prevent duplicate rendering
  trackByRPId(index: number, item: any): any {
    // Use unique request identifier instead of RPId
    return `${item.Contact_name}_${item.Pincode}_${item.RequestDate}` || index;
  }

  GetCounts(item: any) {
    debugger
    var UploadFile = new FormData();
    UploadFile.append("Param1", item.PresentationID);
    //UploadFile.append("Param1", "18");
    var url = "api/BG/Get_PresentationAcceptedCount";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data && data.length > 0) {
        item.AcceptedCount = data[0].Accepted;
      } else {
        item.AcceptedCount = 0;
      }
    });

  }

  GetPresentationDetails(item: any) {
    debugger
    var UploadFile = new FormData();
    UploadFile.append("Param1", item.PresentationID);
    var url = "api/BG/Get_PresentationAccetedDetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.presentationResult = data
    });

  }
  goToDetails(item: any) {
    this.navCtrl.navigateForward('/presentationaccepteddetails', {
      queryParams: {
        presentationId: item.PresentationID
      }
    });
  }

}
