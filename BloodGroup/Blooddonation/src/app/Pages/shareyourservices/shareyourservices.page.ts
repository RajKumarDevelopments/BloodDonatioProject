import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';                        /*Image upload */
import { Camera, CameraResultType, CameraSource, ImageOptions, } from '@capacitor/camera'
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Capacitor } from '@capacitor/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
@Component({
  selector: 'app-shareyourservices',
  templateUrl: './shareyourservices.page.html',
  styleUrls: ['./shareyourservices.page.scss'],
})
export class ShareyourservicesPage implements OnInit {
  shareForm: FormGroup;
  selectedImage: any;
  UserDetails1: any;
  UserDetails: any;
  gallery: any;
  HomeUrl: any;
    latitude: any;
    longitude: any;
    city: any;
    area: any;
    pincode: any;
    state: any;
  country: any; Distict: any;
    States: any;
    States1: any;
    Cities: any;
    DistrictID: any;
    Cities1: any;
    Districts: any;
    Districts1: any;
    StateID: any;
    searchValue: any;
    Placelist: any;
    Placelist1: any;
    selectedDistrict: any;
    selectedState: any;
    CityID: any;
  selectedCity: any;
  selectedImage1: any;
    selectedarea: any;
  selectedpincode: any;
  gallerydata: any;
    CatID: any;
  Catname: any;
  submitAttempt: boolean = false;
  selectorsDate: any;
  selectedDate: string = new Date().toISOString(); // Initialize with current date
  formattedSelectedDate: string = this.formatDate(new Date());
    selectedstateid: any;
    selecteddistid: any;
    DistrictsID: any;
    selectedCitiesid: any;
    cityID: any;

  constructor(private nav: NavController, private loadingController: LoadingController, private Fb: FormBuilder, private modal: ModalController, public actionSheetController: ActionSheetController, private alert: AlertController,
    private general: GeneralService, private http: HttpClient, public geocodingService: GeolocationserviceService
  ) {
    this.HomeUrl = localStorage.getItem("URL");
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);

    if (this.UserDetails[0].Status == false) {
      this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
    else {
      this.getCurrentLocation();
      this.GetStates();
      this.GetDistricts();
      this.GetCities();
      this.getgallerycat();
    }

    this.shareForm = this.Fb.group({
     
      institutionname: ['',],
      message: ['',],

    });


  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  ngOnInit() {
   
    

  }
  getgallerycat() {
    
    
    var obj = [{
      
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj))
    UploadFile.append("Flag", "4");
    var url = "api/BG/GalleryCat_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
      this.gallerydata = data;
    }, err => {
      this.general.presentToast("something went wrong");
    })
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

  getCityAndArea(lat: number, lng: number) {
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`; // Replace with your API key
    this.http.get(url).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];

        this.city = this.getAddressComponent(result.address_components, 'locality');
        this.selectedCity = this.city
        this.area = this.getAddressComponent(result.address_components, 'sublocality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.selectedarea =this.area
        this.pincode = this.getAddressComponent(result.address_components, 'postal_code');
        this.selectedpincode = this.pincode
        this.state = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedState = this.state
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.Distict = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.Distict
        console.log('Distict:', this.Distict,'City:', this.city, 'Area:', this.area, 'Pincode:', this.pincode, 'State:', this.state, 'Country:', this.country);
      } else {
        console.log('No results found');
      }
    }, error => {
      console.error('Error getting geocode', error);
    });
  }
  SearchPlaces() {
    
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Placelist = this.Placelist1;
    } else {
      this.Placelist = this.Placelist1.filter((BG: any) => {
        return (
          BG.Place.toLowerCase().includes(searchQuery)
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
  selectcat(val: any) {
    
    this.CatID = val.Categoryid;
    this.Catname = val.categoryname;
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




  reg() {
    this.modal.dismiss();
  }



  getAddressComponent(components: any[], type: string): string | null {
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
      this.selectedstateid = this.States1.filter((id: any) => id.StateName == this.selectedState)
      this.StateID = this.selectedstateid[0].StateId
      console.log('State:', this.StateID)

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
      this.selecteddistid = this.Districts1.filter((id: any) => id.DistrictName == this.Distict)
      this.DistrictsID = this.selecteddistid[0].DistrictID
      console.log('dst:', this.DistrictsID)

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
      this.selectedCitiesid = this.Cities1.filter((id: any) => id.CityName == this.city)
      this.CityID = this.selectedCitiesid[0].CityId
      console.log('ct:', this.cityID)
    }, err => {
      this.general.presentToast("something went wrong");
    })
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
    const FileuploadUrl = this.HomeUrl + "api/BG/UploadGallery";
    //alert(FileuploadUrl)
    const imageUrl = Capacitor.convertFileSrc(image.path ? image.path : "");
    const blob = await fetch(imageUrl).then(r => r.blob());
    //console.log(blob)
    const formData = new FormData();
    formData.append('PostedFile', blob, customFilename); // Add custom filename to FormData
    this.http.post(FileuploadUrl, formData).subscribe((data: any) => {
      this.general.presentAlert("SUCCESS", "You successfully uploaded photo.")
      this.selectedImage = data;
      // console.log(data)
    });
  }
  createFileName() {
    const timestamp = new Date().getTime();
    return `${timestamp}.jpg`;
  }

  onDateChange(event: any) {
    // Update the selectedDate property with the chosen date
    this.selectedDate = event.detail.value;
    this.formattedSelectedDate = this.formatDate(new Date(this.selectedDate));
  }

  updateDate() {
    this.modal.dismiss();
  }

  openDatePicker() {
   // this.modal.present();
  }

  formatDate(date: Date): string {
    // Format the date to 'DD-MM-YYYY'
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  insert(value: any) {
    ;
    this.submitAttempt = true;

    if (this.shareForm.valid) {
      this.loadingController.create({
        cssClass: 'my-custom-class',
        spinner: 'circles',
        message: 'Please wait...',
        translucent: true,
        backdropDismiss: true
      })

      const obj = [{
        RegId: this.UserDetails[0].RegId,
          GalleryImages: this.selectedImage,
          Categoryid: this.CatID,
        Dateofservice: this.selectedDate,
        City: this.CityID,
        State: this.StateID,
        District: this.DistrictID,
          Institutionname: value.institutionname,
          Message: value.message,
        }];

        const formData = new FormData();
        formData.append('Param', JSON.stringify(obj));
        
        formData.append('Flag', '1');
        console.log('d:', JSON.stringify(obj));
        const url = '/api/BG/Gallery_Crud';

      this.general.PostData(url, formData).subscribe((data: any) => {

            if (data == 'SUCCESS') {
                this.general.presentAlert("Alert", "Thank you for submit.");
                this.nav.navigateForward('/donordetails');
              } else {
                this.general.presentAlert("Alert", "Your submission failed.");
              }
          },
          (error: any) => {
              this.general.presentAlert("Alert", "An error occurred. Please try again.");
            
          }
        );
    }
  }

  
}
