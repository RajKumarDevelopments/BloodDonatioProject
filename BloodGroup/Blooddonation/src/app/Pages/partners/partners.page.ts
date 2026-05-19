import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Platform, AlertController } from '@ionic/angular';
 
import { ModalController, NavController } from '@ionic/angular';



@Component({
  selector: 'app-partners',
  templateUrl: './partners.page.html',
  styleUrls: ['./partners.page.scss'],
})
export class PartnersPage implements OnInit {
  enquiery: any = [];
  formGroup: any;
  Fullname: any;
  email: any;
  Phonenumber:any;
  Message: any;
  //subject: any;
  //number: any;
  userdetails1: any;
  UserDetails: any;
  constructor(public general: GeneralService, private alertController: AlertController, 
     private modalCtrl: ModalController,
  private navCtrl: NavController,) {
    this.userdetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetails1);
  }

  ngOnInit() {
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  sendmail() {
    
    this.enquiery = [];
    this.enquiery.push({
      FullName: this.UserDetails[0].FullName,
      Email: this.UserDetails[0].Email,
      
      Mobile: this.Phonenumber, //this.UserDetails[0].Email
      Comments: this.Message,

    })
    var uploadfile = new FormData;
    uploadfile.append("Email", JSON.stringify(this.enquiery));
    var url = "api/BG/EnquiryMailTo_Admin";
    this.general.PostData(url, uploadfile).subscribe(data => {

      this.showAlert("SUCCESS", 'Mail sent Successfuly',);
      this.showAlert('SUCCESS',
        'Your Enquiry has been submitted successfully. Our Team will contact you soon.',
      )
        // Close popup (modal)
  this.modalCtrl.dismiss();

  // Navigate to Home
  this.navCtrl.navigateRoot('/home'); // or '/'
    });

  }

}
