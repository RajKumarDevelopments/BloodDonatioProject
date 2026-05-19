import { Component, OnInit } from '@angular/core';
//import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-joincampaign',
  templateUrl: './joincampaign.page.html',
  styleUrls: ['./joincampaign.page.scss'],
})
export class JoincampaignPage implements OnInit {
  UserDetails1: any; UserDetails: any;
  Rolestatus: any;

  constructor(public general: GeneralService, /*private socialSharing: SocialSharing*/) {
    
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    if (this.UserDetails != null) {
      if (this.UserDetails[0].Rolestatus == true) {
        this.Rolestatus = true;
      }
    }
    
  }

  ngOnInit() {
  }
    async InviteFrinds() {
      const text = "Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it’s giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe.";
      const image = "https://letshelp.breakingindiaapp.com/webservices/Image/logo.png";
      const shareUrl = "https://letshelp.breakingindiaapp.com";

      try {
        await Share.share({
          title: 'Lets Help',
          text: text,
          url: shareUrl,  // Capacitor's share API doesn't support sharing images directly. Include a URL to the image if necessary.
          dialogTitle: 'Share with your friends'
        });
      } catch (error) {
        //this.general.presentToast("Please check your connection: " + error);
      }
    }


}
