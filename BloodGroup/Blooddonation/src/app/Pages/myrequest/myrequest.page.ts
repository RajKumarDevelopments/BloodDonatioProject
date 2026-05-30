import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
declare var google: any;
import { Geolocation } from '@capacitor/geolocation';
import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-myrequest',
  templateUrl: './myrequest.page.html',
  styleUrls: ['./myrequest.page.scss'],
})
export class MyrequestPage implements OnInit {
  // Replace accordion variables with drawer variables
  openDrawerId: string | null = null;
  isDrawerOpen: boolean = false;

  OpenBloodRequests: any;
  BloodRequestDetalis: any;
  OpenFlag: any = 1; ClosedFlag: any;
  CloseBloodRequests: any;
  userdetail: any; UserDetails: any;
  opendata: any; ClosedData: any;
  openreqdata: any;
  selectedDateTime: any;
  selectedtime: any;
  opend: any;
  RepostDate: any; rpd: any;
  flags: any; today: any; time: any;
  selecd: any;
  selectedCardId: number | null = null;
  openedCardId: string | null = null;
  selectedItem: any; expandedIndex: number | null = null;
  map: any;
  Distict: any;
  country: any;
  state: any;
  pincode: any;
  area: any;
  city: any;
  ContactNumber: any;
  HospitalName: any; Requireddate: any;
  Address: any; CurrentAddress: any;
  placeService: any; autocomplete: any; searchQuery: any;
  selectedLocation: string = 'address'; // Default location
  marker: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  predictions: any;
  StateID1: any;
  distictids1: any;
  CityIDs1: any;
  latitude: any;
  longitude: any;
  selectedTab: string = 'open';
  closed: boolean = false;
  openIndex: number = -1;
  msg: any;
  Number: any;
  Name: any;
  name: any;
  number: any;
  isModalOpen: boolean = false;
  selectedObj: any = null; // Add this at the top
  Role: any;
  status: any;

  constructor(public general: GeneralService, private loadingController: LoadingController,private nav: NavController,) {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);

    if (this.UserDetails[0].Status == false) {
      //this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");
    }
    else {

    }
    const todayDate = new Date();
    this.today = todayDate.toISOString(); // Includes date and time
    this.RepostDate = this.today; // Set the default date and time to now
    this.flags = 0; // or set it to your required value
  }

  ngOnInit() {
    this.requestdata();
    this.getAvailablestatus();
  }

  openDetails(index: number) {
    this.selectedItem = index;
  }

  closeDetails(item: any) {
    this.selectedItem = null;
  }

  // New drawer/accordion controller methods
  onAccordionChange(event: any) {
    const value = event.detail.value;
    this.openDrawerId = value;
    if (value) {
      this.GetBloodRequestDetails(value);
    }
  }

  toggleDrawer(itemId: string) {
    this.rpd = null;
    this.flags = null;
    if (this.openDrawerId === itemId) {
      this.closeDrawer();
    } else {
      this.openDrawer(itemId);
    }
  }

  openDrawer(itemId: string) {
    this.openDrawerId = itemId;
    this.isDrawerOpen = true;
    this.GetBloodRequestDetails(itemId);
  }

  closeDrawer() {
    this.openDrawerId = null;
    this.isDrawerOpen = false;
  }

  isDrawerOpenForItem(itemId: string): boolean {
    return this.openDrawerId === itemId && this.isDrawerOpen;
  }

  open1(state: number) {
    // Close drawer when needed
    this.closeDrawer();
  }

  openModal(val: any) {
    this.selectedObj = val; //Save selected object
    this.Name = val.ContactPerson;
    this.Number = val.ContactMobile;
    this.isModalOpen = true;
  }

  filterDigitsOnly(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, ''); // removes all non-digit characters
    this.Number = input.value; // update the bound variable
  }


  upd() {
    const vals = this.selectedObj; //use saved object
   // console.log('md:', vals)
    this.name = this.Name;
    this.number = this.Number;
    this.isModalOpen = false;
    this.AddRequestForm(vals);
  }


  AddRequestForm(value: any) {
    if (this.Name || this.Number) {
      var obj = [{
        UdId: value.UdId,
        ContactPerson: this.Name,
        ContactMobile: this.Number,
      }]
      var UploadFile = new FormData()
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", '5');
      var url = "api/BG/Insert_Update_requestForm";
      this.general.PostData(url, UploadFile).subscribe((data: any) => {
        if (data == "SUCCESS") {
          this.requestdata();
          this.general.presentAlert("UPDATE", "Contact information updated.");
        }
      })
    } else {
      this.general.presentToast("Please enter all fields to raise a blood request..!");
    }
  }

  repostdata() {
    this.rpd = 1
    this.flags = 3
  }

  onDateChange(event: any) {
    this.RepostDate = event.detail.value
    console.log('Selected date:', event.detail.value);
  }

  Date(item: any) {
    this.time = item.detail.value
  }

  Repost(detail: any) {
   
    var selectedDateTime = this.RepostDate;
    var selectedDate = selectedDateTime.split('T')[0];
    var selectedTime = selectedDateTime.split('T')[1];
    this.selectedtime = selectedTime
    var obj = [{
      RegId: this.UserDetails[0].RegId,
      FullName: detail.FullName,
      age: detail.Age,
      Gender: detail.Gender,
      BloodGroupId: detail.BloodGroupId,
      UnitsofBloodId: detail.UnitsofBloodId,
      BloodRequestDate: selectedDate,
      RequestTime: selectedTime,
      Purpose: detail.Purpose,
      Typesofblood: detail.Typesofblood,
      requestid: 1,
      StateId: detail.StateId,
      DistrictId: detail.DistrictId,
      CityId: detail.CityId,
      newStatename: detail.newStatename,
      newDistrictname: detail.newDistrictname,
      newCityname: detail.newCityname,
      HospitalName: detail.HospitalName,
      HsptName: detail.HospitalName,
      HospitalAddress: detail.HospitalAddress,
      ContactPerson: detail.ContactPerson,
      ContactMobile: detail.ContactMobile,
      Pincode: detail.Pincode,
      Receiptimage: detail.Receiptimage,
      Requestedby: this.UserDetails[0].RegId,
      latitude: detail.Latitude,
      longitude: detail.Longitude,
      CreatedBy: detail.CreatedBy
    }]
    var UploadFile = new FormData()
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", '2');
    var url = "api/BG/Insert_Update_requestForm";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data == 'SUCCESS') {
        this.nav.navigateForward(['/home'])
        this.general.presentAlert('SUCCESS', 'You have successfully reposted...')
       // window.location.reload();
      }
    });
  }

  closereq(BloodRequestID: any) {
    debugger
    var uploadfile = new FormData();
    uploadfile.append("Param1", BloodRequestID);
    var url = "api/BG/BloodRequestClosed";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.general.presentAlert("Update", 'Your Request Details Updated')
      this.requestdata();
    })
  }

  openrequestfilt() {
    this.opendata = [];
    this.openreqdata = this.opendata.filter((t: any) => t.ApprovalStatus == 4)
  }

  updateMapLocation(lat: number, lng: number) {
    const location = new google.maps.LatLng(lat, lng);
    this.map.setCenter(location);
    this.map.setZoom(15);
  }

 
  setTab(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
      this.closeDrawer(); // Close any open drawer when switching tabs

      // Reset repost calendar visibility when switching tabs
      this.rpd = null;
      this.flags = null;
    }

    if (tab === 'open') {
      this.loaders(tab);
    } else if (tab === 'closed') {
      this.loaders(tab);
    }
  }

  async loaders(tabs: any) {
    const loading = await this.loadingController.create({
      translucent: true,
      duration: 1000
    });

    try {
      if (tabs == 'open') {
        this.requestdata();
      }
      else {
        this.closedata();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await loading.dismiss();
    }
  }

  async loaders1(tabs: any) {
    const loading = await this.loadingController.create({
      translucent: true,
      duration: 1000
    });

    try {
      if (tabs == 'open') {
        this.requestdata();
      }
      else {
        this.closedata();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await loading.dismiss();
    }
  }

  requestdata() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", '1');
    uploadfile.append("Param2", this.UserDetails[0].RegId);
    var url = "api/BG/Get_USERrequest_Closedrequest_Idbased";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.OpenFlag = 1;
      this.ClosedFlag = 0;
      this.opendata = data;

      if (this.opendata != "") {
        this.opendata.forEach((item: any, index: any) => {
          item.subIndexName = this.getIndexName(index);
          item.DonorFlag = 1;
          this.closed = true
        });
      } else if (this.opendata.length == 0) {
        this.closed = false
        this.msg = "You don't have any open requests"
      }
    })
  }

  closedata() {
    var uploadfile = new FormData();
    uploadfile.append("Param1", '2');
    uploadfile.append("Param2", this.UserDetails[0].RegId);
    var url = "api/BG/Get_USERrequest_Closedrequest_Idbased";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.OpenFlag = 0;
      this.ClosedFlag = 1;
      this.ClosedData = data;     
      if (data == "") {
        this.closed = false;
        this.msg = "You don't have any closed requests"
      }
      else if (this.ClosedData != "") {
        this.ClosedData.forEach((item: any, index: any) => {
          item.subIndexName = this.getIndexName(index);
          item.DonorFlag = 1;
          this.closed = true
        });
      } else if (this.ClosedData.length == 0) {
        this.closed = false;
        this.msg = "You don't have any closed requests"
      }
    })
  }

  GetBloodRequestDetails(Val: any) {
    this.opend = 1
    this.selecd = Val
    var UploadFile = new FormData();
    UploadFile.append("Param", Val);
    var url = "api/BG/Get_Requestbasedon_presonID";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.BloodRequestDetalis = data;
    })
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
          case 1:
            return `${index + 1}st`;
          case 2:
            return `${index + 1}nd`;
          case 3:
            return `${index + 1}rd`;
          default:
            return `${index + 1}th`;
        }
      }
    }
  }

  shareRequest(obj: any) {
    const detail = this.BloodRequestDetalis.find((x: any) => x.RegId === obj.RegId || x.UdId === obj.UdId);

    if (!detail) {
      console.warn('Matching detail not found');
      return;
    }
    const message = `Blood Request Details
  ----------------------
    City: ${obj.CityName}
    Blood Group: ${obj.BLGName}
    Date: ${obj.BloodRequestDate}
    Patient: ${detail.FullName || 'N/A'}
    Age: ${detail.Age || 'N/A'} yrs
    Gender: ${detail.Gender || 'N/A'}
    Type: ${detail.Typesofblood || 'N/A'}
    Units Needed: ${detail.UnitsofBlood || 'N/A'}
    Required Date: ${detail.BloodRequestDate} ${detail.RequestTime}
    Reason: ${detail.Purpose || 'N/A'}
    Contact: ${detail.ContactPerson} (${detail.ContactMobile})
    Hospital: ${detail.HospitalName || 'N/A'}
    Address: ${detail.HospitalAddress || 'N/A'}`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
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
