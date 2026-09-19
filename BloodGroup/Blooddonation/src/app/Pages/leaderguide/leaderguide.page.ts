import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-leaderguide',
  templateUrl: './leaderguide.page.html',
  styleUrls: ['./leaderguide.page.scss'],
})
export class LeaderguidePage implements OnInit {
  userdetail: any;
  UserDetails: any;

  constructor(
    private nav: NavController,
    private general: GeneralService,
    private alertController: AlertController
  ) {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = this.userdetail ? JSON.parse(this.userdetail) : null;
  }

  ngOnInit() {
  }

  async Go() {
    const existingRoleId = Number(this.UserDetails?.[0]?.RoleId) || 2;
    if (existingRoleId === 4) {
      this.general.presentToast('You are already a Leader.');
      this.nav.navigateForward(['/home']);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Become a Leader',
      message: 'Once you become a Leader, you cannot switch back to becoming a Donor through this option. Do you want to continue?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.proceedGo(existingRoleId);
          }
        }
      ]
    });
    await alert.present();
  }

  proceedGo(existingRoleId: number) {
    const u = this.UserDetails[0];
    const isRoleChangeFrom2To4 = (existingRoleId === 2);

    var obj = [{
      RegId: u.RegId,
      FullName: u.FullName || u.FirstName || '',
      MiddleName: u.MiddleName || '',
      SurName: u.SurName || u.Surname || '',
      Email: u.Email,
      DOB: u.DOB,
      Gender: u.Gender,
      BloodGroupId: u.BLGId || u.BloodGroupId,
      Lastdonatedate: u.Lastdonatedate,
      CityId: u.CityId,
      RoleId: 4,
      RoleStatus: true,
      Status: u.Status !== undefined ? u.Status : (u.Activestatus !== undefined ? u.Activestatus : true),
      Statusphn: true,
      Rolestatus: true,
      status: true,
      Pincode: u.Pincode,
      Availablestatus: u.Availablestatus !== undefined ? u.Availablestatus : true,
      Phonenumber: u.Phonenumber || ''
    }];

    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "3");
    var url = "api/BG/Insert_Update_DonersForm";

    this.general.present('Updating role, please wait...');

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data == "SUCCESS") {
        let uploadFile = new FormData();
        uploadFile.append("Mobile", u.Phonenumber || u.Email);
        var urlCheck = 'api/BG/checking_Mobile';
        this.general.PostData(urlCheck, uploadFile).subscribe((result: any) => {
          this.general.dismiss();
          if (result != "NOTEXIST") {
            localStorage.setItem("UserDetails", JSON.stringify(result));

            const complete = () => {
              this.general.presentAlert("SUCCESS", "Your profile has been updated successfully.");
              this.nav.navigateForward(['/home']);
              window.location.reload();
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
                  complete();
                },
                (err: any) => {
                  console.error('Failed to send welcome email', err);
                  complete();
                }
              );
            } else {
              complete();
            }
          }
        }, () => {
          this.general.dismiss();
          this.general.presentAlert("SUCCESS", "Your profile has been updated successfully.");
          this.nav.navigateForward(['/home']);
          window.location.reload();
        });
      } else {
        this.general.dismiss();
        this.general.presentToast('Something went wrong. Please try again later.');
      }
    }, () => {
      this.general.dismiss();
      this.general.presentToast('Something went wrong. Please try again later.');
    });
  }
}

