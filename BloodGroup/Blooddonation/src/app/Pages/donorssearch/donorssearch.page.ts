import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { IonModal, NavController, Platform, AlertController, IonAccordionGroup, LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../../Services/user/user.service';
declare var google: any;
import { Share } from '@capacitor/share';
import { IonSelect } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';

@Component({
  selector: 'app-donorssearch',
  templateUrl: './donorssearch.page.html',
  styleUrls: ['./donorssearch.page.scss'],
})
export class DonorssearchPage implements OnInit {
  showDropdown: boolean = false;
  searchQuery: any;
  selectedPincode: any;
  @ViewChild('pincodeSelect', { static: false }) pincodeSelect!: IonSelect;
  @ViewChild('modal1', { static: false }) modal!: IonModal;
  @ViewChild('map', { static: false }) mapElement: ElementRef | undefined;
  @ViewChild('openAccordionGroup', { static: false }) openAccordionGroup!: IonAccordionGroup;
  @ViewChild('closedAccordionGroup', { static: false }) closedAccordionGroup!: IonAccordionGroup;
  OpenBloodRequests: any;
  BloodRequestDetalis: any;
  BloodAcceptedDetalis: any;
  OpenFlag: any = 1;
  ClosedFlag: any;
  CloseBloodRequests: any;
  userdetail: any;
  UserDetails: any;
  opendata: any;
  ClosedData: any;
  latitude: any;
  longitude: any;
  city: any;
  selectedCity: any;
  area: any;
  selectedarea: any;
  pincode: any;
  selectedpincode: any;
  state: any;
  selectedState: any;
  country: any;
  Distict: any;
  selectedDistrict: any;
  currentloc: any;
  otherloc: any;
  otherloc1: any;
  comment: any;
  myrepots: any;
  value: any;
  acceptcomment: any;
  isAccepting: boolean = false;
  isModalOpen: boolean = false;
  open: boolean = true;
  crntlatitude: any;
  crntlongitude: any;
  OpenBloodRequestsLength: any;
  selecd: any;
  map: any;
  autocomplete: any;
  placeService: any;
  marker: any;
  predictions: any[] = [];
  rpt: boolean = false;
  acpt: boolean = false;
  opend: any;
  closed: any;
  closse: any;
  opnbg: any;
  clsbg: any;
  curnt: boolean = false;
  isClosed: boolean = false;
  items = [];
  selectedId: any;
  msg: any;
  MyBloodRequestID: any;
  todaydate: any;
  activeAccordionOpen: number | null = null;
  activeAccordionClosed: number | null = null;
  selectedTab: string = 'open';
  Expirydays1: string | null = null;
  Expirydays: any[] | null = null;
  expirystatus: any[] | null = null;
  expiryEmailstatus: boolean[] = [];
  expiryNotificationstatus: boolean[] = [];
  expirySmsstatus: boolean[] = [];
  expiryCallstatus: boolean[] = [];
  expiryWhatsappstatus: boolean[] = [];
  expirydates: string[] = [];
  NewBloodDonateDate: any;
  Email: any;
  UnitsofBlood: any;
  LastDonationValue: any = null;
    Role: any;
  status: any;
  isLoadingAcceptStatus: boolean = false;
    FullName: any;

  constructor(
    private alertController: AlertController,
    public user: UserService,
    public general: GeneralService,
    private http: HttpClient,
    private nav: NavController,
    private launchNavigator: LaunchNavigator,
    private platform: Platform,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
    // Initialize user's pincode for grouping logic
    if (this.UserDetails && this.UserDetails[0] && this.UserDetails[0].Pincode != null) {
      this.pincode = this.UserDetails[0].Pincode.toString().trim();
    }
  }

  ngOnInit() {
    // Initialize with default tab
    this.initializePage();
    this.getAvailablestatus();
  }

  ionViewWillEnter() {
    // Re-initialize tab selection every time the page is entered
    this.initializePage();
  }

  ionViewDidEnter() {
    // Force detect changes after view is fully loaded
    setTimeout(() => {
      if (!this.selectedTab || this.selectedTab === '') {
        this.selectedTab = 'open';
      }
    }, 100);
  }

  initializePage() {
    // Reset tab to default
    this.selectedTab = 'open';

    // Clear accordion states
    this.activeAccordionOpen = null;
    this.activeAccordionClosed = null;
    this.BloodRequestDetalis = null;

    // Load data for open tab
    this.getmylocation();
  }

  toggleAccordion(index: number, tab: string, regId: any) { }

  closeAccordion(tab: string) {
    if (tab === 'open' && this.openAccordionGroup) {
      this.activeAccordionOpen = null;
      this.openAccordionGroup.value = null;
    } else if (tab === 'closed' && this.closedAccordionGroup) {
      this.activeAccordionClosed = null;
      this.closedAccordionGroup.value = null;
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
      const item = this.currentloc && this.currentloc[index];
      if (item && item.RegId) {
        this.GetBloodRequestDetails(item.RegId);
      }
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
      const item = this.otherloc && this.otherloc[index];
      if (item && item.RegId) {
        this.GetBloodRequestDetails(item.RegId);
      }
    }
  }

  openSelected(UdId: any) {
    this.selectedId = UdId;
    this.isClosed = false;
  }

  closeSelected() {
    this.isClosed = true;
    this.selectedId = null;
  }
  openmap(Latitude?: any, Longitude?: any) {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };

    if (Latitude && Longitude) {
      // If coordinates are provided, navigate to them
      const destination = [Latitude, Longitude];
      this.launchNavigator.navigate(destination, options)
        .then(
          (success: any) => console.log('Launched navigator with destination'),
          (error: any) => console.log('Error launching navigator', error)
        );
    } else {
      // No coordinates — just open the Google Maps app
      this.launchNavigator.navigate('', options)
        .then(
          (success: any) => console.log('Launched navigator without destination'),
          (error: any) => console.log('Error launching navigator', error)
        );
    }
  }

  openLocationSettings() {
    if (this.platform.is('android')) {
      this.launchNavigator.navigate('geo:0,0?q=0,0', { app: this.launchNavigator.APP.SETTINGS });
    } else if (this.platform.is('ios')) {
      this.launchNavigator.navigate('app-settings:', { app: this.launchNavigator.APP.SETTINGS });
    }
  }

  setTab(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
      this.activeAccordionOpen = null;
      this.activeAccordionClosed = null;
      this.BloodRequestDetalis = null;
      if (this.openAccordionGroup) this.openAccordionGroup.value = null;
      if (this.closedAccordionGroup) this.closedAccordionGroup.value = null;
      if (tab === 'open') {
        this.getmylocation();
      } else if (tab === 'closed') {
        this.otherlocation();
      }
    }
  }



  getLastDonateDate() {
    const uploadfile = new FormData();
    uploadfile.append("Param1", this.UserDetails[0].RegId.toString());
    uploadfile.append("Param2", '3');

    const url = "api/BG/GetLatestLastDonationDate";

    this.general.PostData(url, uploadfile).subscribe(
      async (data: any) => {
        this.LastDonationValue = data?.[0]?.Lastdonatedate ?? null;

        if (!this.isEligibleForDonation(this.LastDonationValue)) {
          await this.showNotEligibleAlert();   //
          return;
        }

        // eligible → now ask confirmation
        await this.showConfirmAcceptAlert();
      },
      async error => {
        console.error(error);
        // if error → still allow but with confirmation
        await this.showConfirmAcceptAlert();
      }
    );
  }
  async showConfirmAcceptAlert() {
    const alert = await this.alertController.create({
      header: 'Confirm Acceptance',
      message: 'Are you sure you want to accept this blood request?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Yes', role: 'yes' }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    
    if (role === 'yes') {
      this.acceptrqst(); // Direct call to new API
    } else {
      this.isAccepting = false;
    }
  }



  async showNotEligibleAlert() {
    const alert = await this.alertController.create({
      header: 'Not Eligible',
      message: 'You are not eligible to accept this request because you have donated within the last 56 days.',
      buttons: ['OK']
    });

    await alert.present();
    await alert.onDidDismiss();
    this.isAccepting = false;
  }



  isEligibleForDonation(lastDateStr: string | null): boolean {
    if (!lastDateStr) return true;

    const lastDate = new Date(lastDateStr);
    const eligibleDate = new Date(lastDate);
    eligibleDate.setDate(eligibleDate.getDate() + 56);

    const today = new Date();

    return today >= eligibleDate;
  }


  getmylocation() {

    var UploadFile = new FormData();
    UploadFile.append("Param", this.UserDetails[0].RegId);
    var url = "api/BG/Get_Requestform";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.OpenFlag = 1;
      this.ClosedFlag = 0;
      this.open = true;
      this.OpenBloodRequests = data;
      this.currentloc = this.OpenBloodRequests.filter(
        (flt: any) =>
          (flt.Pincode != null ? flt.Pincode.toString().trim() : '') === (this.pincode != null ? this.pincode.toString().trim() : '') &&
          flt.Requestedby != this.UserDetails[0].RegId
      );
      this.OpenBloodRequestsLength = data.length;
      if (this.currentloc.length !== 0) {
        this.opnbg = 0;
        this.clsbg = 1;
        this.curnt = true;
      } else {
        this.curnt = false;
        this.msg = "No blood requests are available in your location.";
      }
    });
  }

  currentdate() {
    let start = new Date();
    this.todaydate = start;
  }

  otherlocation() {
    var UploadFile = new FormData();
    UploadFile.append("Param", this.UserDetails[0].RegId);
    var url = "api/BG/Get_Requestform";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.OpenFlag = 0;
      this.ClosedFlag = 1;
      this.open = false;
      this.closed = true;
      this.ClosedData = data;
      this.otherloc = this.ClosedData.filter(
        (flt: any) =>
          (flt.Pincode != null ? flt.Pincode.toString().trim() : '') !== (this.pincode != null ? this.pincode.toString().trim() : '') &&
          flt.Requestedby != this.UserDetails[0].RegId
      );
      this.otherloc1 = this.ClosedData.filter(
        (flt: any) =>
          (flt.Pincode != null ? flt.Pincode.toString().trim() : '') !== (this.pincode != null ? this.pincode.toString().trim() : '') &&
          flt.Requestedby != this.UserDetails[0].RegId
      );
      if (this.otherloc.length !== 0) {
        this.clsbg = 0;
        this.opnbg = 1;
        this.curnt = true;
      } else {
        this.curnt = false;
        this.msg = "No blood requests are available in other location.";
      }
    });
  }

  toggleFilter() {
    this.showDropdown = !this.showDropdown;
    if (!this.showDropdown) {
      this.searchQuery = '';
      this.selectedPincode = [...this.otherloc1];
    }
  }

  filterPincodes() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.selectedPincode = [...this.otherloc1];
      this.otherloc = this.selectedPincode;
      return;
    }
    this.selectedPincode = this.otherloc1.filter((obj: any) =>
      obj.Pincode.toString().includes(query) || obj.newCityname.toLowerCase().includes(query)
    );
  }

  selectPincode(obj: any) {
    this.selectedPincode = `${obj.Pincode}, (${obj.newCityname})`;
    this.showDropdown = false;
  }

  Selectfilter(val: any) {
    const searchQuery = val;
    if (!searchQuery) {
      this.otherloc = [...this.otherloc1];
    } else {
      this.otherloc = this.otherloc1.filter((BG: any) =>
        BG.Pincode.toString().toLowerCase().includes(searchQuery)
      );
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedPincode = [...this.otherloc1];
    this.otherloc = [...this.otherloc1];
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

  onSearchInput() {
    if (this.searchQuery.length > 2) {
      this.autocomplete.getPlacePredictions({
        input: this.searchQuery,
        componentRestrictions: { country: 'IN' }
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
    this.getPlaceDetails(prediction.place_id);
  }

  getPlaceDetails(placeId: string) {
    const request = {
      placeId: placeId,
      fields: ['name', 'geometry']
    };
    this.placeService.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (this.map) {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(15);
          if (this.marker) {
            this.marker.setMap(null);
          }
          this.marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name
          });
          this.fetchNearbyPlaces(place.geometry.location);
        }
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }

  fetchNearbyPlaces(location: any) {
    const request = {
      location: location,
      radius: '1500',
      type: ['restaurant', 'hospital']
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

  GetBloodRequestDetails(Val: any) {
    this.selecd = Val;
    this.opend = 1;
    this.closse = 0;
    this.BloodAcceptedDetalis = null;
    this.isLoadingAcceptStatus = true;
    var UploadFile = new FormData();
    UploadFile.append("Param", Val);
    var url = "api/BG/Get_Requestbasedon_presonID_mobile";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.BloodRequestDetalis = data;
      this.MyBloodRequestID = this.BloodRequestDetalis[0].BloodRequestID;
      this.FullName = this.BloodRequestDetalis[0].FullName;
      this.crntlatitude = this.BloodRequestDetalis[0].Latitude;
      this.crntlongitude = this.BloodRequestDetalis[0].Longitude;
      this.GetAcceptStatus(this.MyBloodRequestID);
    });
  }

  GetAcceptStatus(Val: any) {
    var UploadFile = new FormData();
    UploadFile.append("Param1", Val);
    UploadFile.append("Param2", '3');
    UploadFile.append("Param3", this.UserDetails[0].RegId);
    var url = "api/BG/BloodAcceptedUser";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      let parsedData = data;
      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          console.error("Error parsing BloodAcceptedDetalis:", e);
        }
      }
      this.BloodAcceptedDetalis = parsedData;
      
      let isAccepted = false;
      if (Array.isArray(this.BloodAcceptedDetalis) && this.BloodAcceptedDetalis.length > 0) {
        const record = this.BloodAcceptedDetalis[0];
        if (record.Accepted == 1 || record.Accepted == '1' || record.AcceptBy == 1 || record.AcceptBy == '1') {
          isAccepted = true;
        }
      } else if (this.BloodAcceptedDetalis && typeof this.BloodAcceptedDetalis === 'object') {
        if (this.BloodAcceptedDetalis.Accepted == 1 || this.BloodAcceptedDetalis.Accepted == '1' || this.BloodAcceptedDetalis.AcceptBy == 1 || this.BloodAcceptedDetalis.AcceptBy == '1') {
          isAccepted = true;
        }
      }
      
      if (this.selectedTab === 'open' && this.activeAccordionOpen !== null) {
        if (this.currentloc && this.currentloc[this.activeAccordionOpen]) {
           this.currentloc[this.activeAccordionOpen].AcceptBy = isAccepted ? 1 : 0;
        }
      } else if (this.selectedTab === 'closed' && this.activeAccordionClosed !== null) {
        if (this.otherloc && this.otherloc[this.activeAccordionClosed]) {
           this.otherloc[this.activeAccordionClosed].AcceptBy = isAccepted ? 1 : 0;
        }
      }
      
      this.isLoadingAcceptStatus = false;
      this.cdr.detectChanges(); // Force Angular to update the UI instantly
    });
  }

  async acceptrqst() {
    debugger
    const loading = await this.loadingController.create({
      message: 'Accepting request, please wait...',
      spinner: 'crescent'
    });
    await loading.present();

    var UploadFile = new FormData();
    UploadFile.append("Param1", this.MyBloodRequestID);
    UploadFile.append("Param2", this.UserDetails[0].RegId);
    UploadFile.append("Param3", this.UnitsofBlood);
    var url = "api/BG/Update_request_donors";

    this.general.PostData(url, UploadFile).subscribe(async (data: any) => {
      await loading.dismiss();
      this.isAccepting = false;
      
      const status = Array.isArray(data) ? data[0]?.Status : data;

      if (status === 'USEREXIST' || data === 'USEREXIST') {
        this.showToast('You have already accepted this blood request.', 'light');
      } else if (status === 'EXIST' || data === 'EXIST') {
        this.showToast('This blood request has already received the required number of donor acceptances.', 'light');
      } else if (status === 'SUCCESS' || data === 'SUCCESS') {
        this.showToast('Thank you for stepping forward to donate blood. Your response has been recorded.', 'success');
        this.accept();
      } else {
        this.showToast('Unexpected response. Please try again.', 'danger');
      }
    }, async (error: any) => {
      await loading.dismiss();
      this.isAccepting = false;
      this.showToast('Failed to accept blood request. Please try again later.', 'danger');
    });
  }

  async acceptCheck(value:any) {
    if (this.isAccepting) return;
    this.isAccepting = true;
    this.Email = value[0].Email;
    this.UnitsofBlood = value[0].UnitsofBlood;
    this.getLastDonateDate(); // first check eligibility
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }


  accept() {
    this.acpt = true;
    this.acceptcomment = `Hi ${this.FullName}, your blood request has been accepted by ${this.UserDetails[0].FullName}.
      Contact: ${this.UserDetails[0].Phonenumber}
      Please reach out immediately and coordinate the donation.`;
    this.comment = this.acceptcomment;
    this.sendMail();
    this.sendnotoifications();
  }

  report() {
    this.comment = this.myrepots;
    this.sendMail();
  }

  myreport() {
    this.comment = this.myrepots;
    this.sendMail();
    this.modal.dismiss();
  }

  openModal() {
    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss();
  }

  sendMail() {
    this.rpt = true;
    var obj = [{
      Email: this.UserDetails[0].Email,
      FullName: this.UserDetails[0].FullName,
      Phonenumber: this.UserDetails[0].Phonenumber,
      CreatedByEmail: this.Email
    }];
    const uploadfile = new FormData();
    uploadfile.append("Email", JSON.stringify(obj));
    const url = "api/BG/MailTo_Admin";
    this.general.PostData(url, uploadfile).subscribe(data => {
      this.nav.navigateForward('/home');
    });
  }

  sendnotoifications() {
    /*if (this.BloodRequestDetalis[0].NotificationStatus == true) {*/
    var UploadFile = new FormData();
    UploadFile.append("deviceId", this.BloodRequestDetalis[0].Devicetoken);
    UploadFile.append("message", this.acceptcomment);
    UploadFile.append("senderName", "Let's Help");
    UploadFile.append("path", 'myrequest');
    UploadFile.append("Img", "");
    var notificationUrl = "api/BG/sendNotification";
    this.general.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
      if (notificationData) {

        var arr = [{

          RegID: this.UserDetails[0].RegId,
          NotiRecevieID: this.BloodRequestDetalis[0].CreatedBy,//Asif
          NotificationsDesc: this.comment,
          CreatedBy: this.UserDetails[0].RegId
        }];
        var notificationsUrl = "api/BG/Crud_Notifications";
        var notificationsUploadFile = new FormData();
        notificationsUploadFile.append("Param", JSON.stringify(arr));
        notificationsUploadFile.append("Flag", "1");
        this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe((data: any) => {
          if (data == 'SUCCESS') {
            this.nav.navigateForward('/home');
          }
        });
      }
    });
    /* }*/
  }

  getIndexName(index: number): string {
    const indexNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
    if (index >= 0 && index < 10) {
      return indexNames[index];
    } else {
      const lastDigit = index % 10;
      const secondLastDigit = Math.floor(index / 10) % 10;
      if (secondLastDigit === 1) {
        return `${index + 1}th`;
      } else {
        switch (lastDigit) {
          case 1: return `${index + 1}st`;
          case 2: return `${index + 1}nd`;
          case 3: return `${index + 1}rd`;
          default: return `${index + 1}th`;
        }
      }
    }
  }

  async InviteFrinds(obj: any) {
    if (this.UserDetails[0].Status === false) {
      await this.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");
      return;
    }
    const text = `
      "Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it's giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe."

      Name: ${obj.FullName}
      Gender: ${obj.Gender}
      Bloodgroup: ${obj.BLGName}
      BloodRequestDate: ${obj.BloodRequestDate}
      Purpose: ${obj.Purpose}
      State: ${obj.newStatename}
      District: ${obj.newDistrictname}
      City: ${obj.newCityname}
      Pincode: ${obj.Pincode}

      For more details, visit the link below:
      const shareUrl = "https://letshelp.in.com";
      const image = "https://letshelp.in/webservices/Image/logo.png";
    `;
    const encodedText = encodeURIComponent(text);
    try {
      await Share.share({
        title: 'Lets Help',
        text: text,
        url: obj.url,
        dialogTitle: 'Share with your friends'
      });
    } catch (error) {
      this.presentToast("Please check your connection: " + error);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    console.log(message);
  }

  openDropdown() {
    this.pincodeSelect.open();
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
