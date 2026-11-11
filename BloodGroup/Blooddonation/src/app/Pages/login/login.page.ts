import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { registerPlugin } from '@capacitor/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

export interface SmsReceiverPluginInterface {
  startListening(): Promise<{ status: string }>;
  stopListening(): Promise<{ status: string }>;
  addListener(eventName: 'otpReceived', listenerFunc: (data: { otp: string; message?: string }) => void): Promise<any>;
  removeAllListeners(): Promise<void>;
}

const SmsReceiver = registerPlugin<SmsReceiverPluginInterface>('SmsReceiverPlugin');

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  LoginForm!: FormGroup;
  submitAttempt: boolean = false;
  isSubmitting: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  Mobile: any; MobileOTP: any; OTP: any;
  OTPFlag: any = 0;
  Token: any;
  Devicetoken: any;
  Devicetoken1: any;
  flag1: any;
  password: any; UserDetails1: any;
  UserDetails: any;

  // 4-digit OTP individual boxes
  otpDigits: string[] = ['', '', '', ''];
  private otpAbortController?: AbortController;
  private otpEventListener: any = null;
  private smsPluginListener: any = null;
  private hasAutoSubmitted: boolean = false;

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

  resendTimer: number = 30;
  timerInterval: any;
  canResend: boolean = false;

  forgotResendTimer: number = 30;
  forgotTimerInterval: any;
  forgotCanResend: boolean = false;

  startResendTimer() {
    this.resendTimer = 30;
    this.canResend = false;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  async startSmsAutoReader() {
    this.stopSmsAutoReader();

    // 1. Listen via DOM CustomEvent (dispatched directly from Android WebView evaluateJavascript)
    if (typeof window !== 'undefined') {
      this.otpEventListener = (event: any) => {
        const otpCode = event?.detail;
        if (otpCode) {
          console.log('OTP received via DOM CustomEvent:', otpCode);
          this.handleAutoReadOtp(otpCode);
        }
      };
      window.addEventListener('otpReceived', this.otpEventListener);
    }

    // 2. Listen via Capacitor Plugin (Google Play Services SMS User Consent)
    try {
      if (SmsReceiver) {
        this.smsPluginListener = await SmsReceiver.addListener('otpReceived', (data: { otp: string }) => {
          if (data && data.otp) {
            console.log('OTP received via Capacitor Plugin:', data.otp);
            this.handleAutoReadOtp(data.otp);
          }
        });

        const res = await SmsReceiver.startListening();
        console.log('SmsReceiver started listening:', res);
      }
    } catch (pluginErr) {
      console.log('SmsReceiver plugin not available:', pluginErr);
    }

    // 3. WebOTP API (as browser fallback)
    this.listenForWebOTP();
  }

  handleAutoReadOtp(code: string) {
    if (!code || this.hasAutoSubmitted) return;
    const cleanDigits = code.toString().replace(/\D/g, '').slice(0, 4);
    if (cleanDigits.length === 4) {
      this.hasAutoSubmitted = true;
      this.stopSmsAutoReader();
      // Must run inside NgZone so Angular immediately updates the UI
      this.ngZone.run(() => {
        this.setOtpValue(cleanDigits);
        this.generalservice.presentToast('OTP auto-filled: ' + cleanDigits);

        // Automatically trigger Login once all 4 digits are auto-filled
        setTimeout(() => {
          if (!this.isSubmitting && this.isOtpComplete()) {
            this.MobileLogin();
          }
        }, 300);
      });
    }
  }

  stopSmsAutoReader() {
    if (typeof window !== 'undefined' && this.otpEventListener) {
      window.removeEventListener('otpReceived', this.otpEventListener);
      this.otpEventListener = null;
    }

    try {
      if (this.smsPluginListener) {
        this.smsPluginListener.remove();
        this.smsPluginListener = null;
      }
      if (SmsReceiver) {
        SmsReceiver.stopListening();
        SmsReceiver.removeAllListeners();
      }
    } catch (e) {}

    if (this.otpAbortController) {
      try { this.otpAbortController.abort(); } catch (e) {}
    }
  }

  async listenForWebOTP() {
    if (typeof window !== 'undefined' && 'OTPCredential' in window) {
      try {
        if (this.otpAbortController) {
          try { this.otpAbortController.abort(); } catch (e) {}
        }
        this.otpAbortController = new AbortController();
        const signal = this.otpAbortController.signal;
        setTimeout(() => {
          try { this.otpAbortController?.abort(); } catch (e) {}
        }, 60 * 1000);

        const otp: any = await (navigator.credentials as any).get({
          otp: { transport: ['sms'] },
          signal: signal
        });
        if (otp && otp.code) {
          this.handleAutoReadOtp(otp.code);
        }
      } catch (err) {
        console.log('WebOTP Error or aborted:', err);
      }
    }
  }

  onMobileChange() {
    this.otpDigits = ['', '', '', ''];
    this.updateMobileOtp();
    this.OTPFlag = 0;
    this.hasAutoSubmitted = false;
  }

  updateMobileOtp() {
    this.MobileOTP = this.otpDigits.join('');
  }

  isOtpComplete(): boolean {
    if (!this.otpDigits || this.otpDigits.length !== 4) {
      return false;
    }
    const allFilled = this.otpDigits.every(d => d !== '' && d !== null && d !== undefined);
    const codeLen = (this.MobileOTP || '').toString().trim().length;
    return allFilled && codeLen === 4;
  }

  isEmailPasswordValid(): boolean {
    const email = (this.Mobile || '').toString().trim();
    const pwd = (this.MobileOTP || '').toString().trim();
    return email.length > 0 && pwd.length > 0;
  }

  setOtpValue(value: any) {
    if (value === null || value === undefined) {
      this.otpDigits = ['', '', '', ''];
      this.updateMobileOtp();
      return;
    }
    const digits = value.toString().replace(/\D/g, '').slice(0, 4);
    for (let i = 0; i < 4; i++) {
      this.otpDigits[i] = digits[i] || '';
      const el = document.getElementById('otp-input-' + i) as HTMLInputElement;
      if (el) {
        el.value = this.otpDigits[i];
      }
    }
    this.updateMobileOtp();
    if (digits.length >= 4) {
      this.focusOtpInput(3);
    } else if (digits.length > 0) {
      this.focusOtpInput(digits.length);
    }
  }

  focusOtpInput(index: number) {
    setTimeout(() => {
      const el = document.getElementById('otp-input-' + index) as HTMLInputElement;
      if (el) {
        el.focus();
        try {
          el.select();
        } catch (e) {}
      }
    }, 50);
  }

  onOtpFocus(index: number, event: any) {
    setTimeout(() => {
      if (event && event.target) {
        try {
          event.target.select();
        } catch (e) {}
      }
    }, 0);
  }

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const rawVal = input ? input.value : '';
    const digitsOnly = (rawVal || '').replace(/\D/g, '');

    if (digitsOnly.length === 0) {
      this.otpDigits[index] = '';
      if (input) input.value = '';
      this.updateMobileOtp();
      return;
    }

    if (digitsOnly.length > 1) {
      // Auto-filled OTP from mobile SMS autofill or pasted into box
      if (digitsOnly.length >= 4) {
        this.setOtpValue(digitsOnly);
        return;
      }

      // If user typed into an already filled box (length 2), keep the newest digit
      const latestDigit = digitsOnly.slice(-1);
      this.otpDigits[index] = latestDigit;
      if (input) input.value = latestDigit;
      this.updateMobileOtp();
      if (index < 3) {
        this.focusOtpInput(index + 1);
      }
      return;
    }

    // Exactly 1 digit
    this.otpDigits[index] = digitsOnly;
    if (input) input.value = digitsOnly;
    this.updateMobileOtp();

    if (index < 3) {
      this.focusOtpInput(index + 1);
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      if (!this.otpDigits[index] && index > 0) {
        // Current box is empty, jump to previous box and clear it
        event.preventDefault();
        this.otpDigits[index - 1] = '';
        this.updateMobileOtp();
        this.focusOtpInput(index - 1);
      } else {
        // Clear current box
        this.otpDigits[index] = '';
        if (input) input.value = '';
        this.updateMobileOtp();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusOtpInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < 3) {
      event.preventDefault();
      this.focusOtpInput(index + 1);
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const digitsOnly = pasted.replace(/\D/g, '').slice(0, 4);
    if (digitsOnly) {
      this.setOtpValue(digitsOnly);
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.forgotTimerInterval) {
      clearInterval(this.forgotTimerInterval);
    }
    this.stopSmsAutoReader();
  }

  startForgotResendTimer() {
    this.forgotResendTimer = 30;
    this.forgotCanResend = false;
    clearInterval(this.forgotTimerInterval);
    this.forgotTimerInterval = setInterval(() => {
      this.forgotResendTimer--;
      if (this.forgotResendTimer <= 0) {
        this.forgotCanResend = true;
        clearInterval(this.forgotTimerInterval);
      }
    }, 1000);
  }

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private generalservice: GeneralService,
    private ngZone: NgZone,
    private androidPermissions: AndroidPermissions
  ) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
  }

  ngOnInit() {
    this.OTPFlag = 0;
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
    const mobileStr = (this.Mobile || '').toString().trim();
    if (!mobileStr) {
      this.generalservice.presentToast('Please enter mobile number.');
      return;
    }

    if (mobileStr.length !== 10 || !/^\d{10}$/.test(mobileStr)) {
      this.generalservice.presentToast('Please enter a valid 10-digit mobile number.');
      return;
    }

    this.isSubmitting = true;
    this.generalservice.present('Sending OTP...');

    let uploadFile = new FormData();
    uploadFile.append("Mobile", mobileStr);
    var url = 'api/BG/checking_Mobile';
    this.generalservice.PostData(url, uploadFile).subscribe(
      (result: any) => {
        if (result != "NOTEXIST") {
          this.SendOTPToMobile();
        } else {
          this.isSubmitting = false;
          this.generalservice.dismiss();
          this.generalservice.presentToast('Mobile number not registered. Please register.');
          this.navCtrl.navigateForward(['/signup']);
        }
      },
      (err: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
        console.error('Error checking mobile number', err);
        this.generalservice.presentToast('Failed to verify mobile number. Please try again.');
      }
    );
  }

  SendOTPToMobile() {
    const mobileStr = (this.Mobile || '').toString().trim();
    this.OTP = Math.floor(1000 + Math.random() * 9000);
    console.log('Generated OTP:', this.OTP);

    var UploadFile = new FormData();
    UploadFile.append("MobileNo", mobileStr);
    UploadFile.append("OTP", this.OTP.toString());

    if (!this.isSubmitting) {
      this.generalservice.present('Sending OTP...');
    }

    var url = "api/BG/SendOtpToMobile";
    this.generalservice.PostData(url, UploadFile).subscribe(
      (data: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
        if (data == "SUCCESS") {
          this.OTPFlag = 1;
          this.hasAutoSubmitted = false;
          this.otpDigits = ['', '', '', ''];
          this.updateMobileOtp();
          this.generalservice.presentToast('OTP sent successfully!');
          this.startResendTimer();
          this.startSmsAutoReader();
          this.focusOtpInput(0);
        } else {
          this.generalservice.presentToast('Failed to send OTP. Please try again.');
        }
      },
      (err: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
        console.error('Error sending OTP', err);
        this.generalservice.presentToast('An error occurred while sending OTP. Please try again.');
      }
    );
  }

  MobileLogin1() {
    if (this.MobileOTP == this.OTP) {
      this.isSubmitting = true;
      this.generalservice.present('Logging in, please wait...');
      let uploadFile = new FormData();
      uploadFile.append("Mobile", this.Mobile);
      var url = 'api/BG/checking_Mobile';
      this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
        if (result != "NOTEXIST") {
          localStorage.setItem("UserDetails", JSON.stringify(result));
          this.loadingController.dismiss();
          this.navCtrl.navigateForward(['/home']);
          window.location.reload();
        } else {
          this.navCtrl.navigateForward(['/signup']);
          this.generalservice.presentToast('Invalid Mobile number or User Ddoesnt not exit. Click back to rety or Click Signup if you are a new user');
        }
      }, (err: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
        this.generalservice.presentToast('Something went wrong. Please try again later.');
      });
    } else {
      this.generalservice.presentToast('Please enter correct otp...!');
    }
  }

  MobileLogin() {
    this.Devicetoken1 = localStorage.getItem("Token");
    this.Devicetoken = JSON.parse(this.Devicetoken1);

    if (this.MobileOTP == this.OTP) {
      this.isSubmitting = true;
      this.generalservice.present('Logging in, please wait...');
      let uploadFile = new FormData();
      uploadFile.append("Mobile", this.Mobile);
      var url = 'api/BG/checking_Mobile';
      this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
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
          this.generalservice.presentToast('Invalid Mobile number or User Ddoesnt not exit. Click back to rety or Click Signup if you are a new user');
        }
      }, (err: any) => {
        this.isSubmitting = false;
        this.generalservice.dismiss();
        this.generalservice.presentToast('Something went wrong. Please try again later.');
      });
    } else {
      this.generalservice.presentToast('Please enter correct otp...!');
    }
  }

  isNumeric(value: any): boolean {
    if (!value) return false;
    return /^[0-9]+$/.test(String(value).trim());
  }

  login() {
    this.submitAttempt = true;
    this.isSubmitting = true;
    this.generalservice.present('Logging in, please wait...');
    let uploadFile = new FormData();
    uploadFile.append("Param1", this.Mobile);
    uploadFile.append("Param2", this.MobileOTP);
    const url = 'api/BG/BG_Admin_Login';
    this.generalservice.PostData(url, uploadFile).subscribe((response: any) => {
      this.isSubmitting = false;
      this.generalservice.dismiss();
      if (response != "Invalid User") {
        localStorage.setItem("UserDetails", JSON.stringify(response));
        this.navCtrl.navigateForward(['/home']);
        window.location.reload();
      } else {
        this.navCtrl.navigateForward(['/signup']);
        this.generalservice.presentToast('Invalid Mobile number or User Ddoesnt not exit. Click back to rety or Click Signup if you are a new user');
      }
    }, (err: any) => {
      this.isSubmitting = false;
      this.generalservice.dismiss();
      this.loadingController.dismiss();
      this.generalservice.presentToast('Something went wrong. Please try again later.');
    });
  }

  signup() {
    this.navCtrl.navigateForward('/signup');
  }

  // ─── Forgot Password Flow ───────────────────────────────────────────────────

  openForgotPassword() {
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
        this.startForgotResendTimer();
      });


    }, (err: any) => {
      this.generalservice.presentToast('Something went wrong. Please try again.');
    });
  }



  verifyForgotOTP() {
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
