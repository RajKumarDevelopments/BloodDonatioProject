import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  LoginForm!: FormGroup;
  submitAttempt: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  Mobile: any; MobileOTP: any; OTP: any;
  OTPFlag: any;
  Token: any;
  Devicetoken: any;
  Devicetoken1: any;
  flag1: any;
  password: any; UserDetails1: any;
  UserDetails: any;

  // Forgot Password fields
  showForgotPassword: boolean = false;
  forgotEmail: string = '';
  forgotOTP: any;
  generatedForgotOTP: any;
  forgotOTPFlag: boolean = false;
  forgotOTPVerified: boolean = false;
  newPassword: string = '';
  confirmPassword: string = '';
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private generalservice: GeneralService
  ) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
  }

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])]
    });
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
  }

  VerifyMobileEmail() {
    if (this.Mobile != null) {
      if (this.Mobile.length == 10) {
        let uploadFile = new FormData();
        uploadFile.append("Mobile", this.Mobile);
        var url = 'api/BG/checking_Mobile';
        this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
          if (this.Mobile.length == 10) {
            if (result != "NOTEXIST") {
              this.SendOTPToMobile();
              this.generalservice.presentToast('OTP sent successfully!');
            } else {
              this.generalservice.presentToast('Invalid email or mobile. Please register.');
              this.navCtrl.navigateForward(['/signup']);
            }
          } else {
            this.OTPFlag = 1;
            this.login();
          }
        });
      } else {
        if (this.Mobile) {
          this.generalservice.presentToast('Please enter valid mobile number...!');
        } else if (this.Mobile.length > 10) {
          this.flag1 = 1;
        }
      }
    } else {
      this.generalservice.presentToast('Please enter mobile number...!');
    }
  }

  SendOTPToMobile() {
    debugger
    this.OTP = Math.floor(1000 + Math.random() * 9000);
    console.log(this.OTP);
    var UploadFile = new FormData();
    UploadFile.append("MobileNo", this.Mobile);
    UploadFile.append("OTP", this.OTP);
    var url = "api/BG/SendOtpToMobile";
    this.generalservice.PostData(url, UploadFile).subscribe((data: any) => {
      if (data == "SUCCESS") {
        this.OTPFlag = 1;
      }
    });
  }

  MobileLogin1() {
    if (this.MobileOTP == this.OTP) {
      let uploadFile = new FormData();
      uploadFile.append("Mobile", this.Mobile);
      var url = 'api/BG/checking_Mobile';
      this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
        if (result != "NOTEXIST") {
          localStorage.setItem("UserDetails", JSON.stringify(result));
          this.loadingController.dismiss();
          this.navCtrl.navigateForward(['/home']);
          window.location.reload();
        } else {
          this.navCtrl.navigateForward(['/signup']);
          this.generalservice.presentToast('Invalid email or mobile. Please register.');
        }
      });
    } else {
      this.generalservice.presentToast('Please enter correct otp...!');
    }
  }

  MobileLogin() {
    this.Devicetoken1 = localStorage.getItem("Token");
    this.Devicetoken = JSON.parse(this.Devicetoken1);

    if (this.MobileOTP == this.OTP) {
      let uploadFile = new FormData();
      uploadFile.append("Mobile", this.Mobile);
      var url = 'api/BG/checking_Mobile';
      this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
        if (result != "NOTEXIST") {
          localStorage.setItem("UserDetails", JSON.stringify(result));
          this.loadingController.dismiss();
          var array = [{
            RegId: result[0].RegId,
            Devicetoken: this.Devicetoken
          }];
          let formData: FormData = new FormData();
          formData.append('tokenDetails', JSON.stringify(array));
          var url = "api/BG/UpdateDeviceToken";
          this.generalservice.PostData(url, formData).subscribe((data: any) => {
            this.navCtrl.navigateForward(['/home']);
            window.location.reload();
          });
        } else {
          this.navCtrl.navigateForward(['/signup']);
          this.generalservice.presentToast('Invalid email or mobile. Please register.');
        }
      });
    } else {
      this.generalservice.presentToast('Please enter correct otp...!');
    }
  }

  isNumeric(value: string): boolean {
    return /^[0-9]+$/.test(value);
  }

  login() {
    debugger
    this.submitAttempt = true;
    let uploadFile = new FormData();
    uploadFile.append("Param1", this.Mobile);
    uploadFile.append("Param2", this.MobileOTP);
    const url = 'api/BG/BG_Admin_Login';
    this.generalservice.PostData(url, uploadFile).subscribe((response: any) => {
      if (response != "Invalid User") {
        localStorage.setItem("UserDetails", JSON.stringify(response));
        this.navCtrl.navigateForward(['/home']);
        window.location.reload();
      } else {
        this.navCtrl.navigateForward(['/signup']);
        this.generalservice.presentToast('Invalid email or password. Please register.');
      }
    }, (err: any) => {
      this.loadingController.dismiss();
      this.generalservice.presentToast('Something went wrong. Please try again later.');
    });
  }

  signup() {
    this.navCtrl.navigateForward('/signup');
  }

  // ─── Forgot Password Flow ───────────────────────────────────────────────────

  openForgotPassword() {
    debugger
    let checkData = new FormData();
    checkData.append("Mobile", this.Mobile);   // SP both mobile/email check chesthundi

    const checkUrl = 'api/BG/checking_Mobile';

    this.generalservice.PostData(checkUrl, checkData).subscribe((result: any) => {


      if (result == "NOTEXIST") {
        this.generalservice.presentToast('Invalid email. Please enter your registered email.');
        return;
      }

      else {
        this.showForgotPassword = true;
        // Pre-fill email from whatever the user already typed in the Mobile/Email field
        this.forgotEmail = (!this.isNumeric(this.Mobile) && this.Mobile?.includes('@')) ? this.Mobile : '';
        this.forgotOTP = '';
        this.generatedForgotOTP = null;
        this.forgotOTPFlag = false;
        this.forgotOTPVerified = false;
        this.newPassword = '';
        this.confirmPassword = '';
      }
    })
  }

  closeForgotPassword() {
    this.showForgotPassword = false;
  }



  sendForgotPasswordOTP1() {
    debugger;

    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.generalservice.presentToast('Please enter a valid email address.');
      return;
    }

    // Generate OTP on the frontend
    this.generatedForgotOTP = Math.floor(1000 + Math.random() * 9000);

    let uploadFile = new FormData();
    uploadFile.append("Email", this.forgotEmail);
    uploadFile.append("OTP", this.generatedForgotOTP);

    const url = 'api/BG/SendForgotPasswordOTP';
    this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {

      // Always allow, no email existence check
      this.forgotOTPFlag = true;
      this.generalservice.presentToast('OTP sent to your email successfully!');

    }, (err: any) => {
      this.generalservice.presentToast('Failed to send OTP. Please try again.');
    });
  }
  sendForgotPasswordOTP2() {
    debugger;

    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.generalservice.presentToast('Please enter a valid email address.');
      return;
    }

    this.generatedForgotOTP = Math.floor(1000 + Math.random() * 9000);

    let uploadFile = new FormData();
    uploadFile.append("Email", this.forgotEmail);
    uploadFile.append("OTP", this.generatedForgotOTP);

    const url = 'api/BG/SendForgotPasswordOTP';
    this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {

      this.forgotOTPFlag = true;
      this.generalservice.presentToast('OTP sent to your email successfully!');

    }, (err: any) => {

      // Show actual API error
      let msg = err?.error || err?.message || 'Failed to send OTP, Please try again.';
      this.generalservice.presentToast(msg);
    });
  }
  sendForgotPasswordOTP() {
    debugger;

    if (!this.forgotEmail || !this.forgotEmail.includes('@')) {
      this.generalservice.presentToast('Please enter a valid email address.');
      return;
    }

    // Step 1: Check email exists in DB
    let checkData = new FormData();
    checkData.append("Mobile", this.forgotEmail);   // SP both mobile/email check chesthundi

    const checkUrl = 'api/BG/checking_Mobile';

    this.generalservice.PostData(checkUrl, checkData).subscribe((result: any) => {


      if (result == "NOTEXIST") {
        this.generalservice.presentToast('Invalid email. Please enter your registered email.');
        return;
      }

      // Step 2: Email exists → generate & send OTP
      this.generatedForgotOTP = Math.floor(1000 + Math.random() * 9000);

      let uploadFile = new FormData();
      uploadFile.append("Email", this.forgotEmail);
      uploadFile.append("OTP", this.generatedForgotOTP);
      uploadFile.append("Name", result[0].FullName);

      const url = 'api/BG/SendForgotPasswordOTP';

      this.generalservice.PostData(url, uploadFile).subscribe((res: any) => {
        this.forgotOTPFlag = true;
        this.generalservice.presentToast('OTP sent to your email successfully!');
      });


    }, (err: any) => {
      this.generalservice.presentToast('Something went wrong. Please try again.');
    });
  }



  verifyForgotOTP() {
    debugger
    if (!this.forgotOTP) {
      this.generalservice.presentToast('Please enter the OTP.');
      return;
    }

    if (this.forgotOTP == this.generatedForgotOTP) {
      this.forgotOTPVerified = true;
      this.generalservice.presentToast('OTP verified successfully!');
    } else {
      this.generalservice.presentToast('Invalid OTP. Please try again.');
    }
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Resets the password by calling the API with the verified email and new password.
   */
  resetPassword() {
    debugger
    if (!this.newPassword || this.newPassword.length < 6) {
      this.generalservice.presentToast('Password must be at least 6 characters.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.generalservice.presentToast('Passwords do not match.');
      return;
    }

    let uploadFile = new FormData();
    uploadFile.append("Param1", this.forgotEmail);
    uploadFile.append("Param2", this.newPassword);

    const url = 'api/BG/ResetPasswordByEmail';
    this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
      if (result == "UPDATED" || result == 1 || result > 0) {
        this.navCtrl.navigateForward(['/home']);
        this.generalservice.presentToast('Password reset successfully! Please login.');

        this.closeForgotPassword();
        //} else {
        //  this.generalservice.presentToast('Failed to reset password. Please try again.');
      }

    }, (err: any) => {
      this.generalservice.presentToast('Something went wrong. Please try again.');
    });
  }
}
