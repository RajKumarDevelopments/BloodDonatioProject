import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController, AlertController, IonRouterOutlet, PopoverController, Platform, NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../Services/user/user.service';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { ToastController } from '@ionic/angular';
//import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-eligibilitycriteria',
  templateUrl: './eligibilitycriteria.page.html',
  styleUrls: ['./eligibilitycriteria.page.scss'],
})
export class EligibilitycriteriaPage implements OnInit {
  activeAccordion: number | null = null;

  message: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
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
  //activeAccordion: number | null = null;
  constructor(private Fb: FormBuilder,
    public platform: Platform,

    //public locationservice: GeolocationserviceService,
    private modal: ModalController,
    public datePipe: DatePipe,
    public general: GeneralService, private launchNavigator: LaunchNavigator, private toastController: ToastController,
    public navCtrl: NavController, public http: HttpClient, public activeRoute: ActivatedRoute, public user: UserService, private cdr: ChangeDetectorRef) {
    
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    if (this.UserDetails[0].Status == false) {
      // this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
    else {
      this.GetStates();
      this.Getvenues();
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

  ngOnInit() {
    // Initialize tab state
    this.selectedTab = 'open';
    this.opening = true;
    this.closed = false;
    this.activeAccordion = null;

    this.GetRequestpresantaions();
    //this.getCurrentLocation();
    this.getall();

    this.AllRequestdetails();
  }

  getall() {
    this.RequestForm.controls['Venue_name'].setValue(this.SelectedvenuName);
    this.RequestForm.controls['Area'].setValue(this.Selectedarea);
    this.RequestForm.controls['Address'].setValue(this.SelectedAddress);
    this.RequestForm.controls['Pincode'].setValue(this.venuepincode);
    this.GetStates();
  }
  back(val: any) {
    this.navCtrl.navigateForward(['/myprofile', { id: val }])

    //this.navCtrl.navigateForward('/home')
  }
  Request() {
    this.first = true
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
      radius: '5000', // Radius in meters
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
  //    console.log('Current position:', position);
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
          console.error('Autocomplete request failed due to', status);
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
        //this.general.presentToast("Selected state not found in the list");
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
      this.leadersonly = this.Alldet.filter((led: any) => led.RoleId == 4)
      //console.log('det', this.leadersonly)
      // window.location.reload();

    });

  }


  Requestdetails(val: any) {
    this.CurrentPincode = val.Pincode;

    // Check if all required fields are present
    if (
      this.UserDetails &&
      this.UserDetails.length > 0 ||
      this.StateID ||
      this.DistrictID ||
      this.CityID
    ) {
      let obj = []; // Initialize an empty array
      this.leadersId = []; // Store all leader IDs in an array

      for (let i = 0; i < this.leadersonly.length; i++) {
        let leaderRegID = this.leadersonly[i].RegId; // Store current leader ID

        this.leadersId.push(leaderRegID); // Add to leadersId array

        obj.push({
          RegId: this.UserDetails[0].RegId,
          CreatedBy: this.UserDetails[0].RegId,
          Requestedto: leaderRegID, // Assign current leader ID

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

      // Store collected leader IDs
      this.ourleadresids = this.leadersId;
      // Prepare FormData for API request
      let UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "1");

      let url = "api/BG/Insert_Update_Requestpresent";
      this.general.PostData(url, UploadFile).subscribe((data: any) => {
        if (data === "SUCCESS") {
          if (this.UserDetails[0].RoleId !== 4) {
            this.leadersPincode = []; // Initialize array for leader pincodes

            for (let i = 0; i < this.Alldet.length; i++) {
              this.leadersPincode.push(this.Alldet[i].Pincode); // Collect all leader pincodes
            }
            this.sendnotification(this.leadersPincode); // Send notification with collected pincodes
          } else {
            this.sendnotification(val.Pincode);
          }

          this.general.presentAlert("SUCCESS", "Details submitted successfully.");
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
    let UploadFile = new FormData();
    UploadFile.append("Param2", "2");
    UploadFile.append("Param1", this.UserDetails[0].Pincode);
    UploadFile.append("Param3", this.UserDetails[0].RegId);
    const url = "api/BG/Get_RequestPresentation";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.requests1 = data || [];
      const currentUserRegid = this.UserDetails[0].RegId;
      const allActive = this.requests1.filter(
        (req: any) => req.RequestAcceptStatus != 4
      );
      const closed = this.requests1.filter(
        (req: any) => req.RequestAcceptStatus == 4
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expired = allActive.filter((req: any) => {
        const reqDate = new Date(req.RequestDate);
        reqDate.setHours(0, 0, 0, 0);
        return reqDate < today;
      });
      this.requests = allActive.filter((req: any) => {
        const reqDate = new Date(req.RequestDate);
        reqDate.setHours(0, 0, 0, 0);
        return reqDate >= today && req.createdBy != currentUserRegid;
      });

      this.closedrec = [...closed, ...expired].filter(
        (req: any) => req.createdBy != currentUserRegid
      );

      if (
        this.requests.length > 0 ||
        this.closedrec.length > 0 ||
        (this.MyClosedrequsest?.length ?? 0) > 0 ||
        (this.currentrequest?.length ?? 0) > 0
      ) {
        this.curnt = true;
      } else {
        this.curnt = false;
        this.message = "You don't have any requests in your location";
      }
      this.accordionState = Array(this.currentrequest?.length ?? 0).fill(false);
      setTimeout(() => {
        this.general.dismiss();
      }, 50);
    }, err => {
      this.requests = [];
      this.closedrec = [];
      this.curnt = false;
      this.general.dismiss();
      this.general.presentToast("something went wrong");
    });
  }
 
  

  Accept(values: any, status: number) {

    this.custmer = this.Alldet.filter(
      (cust: any) => cust.RegId == values.CreatedBy
    );

    this.test = [{
      RPId: values.RPId,
      RequestAcceptStatus: status
    }];

    this.selectedPlace = values.Venue;

    const notificationsUrl = "api/BG/Crud_Notifications";
    const notificationsUploadFile = new FormData();
    notificationsUploadFile.append("Param", JSON.stringify(this.test));
    notificationsUploadFile.append("Flag", "6");

    this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(
      () => {

        this.updateRequestdetails(values.Pincode);

        if (status === 1) {
          this.Acceptsendnotification(values.Pincode);
          this.presentToast('Request Accepted successfully', 'success');
        } else if (status === 2) {
          this.Rejectsendnotification(values.Pincode);
          this.presentToast('Request Rejected successfully', 'danger');
        }

      },
      () => {
        this.presentToast('Something went wrong. Try again.', 'danger');
      }
    );
  }
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    await toast.present();
  }


  //Format date to YYYY-MM-DD (ensuring uniform comparison)
  formatDate(date: any): string {
    if (!(date instanceof Date)) {
      date = new Date(date); // Ensure it's a Date object
    }

    if (isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }
  open1(state: number) {
    

    if (this.activeAccordion === state) {
      this.activeAccordion = null;
    }
  }

  
  openmap(Latitude?: any, Longitude?: any, Address?: string, StateName?: string, Pincode?: string) {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };

    // Case 1: Coordinates available
    if (Latitude && Longitude) {
      const destination = [Latitude, Longitude];
      this.launchNavigator.navigate(destination, options)
        .then(() => console.log('Navigation started with coordinates'))
        .catch(error => console.log('Error launching navigator', error));
      return;
    }

    // Case 2: No coordinates, but address available
    const fullAddress = `${Address || ''}, ${StateName || ''}, ${Pincode || ''}`.trim();

    if (fullAddress.length > 0 && fullAddress !== ', ,') {
      this.launchNavigator.navigate(fullAddress, options)
        .then(() => console.log('Navigation started with address'))
        .catch(error => console.log('Error launching navigator with address', error));
      return;
    }

    // Case 3: No coordinates and no address
    window.open('geo:0,0?q=', '_system');
    console.log('Opened Google Maps without destination');
  }


  openLocationSettings() {
    // Open device location settings
    if (this.platform.is('android')) {
      // For Android
      this.launchNavigator.navigate('geo:0,0?q=0,0', { app: this.launchNavigator.APP.SETTINGS });
    } else if (this.platform.is('ios')) {
      // For iOS
      this.launchNavigator.navigate('app-settings:', { app: this.launchNavigator.APP.SETTINGS });
    }
  }

  toggleAccordion(index: number) {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  closeAccordion(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.activeAccordion = null;
  }


  Accepted(values: any[], val: any) {
    //  this.custmer = this.Alldet.filter((cust: any) => cust.RegId == values.CreatedBy)
    if (!Array.isArray(values) || values.length === 0) {
      console.error("Invalid input: values should be a non-empty array.");
      return;
    }
    //  Create the array properly without overriding `this.test`
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

 
    const jsonData = JSON.stringify(this.test);

   
    let UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(this.test));
    UploadFile.append("Flag", "2");

    let url = "api/BG/Insert_Update_Requestpresent";
    this.general.PostData(url, UploadFile).subscribe(
      (response: any) => {

        //  console.log("Data successfully posted.");

        this.ExpiredAcceptsendnotification(this.expiredlist);



      },
      (error: any) => {
        console.error("Error in API call:", error);
      }
    );
  }

  updateRequestdetails(val: any) {
    // Ensure leaderRegID is available
    let leaderRegID = val.leaderRegID; // Adjust according to actual data structure

    // Construct request object
    let obj = {
      CreatedBy: this.UserDetails[0].RegId,
      Requestedto: 0, // Assign current leader ID
    };

    // Store collected leader IDs
    let UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "3");

    let url = "api/BG/Insert_Update_Requestpresent";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data === "SUCCESS") {
        //   this.navCtrl.navigateForward(['/home'])

      }
    });
  }

 
    async setTab(tab: string) {
      this.selectedTab = tab;
      if (tab === 'open') {
        this.opening = true;
        this.closed = false;
      } else if (tab === 'closed') {
        this.closed = true;
        this.opening = false;
      }
      this.activeAccordion = null;
      
      // Force change detection
      this.cdr.detectChanges();
      
      await this.general.present();
      this.GetRequestpresantaions();
    }
  

  ExpiredAcceptsendnotification(expired: any[]) {
    if (!Array.isArray(expired) || expired.length === 0) {
      console.error("Invalid input: expired should be a non-empty array.");
      return;
    }

    let path = "rquestpresentation";

    for (let i = 0; i < expired.length; i++) {
      let currentCustomer = expired[i]; // Access each customer correctly

      const message = `Dear ${currentCustomer.FullName}, your request has been accepted by our leader, ${this.UserDetails[0].FullName}, for the special blood donation presentation at ${this.selectedPlace}. We would be thrilled to have you join us and contribute to this noble cause.`;

      // Fetch user data based on the correct Pincode
      this.user.getusersData(currentCustomer.Pincode).subscribe((data: any) => {
        let uploadFile = new FormData();
        uploadFile.append("deviceId", currentCustomer.Devicetoken);
        uploadFile.append("message", message);
        uploadFile.append("senderName", "BloodGroup");
        uploadFile.append("Path", path);

        let notificationUrl = "api/BG/sendNotification";
        this.general.PostData(notificationUrl, uploadFile).subscribe((notificationData: any) => {

          // Push notification details into `test` array
          this.test.push({
            RegID: currentCustomer.RegId,
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
    }
  }

  Acceptsendnotification(Pincode: any) {
    let targetPincode = Pincode; // Use the function parameter

    var path = "rquestpresentation";
    //const message =  `Dear ${this.custmer[0].FullName }, Your request has been Accepted by ${this.UserDetails[0].FullName}, to a special blood donation presentation happening at ${this.selectedPlace}. We would be thrilled to have you join us and learn more about how you can contribute to this noble cause.`;
    const message = `Dear ${this.custmer[0].FullName}, your request has been accepted by our leader, ${this.UserDetails[0].FullName}, ${this.UserDetails[0].Phonenumber} for the special blood donation presentation at ${this.selectedPlace}. We would be thrilled to have you join us and contribute to this noble cause.`;

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
          NotiRecevieID: this.custmer[0].RegId, // Asif
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
      this.GetRequestpresantaions();
    });
  }

  Rejectsendnotification(Pincode: any) {
    let targetPincode = Pincode; // Use the function parameter

    var path = "rquestpresentation";
    //const message =  `Dear ${this.custmer[0].FullName }, Your request has been Accepted by ${this.UserDetails[0].FullName}, to a special blood donation presentation happening at ${this.selectedPlace}. We would be thrilled to have you join us and learn more about how you can contribute to this noble cause.`;
    const message = `Dear ${this.custmer[0].FullName}, we regret to inform you that your request has been declined by our leader, ${this.UserDetails[0].FullName}. We appreciate your interest and encourage you to stay connected for future opportunities to contribute to this noble cause.`;
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
          NotiRecevieID: this.custmer[0].RegId, // Asif
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
      this.GetRequestpresantaions();
    });
  }

  sendnotification(Pincode: any) {

    let targetPincode = Pincode; // Use the function parameter

    if (this.UserDetails[0].RoleId != 4) {
      // Check if any leader's pincode matches the given Pincode
      this.ourleaderspincode = this.Alldet.filter((item: any) => item.Pincode == targetPincode);
      this.AdminPincode = this.Alldet.filter((item: any) => item.RoleId == 1);
      this.Admindevicetoken = this.Alldet.filter((item: any) => item.RoleId == 1);
      this.leaderdevicetoken = this.Alldet.filter((item: any) => item.RoleId == 4);
      this.AdminDeviceid = this.Admindevicetoken[0].Devicetoken
      this.AdminsPincode = this.AdminPincode[0].Pincode

    } else {
      this.ourleaderspincode = this.CurrentPincode;
      this.leaderdevicetoken = this.Alldet

    }

    var path = "rquestpresentation";
    const message = `We are excited to invite ${this.UserDetails[0].FullName}, to a special blood donation presentation happening at ${this.selectedPlace}. We would be thrilled to have you join us and learn more about how you can contribute to this noble cause.`;

    // Fetch user data based on the correct Pincode
    this.user.getusersData(targetPincode).subscribe((data: any) => {
      if (!data || data.length === 0) {
        return;
      }

      for (let i = 0; i < this.leaderdevicetoken.length; i++) {
        

        var UploadFile = new FormData();
        UploadFile.append("deviceId", this.leaderdevicetoken[i].Devicetoken);
        UploadFile.append("message", message);
        UploadFile.append("senderName", "BloodGroup");
        UploadFile.append("Path", path);
        var notificationUrl = "api/BG/sendNotification";
        this.general.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
          

          this.test.push({
            RegID: this.leaderdevicetoken[i].RegId, // Fixed incorrect index
            NotificationsDesc: message,
            CreatedBy: this.UserDetails[0].RegId
          });

          var notificationsUrl = "api/BG/Crud_Notifications";
          var notificationsUploadFile = new FormData();
          notificationsUploadFile.append("Param", JSON.stringify(this.test));
          notificationsUploadFile.append("Flag", "1");

          this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
            // this.Adminsendnotification(this.AdminsPincode)

          });
        });
      }
    });
  }


  Adminsendnotification(Pincode: any) {
    

    let targetPincode = Pincode; // Use the function parameter

    if (this.UserDetails[0].RoleId != 4) {
      // Check if any leader's pincode matches the given Pincode
      this.ourleaderspincode = this.Alldet.some((item: any) => item.Pincode == targetPincode);
    } else {
      this.ourleaderspincode = this.CurrentPincode;
    }

    var path = "rquestpresentation";
    //const message = `Dear Admin iam  ${this.UserDetails[0].FullName}, to give a special blood donation presentation happening at ${this.selectedPlace}. We would be thrilled to have you join us and learn more about how you can contribute to this noble cause.`;
    const message = `Dear Admin, I am ${this.UserDetails[0].FullName}, and I would love to give a special blood donation presentation at ${this.selectedPlace}. Your support would mean a lot—looking forward to your approval.`;

    // Fetch user data based on the correct Pincode
    this.user.getusersData(targetPincode).subscribe((data: any) => {
    
      var UploadFile = new FormData();
      UploadFile.append("deviceId", this.AdminDeviceid);
      UploadFile.append("message", message);
      UploadFile.append("senderName", "BloodGroup");
      UploadFile.append("Path", path);

      var notificationUrl = "api/BG/sendNotification";
      this.general.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
      

        this.test.push({
          RegID: this.UserDetails[0].RegId, // Fixed incorrect index
          NotificationsDesc: message,
          CreatedBy: this.UserDetails[0].RegId
        });

        var notificationsUrl = "api/BG/Crud_Notifications";
        var notificationsUploadFile = new FormData();
        notificationsUploadFile.append("Param", JSON.stringify(this.test));
        notificationsUploadFile.append("Flag", "1");
        this.general.present();
        this.navCtrl.navigateForward(['/rquestpresentation', { id: 3 }])
        this.general.dismiss();

        this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
        });
      });

    });
  }
  trackByRPId(index: number, item: any): any {
    return item?.RPId || index;
  }

  onAccordionChange(event: any): void {
    const val = event?.detail?.value;
    this.activeAccordion = val === null || val === undefined ? null : Number(val);
  }
}
