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
  Count: any;
  BloodAcceptedDetalis: any;
  constructor(public general: GeneralService, private loadingController: LoadingController, private nav: NavController, private alertController: AlertController) {
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
    // Initialization logic if any
  }

  ionViewWillEnter() {
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
  async closereq(BloodRequestID: any, Name: string, BloodRequestDate: string) {
    const reqId = BloodRequestID || (this.BloodRequestDetalis && this.BloodRequestDetalis[0] ? (this.BloodRequestDetalis[0].BloodRequestID || this.BloodRequestDetalis[0].UdId) : this.selecd);
    const patientName = Name || (this.BloodRequestDetalis && this.BloodRequestDetalis[0] ? (this.BloodRequestDetalis[0].FullName || this.BloodRequestDetalis[0].patientname) : '');
    const requestDate = BloodRequestDate || (this.BloodRequestDetalis && this.BloodRequestDetalis[0] ? this.BloodRequestDetalis[0].BloodRequestDate : '');

    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'Are you sure you want to close this request?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            // Cancel/revoke the action and keep request unchanged
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // Send cancellation notifications to all accepted users
            this.sendCloseNotifications(reqId, patientName, requestDate);

            var uploadfile = new FormData();
            uploadfile.append("Param1", reqId);
            var url = "api/BG/BloodRequestClosed";
            this.general.PostData(url, uploadfile).subscribe((data: any) => {
              this.general.presentAlert("Update", 'Your Request Details Updated');
              this.requestdata();
            });
          }
        }
      ]
    });

    await alert.present();
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
      if (this.BloodRequestDetalis && this.BloodRequestDetalis.length > 0) {
        const reqId = this.BloodRequestDetalis[0].BloodRequestID || this.BloodRequestDetalis[0].UdId || Val;
        this.GetAcceptedCount(reqId);
        this.GetAcceptedUsers(reqId);
      }
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
  goToSearchLocation() {
    this.nav.navigateForward('/searchlocation');
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
  GetAcceptedCount(Val: any) {
    var UploadFile = new FormData();
    UploadFile.append("Param1", Val);
    UploadFile.append("Param2", '2');
    UploadFile.append("Param3", '1');
    var url = "api/BG/BloodAcceptedUser";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Count = data;
    });
  }
  GetAcceptedUsers(Val: any, callback?: (data: any[]) => void) {
    var UploadFile = new FormData();
    UploadFile.append("Param1", Val);
    UploadFile.append("Param2", '1');
    UploadFile.append("Param3", '1');
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
      this.BloodAcceptedDetalis = Array.isArray(parsedData) ? parsedData : (parsedData ? [parsedData] : []);
      console.log('Accepted Users:', this.BloodAcceptedDetalis);
      if (callback) {
        callback(this.BloodAcceptedDetalis);
      }
    }, (error: any) => {
      console.error('Error in GetAcceptedUsers:', error);
      if (callback) {
        callback(this.BloodAcceptedDetalis || []);
      }
    });
  }

  sendCloseNotifications(reqId: any, Name: string, BloodRequestDate: string) {
    this.GetAcceptedUsers(reqId, (users: any[]) => {
      const acceptedUsers = Array.isArray(users) && users.length > 0
        ? users
        : (Array.isArray(this.BloodAcceptedDetalis) ? this.BloodAcceptedDetalis : []);

      if (!acceptedUsers || acceptedUsers.length === 0) {
        console.log('No accepted users to notify for request:', reqId);
        return;
      }

      // Deduplicate users by ID so each user receives only one notification
      const uniqueUsers: any[] = [];
      const seenUserIds = new Set<string>();

      acceptedUsers.forEach((user: any) => {
        const uid = (user.AcceptBy || user.RegId || user.RegID || user.regId || '').toString();
        if (uid) {
          if (!seenUserIds.has(uid)) {
            seenUserIds.add(uid);
            uniqueUsers.push(user);
          }
        } else {
          uniqueUsers.push(user);
        }
      });

      console.log(`Sending cancel notifications to ${uniqueUsers.length} accepted users:`, uniqueUsers);

      const dbNotifications: any[] = [];

      uniqueUsers.forEach((user: any) => {
        const fullName = (user.FullName || user.fullname || user.Name || user.name || '').toString().trim();
        let displayDate = BloodRequestDate || '';
        try {
          if (displayDate) {
            const d = new Date(displayDate);
            if (!isNaN(d.getTime())) {
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              displayDate = `${day}/${month}/${year}`;
            }
          }
        } catch (e) {
          displayDate = BloodRequestDate;
        }

        const message = fullName
          ? `Dear ${fullName}, your accepted blood donation request for ${Name || 'patient'}, dated ${displayDate}, has been closed.`
          : `Your accepted blood donation request for ${Name || 'patient'}, dated ${displayDate}, has been closed.`;

        const deviceToken = user.DeviceToken || user.Devicetoken || user.devicetoken || user.DeviceId || user.deviceId;
        const recipientId = user.AcceptBy || user.RegId || user.RegID || user.regId;

        // 1. Send push notification if device token is available
        if (deviceToken) {
          const uploadFile = new FormData();
          uploadFile.append("deviceId", deviceToken);
          uploadFile.append("message", message);
          uploadFile.append("senderName", "BloodGroup");
          uploadFile.append("path", "myrequest");
          uploadFile.append("Img", "");

          const notificationUrl = "api/BG/sendNotification";
          this.general.PostData(notificationUrl, uploadFile).subscribe(
            (res: any) => {
              console.log('Push notification sent to:', fullName, res);
            },
            (error: any) => {
              console.error('Error sending push notification:', error);
            }
          );
        }

        // 2. Prepare in-app notification in database
        if (recipientId) {
          dbNotifications.push({
            RegID: recipientId,
            NotiRecevieID: recipientId,
            NotificationsDesc: message,
            CreatedBy: this.UserDetails && this.UserDetails[0] ? this.UserDetails[0].RegId : 0
          });
        }
      });

      // Insert all in-app notifications in database in bulk
      if (dbNotifications.length > 0) {
        const notificationsUploadFile = new FormData();
        notificationsUploadFile.append("Param", JSON.stringify(dbNotifications));
        notificationsUploadFile.append("Flag", "1");
        const notificationsUrl = "api/BG/Crud_Notifications";

        this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(
          (data: any) => {
            console.log('Notification records saved for accepted users:', data);
          },
          (error: any) => {
            console.error('Error saving notifications in db:', error);
          }
        );
      }
    });
  }

  sendCloseNotificationToUser(user: any, Name: string, BloodRequestDate: string) {
    const fullName = (user.FullName || user.fullname || user.Name || user.name || '').toString().trim();
    let displayDate = BloodRequestDate || '';
    try {
      if (displayDate) {
        const d = new Date(displayDate);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          displayDate = `${day}/${month}/${year}`;
        }
      }
    } catch (e) {
      displayDate = BloodRequestDate;
    }

    const message = fullName
      ? `Dear ${fullName}, your accepted blood donation request for ${Name || 'patient'}, dated ${displayDate}, has been closed.`
      : `Your accepted blood donation request for ${Name || 'patient'}, dated ${displayDate}, has been closed.`;
    const deviceToken = user.DeviceToken || user.Devicetoken || user.devicetoken || user.DeviceId || user.deviceId;
    const recipientId = user.AcceptBy || user.RegId || user.RegID || user.regId;

    // 1. Send push notification if device token is available
    if (deviceToken) {
      const uploadFile = new FormData();
      uploadFile.append("deviceId", deviceToken);
      uploadFile.append("message", message);
      uploadFile.append("senderName", "BloodGroup");
      uploadFile.append("path", "myrequest");
      uploadFile.append("Img", "");

      const notificationUrl = "api/BG/sendNotification";
      this.general.PostData(notificationUrl, uploadFile).subscribe(
        (res: any) => {
          console.log('Push notification sent to:', fullName, res);
        },
        (error: any) => {
          console.error('Error sending push notification:', error);
        }
      );
    }

    // 2. Insert in-app notification in database
    if (recipientId) {
      const notifArr = [{
        RegID: recipientId,
        NotiRecevieID: recipientId,
        NotificationsDesc: message,
        CreatedBy: this.UserDetails && this.UserDetails[0] ? this.UserDetails[0].RegId : 0
      }];

      const notificationsUploadFile = new FormData();
      notificationsUploadFile.append("Param", JSON.stringify(notifArr));
      notificationsUploadFile.append("Flag", "1");
      const notificationsUrl = "api/BG/Crud_Notifications";

      this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe(
        (data: any) => {
          console.log('Notification record saved for:', fullName, data);
        },
        (error: any) => {
          console.error('Error saving notification in db:', error);
        }
      );
    }
  }
  getValidCount() {
    if (this.Count === null || this.Count === undefined || this.Count === '') return 0;
    if (Array.isArray(this.Count)) {
      if (this.Count.length > 0) {
        return this.Count[0].AcceptedCount || this.Count[0].Accepted || this.Count[0].Count || 0;
      }
      return 0;
    }
    return this.Count;
  }
  goToDetails(item: any) {
    this.nav.navigateForward('/requestaccepteddetails', {
      queryParams: {
        BloodRequestedId: item.BloodRequestID || item.UdId || this.selecd
      }
    });
  }


}
