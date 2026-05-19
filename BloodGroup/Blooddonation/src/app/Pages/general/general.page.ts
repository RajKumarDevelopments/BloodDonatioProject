import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})

export class GeneralPage implements OnInit {

  UserDetails1: any;
  UserDetails: any;

  Password: any;
  Email: any;

  Resson: any;
  Phonenumber: any;

  // New properties for Edit/OTP flow
  showModal = false;
  editType: 'Email' | 'Mobile' | 'Password' = 'Email';
  editValue: string = '';
  otpSent = false;
  generatedOtp: any;
  enteredOtp: string = '';
  isPasswordEditable: boolean = false;
  constructor(
    private alertController: AlertController,
    private router: Router,
    public NavCtl: NavController,
    public general: GeneralService
  ) {

    this.UserDetails1 = localStorage.getItem('UserDetails');
    this.UserDetails = JSON.parse(this.UserDetails1);

    this.Email = this.UserDetails[0].Email;
    this.Phonenumber = this.UserDetails[0].Phonenumber;
    this.Password = this.UserDetails[0].Password;

  }

  ngOnInit() { }


  maskpassword(password: string): string {

    if (!password) return '';

    return '*'.repeat(password.length);

  }




  UpdateProfile() {
    if (!this.Password) {
      this.general.presentToast('Password cannot be empty');
      return;
    }

    var obj = [{
      RegId: this.UserDetails[0].RegId,
      Email: this.Email,
      Phonenumber: this.Phonenumber,
      Password: this.Password
    }];
    let uploadFile = new FormData();
    uploadFile.append("Param", JSON.stringify(obj));
    uploadFile.append("Flag", "4");

    var url = "api/BG/Insert_Update_DonersForm";
    this.general.PostData(url, uploadFile).subscribe((data: any) => {

      if (data == "UPDATED" || data == "SUCCESS") {
        // Update local UserDetails and storage
        this.UserDetails[0].Email = this.Email;
        this.UserDetails[0].Phonenumber = this.Phonenumber;
        this.UserDetails[0].Password = this.Password;
        localStorage.setItem("UserDetails", JSON.stringify(this.UserDetails));
        
        // Reset edit mode
        this.isPasswordEditable = false;

        // Show success message
        this.general.presentToast('Your details have been updated successfully');

        this.NavCtl.navigateForward(['/home']);
      } else {
        this.general.presentAlert("Error", "Something Went Wrong: " + data);
      }
    });
  }

  async confirmDelete() {

    const alert = await this.alertController.create({

      header: 'Delete Account',

      message: 'Are you sure you want to delete your account? Once deleted, your account cannot be recovered.',

      buttons: [

        {
          text: 'Cancel',
          role: 'cancel'
        },

        {
          text: 'Yes Delete',
          role: 'destructive',
          handler: () => {
            this.DeleteAcc();
          }
        }

      ]

    });

    await alert.present();

  }



  DeleteAcc() {

    var uploadfile = new FormData();

    uploadfile.append("Param1", "1");
    uploadfile.append("Param2", this.UserDetails[0].RegId);

    var url = "api/BG/DeleteAccount_Covert_as_Leader";

    this.general.PostData(url, uploadfile).subscribe((data: any) => {

      if (data == 'SUCCESS') {

        this.general.presentAlert('SUCCESS', 'Your Account Has Deleted Permanently');

        localStorage.removeItem('UserDetails');
        localStorage.removeItem("City");
        localStorage.removeItem("Distict");
        localStorage.removeItem("District");
        localStorage.removeItem("State");
        localStorage.removeItem("URL");
        localStorage.removeItem("selectedTab");

        this.NavCtl.navigateRoot('/login');

      }

      else {

        this.general.presentAlert('Error', 'Something Went Wrong');

      }

    });

  }



  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            localStorage.removeItem('UserDetails');
            this.NavCtl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }

  // ─── Edit and OTP Flow ──────────────────────────────────────────────────────

  openEditModal(type: 'Email' | 'Mobile' | 'Password') {
    this.editType = type;
    // Bind existing values to the edit input field
    if (type === 'Email') {
      this.editValue = this.Email;
    } else if (type === 'Mobile') {
      this.editValue = this.Phonenumber;
    } else {
      this.editValue = this.Password;
    }
    
    this.showModal = true;
    this.otpSent = false;
    this.enteredOtp = '';
    this.generatedOtp = null;
  }

  closeModal() {
    this.showModal = false;
  }

  sendOtp() {
    if (!this.editValue) {
      this.general.presentToast('Please enter a value');
      return;
    }

    if (this.editType === 'Password') {
      // For password, we don't have an OTP API yet, so we save directly from the modal
      this.Password = this.editValue;
      this.closeModal();
      this.UpdateProfile();
      return;
    }

    if (this.editType === 'Email' && !this.editValue.includes('@')) {
      this.general.presentToast('Please enter a valid email');
      return;
    }

    if (this.editType === 'Mobile' && this.editValue.length !== 10) {
      this.general.presentToast('Please enter a valid 10-digit mobile number');
      return;
    }

    this.generatedOtp = Math.floor(1000 + Math.random() * 9000);
    let uploadFile = new FormData();

    let url = "";
    if (this.editType === 'Email') {
      uploadFile.append("Email", this.editValue);
      uploadFile.append("OTP", this.generatedOtp);
      uploadFile.append("Name", this.UserDetails[0].FullName);
      url = "api/BG/SendForgotPasswordOTP";
    } else {
      uploadFile.append("MobileNo", this.editValue);
      uploadFile.append("OTP", this.generatedOtp);
      url = "api/BG/SendOtpToMobile";
    }

    this.general.PostData(url, uploadFile).subscribe((data: any) => {
      // Email API returns "OTP_SENT", Mobile API returns "SUCCESS"
      if (data === "SUCCESS" || data === "OTP_SENT") {
        this.otpSent = true;
        this.general.presentToast('OTP sent successfully!');
      } else {
        this.general.presentToast('Failed to send OTP. Please try again.');
      }
    }, (err: any) => {
      this.general.presentToast('Error sending OTP. Please try again.');
    });
  }

  verifyOtp() {
    if (this.enteredOtp == this.generatedOtp) {
      // Step 1: Show success message for verification
      this.general.presentToast('OTP Verified Successfully');

      // Step 2: Update the local variables displayed on the main page
      if (this.editType === 'Email') {
        this.Email = this.editValue;
      } else {
        this.Phonenumber = this.editValue;
      }

      // Step 3: Close the modal
      this.closeModal();

      // Step 4: Auto-save to backend
      this.UpdateProfile();

    } else {
      this.general.presentToast('Invalid OTP. Please try again.');
    }
  }

}
