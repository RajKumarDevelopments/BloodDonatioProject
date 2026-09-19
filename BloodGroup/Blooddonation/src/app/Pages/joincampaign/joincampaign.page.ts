import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Share } from '@capacitor/share';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-joincampaign',
  templateUrl: './joincampaign.page.html',
  styleUrls: ['./joincampaign.page.scss'],
})
export class JoincampaignPage implements OnInit {
  UserDetails1: any;
  UserDetails: any;
  Rolestatus: any;

  existingRoleId: number = 2;
  isAlreadyLeader: boolean = false;
  leaderModalOpen: boolean = false;
  leaderTermsAccepted: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    public general: GeneralService,
    private alertController: AlertController,
    public navCtrl: NavController
  ) {
    this.loadUserData();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = this.UserDetails1 ? JSON.parse(this.UserDetails1) : null;
    if (this.UserDetails && this.UserDetails[0]) {
      const u = this.UserDetails[0];
      this.existingRoleId = Number(u.RoleId) || 2;
      this.isAlreadyLeader = (this.existingRoleId === 4 || u.Rolestatus === true || u.Rolestatus === 'true' || u.Rolestatus === 1 || u.Rolestatus === '1');
      this.Rolestatus = this.isAlreadyLeader;
    } else {
      this.existingRoleId = 2;
      this.isAlreadyLeader = false;
      this.Rolestatus = false;
    }
  }

  async onJoinAsLeader() {
    if (this.isAlreadyLeader) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Become a Leader',
      message: 'Once you become a Leader, you cannot switch back to becoming a Donor. Do you want to continue?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // Cancelled
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.leaderModalOpen = true;
            this.leaderTermsAccepted = false;
          }
        }
      ]
    });
    await alert.present();
  }

  acceptLeaderTerms() {
    if (!this.leaderTermsAccepted) {
      this.general.presentToast('Please accept the terms and conditions');
      return;
    }

    this.leaderModalOpen = false;

    if (!this.UserDetails || !this.UserDetails[0]) {
      this.general.presentToast('User details not found. Please log in again.');
      return;
    }

    const u = this.UserDetails[0];
    const isRoleChangeFrom2To4 = (this.existingRoleId === 2);

    if (!isRoleChangeFrom2To4) {
      return;
    }

    const obj = [{
      RegId: u.RegId,
      FullName: u.FullName || u.FirstName || '',
      MiddleName: u.MiddleName || '',
      SurName: u.SurName || u.Surname || '',
      Email: u.Email || '',
      Weight: u.Weight || '',
      DOB: u.DOB,
      Gender: u.Gender,
      BloodGroupId: u.BLGId || u.BloodGroupId,
      Lastdonatedate: u.Lastdonatedate,
      StateId: u.StateId || 0,
      DistrictId: u.DistrictId || u.DistrictID || 0,
      CityId: u.CityId || 0,
      newStatename: u.StateName || u.newStatename || '',
      newDistrictname: u.DistrictName || u.newDistrictname || '',
      newCityname: u.CityName || u.newCityname || '',
      Area: u.Area || '',
      Pincode: u.Pincode || '',
      UserAddress: u.UserAddress || '',
      RoleId: 4,
      Rolestatus: true,
      RoleStatus: true,
      Status: u.Status !== undefined ? u.Status : (u.Activestatus !== undefined ? u.Activestatus : true),
      Statusphn: true,
      status: true,
      Availablestatus: u.Availablestatus !== undefined ? u.Availablestatus : true,
      Phonenumber: u.Phonenumber || ''
    }];

    const UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "3");
    const url = "api/BG/Insert_Update_DonersForm";

    this.isSubmitting = true;
    this.general.present('Registering as Leader, please wait...');

    this.general.PostData(url, UploadFile).subscribe((res: any) => {
      if (res === "SUCCESS") {
        const uploadFile = new FormData();
        uploadFile.append("Mobile", u.Phonenumber || u.Email);
        this.general.PostData('api/BG/checking_Mobile', uploadFile).subscribe((result: any) => {
          this.isSubmitting = false;
          this.general.dismiss();

          if (result && result !== "NOTEXIST") {
            localStorage.setItem("UserDetails", JSON.stringify(result));
            this.UserDetails = result;
            this.loadUserData();
          }

          const completeProcess = () => {
            this.general.presentAlert("SUCCESS", "You have successfully become a Leader!");
            this.navCtrl.navigateRoot('/home');
          };

          const userEmail = (result?.[0]?.Email || u.Email || '').trim();

          if (isRoleChangeFrom2To4 && result && result.length > 0 && userEmail && userEmail !== 'undefined') {
            const firstName = (result[0].FirstName || result[0].FullName || u.FirstName || u.FullName || '').trim();
            const middleName = (result[0].MiddleName || u.MiddleName || '').trim();
            const surName = (result[0].SurName || result[0].Surname || result[0].LastName || u.SurName || '').trim();

            const nameParts = [firstName, middleName, surName].filter(p => p && p.length > 0);
            const fullName = nameParts.length > 0 ? nameParts.join(' ') : (result[0].FullName || firstName || '').trim();

            const memberId = result[0].UserProtalID ? result[0].UserProtalID : ('LH' + String(result[0].RegId).padStart(7, '0'));
            const referralCode = (result[0].Reffercode || result[0].RefferCode || result[0].ReferralCode || result[0].ReferenceCode || localStorage.getItem('pendingReferralCode') || '').trim();

            var emailForm = new FormData();
            emailForm.append('Email', userEmail);
            emailForm.append('FirstName', firstName);
            emailForm.append('MiddleName', middleName);
            emailForm.append('SurName', surName);
            emailForm.append('FullName', fullName);
            emailForm.append('MemberId', memberId);
            emailForm.append('RegId', result[0].RegId ? result[0].RegId.toString() : (u.RegId ? u.RegId.toString() : ''));
            emailForm.append('RoleId', '4');
            emailForm.append('BloodGroup', (result[0].BLGName || u.BLGName || '').trim());
            emailForm.append('PhoneNumber', (result[0].Phonenumber || u.Phonenumber || '').trim());
            emailForm.append('Title', 'Community Leader');
            emailForm.append('ReferralCode', referralCode);
            emailForm.append('ReferenceCode', referralCode);

            this.general.PostData('api/BG/SendLeaderWelcomeEmail', emailForm).subscribe(
              () => {
                console.log('Leader welcome email sent successfully');
                completeProcess();
              },
              (err: any) => {
                console.error('Failed to send welcome email', err);
                completeProcess();
              }
            );
          } else {
            completeProcess();
          }
        }, () => {
          this.isSubmitting = false;
          this.general.dismiss();
          this.general.presentAlert("SUCCESS", "You have successfully become a Leader!");
          this.navCtrl.navigateRoot('/home');
        });
      } else {
        this.isSubmitting = false;
        this.general.dismiss();
        this.general.presentToast('Something went wrong. Please try again later.');
      }
    }, (error: any) => {
      this.isSubmitting = false;
      this.general.dismiss();
      this.general.presentToast('Connection error. Please try again later.');
    });
  }

  cancelLeaderTerms() {
    this.leaderModalOpen = false;
    this.leaderTermsAccepted = false;
  }

  async InviteFrinds() {
    const text = "Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it’s giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe.";
    const image = "https://letshelp.in/webservices/Image/logo.png";
    const shareUrl = "https://play.google.com/store/apps/details?id=com.gg.Bloodgroup";

    try {
      await Share.share({
        title: 'Lets Help',
        text: text,
        url: shareUrl,
        dialogTitle: 'Share with your friends'
      });
    } catch (error) {
    }
  }
}

