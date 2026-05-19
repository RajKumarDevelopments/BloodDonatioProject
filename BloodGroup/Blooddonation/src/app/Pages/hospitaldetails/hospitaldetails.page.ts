import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform, AlertController, NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
declare var google: any;
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
@Component({
  selector: 'app-hospitaldetails',
  templateUrl: './hospitaldetails.page.html',
  styleUrls: ['./hospitaldetails.page.scss'],
})
export class HospitaldetailsPage implements OnInit {
  UserDetails1: any;
  UserDetails: any;
  HsptalForm: FormGroup;
  StatesList: any;
  StateID: any;
  DistrictID: any;
  CityId: any; DistrictsList: any; CitiesList: any;
  hspatllist: any;
  HsptID: any;
  CityID: any;
  selectedCity: any;
  States: any; Districts: any; Cities: any; Pincodes: any;
  States1: any; Districts1: any; Cities1: any; Pincodes1: any;
  selectedState: any; selectedDistrict: any;
  searchValue: any;
  hspatals1: any;
  hspatals: any;
  selectedhsptal: any;

  currentLocationMarker: any;
  Longitude: any;
  Lattitude: any;
  Landmark: any; 
  Area: any; err: any; values: any;
  Latitude: any; Details: any; Details1: any; CurrentAddress: any;
  selectedLocation: string = 'address';
  marker: any; 
  selectedCity1: any;
  pos: any; value: any;
  place: any;
  map: any; selectedarea: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  predictions: any;
  StateID1: any;
  distictids1: any; selectedImage: any;
  CityIDs1: any;
  opend: any; AddressId: any;
  state: any;
  pincode: any;
  area: any;
  city: any; selectedCitiesid: any;
  country: any; 
  HospitalName: any; flags: any; Requireddate: any;
  placeService: any; autocomplete: any; searchQuery: any;
    latitude: any;
    longitude: any;
    selectedpincode: any;
    Distict: any;
    distictids: any;
    CityID1: any;
    hospitaname: any;
    hospitalName: any;
    hospitalAddress: any;
    hospitals: any;
    hospitaladd: any;
  constructor(private Fb: FormBuilder, public platform: Platform,
    private modal: ModalController,
    public datePipe: DatePipe, private alertController: AlertController,
    public general: GeneralService, public http: HttpClient,  private geolocationService: GeolocationserviceService,
    public navCtrl: NavController, public activeRoute: ActivatedRoute) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);

    this.HsptalForm = this.Fb.group({
      HospitalName: ['', Validators.compose([Validators.maxLength(50), Validators.minLength(3), Validators.required])],
      HsptPhNum: ['',],
      DoctorName: ['',],
      StateId: ['',],
      DistrictID: ['',],
      CityId: ['',],
      HsptAddress: ['',],
      POCName: ['',],
      POC_ContactNumber: ['',],
      Pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  ngOnInit() {
    //this.showLocationAlert();
    this.platform.ready().then(() => {
      this.loadMap();
    });
    this.GetStates();
    //this.GetHsptals();
    this.gethspatldetails();
  }



  async showLocationAlert() {
    // Step 1: Show a custom alert asking for location permission
    const alert = await this.alertController.create({
      header: 'Location Access Required',
      message: 'This app needs access to your location. Please enable location services to proceed.',
      buttons: [
        {
          text: 'Deny',
          role: 'cancel',
          handler: () => {
            console.log('Location permission denied');
            this.general.presentToast('You have denied location access. Some features may not work.');
          }
        },
        {
          text: 'Allow',
          handler: async () => {
            console.log('Location permission allowed');
            await this.checkLocationServices();
          }
        }
      ]
    });

    await alert.present();
  }
  async checkLocationServices() {
    try {
      const permissionStatus = await this.geolocationService.getCurrentLocation();
      if (!permissionStatus) {
        // Handle permission denied scenario, you can show an alert or a toast
        this.general.presentToast('Location services are required for this app. Please enable them in settings.');
      }
    } catch (error) {
      console.error('Error checking location services:', error);
      this.general.presentToast('An error occurred while checking location services.');
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
    const descriptionParts = this.searchQuery.split("|").map((part:any) => part.trim());
    this.hospitaname = descriptionParts[0].replace(/^hos;\s*/, '').trim();
    const address = descriptionParts.slice(1).join(", ");
    this.HsptalForm.controls['HospitalName'].setValue(this.hospitaname);
    console.log('hos;', this.hospitaname)
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
      radius: '5000', // Radius in meters
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
        console.log('loc:', this.placeService)
        //this.handlePlacePredictions(predictions[0].place_id);

      } else {
        console.error('Error fetching nearby places:', status);
      }
    });
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Current position:', position);
      this.getCityAndArea(this.latitude, this.longitude);
    } catch (error) {
      console.error('Error getting location', error);
    }
  }

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
    this.HsptalForm.controls['area'].setValue(this.area);
    this.HsptalForm.controls['Pincode'].setValue(this.pincode);
    this.HsptalForm.controls['state'].setValue(this.state);
    this.HsptalForm.controls['city'].setValue(this.city);

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
        this.HsptalForm.controls['Pincode'].setValue(this.pincode);

        this.state = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedState = this.state
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.Distict
        this.HsptalForm.controls['area'].setValue(this.area);
        this.HsptalForm.controls['Pincode'].setValue(this.pincode);

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
  getAddressComponent(components: any[], type: string) {
    for (const component of components) {
      if (component.types.includes(type)) {
        return component.long_name;
      }
    }
  }


  GetHsptals() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544"
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "6");
    var url = "api/BG/HospitalDetails_CRUD";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.hspatals = data;
      this.hspatals1 = data;

    }, err => {
      this.general.presentToast("something went wrong")
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

  SearchHsptals() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.hspatals = this.hspatals1;
    } else {
      this.hspatals = this.hspatals1.filter((BG: any) => {
        return (
          BG.HsptName.toLowerCase().includes(searchQuery)
        );
      });
    }
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

  selectHsptal(val: any) {
    
    this.HsptID = val.HsptID;
    this.selectedhsptal = val.HsptName;
    this.reg();
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
        for (let i = 0; this.hspatals.length <= 0; i++) {
          this.hospitalAddress = this.hspatals[i]
          this.hospitaladd = this.hospitalAddress
        }
        this.hspatals.forEach((hospital: any) => {
          if (hospital.HsptAddress) {
            let hospitalName = '';
            let address = '';
            this.hospitals = hospital.HsptAddress
            console.log('hosp', this.hospitals)
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

  hspatldetails(val: any) {
    
    if (this.hospitaladd != this.searchQuery) {
      var obj = [{
        RegId: this.UserDetails[0].RegId,
        CreatedBy: this.UserDetails[0].RegId,
        TokenId: this.UserDetails[0].TokenId,
        HsptName: val.HospitalName,
        HsptPhNum: val.HsptPhNum,
        DoctorName: val.DoctorName,
        StateId: this.StateID,
        DistrictId: this.DistrictID,
        CityId: this.CityID,

        //HospitalAddress: this.searchQuery,
        HsptAddress: this.searchQuery,
        POCName: val.POCName,
        POC_ContactNumber: val.POC_ContactNumber,
        Pincode: val.Pincode,
      }];

      var UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "1");
      var url = "api/BG/HospitalDetails_CRUD";

      this.general.PostData(url, UploadFile).subscribe((data: any) => {
        ;
        if (data == "SUCCESS") {
          this.general.presentAlert("SUCCESS", "Your Hospital details have been completed successfully.");
          this.navCtrl.navigateForward(['/home']);
          //window.location.reload();
        } else {
          this.general.presentToast('Something went wrong. Please try again later.');
        }
      });
    } else {
      this.general.presentToast('Please another hospital details.');
    }
  }

  


}

