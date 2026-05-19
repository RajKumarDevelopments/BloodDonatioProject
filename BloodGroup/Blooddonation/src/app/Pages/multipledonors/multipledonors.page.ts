import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
declare var google: any;
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-multipledonors',
  templateUrl: './multipledonors.page.html',
  styleUrls: ['./multipledonors.page.scss'],
})
export class MultipledonorsPage implements OnInit {
  id: any;
  latitude: any;
  longitude: any;
  state: any;
  pincode: any;
  area: any;
  city: any;
  selectedpincode: any;
  selectedarea: any;
  venues: any;
  searchQuery: any;
  Distict: any;
  rd1: boolean = false;
  selectedLocation: string = 'address';
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  predictions: any;
  marker: any; map: any;
  placeService: any; autocomplete: any; // Default location
    selectedCity: any;
    country: any;
    selectedDistrict: any;
  RequestForm: FormGroup;
    Role: any;
    status: any;
    UserDetails: any;
    UserDetails1: any;

  constructor( private Fb: FormBuilder,private navCtrl: NavController, public activeRoute: ActivatedRoute, public http: HttpClient, public general: GeneralService) {

    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.id = this.activeRoute.snapshot.paramMap.get("id");

    this.RequestForm = this.Fb.group({
     // Mode: ["",],
     // Audiance: ["",],
     // Venue: ["",],
     // Venue_name: ["",],
      Address: ["",],
      Area: ["",],
      StateId: ["",],
      DistrictId: ["",],
      CityId: ["",],
      Pincode: ["",],
     // Contact_name: ["",],
      //Contact_number: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      //Message: ["",],
      //RequiredDate: ["",],

    });

  }

  ngOnInit() {
    //this.platform.ready().then(() => {
    this.loadMap();
    this.getAvailablestatus();
   // });
  }
  routing(val: any) {
    if (val == 1 || val == 3) {
      this.rd1 = true
      this.navCtrl.navigateForward(['/supportletshelp', { id: 1 }])
    }
    else {
      this.navCtrl.navigateForward(['/rquestpresentation', { rk: val }])
    }
  }

  nxt(val: any) {
    
    if (val) {
      this.navCtrl.navigateForward(['/rquestpresentation', { rk: val, venu: this.venues }])

    }
    else {
      this.general.presentToast("Please select ..!");

    }

  }


  loadMap() {
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
    this.predictions = [];
    const descriptionParts = prediction.description.split(',');
    const hospitalName = descriptionParts[0].trim(); this.predictions = [];
    this.venues = hospitalName
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
      } else {
        console.error('Error fetching nearby places:', status);
      }
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
        this.selectedarea = this.state
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.Distict
        //this.BloodRequestForm.controls['area'].setValue(this.area);
        //this.BloodRequestForm.controls['Pincode'].setValue(this.pincode);

        

        console.log('Distict:', this.Distict, 'City:', this.city, 'Area:', this.area, 'Pincode:', this.pincode, 'State:', this.state, 'Country:', this.country);
      } else {
        console.log('No results found');
      }
    }, (error: any) => {
      console.error('Error getting geocode', error);
    });
  }
  getAddressComponent(components: any[], type: string) {
    for (const component of components) {
      if (component.types.includes(type)) {
        return component.long_name;
      }
    }
    return null;
  }
  getAvailablestatus() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId)
    uploadfile.append("Param2", '1')
    var url = "api/BG/Get_RoleforRolechange";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.Role = data;
      this.status = this.Role[0].Availablestatus;
    }, (error) => {
      console.error('Error fetching role:', error);
    });
  }
}
