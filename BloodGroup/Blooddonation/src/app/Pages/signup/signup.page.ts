import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'
import { UserService } from '../../Services/user/user.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  SignupForm!: FormGroup;
  submitAttempt: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  Mobile: any; MobileOTP: any; OTP: any;
  UserName: any; InviteCode: any;
  OTPFlag: any; SignFlag: any;
  OTPVerified: any;
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
  constructor(private generalservice: GeneralService, public navCtrl: NavController,
    private formBuilder: FormBuilder, public activeRoute: ActivatedRoute, public user: UserService) {
    
    this.SignupForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
      TandC: [false, Validators.required],
      Policy: [false, Validators.required],
    });
    

    this.DonorFlag = this.activeRoute.snapshot.paramMap.get("DonorFlag");
    this.data1 = this.activeRoute.snapshot.paramMap.get("objs");
    this.mydata = JSON.parse(this.data1);
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
  }

  ngOnInit() {
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
      this.UserName = data.UserName,
        this.Email = data.Email,
        this.Password = data.Password,
        this.ConformPassword = data.Password,
        this.Mobile = data.Mobile,
        this.RoleId = 2,
        this.Status = data.Status,
        this.InviteCode = data.Reffercode
    } else {
      this.flags = 3
      this.Policy = true;
      this.OTPVerified = 1
      const data = this.mydata[0];
      this.UserName = data.UserName,
        this.Email = data.Email,
        this.Mobile = data.Mobile,

        this.Password = data.Password,
        this.ConformPassword = data.Password,
        this.RoleId = 2,
        this.Status = data.Status,
        this.InviteCode = data.Reffercode,

        this.getdata1();
    }

  }
  getdata1() {
    
    this.flags = 3
    this.TandC = true;
    this.Policy = true;
    this.OTPVerified = 1
    const data = this.mydata[0];
    this.UserName = data.UserName,
      this.Email = data.Email,
      this.Mobile = data.Mobile,

      this.Password = data.Password,
      this.ConformPassword = data.Password,
      this.RoleId = 2,
      this.Status = data.Status,
      this.InviteCode = data.Reffercode
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
    
    //this.OTPFlag = 1;
    this.OTP = Math.floor(1000 + Math.random() * 9000);
    var UploadFile = new FormData();
    UploadFile.append("MobileNo", this.Mobile);
    UploadFile.append("OTP", this.OTP);
    var url = "api/BG/SendOtpToMobile";
    this.generalservice.PostData(url, UploadFile).subscribe((data: any) => {
      
      if (data == "SUCCESS") {
        this.OTPFlag = 1;
      }
    })
  }

  CheckOTP() {
    
    if (this.MobileOTP == this.OTP) {
      this.OTPVerified = 1;
      this.OTPFlag = 0;
      if (this.DonorFlag == 1) {
        this.navCtrl.navigateForward(['/donor-registration', { Mobile: this.Mobile, DonorFlag: 1 }]);
      }

    } else {
      this.generalservice.presentToast('Please enter correct otp...!');
    }
  }

  NextDetails() {
    
    if (this.Password == this.ConformPassword) {
     if (this.UserName != undefined) {
        if (this.UserName != "" && this.Email != "" && this.Password != "") {
          if (this.TandC == true || this.Policy == true) {
            var obj = [{
              FullName: this.UserName,
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
              
              if (data == "SUCCESS") {
                this.GetUserdata();
                //this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, UserName: this.UserName, InviteCode: this.InviteCode }]);
              } else if (data == "Mobile Exists") {
                this.generalservice.presentToast('Your mobile is already exists. please login');
                this.navCtrl.navigateForward(['/login']);
              } else {
                this.generalservice.presentToast('Something went wrong. Please try again later.');
              }
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
         // this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, UserName: this.UserName, InviteCode: this.InviteCode }]);
          //this.navCtrl.navigateForward(['/home']);
        });
        this.user.getreferalcodeusers(result[0].ReffererId).subscribe((data: any) => {
          if (data != null) {
            this.SendNote(result[0].ReffererId, result[0].RegId, data);
          }
        });
        //this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, UserName: this.UserName, InviteCode: this.InviteCode }]);
      }
    })
  }

  SendNote(ReceiverID: any, UserID: any, data: any) {
    
    var path = "requsetform";
    const massege = "Excited to inform you that " + this.UserName + " .has registered using your referral code. Thank you for sharing our service and helping us grow!";
    var UploadFile = new FormData();
    UploadFile.append("deviceToken", data[0].Devicetoken);
    UploadFile.append("message", massege);
    UploadFile.append("senderName", "BloodGroup");
    UploadFile.append("Path", path);
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
        this.SendMailtoCustomer();
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
        this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, UserName: this.UserName, InviteCode: this.InviteCode }]);
      }
      else {
        this.navCtrl.navigateForward(['/registration', { Mobile: this.Mobile, UserName: this.UserName, InviteCode: this.InviteCode }]);
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
      UserName: this.UserName,
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
      UserName: this.UserName,
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
