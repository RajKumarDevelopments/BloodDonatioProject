import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { NavController, ModalController } from '@ionic/angular';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { NotificationcountService } from '../../Services/notificationcount/notificationcount.service';
import { PushnotificationService } from '../../Services/push/pushnotification.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-usercontrol',
  templateUrl: './usercontrol.page.html',
  styleUrls: ['./usercontrol.page.scss'], 
})
export class UsercontrolPage implements OnInit {
  TwoLimit: any;
  ThreeLimit: any; four: any;
  selcecttwo: any;
  UserDetails: any; UserDetails1: any;
  emailstatus: any; phnthreelabl: any; whats: any;
  labl: any; threelabl: any; adthreelabl: any; twmsg: any;
  adwhts: any;
  selectedLimit: any;
  selectedFrequency: any;
  selectedOption: any;
  startDate: any;
  endDate: any;
  users: any;
  roleid: any;
  myexpiris: any;
  timesperiod: any;
    AdminWhatsAppMessagesstatus: any;
    AdminWhatsAppMessages: any;
    WhatsAppMessagesstatus: any;
    WhatsAppMessages: any;
    Notificationsstatus: any;
    Notifications: any;
    PhoneCallsstatus: any;
    Administrativemessagesstatus: any;
    LeaderNotificationsstatus: any;
  NotificationPreferencestatus: any;
  expirystatus: any;
    WeeklyTimes2: any;
    MonthlyTimes2: any;
    dailyTimes2: any;
    onedayTimes2: any;
    UnlimiteTimes2: any;
    SMS: any;
    whatsapp: any;
    Notification: any;
    Call: any;
    Email: any;
    AdminSMS: any;
    DonorSMS: any;
    LeardeSMS: any;
    Adminwhatsapp: any;
    Donorwhatsapp: any;
    Learderwhatsapp: any;
    AdminNotification: any;
    DonorNotification: any;
    LeardeNotification: any;
    AdminCall: any;
    DonorCall: any;
    LearderCall: any;
    LearderNotification: any;
    AdminEmail: any;
    DonorEmail: any;
    LearderEmail: any;
  val: any;

  Communication: any[] = [];
  Communicationn: any;
  showCommDrawer = false;
  selectedChannel: string = '';

  selectedTypes = {
    notification: { name: '', id: 0 },
    whatsapp: { name: '', id: 0 },
    call: { name: '', id: 0 }
  };
  communicationId: number = 0; 
  isUpdateMode: boolean = false;
  toggleValue: boolean = false;  // or true by default

  constructor(private toastController: ToastController,private notificationService: PushnotificationService, private notificationsService: NotificationcountService, public generalservice: GeneralService, public NavCrtl: NavController, private modal: ModalController) {
    // this.UserDetails = JSON.parse(localStorage.getItem("UserDetails"));
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    if (this.UserDetails[0].Status == false) {
      //  this.generalservice.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    }
    //this.TwoLimit = [
    //  { value: '1', label: 'Weekly' },
    //  { value: '2', label: 'Do not limit receiving messages' }
    //]

    //this.ThreeLimit = [
    //  { value: '1', label: 'Weekly' },
    //  { value: '2', label: 'Monthly' },
    //  { value: '3', label: 'Do not limit receiving messages' },
    //  { value: '4', label: 'Off' }
    //]

    //this.four = [
    //  { value: '1', label: 'oneday' },
    //  { value: '2', label: 'Weekly' },
    //  { value: '3', label: 'daily' },
    //  { value: '4', label: 'monthly' }
    //]

  }

  ngOnInit() {
    this.getCommunicationpref();
  }
  //turnOffNotifications(interval: 'oneday' | 'oneweek' | 'daily' | 'monthly') {
  //  this.notificationService.scheduleNotification(interval);
  //}

  //onThreeLimitChange(value: any) {
  //  this.selectedOption = value;

  //  switch (this.selectedOption) {
  //    case 1:
  //      this.notificationsService.scheduleTwiceWeeklyNotification();
  //      this.modal.dismiss();

  //      break;
  //    case 2:
  //      this.notificationsService.scheduleMonthlyNotification();
  //      this.modal.dismiss();

  //      break;
  //    case 3:
  //      this.notificationsService.cancelAllNotifications(); // Stop notifications
  //      console.log('User selected not to limit receiving messages');
  //      this.modal.dismiss();

  //      break;
  //    default:
  //      console.log('No valid option selected');
  //  }
  //}

  //onLimitChange(value: any) {
    
  //  this.selectedFrequency = value;

  //  // Schedule notifications based on selected frequency
  //  //this.selectedOption = value;

  //  switch (this.selectedFrequency) {
  //    case 1:
  //      this.notificationsService.scheduleWeeklyNotification();
  //      this.modal.dismiss();

  //      break;
  //    case 2:
  //      this.notificationsService.cancelAllNotifications(); // Stop notifications
  //      console.log('User selected not to limit receiving messages');
  //      this.modal.dismiss();

  //      break;
  //    default:
  //      console.log('No valid option selected');
  //  }
  //}

  //// Cancel all scheduled notifications
  //cancelNotifications() {
  //  this.notificationsService.cancelAllNotifications();
  //}
  //SelectThree(val: any, lable: any, id: any) {
    
  //  if (id == 3) {
  //    this.threelabl = lable
  //    this.roleid = 1
  //    this.NotificationPreferencestatus = lable;
  //    this.onThreeLimitChange(id);
  //    this.getDateRange(lable, id);

  //  }
  //  else if (id == 4) {
  //    this.adthreelabl = lable
  //    this.LeaderNotificationsstatus = lable;
  //    this.roleid = 4

  //    this.onThreeLimitChange(id);
  //    this.getDateRange(lable, id);

      
  //  }
  //  else if (id == 1) {
  //    this.phnthreelabl = lable
  //    this.Administrativemessagesstatus = lable;
  //    this.roleid = 1

  //    this.onThreeLimitChange(id);
  //    this.getDateRange(lable, id);


  //  }
  //  else if (id == 7) {
  //    this.whats = lable
  //    this.PhoneCallsstatus = lable;
  //    this.roleid = 2

  //    this.onThreeLimitChange(id);
  //    this.getDateRange(lable, id);


  //  }
  //}

  //SelectTwo(val: any, lable: any, id: any) {
    
  //  if (id == 5) {
  //    this.labl = lable
  //    this.Notifications = val;
  //    this.Notificationsstatus = lable;
  //    this.roleid = 2

  //    this.onLimitChange(id);
  //    this.getDateRange(lable, id);
  //  } else if (id == 6) {
  //    this.adwhts = lable
  //    this.WhatsAppMessages = val;
  //    this.roleid = 2

  //    this.WhatsAppMessagesstatus = lable;

  //    this.onLimitChange(id);
  //    this.getDateRange(lable, id);


  //  }
  //  else if (id == 2) {
  //    this.twmsg = lable
  //    this.AdminWhatsAppMessages = val;
  //    this.AdminWhatsAppMessagesstatus = lable;
  //    this.roleid = 1
  //    this.onLimitChange(id);
  //    this.getDateRange(lable, id);


  //  }

  //} 

  //updatenotifcation() {
    
  //  if (this.labl == 'Off' || this.adthreelabl == 'Off' || this.threelabl == 'Off') {
  //    this.endDate = ''
  //    this.val = 0
  //  }
  //  else if (this.labl == 'Do not limit receiving messages' || this.adthreelabl == 'Do not limit receiving messages' || this.threelabl == 'Do not limit receiving messages') {

  //    this.endDate = this.startDate
  //    this.val = 1

  //  } else {
  //    this.val = 0
  //  }
  //  var uploadfile = new FormData();
  //  uploadfile.append("Param1", this.UserDetails[0].RegId);
  //  uploadfile.append("Param2", this.roleid);
  //  uploadfile.append("Param3", this.endDate);
  //  uploadfile.append("Param4", '1');
  //  uploadfile.append("Param5", '1');
  //  uploadfile.append("Param6", '1');
  //  uploadfile.append("Param7", this.val);
  //  uploadfile.append("Param8", '1');
  //  uploadfile.append("Param9", this.timesperiod);
  //  var url = "api/BG/BG_UserControllersInsert";
  //  this.generalservice.PostData(url, uploadfile).subscribe((data: any) => {
  //    if (data == 'SUCCESS') {
  //      this.generalservice.presentAlert("Update", 'Notification Status Updated Successfully');

  //      this.modal.dismiss();
  //    }
  //    else {
  //      //this.generalservice.presentAlert("ERROR", 'Some thing went wrong');
  //    }
  //  })

  //}

  //MobileLogin() {
    

  //  let uploadFile = new FormData();
  //  uploadFile.append("Mobile", this.UserDetails[0].Phonenumber || this.UserDetails[0].Email);
  //  var url = 'api/BG/BG_CustomersLoginByStatus';
  //  this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
      
  //    if (result && result.length > 0) {
  //      this.users = result[0]; // Get only the first item if array has values
  //      localStorage.setItem("UserDetails1", JSON.stringify(this.users));
  //      localStorage.setItem("UserDetails", JSON.stringify(this.UserDetails));
  //      this.NavCrtl.navigateForward('/home')
  //      console.log('User Details:', this.users);
  //    } else {
  //      console.warn("No users found in the result.");
  //    }
  //  })
  //}


  //updateemail() {
    
    
  //  if (this.Notifications == 'Off' || this.adthreelabl == 'Off' || this.threelabl == 'Off') {
  //    this.endDate = ''
  //    this.val = 0
  //  }
  //  else if (this.Notifications == 'Do not limit receiving messages' || this.adthreelabl == 'Do not limit receiving messages' || this.threelabl == 'Do not limit receiving messages') {

  //    this.endDate = this.startDate
  //    this.val = 1

  //  } else {
  //    this.val = 0
  //  }
  //  var uploadfile = new FormData();
  //  uploadfile.append("Param1", this.UserDetails[0].RegId);
  //  uploadfile.append("Param2", this.roleid);
  //  uploadfile.append("Param3", this.endDate);
  //  uploadfile.append("Param4", '1');
  //  uploadfile.append("Param5", '1');
  //  uploadfile.append("Param6", '1');
  //  uploadfile.append("Param7", '1');
  //  uploadfile.append("Param8", this.val);
  //  uploadfile.append("Param9", this.timesperiod);

  //  var url = "api/BG/BG_UserControllersInsert";
  //  this.generalservice.PostData(url, uploadfile).subscribe((data: any) => {
  //    if (data == 'SUCCESS') {
  //      this.generalservice.presentAlert("Update", 'Mail Status Updated Successfully');

  //      this.modal.dismiss();
  //    }
  //    else {
  //      //   this.generalservice.presentAlert("ERROR", 'Some thing went wrong');
  //    }
  //  })

  //}


  //updateCallStatus() {
    
  //  if (this.phnthreelabl == 'Off' || this.adthreelabl == 'Off' || this.threelabl == 'Off') {
  //    this.endDate = ''
  //    this.val = 0
  //  }
  //  else if (this.phnthreelabl == 'Do not limit receiving messages' || this.adthreelabl == 'Do not limit receiving messages' || this.threelabl == 'Do not limit receiving messages') {

  //    this.endDate = this.startDate
  //    this.val = 1

  //  } else {
  //    this.val = 0
  //  }
  //  var uploadfile = new FormData();
  //  uploadfile.append("Param1", this.UserDetails[0].RegId);
  //  uploadfile.append("Param2", this.roleid);
  //  uploadfile.append("Param3", this.endDate);
  //  uploadfile.append("Param4", '1');
  //  uploadfile.append("Param5", this.val);
  //  uploadfile.append("Param6", '1');
  //  uploadfile.append("Param7", '1');
  //  uploadfile.append("Param8", '1');
  //  uploadfile.append("Param9", this.timesperiod);

  //  var url = "api/BG/BG_UserControllersInsert";
  //  this.generalservice.PostData(url, uploadfile).subscribe((data: any) => {
  //    if (data == 'SUCCESS') {
  //      this.generalservice.presentAlert("Update", 'Call Status Updated Successfully');

  //      this.modal.dismiss();
  //    }
  //    else {
  //      //   this.generalservice.presentAlert("ERROR", 'Some thing went wrong');
  //    }
  //  })

  //}


  //updateWhatsappStatus() {
    
  //  if (this.whats == 'Off') {
  //    this.endDate = ''
  //  }
  //  var uploadfile = new FormData();
  //  uploadfile.append("Param1", this.UserDetails[0].RegId);
  //  uploadfile.append("Param2", this.roleid);
  //  uploadfile.append("Param3", this.endDate);
  //  uploadfile.append("Param4", '0');
  //  uploadfile.append("Param5", '1');
  //  uploadfile.append("Param6", '1');
  //  uploadfile.append("Param7", '1');
  //  uploadfile.append("Param8", '1');
  //  uploadfile.append("Param9", this.timesperiod);

  //  var url = "api/BG/BG_UserControllersInsert";
  //  this.generalservice.PostData(url, uploadfile).subscribe((data: any) => {
  //    if (data == 'SUCCESS') {
  //      this.generalservice.presentAlert("Update", 'Whatsapp Status Updated Successfully');

  //      this.modal.dismiss();
  //    }
  //    else {
  //      //   this.generalservice.presentAlert("ERROR", 'Some thing went wrong');
  //    }
  //  })

  //}


  //updatesms() {
    
  //  if (this.phnthreelabl == 'Off' || this.adthreelabl == 'Off' || this.threelabl == 'Off') {
  //    this.endDate = ''
  //    this.val = 0
  //  }
  //  else if (this.phnthreelabl == 'Do not limit receiving messages' || this.adthreelabl == 'Do not limit receiving messages' || this.threelabl == 'Do not limit receiving messages') {

  //    this.endDate = this.startDate
  //    this.val = 1

  //  } else {
  //    this.val = 0
  //  }
  //  var uploadfile = new FormData();
  //  uploadfile.append("Param1", this.UserDetails[0].RegId);
  //  uploadfile.append("Param2", this.roleid);
  //  uploadfile.append("Param3", this.endDate);
  //  uploadfile.append("Param4", '1');
  //  uploadfile.append("Param5", '1');
  //  uploadfile.append("Param6", this.val);
  //  uploadfile.append("Param7", '1');
  //  uploadfile.append("Param8", '1');
  //  uploadfile.append("Param9", this.timesperiod);
  //  var url = "api/BG/BG_UserControllersInsert";
  //  this.generalservice.PostData(url, uploadfile).subscribe((data: any) => {
  //    if (data == 'SUCCESS') {
  //      this.generalservice.presentAlert("Update", 'Sms Status Updated Successfully');

  //      this.modal.dismiss();
  //    }
  //    else {
  //      //   this.generalservice.presentAlert("ERROR", 'Some thing went wrong');
  //    }
  //  })

  //}
  //////

  //getDateRange(type: string, id: any): string {
    
  //  let start = new Date(); // Today's date
  //  let endDate = new Date(start);

  //  if (type === "Weekly") {
  //    endDate.setDate(start.getDate() + 7); // Add 7 days
  //  } else if (type === "Monthly") {
  //    endDate.setMonth(start.getMonth() + 1); // Add 1 month
  //  }
  //  this.startDate = this.formatDate(start);
  //  this.endDate = this.formatDate(endDate);
  //  this.timesperiod = type
  //  console.log('dates:', this.startDate)
  //  console.log('dates2:', this.endDate)
  //  if (id == 5 || id == 4 || id == 3) {
  //    this.updatenotifcation();

  //  }
  //  else if (id == 1) {
  //    this.updatesms()
  //  }
  //  else if (id == 6 || id == 2) {
  //    this.updateWhatsappStatus()
  //  } else {
  //    this.updateCallStatus();

  //  }
  //  return `${this.formatDate(start)} to ${this.formatDate(endDate)}`;


  //}


  //getMonthlyDates(startDate: Date, months: number): Date[] {
  //  let dates: Date[] = [];
  //  let currentDate = new Date(startDate);

  //  for (let i = 0; i < months; i++) {
  //    let monthDate = new Date(currentDate);
  //    monthDate.setDate(1); // 1st of the month
  //    dates.push(new Date(monthDate));

  //    currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
  //  }
  //  return dates;
  //  console.log('date:', dates)

  //}

  getCommunications(channel: string): void {
    this.selectedChannel = channel;
    const url = 'api/BG/Get_CommunicationMaster';
    this.generalservice.GetData(url).subscribe(
      (data: any) => {
        this.Communication = data;
        this.showCommDrawer = true;
      },
      (error) => {
        console.error('Error loading communication master:', error);
      }
    );
  }

  selectCommunication(item: any): void {
    if (this.selectedChannel === 'notification') {
      this.selectedTypes.notification = { name: item.CommTypeName, id: item.CommTypeId };
    } else if (this.selectedChannel === 'whatsapp') {
      this.selectedTypes.whatsapp = { name: item.CommTypeName, id: item.CommTypeId };
    } else if (this.selectedChannel === 'call') {
      this.selectedTypes.call = { name: item.CommTypeName, id: item.CommTypeId };
    }

    this.showCommDrawer = false;
    this.selectedChannel = '';
  }


  closeDrawer(): void {
    this.showCommDrawer = false;
  }
  getCommunicationpref() {
    
    const formData = new FormData();
    formData.append('Param1', this.UserDetails[0]?.RegId);

    const url = 'api/BG/Get_UserCommunicationPref';
    this.generalservice.PostData(url, formData).subscribe(
      (data: any) => {
        
        if (data && data.length > 0 && data[0].UserId) {
          const pref = data[0];
          this.Communicationn = pref;
          this.isUpdateMode = true; //set to update mode
          this.toggleValue = pref.Status; // true or false from backend
          // Fetch all communication types
          this.generalservice.GetData('api/BG/Get_CommunicationMaster').subscribe(
            (options: any[]) => {
              this.Communication = options;

              const getNameById = (id: number): string => {
                const match = options.find(opt => opt.CommTypeId === id);
                return match ? match.CommTypeName : '';
              };

              this.selectedTypes.call = {
                id: pref.PhoneCallFreq,
                name: getNameById(pref.PhoneCallFreq)
              };

              this.selectedTypes.whatsapp = {
                id: pref.WhatsAppFreq,
                name: getNameById(pref.WhatsAppFreq)
              };

              this.selectedTypes.notification = {
                id: pref.NotificationFreq,
                name: getNameById(pref.NotificationFreq)
              };
            }
          );
        } else {
          this.isUpdateMode = false; //insert mode
        }
      },
      (error) => {
        console.error('Error loading communication preferences:', error);
      }
    );
  }



  savePreferences(): void {
    
    if (
      !this.selectedTypes.call?.id ||
      !this.selectedTypes.whatsapp?.id ||
      !this.selectedTypes.notification?.id
    ) {
      this.presentToastt('Please select all communication preferences.', 'warning');
      return;
    }

    const preferences = {
      CommunicationID: this.Communicationn?.CommunicationID || 0,
      UserId: this.UserDetails[0]?.RegId || 0,
      PhoneCallFreq: this.selectedTypes.call.id,
      WhatsAppFreq: this.selectedTypes.whatsapp.id,
      NotificationFreq: this.selectedTypes.notification.id,
      SMSFreq: 1,
      Status: this.toggleValue,
      CreatedBy: this.UserDetails[0]?.RegId || 0,
      ModifiedBy: this.UserDetails[0]?.RegId || 0
    };

    const formData = new FormData();
    formData.append('Param', JSON.stringify([preferences]));
    formData.append('Flag', this.isUpdateMode ? '2' : '1'); //Set based on UserId

    this.generalservice.PostData('api/BG/Crud_UserCommunicationPreferences', formData).subscribe(
      (res: any) => {
        this.presentToast('Preferences saved successfully!', 'success');
        this.getCommunicationpref(); // Refresh
      },
      (err) => {
        console.error(err);
        this.presentToast('Error saving preferences!', 'danger');
      }
    );
  }


 


  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // e.g., "2025-07-09"
  }

 
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      color: color
    });

    await toast.present();
  }
  async presentToastt(message: string, color: string = 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'custom-toast' // 👈 Custom class
    });

    await toast.present();
  }
  onToggleChange(event: any) {
    this.toggleValue = event.detail.checked;  
  }

}
