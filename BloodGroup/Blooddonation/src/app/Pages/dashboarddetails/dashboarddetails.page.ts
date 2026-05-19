import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController, IonAccordionGroup } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-dashboarddetails',
  templateUrl: './dashboarddetails.page.html',
  styleUrls: ['./dashboarddetails.page.scss'],
})
export class DashboarddetailsPage implements OnInit {
  values: any; donorslist: any; UserDetails: any; userdetail: any;
  accordionState: any; opend: any; name: any;
  mydonors: any; presntationlist: any; presntationlist2:any
    presntationlist1: any;
  stat: any;
  openIndex: number = -1;
  activeAccordion: number | null = null;
  @ViewChild('accordionGroup1', { static: false }) accordionGroup1!: IonAccordionGroup;
  @ViewChild('accordionGroup2', { static: false }) accordionGroup2!: IonAccordionGroup;
  @ViewChild('accordionGroup3', { static: false }) accordionGroup3!: IonAccordionGroup;
  @ViewChild('accordionGroup4', { static: false }) accordionGroup4!: IonAccordionGroup;
  @ViewChild('accordionGroup5', { static: false }) accordionGroup5!: IonAccordionGroup;
  @ViewChild('accordionGroup6', { static: false }) accordionGroup6!: IonAccordionGroup;
  @ViewChild('accordionGroup7', { static: false }) accordionGroup7!: IonAccordionGroup;
  Expirydays1: any; Expirydays: any;
  expiryEmailstatus: any; expiryNotificationstatus: any;
  expirySmsstatus: any; expiryCallstatus: any;
  expiryWhatsappstatus: any;
  acceptlist: any;
  leadrefslist: any;
  donorreflist: any;
  boucherlist: any

  constructor(public activeRoute: ActivatedRoute, public general: GeneralService,) {
    this.values = this.activeRoute.snapshot.paramMap.get("id");
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
    if (this.values == 1) {
      this.name = 'My Donors';
      this.Getreg();
    }
    else if (this.values == 2) {
      this.name = 'My Donations';
      this.mydonation();
    }
    else if (this.values == 3) {
      this.name = 'My Presentations';
      this.mypresantation();
    }
    else if (this.values == 4) {
      this.name = 'My Donor References';
      this.myDonerRef();
    }
    else if (this.values == 5) {
      this.name = 'Banner Downloads';
      this.myBanners();
    }
    else if (this.values == 6) {
      this.name = 'Accepted Requests';
      this.myAccepted();
    }
    else if (this.values == 7) {
      this.name = 'My References';
      this.myLeadRef();
    }

  }

  ngOnInit() {
    //this.accordionState = new Array(this.mydonors.length).fill(false);
  }
  

  Getreg() {
    var obj = [{
      CreatedBy: this.UserDetails[0].RegId,
      Reffercode: this.UserDetails[0].Reffercode
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/Register_User_Curd";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.donorslist = data;
      this.mydonors = this.donorslist.filter((my: any) => my.FullName != this.UserDetails[0].FullName)
      this.accordionState = Array(this.donorslist.length).fill(false);
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }

  mydonation() { 
    var UploadFile = new FormData(); 
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", '1');
    var url = "api/BG/DashBoardDetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.donorslist = data;
      this.accordionState = Array(this.donorslist.length).fill(false);
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  mypresantation() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", "1");
    UploadFile.append("Param3", this.UserDetails[0].RegId);
    var url = "api/BG/Get_RequestPresentation";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.presntationlist = data;
      this.presntationlist1 = this.presntationlist.filter((flt: any) => flt.CreatedBy == this.UserDetails[0].RegId)
      this.presntationlist2 = this.presntationlist1
      this.accordionState = Array(this.presntationlist1.length).fill(false);
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }

  

  onAccordionChange(event: any) {
    const value = event?.detail?.value;
    if (value === null || value === undefined || value === '') {
      this.activeAccordion = null;
      return;
    }
    const index = parseInt(value, 10);
    if (!isNaN(index)) {
      this.activeAccordion = index;
    }
  }

  closeAccordion() {
    this.activeAccordion = null;
    if (this.accordionGroup1) this.accordionGroup1.value = null;
    if (this.accordionGroup2) this.accordionGroup2.value = null;
    if (this.accordionGroup3) this.accordionGroup3.value = null;
    if (this.accordionGroup4) this.accordionGroup4.value = null;
    if (this.accordionGroup5) this.accordionGroup5.value = null;
    if (this.accordionGroup6) this.accordionGroup6.value = null;
    if (this.accordionGroup7) this.accordionGroup7.value = null;
  }

  myAccepted() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", '6');
    var url = "api/BG/DashBoardDetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.acceptlist = data;
      // Reset accordion state for fresh data
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    });
  }

  myLeadRef() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", '7');
    var url = "api/BG/DashBoardDetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.leadrefslist = data;
      this.accordionState = Array(this.donorslist.length).fill(false);
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  myDonerRef() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", '4');
    var url = "api/BG/DashBoardDetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.donorreflist = data;
      this.accordionState = Array(this.donorslist.length).fill(false);
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  myBanners() {
    var UploadFile = new FormData();
    UploadFile.append("Param1", this.UserDetails[0].RegId);
    UploadFile.append("Param2", '5');
    var url = "api/BG/DashBoardDetails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.boucherlist = data;
      this.accordionState = Array(this.donorslist.length).fill(false);
      this.activeAccordion = null;
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
}
