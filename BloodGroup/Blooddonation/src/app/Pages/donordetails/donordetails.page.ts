import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { IonModal, ModalController, NavController, } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-donordetails',
  templateUrl: './donordetails.page.html',
  styleUrls: ['./donordetails.page.scss'],
})
export class DonordetailsPage implements OnInit {


  @ViewChild('reportModal') reportModal!: IonModal;
  @ViewChild('accordionGroup', { static: false }) accordionGroup!: any;

  activeAccordion: number | null = null;
  Observationlist: any;
  Observationlist1: any;
  FilterObject: any; FilterObject1: any;
  selectedObservation: any;
  comments: any;
  closeReportModal: any;
  FilterData: any;
  FilterData1: any;
  FilterDataLength: any;
  State: any; District: any; City: any;
  Pincode: any; BloodGroup: any;
  searchValue: any;
  selectedPlace: any;
  isClosed: boolean = false;
  ObsID: any;
  items = [];
  openIndex: number = -1;
  // FilterData: any[] = []; // Ensure FilterData is properly typed
  accordionState: boolean[] = [];
  selectedId: any; //accordionState: any;
  UserDetails1: any;
  UserDetails: any;
  Expirydays1: any; Expirydays: any;
  expiryEmailstatus: any; expiryNotificationstatus: any;
  expirySmsstatus: any; expiryCallstatus: any;
  expiryWhatsappstatus: any;
  reportedUser: any = null;
  Allow: boolean = true;
  restrictionMessage: string = '';
  PermanentBlocked: boolean = false;
  isPermanentBlocked: boolean = false;
  constructor(private modal: ModalController, public navCtrl: NavController, private alertController: AlertController, public general: GeneralService, public activeRoute: ActivatedRoute, private toastController: ToastController,) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);

    this.FilterObject1 = this.activeRoute.snapshot.paramMap.get("FilterObject");
    this.FilterObject = JSON.parse(this.FilterObject1);
    if (this.FilterObject != null) {
      if (this.FilterObject[0].State == undefined) {
        this.State = "";
      } else {
        this.State = this.FilterObject[0].State;
      }
      if (this.FilterObject[0].District == undefined) {
        this.District = "";
      } else {
        this.District = this.FilterObject[0].District;
      }
      if (this.FilterObject[0].City == undefined) {
        this.City = "";
      } else {
        this.City = this.FilterObject[0].City;
      }
      if (this.FilterObject[0].Pincode == undefined) {
        this.Pincode = "";
      } else {
        this.Pincode = this.FilterObject[0].Pincode;
      }
      if (this.FilterObject[0].BloodGroup == undefined) {
        this.BloodGroup = "";
      } else {
        this.BloodGroup = this.FilterObject[0].BloodGroup;
      }
    } else {
      this.State = ""; this.District = ""; this.City = ""; this.Pincode = ""; this.BloodGroup = "";
    }


    this.Expirydays1 = localStorage.getItem("Expiry");
    this.Expirydays = JSON.parse(this.Expirydays1);
    if (this.Expirydays) {
      this.expiryEmailstatus = this.Expirydays
        .map((item: any) => item.EmailStatus)
        .filter((status: boolean) => status === true);

      this.expiryNotificationstatus = this.Expirydays
        .map((item: any) => item.NotificationStatus)
        .filter((status: boolean) => status === true);

      this.expirySmsstatus = this.Expirydays
        .map((item: any) => item.SMSStatus)
        .filter((status: boolean) => status === true);

      this.expiryCallstatus = this.Expirydays
        .map((item: any) => item.CallStatus)
        .filter((status: boolean) => status === true);

      this.expiryWhatsappstatus = this.Expirydays
        .map((item: any) => item.WhatsappStatus)
        .filter((status: boolean) => status === true);

    }
  }

  async ngOnInit() {
    this.general.present();
    const isEligible = await this.checkUserEligible();
    this.general.dismiss();
    if (isEligible) {
      this.ApplyFilter();
    }
    this.GetObservations();
  }

  initializeAccordionState(): void {
  }
  toggleAccordion221(index: number) {
    this.general.present();

    this.accordionState[index] = !this.accordionState[index];
    this.general.dismiss();

  }

  onAccordionChange(event: any) {
    const value = event?.detail?.value;
    if (value === null || value === undefined || value === '') {
      this.activeAccordion = null;
      return;
    }
    const index = parseInt(value, 10);
    this.activeAccordion = !isNaN(index) ? index : null;
  }

  toggleAccordion(index: number) {
    if (this.activeAccordion === index) {
      this.activeAccordion = null;
      if (this.accordionGroup) {
        this.accordionGroup.value = null;
      }
    } else {
      this.activeAccordion = index;
      if (this.accordionGroup) {
        this.accordionGroup.value = index.toString();
      }
    }
  }

  open1(state: number) {
    this.activeAccordion = null;
    if (this.accordionGroup) {
      this.accordionGroup.value = null;
    }
  }
  toggleAccordion2(index: number) {
    if (this.openIndex === index) {
      // If the clicked accordion is already open, close it
      this.openIndex = -1;
    } else {
      // Open the clicked accordion and close others
      this.openIndex = index;
    }
  }


  DonorDetails(item: any) {
    item.DonorFlag = 0;
  }
  DonorDetails1(item: any) {
    item.DonorFlag = 1;
  }

  ApplyFilter() {
    var UploadFile = new FormData()
    UploadFile.append("Param1", this.Pincode);
    UploadFile.append("Param2", this.BloodGroup);
    UploadFile.append("Param3", this.UserDetails[0].RegId);
    var url = "api/BG/Get_Searchdetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.FilterData1 = Array.isArray(data) ? data : [];

      this.FilterData = this.FilterData1.filter((fd: any) => fd.RegId != this.UserDetails[0].RegId);
      this.FilterDataLength = this.FilterData.length;
      this.accordionState = Array(this.FilterData.length).fill(false);

      if (this.FilterData && this.FilterData.length > 0) {
        this.FilterData.forEach((item: any, index: any) => {
          item.subIndexName = this.getIndexName(index);
          item.DonorFlag = 1;
        });
      }
    }, err => {
      this.FilterData = [];
      this.FilterData1 = [];
      this.FilterDataLength = 0;
      this.accordionState = [];
      this.general.presentToast("something went wrong");
    })
  }
  isPastDate(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const inputDate = new Date(dateStr);
    const now = new Date();
    return inputDate.getTime() < now.getTime();
  }

  SearchDonors() {
    if (!this.Allow) {
      this.FilterData = [];
      return;
    }
    if (!this.FilterData1) {
      this.FilterData = [];
      return;
    }
    const searchQuery = this.searchValue ? this.searchValue.trim().toLowerCase() : '';
    if (searchQuery === '') {
      this.FilterData = this.FilterData1.filter((fd: any) => fd.RegId != this.UserDetails[0].RegId);
    } else {
      this.FilterData = this.FilterData1.filter((BG: any) => {
        return BG.RegId != this.UserDetails[0].RegId && (
          (BG.FullName && BG.FullName.toLowerCase().includes(searchQuery)) ||
          (BG.BLGName && BG.BLGName.toLowerCase().includes(searchQuery)) ||
          (BG.Phonenumber && BG.Phonenumber.toLowerCase().includes(searchQuery)) ||
          (BG.CityName && BG.CityName.toLowerCase().includes(searchQuery)) ||
          (BG.DistrictName && BG.DistrictName.toLowerCase().includes(searchQuery))
        );
      });
    }
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

  async onCallClick(event: Event, obj: any) {
    event.preventDefault();
    if (!this.Allow) {
      await this.showLimitExpiredAlert(this.restrictionMessage);
      return;
    }

    const isAllowed = await this.Addcount(obj.RegId);
    if (isAllowed) {
      this.updateCommunicationChannel(obj.RegId, 1);
      window.location.href = `tel:${obj.Phonenumber}`;
    }
  }

  async onWhatsAppClick(event: Event, obj: any) {
    event.preventDefault();
    if (!this.Allow) {
      await this.showLimitExpiredAlert(this.restrictionMessage);
      return;
    }

    const isAllowed = await this.Addcount(obj.RegId);
    if (isAllowed) {
      this.updateCommunicationChannel(obj.RegId, 2);
      this.openWhatsApp(obj.Phonenumber);
    }
  }

  openWhatsApp(phone: string): void {
    const url = `https://api.whatsapp.com/send?phone=+91${phone}&text=Hiii&source=&data=`;
    window.open(url, '_blank');
  }


  updateCommunicationChannel(userId: number, channelId: number): void {
    const formData = new FormData();
    formData.append('Param1', userId.toString());
    formData.append('Param2', channelId.toString());

    this.general.PostData('api/BG/Update_CommunicationChannel', formData).subscribe({
      next: (response: any) => {
        console.log('Update Success:', response);
        //this.presentToast('Communication updated: ' + response, 'success');
        this.ApplyFilter();
      },
      error: (error) => {
        console.error('Update Error:', error);
        this.presentToast('Error updating communication', 'danger');
      }
    });
  }
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    toast.present();
  }


  GetObservations() {
    var obj = [{
      RegId: 1,
    }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/BG_Observation_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Observationlist = data;
      this.Observationlist1 = data;

    }, err => {
      this.general.presentToast("something went wrong")
    });
  }



  SearchPlaces() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Observationlist = this.Observationlist1;
    } else {
      this.Observationlist = this.Observationlist1.filter((BG: any) => {
        return (
          BG.Place.toLowerCase().includes(searchQuery)
        );
      });
    }
  }


  submitReport() {
    const storedUser = localStorage.getItem('UserDetails');
    let regId = 0;
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Since it's an array, take the first item
      regId = parsedUser[0]?.RegId || 0;
    }

    if (!this.selectedObservation) {
      this.general.presentToast('Please select an observation');
      return;
    }

    if (!this.comments || !this.comments.trim()) {
      this.general.presentToast('Please enter comments');
      return;
    }
    const obj = [{
      CreatedBy: this.reportedUser.RegId,
      RegId: regId,
      Observation: this.selectedObservation?.ObservationReason || '',
      Comments: this.comments
    }];
    const formData = new FormData();
    formData.append('Param', JSON.stringify(obj));
    formData.append('Flag', '1');
    this.general.PostData('api/BG/Insert_Update_Report', formData).subscribe({
      next: (res: any) => {
        if (res && res !== '') {
          this.general.presentToast('Report submitted successfully');
          this.modal.dismiss();
          this.comments = '';
          this.selectedObservation = null;
        } else {
          this.general.presentToast('Failed to submit report');
        }
      },
      error: (err) => {
        console.error(' Submit report error:', err);
        this.general.presentToast('Error submitting report');
      }
    });
  }




  openReportModal(obj: any) {

    this.reportedUser = obj;   // <-- STORE clicked person here
  }


  closeModal() {
    this.modal.dismiss();
  }

  submitReport1() {
    if (!this.selectedObservation) {
      this.general.presentToast('Please select an observation');
      return;
    }

    if (!this.comments || !this.comments.trim()) {
      this.general.presentToast('Please enter comments');
      return;
    }

    // Prepare object
    const obj = [{
      RegId: 1, // Replace with dynamic RegId if available
      RId: this.selectedObservation.RId,
      Comments: this.comments
    }];

    // Prepare FormData
    const formData = new FormData();
    formData.append('Param', JSON.stringify(obj));
    formData.append('Flag', '1');
    this.general.PostData('api/BG/Insert_Update_Report', formData).subscribe({
      next: (res: any) => {
        if (res && res !== '') {
          this.general.presentToast('Report submitted successfully');
          this.modal.dismiss();
          this.comments = '';
          this.selectedObservation = null;
        } else {
          this.general.presentToast('Failed to submit report');
        }
      },
      error: (err) => {
        console.error('Submit report error:', err);
        this.general.presentToast('Error submitting report');
      }
    });
  }




  selectPlace(val: any) {
    this.ObsID = val.ObsID
    this.selectedPlace = val.ObservationReason;
    this.reg();
  }

  reg() {
    this.modal.dismiss();
  }

  openVenueModal() {
    this.reportModal.present();
  }
  closeVenueModal() {
    this.reportModal.dismiss();
  }


  async Combinedchannel(obj: any) {
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: `Are you sure you want to send a Notification, Mail and SMS to the donor?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Yes',
          handler: async () => {
            await this.sendnotifications(obj);
            await this.sendMail(obj);
            await this.sendSMSToDonor(obj);

            const toast = await this.toastController.create({
              message: 'Notification, SMS & Email sent successfully to the donor.',
              duration: 3000,
              position: 'middle',
              color: 'dark',
              cssClass: 'custom-toast'
            });
            await toast.present();
          }
        }
      ]
    });

    await alert.present();
  }



  sendnotifications(obj: any): Promise<void> {
    return new Promise((resolve) => {
      debugger
      var UploadFile = new FormData();
      UploadFile.append("deviceId", obj.Devicetoken);
      UploadFile.append("message", `Dear ${obj.FullName}, ${this.UserDetails[0].FullName} urgently needs ${obj.BLGName} blood at ${this.UserDetails[0].CityName}. Your help can save a life. Please call: ${this.UserDetails[0].Phonenumber}`);
      UploadFile.append("senderName", "BloodGroup");
      UploadFile.append("path", 'searchdonors');
      UploadFile.append("Img", "");

      var notificationUrl = "api/BG/sendNotification";
      this.general.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
        if (notificationData) {
          var arr = [{
            RegID: this.UserDetails[0].RegId,
            NotiRecevieID: obj.RegId,//Asif
            CreatedBy: this.UserDetails[0].RegId,
            NotificationsDesc: `Dear ${obj.FullName}, ${this.UserDetails[0].FullName} urgently needs ${obj.BLGName} blood at ${this.UserDetails[0].CityName}. Your help can save a life. Please call: ${this.UserDetails[0].Phonenumber}`,
            RouterLink: 'searchdonors',
          }];
          var notificationsUrl = "api/BG/Crud_Notifications";
          var notificationsUploadFile = new FormData();
          notificationsUploadFile.append("Param", JSON.stringify(arr));
          notificationsUploadFile.append("Flag", "1");

          this.general.PostData(notificationsUrl, notificationsUploadFile).subscribe((data: any) => {
            if (data === 'SUCCESS') {
              resolve();
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    });
  }

  sendMail(obj: any): Promise<void> {
    return new Promise((resolve) => {
      var objj = [{
        DonorName: obj.FullName,
        UserName: this.UserDetails[0].FullName,
        Mobile: this.UserDetails[0].Phonenumber,
        FromMail: this.UserDetails[0].Email,
        ToMail: obj.Email,
        BLGName: obj.BLGName,
        CityName: this.UserDetails[0].CityName
      }];
      const uploadfile = new FormData();
      uploadfile.append("Email", JSON.stringify(objj));
      const url = "api/BG/BloodRequestMailtoDonor";
      this.general.PostData(url, uploadfile).subscribe(() => {
        resolve(); // Done
      });
    });
  }

  sendSMSToDonor(obj: any): Promise<void> {
    return new Promise((resolve) => {
      const url = "api/BG/SendSMSToDonors";

      const phone = (this.UserDetails[0]?.Phonenumber || "").toString();
      let fullName = (this.UserDetails[0]?.FullName || "").toString();
      let cityName = (this.UserDetails[0]?.CityName || "").toString();
      const maxLength = 30;
      const reservedForPhone = phone.length + 1;
      const maxFullNameLength = maxLength - reservedForPhone;

      if (fullName.length > maxFullNameLength) {
        fullName = fullName.substring(0, maxFullNameLength);
      }

      const patientNameFull = `${fullName}|${phone}`;

      const smsObj = {
        MobileNo: (obj.Phonenumber || "").toString().substring(0, 30),
        DonorName: (obj.FullName || "").toString().substring(0, 30),
        PatientName: patientNameFull,
        BloodGroup: (obj.BLGName || "").toString().substring(0, 30),
        CityName: (cityName || "").toString().substring(0, 30)
      };

      this.general.PostData(url, smsObj).subscribe(() => {
        console.log("SMS sent successfully");
        resolve();
      });
    });
  }

  async showLimitExpiredAlert(customMsg?: string) {
    const alert = await this.alertController.create({
      header: 'Access Restricted',
      message: customMsg || 'You have reached your donor search limit.',
      buttons: ['OK']
    });
    await alert.present();
  }

  public checkUserEligible(): Promise<boolean> {
    return new Promise((resolve) => {
      var UploadFile = new FormData();
      UploadFile.append("Flag", "1");
      UploadFile.append("UserID", this.UserDetails && this.UserDetails[0] ? this.UserDetails[0].RegId : "");
      UploadFile.append("DonorSearchLimitID", "");
      UploadFile.append("ContactUsRequestID", "");
      UploadFile.append("RequestTypeID", "");
      UploadFile.append("Subject", "");
      UploadFile.append("Description", "");
      UploadFile.append("AdminRemarks", "");
      UploadFile.append("ActionBy", "");
      UploadFile.append("SearchedUserID", "");
      var url = "api/BG/DonorSearchLimit_CRUD";
      this.general.PostData(url, UploadFile).subscribe(
        async (data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            const isAllowed = data[0].IsAllowed === true || data[0].IsAllowed === 'true' || data[0].IsAllowed === 1;
            this.Allow = isAllowed;
            this.restrictionMessage = data[0].Message || 'You have reached your donor search limit.';
            const isBlocked = data[0].PermanentBlocked === true || data[0].PermanentBlocked === 'true' || data[0].PermanentBlocked === 1;
            this.PermanentBlocked = isBlocked;
            this.isPermanentBlocked = isBlocked;
            console.log('checkUserEligible Allow:', this.Allow, 'PermanentBlocked:', this.PermanentBlocked);
            if (!this.Allow) {
              this.FilterData = [];
              this.FilterData1 = [];
            }
            resolve(this.Allow);
          } else {
            this.Allow = false;
            this.PermanentBlocked = false;
            this.isPermanentBlocked = false;
            this.restrictionMessage = 'You have reached your donor search limit.';
            this.FilterData = [];
            this.FilterData1 = [];
            resolve(false);
          }
        },
        async (err) => {
          console.error("checkUserEligible error:", err);
          this.Allow = false;
          this.PermanentBlocked = false;
          this.isPermanentBlocked = false;
          this.FilterData = [];
          this.FilterData1 = [];
          this.general.presentToast("something went wrong");
          resolve(false);
        }
      );
    });
  }

  public Addcount(searchedUserId?: any): Promise<boolean> {
    return new Promise((resolve) => {
      var UploadFile = new FormData();
      UploadFile.append("Flag", "2");
      UploadFile.append("UserID", this.UserDetails && this.UserDetails[0] ? this.UserDetails[0].RegId : "");
      UploadFile.append("DonorSearchLimitID", "");
      UploadFile.append("ContactUsRequestID", "");
      UploadFile.append("RequestTypeID", "");
      UploadFile.append("Subject", "");
      UploadFile.append("Description", "");
      UploadFile.append("AdminRemarks", "");
      UploadFile.append("ActionBy", "");
      UploadFile.append("SearchedUserID", searchedUserId !== undefined && searchedUserId !== null ? searchedUserId.toString() : "");
      var url = "api/BG/DonorSearchLimit_CRUD";
      this.general.PostData(url, UploadFile).subscribe(
        async (data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            const isAllowed = data[0].IsAllowed === true || data[0].IsAllowed === 'true' || data[0].IsAllowed === 1;
            this.Allow = isAllowed;
            this.restrictionMessage = data[0].Message || 'You have reached your donor search limit.';
            const isBlocked = data[0].PermanentBlocked === true || data[0].PermanentBlocked === 'true' || data[0].PermanentBlocked === 1;
            this.PermanentBlocked = isBlocked;
            this.isPermanentBlocked = isBlocked;
            if (!this.Allow) {
              this.FilterData = [];
              this.FilterData1 = [];
              await this.showLimitExpiredAlert(this.restrictionMessage);
            }
            resolve(this.Allow);
          } else {
            this.Allow = false;
            this.PermanentBlocked = false;
            this.isPermanentBlocked = false;
            this.restrictionMessage = 'You have reached your donor search limit.';
            this.FilterData = [];
            this.FilterData1 = [];
            await this.showLimitExpiredAlert(this.restrictionMessage);
            resolve(false);
          }
        },
        async (err) => {
          console.error("Addcount error:", err);
          this.Allow = false;
          this.PermanentBlocked = false;
          this.isPermanentBlocked = false;
          this.FilterData = [];
          this.FilterData1 = [];
          this.general.presentToast("something went wrong");
          resolve(false);
        }
      );
    });
  }

  public Account(searchedUserId?: any): Promise<boolean> {
    return this.Addcount(searchedUserId);
  }

  goToContact() {
    this.navCtrl.navigateForward('/contact');
  }

}
