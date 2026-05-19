import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController, ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
declare var google: any;
import { Platform, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-supportletshelp',
  templateUrl: './supportletshelp.page.html',
  styleUrls: ['./supportletshelp.page.scss'],
})
export class SupportletshelpPage implements OnInit {
  id: any;
  StateID: any;
  DistrictID: any;
  CityID: any;
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
  marker: any;
  map: any;
  placeService: any;
  autocomplete: any;
  selectedCity: any;
  country: any;
  selectedDistrict: any;
  venueslist: any;
  venueslist1: any;

  RequestForm: FormGroup;
  searchValue: any;
  selectedState: any;
  States: any;
  States1: any;
  Districts: any;
  Districts1: any;
  Cities: any;
  Cities1: any;

  // Debounce subjects for search optimization
  private searchSubject = new Subject<string>();
  private stateSearchSubject = new Subject<string>();
  private districtSearchSubject = new Subject<string>();
  private citySearchSubject = new Subject<string>();

  constructor(
    private Fb: FormBuilder,
    public general: GeneralService,
    private modal: ModalController,
    private navCtrl: NavController,
    public activeRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.id = this.activeRoute.snapshot.paramMap.get("id");
    this.RequestForm = this.Fb.group({
      Address: [""],
      Area: [""],
      StateId: [""],
      DistrictId: [""],
      CityId: [""],
      Pincode: [""],
    });

    // Setup debounced search for location autocomplete
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchText => {
      this.performLocationSearch(searchText);
    });

    // Setup debounced search for States
    this.stateSearchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performStateSearch();
    });

    // Setup debounced search for Districts
    this.districtSearchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performDistrictSearch();
    });

    // Setup debounced search for Cities
    this.citySearchSubject.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performCitySearch();
    });
  }

  ngOnInit() {
    this.loadMap();
    this.GetStates();
  }

  back(val: any) {
    if (val == 1) {
      this.navCtrl.navigateForward(['/multipledonors', { id: val }])
    } else {
      this.navCtrl.navigateForward(['/myprofile'])
    }
  }

  nxt(val: any) {
    debugger
    if (this.venues != undefined) {
      this.navCtrl.navigateForward(['/rquestpresentation', { rk: val, venu: this.venues, pincode: this.selectedpincode }])
    } else {
     this.general.presentAlert("Location Required", "Please search and select a location.");
    }
  }

  loadMap() {
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps JavaScript API is not loaded.');
      return;
    }

    const mapOptions = {
      center: new google.maps.LatLng(20.5937, 78.9629),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    if (this.mapElement && this.mapElement.nativeElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.placeService = new google.maps.places.PlacesService(this.map);
      this.autocomplete = new google.maps.places.AutocompleteService();
    } else {
      console.error('Map element is not properly initialized.');
    }
  }

  // Optimized search input handler
  onSearchInput() {
    if (this.searchQuery && this.searchQuery.length > 2) {
      this.searchSubject.next(this.searchQuery);
    } else {
      this.predictions = [];
    }
  }

  // Separated search logic for better performance
  private performLocationSearch(searchText: string) {
    if (!this.autocomplete) return;

    this.autocomplete.getPlacePredictions({
      input: searchText,
      componentRestrictions: { country: 'IN' }
    }, (predictions: any[], status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.predictions = predictions || [];
      } else {
        this.predictions = [];
      }
    });
  }

  selectPrediction(prediction: any) {
    this.searchQuery = prediction.description;
    this.predictions = [];
    const descriptionParts = prediction.description.split(',');
    const hospitalName = descriptionParts[0].trim();
    this.venues = hospitalName;
    this.getPlaceDetails(prediction.place_id);
  }

  getPlaceDetails(placeId: string) {
    const request = {
      placeId: placeId,
      fields: ['address_components', 'formatted_address', 'geometry']
    };

    this.placeService.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

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

        // Get city and area WITHOUT making another API call if possible
        this.extractLocationFromPlace(place.address_components, latitude, longitude);
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }

  // Optimized: Extract location data directly from place details
  private extractLocationFromPlace(addressComponents: any[], lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;
    this.city = this.getAddressComponent(addressComponents, 'locality');
    this.selectedCity = this.city;
    this.area = this.getAddressComponent(addressComponents, 'sublocality') ||
      this.getAddressComponent(addressComponents, 'sublocality_level_1');
    this.selectedarea = this.area;
    this.pincode = this.getAddressComponent(addressComponents, 'postal_code');
    this.selectedpincode = this.pincode;
    this.state = this.getAddressComponent(addressComponents, 'administrative_area_level_1');
    this.selectedState = this.state;
    this.country = this.getAddressComponent(addressComponents, 'country');
    this.Distict = this.getAddressComponent(addressComponents, 'administrative_area_level_3');
    this.selectedDistrict = this.Distict;

    // Store in localStorage
    localStorage.setItem("Distict", this.Distict);
    localStorage.setItem("City", this.city);
    localStorage.setItem("State", this.state);

    // Update IDs based on extracted data
    this.updateLocationIDs();
  }

  // Optimized: Update IDs only when needed
  private updateLocationIDs() {
    if (this.States1 && this.selectedState) {
      const selectedStateObj = this.States1.find((s: any) => s.StateName === this.selectedState);
      if (selectedStateObj) {
        this.StateID = selectedStateObj.StateId;
        this.GetDistricts();
      }
    }
  }

  getAddressComponent(components: any[], type: string) {
    const component = components.find(c => c.types.includes(type));
    return component ? component.long_name : null;
  }

  GetStates() {
    const obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544"
    }];
    const UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    const url = "api/BG/StatesMaster_crud";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.States = data;
      this.States1 = data;

      // Auto-select state if already set
      if (this.selectedState) {
        this.updateLocationIDs();
      }
    }, err => {
      this.general.presentToast("something went wrong");
    });
  }

  GetDistricts() {
    if (!this.StateID) return;

    const obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      StateId: this.StateID
    }];
    const UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    const url = "api/BG/DistrictMaster_crud";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Districts = data;
      this.Districts1 = data;

      if (this.selectedDistrict && this.Districts1) {
        const selectedDistrictObj = this.Districts1.find((d: any) => d.DistrictName === this.selectedDistrict);
        if (selectedDistrictObj) {
          this.DistrictID = selectedDistrictObj.DistrictId;
          this.GetCities();
        }
      }
    }, err => {
      this.general.presentToast("something went wrong");
    });
  }

  GetCities() {
    if (!this.DistrictID) return;

    const obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      DistrictId: this.DistrictID
    }];
    const UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    const url = "api/BG/CitiesMaster_Crud";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Cities = data;
      this.Cities1 = data;

      if (this.selectedCity && this.Cities1) {
        const selectedCityObj = this.Cities1.find((c: any) => c.CityName === this.selectedCity);
        if (selectedCityObj) {
          this.CityID = selectedCityObj.CityId;
        }
      }
    }, err => {
      this.general.presentToast("something went wrong");
    });
  }

  // Optimized search methods with debouncing
  SearchStates() {
    this.stateSearchSubject.next(this.searchValue);
  }

  private performStateSearch() {
    const searchQuery = this.searchValue?.trim().toLowerCase();
    if (!searchQuery) {
      this.States = this.States1;
    } else {
      this.States = this.States1.filter((state: any) =>
        state.StateName.toLowerCase().includes(searchQuery)
      );
    }

    if (this.States.length === 1) {
      this.StateID = this.States[0].StateId;
      this.selectedState = this.States[0].StateName;
    }
  }

  SearchDistricts() {
    this.districtSearchSubject.next(this.searchValue);
  }

  private performDistrictSearch() {
    const searchQuery = this.searchValue?.trim().toLowerCase();
    if (!searchQuery) {
      this.Districts = this.Districts1;
    } else {
      this.Districts = this.Districts1.filter((district: any) =>
        district.DistrictName.toLowerCase().includes(searchQuery)
      );
    }

    if (this.Districts.length === 1) {
      this.DistrictID = this.Districts[0].DistrictId;
      this.selectedDistrict = this.Districts[0].DistrictName;
    }
  }

  SearchCities() {
    this.citySearchSubject.next(this.searchValue);
  }

  private performCitySearch() {
    const searchQuery = this.searchValue?.trim().toLowerCase();
    if (!searchQuery) {
      this.Cities = this.Cities1;
    } else {
      this.Cities = this.Cities1.filter((city: any) =>
        city.CityName.toLowerCase().includes(searchQuery)
      );
    }

    if (this.Cities.length === 1) {
      this.CityID = this.Cities[0].CityId;
      this.selectedCity = this.Cities[0].CityName;
    }
  }

  Searchplaces() {
    const searchQuery = this.searchValue?.trim().toLowerCase();
    if (searchQuery === '') {
      this.venueslist = this.venueslist1;
    } else {
      this.venueslist = this.venueslist1.filter((BG: any) => {
        return BG.CityName.toLowerCase().includes(searchQuery);
      });
    }
  }

  reg() {
    this.modal.dismiss();
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.searchSubject.complete();
    this.stateSearchSubject.complete();
    this.districtSearchSubject.complete();
    this.citySearchSubject.complete();
  }
}
