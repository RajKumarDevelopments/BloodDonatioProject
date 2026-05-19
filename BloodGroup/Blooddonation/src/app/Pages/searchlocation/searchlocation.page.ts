import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Platform, MenuController, NavController, AlertController, IonRouterOutlet, ActionSheetController, PopoverController, ModalController, IonContent } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
declare var google: any;
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Geolocation } from '@capacitor/geolocation';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { Camera, CameraResultType, CameraSource, ImageOptions, } from '@capacitor/camera'
import { SearchcomponentComponent } from '../../Component/searchcomponent/searchcomponent.component'
@Component({
  selector: 'app-searchlocation',
  templateUrl: './searchlocation.page.html',
  styleUrls: ['./searchlocation.page.scss'],
})
export class SearchlocationPage implements OnInit {
  pos: any; value: any;
  place: any;
  map: any; selectedarea: any; 
  BloodRequestForm: FormGroup;
  latitude: any; Distict: any;
  longitude: any;
  selectedCity: any;
  selectedState: any;
  selectedDistrict: any;
  Cities: any;
  CatID: any;
  Catname: any;
  DistrictID: any;
  [x: string]: any;
  HomeUrl: any;
  lastImage: any;
  currentLocationMarker: any;
  Longitude: any;
  Lattitude: any;
  ImagePath: any; DistrictID1: any;
  Image: any; DistrictsID1: any;
  selectedpincode: any;   
  LoginDetails1: any; selectedDistrict1: any;
  LoginDetails: any; Cities1: any; selectedState1: any;
  HNO: any; Districts1: any; States1: any; CityID1: any;
  address: any; distictids: any;
  Address: any; selectedstateid: any;
  selecteddistid: any;
  locat: any;
  submitAttempt: boolean = false;
  State: any; UserDetails1: any; UserDetails: any; 
  City: any; States: any;
  show: boolean = false;
  Landmark: any; Districts: any;
  Area: any; err: any; values: any;
  Latitude: any; Details: any; Details1: any; CurrentAddress: any;
  selectedLocation: string = 'address';
  marker: any; searchValue: any;
  selectedCity1: any;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
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
  country: any; StateID: any;
  HospitalName: any; flags: any; Requireddate: any;
  placeService: any; autocomplete: any; searchQuery: any;
  IonContent: any;
  constructor(public NavCtrl: NavController, private route: ActivatedRoute,
    public general: GeneralService, public http: HttpClient,
    private actionSheetController: ActionSheetController,
    public locationservice: GeolocationserviceService,
    public fb: FormBuilder, public router: Router,
    private alertController: AlertController,
    private modal: ModalController,
    public platform: Platform,
    private geolocation: Geolocation,
    public popoverctrl: PopoverController, public activeRoute: ActivatedRoute, private photoViewer: PhotoViewer)

  {

    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.HomeUrl = localStorage.getItem("URL")
    this.values = this.activeRoute.snapshot.paramMap.get("TandCValue");


    this.BloodRequestForm = this.fb.group({
      //FullName: ['', Validators.required],

     
     
      Pincode: ['', Validators.required],
      //RequiredDate: ['', Validators.required],
      //ContactName: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],
      //ContactNumber: ['', Validators.compose([Validators.maxLength(10), Validators.minLength(10), Validators.required])],
      HospitalName: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],
      area: ['', Validators.compose([Validators.maxLength(100), Validators.minLength(3), Validators.required])],

    })
 }

  ngOnInit() {
   // this.showLocationAlert();

    this.platform.ready().then(() => {
      this.loadMap();
    });
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
      const permissionStatus = await this.locationservice.getCurrentLocation();
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
  reg() {
    this.modal.dismiss();
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
   
    /*const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`; // Replace with your API key*/
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCr7yLGPltOafS-vwIMsoMNYE8J21szmGc`; // Replace with your API key
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
  getAddressComponent(components: any[], type: string) {
    for (const component of components) {
      if (component.types.includes(type)) {
        return component.long_name;
      }
    }
  }
    
 
  // Open action sheet to select image source
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

  public async Photozoom(url: string) {
    try {
      const options = {
        share: true,
        closeButton: true,
        copyToReference: false,
        headers: "",
        piccasoOptions: {}
      };

      this.photoViewer.show(url, "Image Preview", options);

    } catch (error) {
      console.log("Photo zoom error:", error);
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
  

  next() {
    
    //if (!this.BloodRequestForm.valid) return;

    //if (!this.selectedImage) {
    //  this.general.presentToast("Please upload receipt image.");
    //  return;
    //}
    // Check if hospital/location is selected
    if (!this.searchQuery || !this.latitude || !this.longitude) {
      this.general.presentToast("Please search and select the hospital / location where blood is needed.");
      return;
    }

    const obj = [{
      RegId: this.UserDetails[0].RegId,
      requestid: 1,
      StateId: this.StateID,
      DistrictId: this.distictids,
      CityId: this.CityID1,

      newStatename: this.selectedState,
      newDistrictname: this.selectedDistrict,
      newCityname: this.selectedCity,

      HospitalName: this.BloodRequestForm.value.HospitalName,
      HsptName: this.BloodRequestForm.value.HospitalName,

      HospitalAddress: this.searchQuery,

      ContactPerson: this.BloodRequestForm.value.ContactName,
      ContactMobile: this.BloodRequestForm.value.ContactNumber,
      Pincode: this.BloodRequestForm.value.Pincode,

      Receiptimage: this.selectedImage,

      latitude: this.latitude,
      longitude: this.longitude
    }];

    this.NavCtrl.navigateForward(['/requsetform', { objs: JSON.stringify(obj) }]);
  }
  

  scrollToImage() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }

}
