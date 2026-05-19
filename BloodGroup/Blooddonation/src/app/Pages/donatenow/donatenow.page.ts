import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-donatenow',
  templateUrl: './donatenow.page.html',
  styleUrls: ['./donatenow.page.scss'],
})
export class DonatenowPage implements OnInit {

  constructor(private navCtrl: NavController, public general: GeneralService, private socialSharing: SocialSharing) { }

  ngOnInit() {
  }


  InviteFrinds() {
   
    var text = "Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it’s giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe."
    var image = "https://letshelp.breakingindiaapp.com/webservices/Image/logo.png";
    var sahreurl = "https://www.google.com/";
    this.socialSharing.share(text, 'Lets Help', image, sahreurl).then((obj: any) => {
    }).catch((error: any) => {
      this.general.presentToast("please check your connection" + error)
    });
  }


  back(val: any) {
    this.navCtrl.navigateForward(['/rquestpresentation', { id: val }])
  }
}
