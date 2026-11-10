import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../../Services/user/user.service';
import { registerPlugin } from '@capacitor/core';

export interface SmsReceiverPluginInterface {
  startListening(): Promise<{ status: string }>;
  stopListening(): Promise<{ status: string }>;
  addListener(eventName: 'otpReceived', listenerFunc: (data: { otp: string; message?: string }) => void): Promise<any>;
  removeAllListeners(): Promise<void>;
}

const SmsReceiver = registerPlugin<SmsReceiverPluginInterface>('SmsReceiverPlugin');

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  SignupForm!: FormGroup;
  submitAttempt: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  Mobile: any; MobileOTP: any; OTP: any;
  FirstName: any; MiddleName: any; SurName: any; UserName: any; InviteCode: any;
  firstNameError: string | null = null;
  emailError: string | null = null;
  isSubmitting: boolean = false;
  OTPFlag: any = 0; SignFlag: any;
  OTPVerified: any = 0;
  //TandC: any; Policy: any;
  TandC: boolean = false;
  Policy: boolean = false;
  TandCValue: any; PolicyValue: any;
  DonorFlag: any;
  //Email: any;
  Password: any;
  ConformPassword: any;
  passwordshow: boolean = false;
  mydata: any; flags: any;
  RoleId: any;
  Status: any;
  data1: any;
  showPassword: boolean = false;
  reshowPassword: boolean = false; Devicetoken: any;
  Devicetoken1: any;
  Email: string = '';

  resendTimer: number = 30;
  timerInterval: any;
  canResend: boolean = false;

  // 4-digit OTP individual boxes
  otpDigits: string[] = ['', '', '', ''];
  private otpAbortController?: AbortController;
  private otpEventListener: any = null;
  private smsPluginListener: any = null;

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
          console.log('Signup OTP received via DOM CustomEvent:', otpCode);
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
            console.log('Signup OTP received via Capacitor Plugin:', data.otp);
            this.handleAutoReadOtp(data.otp);
          }
        });

        const res = await SmsReceiver.startListening();
        console.log('Signup SmsReceiver started listening:', res);
      }
    } catch (pluginErr) {
      console.log('Signup SmsReceiver plugin not available:', pluginErr);
    }

    // 3. WebOTP API (as browser fallback)
    this.listenForWebOTP();
  }

  handleAutoReadOtp(code: string) {
    if (!code) return;
    const cleanDigits = code.toString().replace(/\D/g, '').slice(0, 4);
    if (cleanDigits.length === 4) {
      this.ngZone.run(() => {
        this.setOtpValue(cleanDigits);
        this.generalservice.presentToast('OTP detected: ' + cleanDigits);
        this.stopSmsAutoReader();
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
        console.log('Signup WebOTP Error or aborted:', err);
      }
    }
  }

  onMobileChange() {
    this.otpDigits = ['', '', '', ''];
    this.updateMobileOtp();
    this.OTPFlag = 0;
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
    const email = (this.Email || '').toString().trim();
    const pwd = (this.Password || '').toString().trim();
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
      const el = (document.getElementById('signup-otp-input-' + i) || document.getElementById('signup-donor-otp-input-' + i)) as HTMLInputElement;
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
      const el = (document.getElementById('signup-otp-input-' + index) || document.getElementById('signup-donor-otp-input-' + index)) as HTMLInputElement;
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
      if (digitsOnly.length >= 4) {
        this.setOtpValue(digitsOnly);
        return;
      }
      const latestDigit = digitsOnly.slice(-1);
      this.otpDigits[index] = latestDigit;
      if (input) input.value = latestDigit;
      this.updateMobileOtp();
      if (index < 3) {
        this.focusOtpInput(index + 1);
      }
      return;
    }

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
        event.preventDefault();
        this.otpDigits[index - 1] = '';
        this.updateMobileOtp();
        this.focusOtpInput(index - 1);
      } else {
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
    this.stopSmsAutoReader();
  }

  constructor(private generalservice: GeneralService, public navCtrl: NavController,
    private formBuilder: FormBuilder, public activeRoute: ActivatedRoute, public user: UserService,
    private ngZone: NgZone) {
    
    this.SignupForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
      TandC: [false, Validators.required],
      Policy: [false, Validators.required],
    });
    

    this.DonorFlag = this.activeRoute.snapshot.paramMap.get("DonorFlag");
    this.data1 = this.activeRoute.snapshot.paramMap.get("objs");
    this.mydata = this.data1 ? JSON.parse(this.data1) : null;
    this.TandCValue = this.activeRoute.snapshot.paramMap.get("TandCValue");
    this.PolicyValue = this.activeRoute.snapshot.paramMap.get("PolicyValue");
    if (this.TandCValue == 1) {
      this.TandC = true;
      this.getdata();
    }
    if (this.PolicyValue == 1) {
      this.Policy = true;

      this.getdata();
    }
    if (this.PolicyValue == 1 && this.TandCValue == 1) {
      this.getdata1();
    }

    this.populateReferralCode();
  }

  ngOnInit() {
    this.OTPFlag = 0;
    this.OTPVerified = 0;
    this.populateReferralCode();
    if (typeof window !== 'undefined') {
      window.addEventListener('referralCodeReceived', (e: any) => {
        if (e?.detail && !this.InviteCode) {
          this.InviteCode = e.detail;
        }
      });
    }
  }

  ionViewWillEnter() {
    this.populateReferralCode();
  }

  populateReferralCode() {
    if (this.InviteCode) {
      return;
    }

    // 1. Check Route query params
    const queryParams = this.activeRoute.snapshot.queryParams;
    let code = queryParams?.['referral_code'] || queryParams?.['ref'] || queryParams?.['referrer'] || queryParams?.['InviteCode'] || queryParams?.['invite_code'] || queryParams?.['code'];

    // 2. Check Route matrix params
    if (!code) {
      code = this.activeRoute.snapshot.paramMap.get('InviteCode') ||
             this.activeRoute.snapshot.paramMap.get('referral_code') ||
             this.activeRoute.snapshot.paramMap.get('ref');
    }

    // 3. Check localStorage or sessionStorage
    if (!code) {
      code = localStorage.getItem('pendingReferralCode') || sessionStorage.getItem('pendingReferralCode');
    }

    // 4. Check window.location in browser/web fallback
    if (!code && typeof window !== 'undefined' && window.location) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        code = urlParams.get('referral_code') || urlParams.get('ref') || urlParams.get('referrer') || urlParams.get('InviteCode') || urlParams.get('code');
        if (!code && window.location.hash && window.location.hash.includes('?')) {
          const hashQuery = window.location.hash.split('?')[1];
          const hashParams = new URLSearchParams(hashQuery);
          code = hashParams.get('referral_code') || hashParams.get('ref') || hashParams.get('referrer') || hashParams.get('InviteCode');
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Process code if formatted as referrer=referral_code%3DXYZ
    if (code && typeof code === 'string') {
      if (code.includes('referral_code=')) {
        const match = code.match(/referral_code=([^&]+)/i);
        if (match && match[1]) {
          code = decodeURIComponent(match[1]);
        }
      }
      this.InviteCode = code.trim();
      localStorage.setItem('pendingReferralCode', this.InviteCode);
    }
  }

  togglePassword() {
    
    this.showPassword = !this.showPassword;
  }

  retogglePassword() {
    
    this.reshowPassword = !this.reshowPassword;
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('Password')?.value === g.get('Confirmpassword')?.value
      ? null : { mismatch: true };
  }

  Onchange($event: any) {
    
    if (!$event.detail.checked == true) {
      this.TandC = true;
      //this.SignupForm.patchValue({ TandC: true });
    }
  }
  Onchange1($event: any) {
    
    if (!$event.detail.checked == true) {
      this.Policy = true;
      //this.SignupForm.patchValue({ Policy: true });
    }
  }

  gmailValidator(control: any) {
    const email = control.value;
    return email && !email.endsWith('@gmail.com') ? { invalidEmail: true } : null;
  }
  getdata() {
    
    if (this.TandC = true) {
      this.flags = 3
      this.TandC = true;
      this.OTPVerified = 1
      const data = this.mydata[0];
      this.FirstName = data.FirstName || data.UserName,
      this.MiddleName = data.MiddleName,
      this.SurName = data.SurName,
        this.Email = data.Email,
        this.Password = data.Password,
        this.ConformPassword = data.Password,
        this.Mobile = data.Mobile,
        this.RoleId = 2,
        this.Status = data.Status,
        this.InviteCode = data.Reffercode || this.InviteCode || localStorage.getItem('pendingReferralCode') || ''
    } else {
      this.flags = 3
      this.Policy = true;
      this.OTPVerified = 1
      const data = this.mydata[0];
      this.FirstName = data.FirstName || data.UserName,
      this.MiddleName = data.MiddleName,
      this.SurName = data.SurName,
        this.Email = data.Email,
        this.Mobile = data.Mobile,

        this.Password = data.Password,
        this.ConformPassword = data.Password,
        this.RoleId = 2,
        this.Status = data.Status,
        this.InviteCode = data.Reffercode || this.InviteCode || localStorage.getItem('pendingReferralCode') || '',

        this.getdata1();
    }

  }
  getdata1() {
    
    this.flags = 3
    this.TandC = true;
    this.Policy = true;
    this.OTPVerified = 1
    const data = this.mydata[0];
    this.FirstName = data.FirstName || data.UserName,
    this.MiddleName = data.MiddleName,
    this.SurName = data.SurName,
      this.Email = data.Email,
      this.Mobile = data.Mobile,

      this.Password = data.Password,
      this.ConformPassword = data.Password,
      this.RoleId = 2,
      this.Status = data.Status,
      this.InviteCode = data.Reffercode || this.InviteCode || localStorage.getItem('pendingReferralCode') || ''
  }

  VerifyMobileEmail() {
    
    if (this.Mobile != null) {
      if (this.Mobile.length == 10) {
        let uploadFile = new FormData();
        uploadFile.append("Mobile", this.Mobile);
        var url = 'api/BG/checking_Mobile';
        this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
          
          if (result == "NOTEXIST") {
            this.SendOTPToMobile();
          } else {
            this.generalservice.presentToast('Your email or mobile is already exists. Please login.');
            this.navCtrl.navigateForward(['/login']);
          }
        })
      } else {
        this.generalservice.presentToast('Please enter valid mobile number...!');
      }
    } else {

      this.generalservice.presentToast('Please enter mobile number...!');
    }
  }

  SendOTPToMobile() {
    this.OTP = Math.floor(1000 + Math.random() * 9000);
    var UploadFile = new FormData();
    console.log('OTP :', this.Mobile);
    console.log('OTP :', this.OTP);
    UploadFile.append("MobileNo", this.Mobile);
    UploadFile.append("OTP", this.OTP);
    var url = "api/BG/SendOtpToMobile";
    this.generalservice.PostData(url, UploadFile).subscribe((data: any) => {
      if (data == "SUCCESS") {
        this.OTPFlag = 1;
        this.otpDigits = ['', '', '', ''];
        this.updateMobileOtp();
        this.generalservice.presentToast('OTP sent successfully!');
        this.startResendTimer();
        this.startSmsAutoReader();
        this.focusOtpInput(0);
      } else {
        this.generalservice.presentToast('Failed to send OTP. Please try again.');
      }
    }, (err: any) => {
      this.generalservice.presentToast('Failed to send OTP. Please try again.');
    });
  }

  CheckOTP() {
    if (this.MobileOTP == this.OTP) {
      this.OTPVerified = 1;
      this.OTPFlag = 0;
      this.stopSmsAutoReader();
      if (this.DonorFlag == 1) {
        this.navCtrl.navigateForward(['/donor-registration', { Mobile: this.Mobile, DonorFlag: 1 }]);
      }
    } else {
      this.generalservice.presentToast('Please enter correct otp...!');
    }
  }

  validateEmail(email: string): string | null {
    if (!email) return 'Email is required.';
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return 'Please enter a valid email address (e.g., user@example.com).';
    }
    return null;
  }

  onEmailChange(value: string) {
    this.Email = value;
    this.emailError = this.validateEmail(value);
  }

  validateFirstName(name: string): string | null {
    if (!name) return 'First Name is required.';
    if (!/^[a-zA-Z]+$/.test(name)) return 'First Name cannot contain caste names, spaces, special characters, or numbers.';
    const lowerName = name.toLowerCase().trim();
    const restricted = this.generalservice.restrictedCasts || [];
    if (restricted.includes(lowerName)) return 'First Name cannot contain caste names, spaces, special characters, or numbers.';
    return null;
  }

  onFirstNameChange(value: string) {
    if (!value) {
      this.FirstName = value;
      this.firstNameError = this.validateFirstName(value);
      return;
    }
    if (/[^a-zA-Z]/.test(value)) {
       this.firstNameError = 'First Name cannot contain caste names, spaces, special characters, or numbers.';
       setTimeout(() => {
         this.FirstName = value.replace(/[^a-zA-Z]/g, '');
       });
    } else {
       this.FirstName = value;
       this.firstNameError = this.validateFirstName(value);
    }
  }

  preventInvalidChars(event: KeyboardEvent) {
    if (event.key.length === 1 && !/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
      this.firstNameError = 'First Name cannot contain caste names, spaces, special characters, or numbers.';
    }
  }

  onPasteSanitize(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    if (/[^a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
      this.firstNameError = 'First Name cannot contain caste names, spaces, special characters, or numbers.';
    }
  }

  NextDetails() {
    
    if (this.Password == this.ConformPassword) {
     if (this.FirstName != undefined) {
        if (this.FirstName != "" && this.Email != "" && this.Password != "") {
          this.firstNameError = this.validateFirstName(this.FirstName);
          if (this.firstNameError !== null) {
            this.generalservice.presentToast(this.firstNameError);
            return;
          }
          this.emailError = this.validateEmail(this.Email);
          if (this.emailError !== null) {
            this.generalservice.presentToast(this.emailError);
            return;
          }
          if (this.TandC == true || this.Policy == true) {
            this.isSubmitting = true;
            this.generalservice.present('Registering your account, please wait...');
            var obj = [{
              FullName: this.FirstName,
              FirstName: this.FirstName,
              MiddleName: this.MiddleName,
              SurName: this.SurName,
              Phonenumber: this.Mobile,
              Email: this.Email,
              Reffercode: this.InviteCode,
              Password: this.Password
              //RoleId: 2,
              //Status: true
            }]
            var UploadFile = new FormData();
            UploadFile.append("Param", JSON.stringify(obj));
            UploadFile.append("Flag", "1");
            var url = "api/BG/Insert_Update_DonersForm";
            this.generalservice.PostData(url, UploadFile).subscribe((data: any) => {
              this.isSubmitting = false;
              this.generalservice.dismiss();
              if (data == "SUCCESS") {
                localStorage.removeItem('pendingReferralCode');
                sessionStorage.removeItem('pendingReferralCode');
                this.GetUserdata();
                //this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, UserName: this.UserName, InviteCode: this.InviteCode }]);
              } else if (data == "Mobile Exists") {
                this.generalservice.presentToast('Your mobile is already exists. please login');
                this.navCtrl.navigateForward(['/login']);
              } else {
                this.generalservice.presentToast('Something went wrong. Please try again later.');
              }
            }, (err: any) => {
              this.isSubmitting = false;
              this.generalservice.dismiss();
              this.generalservice.presentToast('Something went wrong. Please try again later.');
            })


          } else {
            this.generalservice.presentToast('Please read and accept terms and policy');
          }
        } else {
          this.generalservice.presentToast('Please enter first and last name and please check password');

          //this.generalservice.presentToast('Please enter first and last name');
        }
     } else {
       this.generalservice.presentToast('Please enter all fields ');

      }

    } else {
      this.generalservice.presentToast('Please enter valid passwords.');

    }
  }

  GetUserdata() {
    
    this.Devicetoken1 = localStorage.getItem("Token")
    this.Devicetoken = JSON.parse(this.Devicetoken1);

    let uploadFile = new FormData();
    uploadFile.append("Mobile", this.Mobile);
    var url = 'api/BG/checking_Mobile';
    this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
      
      if (result != "NOTEXIST") {
        localStorage.setItem("UserDetails", JSON.stringify(result));
        var array = [{
          RegId: result[0].RegId,
          Devicetoken: this.Devicetoken
        }];
        let formData: FormData = new FormData();
        formData.append('tokenDetails', JSON.stringify(array));
        var url = "api/BG/UpdateDeviceToken";
        this.generalservice.PostData(url, formData).subscribe((data: any) => {
        });
        this.user.getreferalcodeusers(result[0].ReffererId).subscribe((data: any) => {
          if (data != null) {
            this.SendNote(result[0].ReffererId, result[0].RegId, data);
          }
        });
        this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, FirstName: this.FirstName, MiddleName: this.MiddleName, SurName: this.SurName, InviteCode: this.InviteCode }]);
      }
    })
  }

  SendNote(ReceiverID: any, UserID: any, data: any) {
    
    var path = "requsetform";
    const massege = "Excited to inform you that " + this.FirstName + " .has registered using your referral code. Thank you for sharing our service and helping us grow!";
    var UploadFile = new FormData();
    UploadFile.append("deviceId", data[0].Devicetoken);
    UploadFile.append("message", massege);
    UploadFile.append("senderName", "BloodGroup");
    UploadFile.append("path", path);
    UploadFile.append("Img", "");
    var notificationUrl = "api/BG/sendNotification";
    this.generalservice.PostData(notificationUrl, UploadFile).subscribe((notificationData: any) => {
      ;

      var Test = [{
        RegID: ReceiverID,
        NotificationsDesc: massege,
        CreatedBy: UserID
      }]

      var notificationsUrl = "api/BG/Crud_Notifications";
      var notificationsUploadFile = new FormData();
      notificationsUploadFile.append("Param", JSON.stringify(Test));
      notificationsUploadFile.append("Flag", "1");

      this.generalservice.PostData(notificationsUrl, notificationsUploadFile).subscribe(() => {
       // this.SendMailtoCustomer();
      });
    });
  }

  SendMailtoCustomer() {
    
    var uploadfile = new FormData();
    uploadfile.append("Email", this.Email);
    var url = "api/BG/customerRegconformmail";
    this.generalservice.PostData(url, uploadfile).subscribe((data: any) => {
      if (data == "SUCCESS") {
        this.generalservice.presentAlert("SUCCESS", 'Confirmation mail to Register Details');
        this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, FirstName: this.FirstName, MiddleName: this.MiddleName, SurName: this.SurName, InviteCode: this.InviteCode }]);
      }
      else {
        this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, FirstName: this.FirstName, MiddleName: this.MiddleName, SurName: this.SurName, InviteCode: this.InviteCode }]);
      }
    });
  }


  Signup(val: any) {
    
    if (this.SignupForm.valid) {
      var obj = [{
        Email: val.Email,
        Password: val.Password,
        RoleId: 2,
        //Status: true
      }]
      var UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", "1");
      var url = "api/BG/Insert_Update_DonersForm";
      this.generalservice.PostData(url, UploadFile).subscribe((data: any) => {
        
        if (data == "SUCCESS") {
          let uploadFile = new FormData();
          uploadFile.append("Mobile", val.Email);
          var url = 'api/BG/checking_Mobile';
          this.generalservice.PostData(url, uploadFile).subscribe((result: any) => {
            
            if (result != "NOTEXIST") {
              localStorage.setItem("UserDetails", JSON.stringify(result));
              this.navCtrl.navigateForward(['/registration']);
            }
          })
          //this.generalservice.presentAlert("SUCCESS", "Your registration has been completed successfully.");        
          //this.generalservice.presentToast("Your email is already exists.");
        } else if (data == "Mobile Exists") {
          this.generalservice.presentToast('Your email is already exists. please login');
          this.navCtrl.navigateForward(['/login']);
        } else {
          this.generalservice.presentToast('Something went wrong. Please try again later.');
          //this.navCtrl.navigateForward(['/registration', { Email: val.Email, Password: val.Password }]);
          //localStorage.setItem("UserID", data);
        }
      })
    } else {
      this.generalservice.presentToast('Please enter all fields.');
    }
  }

  tac() {


    var obj = [{
      FirstName: this.FirstName,
      MiddleName: this.MiddleName,
      SurName: this.SurName,
      Mobile: this.Mobile,
      Email: this.Email,
      Password: this.Password,
      RoleId: 2,
      //Status: true,
      Reffercode: this.InviteCode,

    }]
    this.navCtrl.navigateForward(['/termsofusedisclaimer', { data: JSON.stringify(obj) }])



  }

  policy() {

    var obj = [{
      FirstName: this.FirstName,
      MiddleName: this.MiddleName,
      SurName: this.SurName,
      Mobile: this.Mobile,
      Email: this.Email,
      Password: this.Password,
      RoleId: 2,
      //Status: true,
      Reffercode: this.InviteCode,

    }]
    this.navCtrl.navigateForward(['/privacypolicy', { data: JSON.stringify(obj) }])


  }

}
