import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Camera, CameraResultType, CameraSource, ImageOptions, } from '@capacitor/camera';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ActionSheetController, ModalController, NavController, LoadingController, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { Geolocation } from '@capacitor/geolocation';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
declare var google: any;
import { Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registerdonation',
  templateUrl: './registerdonation.page.html',
  styleUrls: ['./registerdonation.page.scss'],
})
export class RegisterdonationPage implements OnInit {
  HomeUrl: any;
  DonationImage: any;
  BloodRequestIDs: any; BloodRequestIDs1: any;
  SelectedBloodRequestID: any;
  searchValue: any;
  value1: any;
  Hospitals: any[] = [];
  //  Hospitals: any;
  Hospitals1: any; Hospitals2: any;
  Hospitalloc: any;
  filtes: any;
  ids: any;
  Retakeimg: any;
  myimge: any;
  selectedImage: any;
  getdata: any;
  mycompltedata: any;
  userdetail: any;
  UserDetails: any; TodayDate: any; DOB: any;
  HospitalAddress: any
  DonationDate: any
  Address: any; CurrentAddress: any;
  placeService: any; autocomplete: any; searchQuery: any;
  selectedLocation: string = 'address'; // Default location
  marker: any; map: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  predictions: any;
  StateID1: any;
  districtids1: any;
  CityIDs1: any;
  District: any;
  country: any;
  state: any;
  pincode: any;
  area: any;
  city: any;
  selectedpincode: any;
  selectedarea: any;
  latitude: any;
  longitude: any;
  DistrictsID1: any;
  CityID1: any;
  selectedCity1: any;
  selectedDistrict1: any;
  selectedState1: any;
  DistrictID1: any;
  selectedCity: any;
  selectedState: any;
  selectedDistrict: any;
  StateID: any;
  district: any;
  districtids: any; hospitalname: any;
  hosdatas: any;
  loading: boolean = false;
  selectedTab: string = 'open';
  myids: boolean = false; dropBloodRequestIDs: any;
  reqstid: any; selectedBloodRequestID: any;
  dropfiltes: any; my: any; Myhospital: any; Donate: any;
  donatedate: any;
  donatetime: any; maxDate: any; Today: any;
  mydateofservice: any; NewBloodDonateDate: any;
  dropBloodRequestIDs1: any;
  messg: any;
  hideSearchBar: boolean = false;
  isDateLocked: boolean = false;
  constructor(private loadingController: LoadingController, public general: GeneralService, public http: HttpClient, public actionSheetController: ActionSheetController,
    private modal: ModalController, private router: Router, public datePipe: DatePipe, private navCtrl: NavController, public activeRoute: ActivatedRoute,
    public geocodingService: GeolocationserviceService, private toastCtrl: ToastController, private alertController: AlertController, private geolocationService: GeolocationserviceService,private alertCtrl: AlertController
  ) {
    this.HomeUrl = localStorage.getItem("URL");
    this.userdetail = localStorage.getItem("UserDetails");

    this.UserDetails = JSON.parse(this.userdetail);

    if (this.UserDetails[0].Status == false) {
      // this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
    else {
      this.Gethospitaldetails();
      this.GetBloodRequest();
    }
    var date = new Date();
    this.TodayDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }





  ngOnInit() {
    // this.showLocationAlert();
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
    this.loadMap();
    this.GetBloodRequestdropdown();
    this.Gethospitaldetails();
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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

  opens(id: any) {
    this.value1 = id
  }

  Gethospitaldetails() {
    // var UploadFile = new FormData();
    //UploadFile.append("Param", '1');
    var url = "api/BG/Get_Hospitaldetails_mobile";
    this.general.GetData(url).subscribe((data: any) => {
      this.Hospitals = data;
      //  this.Hospitals2 = data;
      this.Hospitals1 = data;

    })
  }

  getSearch(event: any) {
    let query = event.detail.value;
    this.Hospitals = [];
    this.Hospitals = this.Hospitals1.filter((KR: any) => {
      return (
        KR.HospitalName.toLowerCase().indexOf(query.toLowerCase()) > -1

      );
    })
  }

  selection(item: any) {
    //this.selectid = item.SiteId
    this.Hospitalloc = item.HospitalName
    this.GetBloodRequest();
    this.modal.dismiss();

  }

  async GetBloodRequest() {
    const loading = await this.loadingController.create({
      message: 'Please Wait...',
      spinner: 'circles',
      duration: 70000 // Optional timeout to avoid infinite loading
    });

    const url = 'api/BG/Acceptrequestby_mobile';
    this.general.GetData(url).subscribe(
      (data: any) => {
        this.BloodRequestIDs1 = data;
        if (this.BloodRequestIDs1) {
          this.filtes = this.BloodRequestIDs1.filter(
            (s: any) => s.HospitalName == this.hospitalname
          );
          this.hosdatas = this.filtes.filter(
            (s: any) => s.Requestedby == this.dropBloodRequestIDs
          );
          this.BloodRequestIDs = this.hosdatas;

          if (this.BloodRequestIDs.length == 0) {
            this.my = 1;
            if (this.hospitalname) {

              this.presentConfirmAlert(this.hospitalname)
            }
          }
        } else if (this.BloodRequestIDs == undefined) {
          this.my = 1;
          if (this.hospitalname) {
            this.presentConfirmAlert(this.hospitalname)

            //this.Myhospital = this.hospitalname;
          }

        }
      },
      (error: any) => {
        console.error(error);
        loading.dismiss(); // Stop the loader on error
      }
    );
  }



  presentConfirmAlert(hospital: any) {
    this.Myhospital = hospital;
  }

  GetBloodRequestdropdown() {
    const url = 'api/BG/Get_BloodRequestsIDMobiles';

    this.general.GetData(url).subscribe((data: any) => {
      this.dropBloodRequestIDs1 = data;

    this.dropBloodRequestIDs = this.dropBloodRequestIDs1.filter((s: any) =>
      s.AcceptedBy == this.UserDetails[0].RegId &&
      (s.SYSSubmitted == 0 || s.SYSSubmitted == null)
    );

      if (this.dropBloodRequestIDs.length === 0) {
        this.messg = 'No request found';
      }
    });
  }






  Donatedate(item: any) {
    this.Donate = item; 

    const dateObj = new Date(this.Donate);
    const date = dateObj.toISOString().split('T')[0];
    this.donatedate = date;

    const time = dateObj.toTimeString().split(' ')[0];
    this.donatetime = time;

  }



  async goToDonate() {
    const alert = await this.alertCtrl.create({
    header: 'Request to Donate',
    message: 'You haven’t donated blood yet. You can donate blood once every 56 days to continue saving lives.',
    backdropDismiss: false
  });

  await alert.present();

  // Auto close after 3 seconds
  setTimeout(() => {
    alert.dismiss();
  }, 2000);
   
  }

  reqst(val: any) {
    this.SelectedBloodRequestID = val;
    this.hideSearchBar = true;

    let uploadfile = new FormData();
    uploadfile.append("Param1", val);

    this.general.PostData("api/BG/GetLocation_Donationdate_basedonBrequestID", uploadfile)
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          const data = res[0];

          this.HospitalAddress = data.HospitalAddress;

          if (data.BloodRequestDate) {
            const parts = data.BloodRequestDate.split('/');
            this.donatedate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }

          this.searchQuery = this.HospitalAddress;
          this.Myhospital = this.HospitalAddress;
          this.Donate = true;

        this.isDateLocked = true; // 🔒 lock date
        }
      });
  }

 

  setTab(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }

    // Fetch data based on the selected tab
    if (tab === 'open') {
      //this.GetBloodRequestdropdown();
      // this.Gethospitaldetails();
    }
    else if (tab === 'closed') {

      // this.otherlocation();
    }
  }

  reg() {
    this.modal.dismiss();
  }
  SearchBloodRequestIDs() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.BloodRequestIDs = this.BloodRequestIDs1;
    } else {
      this.BloodRequestIDs = this.BloodRequestIDs1.filter((BG: any) => {
        return (
          BG.BloodRequestID.toLowerCase().includes(searchQuery)
        );
      });
    }
  }
  selectBloodRequestID(val: any) {
    this.SelectedBloodRequestID = val;
    this.reg();
  }

  public async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Gallery',
        icon: 'images',
        handler: () => {

          this.takePicture(CameraSource.Photos);

        }
      }, {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          //this.navCtrl.navigateForward('/imagetemplates')
          this.takePicture(CameraSource.Camera);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  take1(val: any) {
      var obj = [{
        hospitaladdress: this.searchQuery,

        hospitalname: this.Myhospital,
        date: this.donatedate,
        time: this.donatetime,
        state: this.selectedState,
        District: this.District,
        city: this.city,
        BloodrequestID: this.SelectedBloodRequestID

      }]
    this.navCtrl.navigateForward(['/imagetemplates', { ids: 1, image: this.selectedImage, totaldata: JSON.stringify(obj), donatedate: this.donatedate }]);
    }


  // Function to show alert
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async takePicture(source: CameraSource) {
    const image = await Camera.getPhoto({
      source,
      resultType: CameraResultType.Uri,
      quality: 40,
      width: 700,
      height: 700,
      correctOrientation: true,
      allowEditing: false
    });
    const customFilename = this.createFileName();
    const FileuploadUrl = this.HomeUrl + "api/BG/UploadBloodDonationImage";
    //alert(FileuploadUrl)
    const imageUrl = Capacitor.convertFileSrc(image.path ? image.path : "");
    const blob = await fetch(imageUrl).then(r => r.blob());
    const formData = new FormData();
    formData.append('UploadedImage', blob, customFilename); // Add custom filename to FormData
    this.http.post(FileuploadUrl, formData).subscribe((data: any) => {
      this.DonationImage = data;
      this.selectedImage = this.DonationImage.dataUrl;
      this.navCtrl.navigateForward(['/imagetemplates', { ids: 1, image: this.selectedImage, totaldata: JSON.stringify(this.filtes) }])
    });
  }
  createFileName() {
    const timestamp = new Date().getTime();
    return `${timestamp}.jpg`;
  }

  UploadBloodDonationImage() {
    if (this.SelectedBloodRequestID != null) {
      if (this.DonationImage != null) {
        var UploadFile = new FormData();
        UploadFile.append("BloodDonationImage", this.selectedImage);
        UploadFile.append("BloodRequestID", this.SelectedBloodRequestID);
        var url = "api/BG/UploadBloodDonationImagebyDonor";
        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          if (data == "SUCCESS") {
            this.general.presentAlert("SUCCESS", "You successfully uploaded image.");
            this.navCtrl.navigateForward('/home');
          }
        });
      } else {
        this.general.presentToast("Please upload your image..!");
      }
    } else {
      this.general.presentToast("Please select Blood RequestID..!");
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
    this.searchQuery = prediction.description;  // shows in searchbar input
    this.predictions = [];

    // Save full address string for Donation Center display
    this.Myhospital = prediction.description;

    // Optional: If you still want just hospital name separately
    const descriptionParts = prediction.description.split(',');
    this.hospitalname = descriptionParts[0].trim();

    // If you want more place details using place_id
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


        this.noreqstgetCityAndArea(latitude, longitude); // For example, passing it to your custom method
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
        this.selectedState = this.state
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.District = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.District = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.District


        this.StateID1 = this.BloodRequestIDs1.filter((id: any) => id.StateName == this.selectedState)
        this.StateID = this.StateID1[0].StateId
        this.districtids1 = this.BloodRequestIDs1.filter((id: any) => id.DistrictName == this.selectedDistrict)
        this.districtids = this.districtids1[0].DistrictId
        this.CityIDs1 = this.BloodRequestIDs1.filter((id: any) => id.CityName == this.selectedCity)
        this.CityID1 = this.CityIDs1[0].CityId
        if (this.CityID1 || this.districtids || this.StateID) {
          this.GetBloodRequest();
        } else {
          this.GetBloodRequest();

        }

      } else {
        console.log('No results found');
      }
    }, (error: any) => {
      console.error('Error getting geocode', error);
    });
  }

  noreqstgetCityAndArea(lat: number, lng: number) {
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
        //this.District = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.District = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.District

        this.GetBloodRequest();

        localStorage.setItem("District", this.District);
        localStorage.setItem("City", this.city);
        localStorage.setItem("State", this.state);

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

  
  clearBloodRequest() {
    this.selectedBloodRequestID = null;
    this.isDateLocked = false;
    this.donatedate = null;
    this.Myhospital = null;
    this.HospitalAddress = null;
    this.hideSearchBar = false;

    // Remove marker from map
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }

    this.searchQuery = '';
    this.predictions = [];
    this.loadMap(); // reset map to default view
  }

}
