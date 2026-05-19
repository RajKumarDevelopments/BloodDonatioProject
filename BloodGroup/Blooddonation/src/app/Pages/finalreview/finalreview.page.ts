import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Camera, CameraResultType, CameraSource, ImageOptions, } from '@capacitor/camera'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ActionSheetController, ModalController, NavController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { ActivatedRoute } from '@angular/router';
import { Filesystem, Directory, Encoding, FilesystemDirectory, FilesystemEncoding } from '@capacitor/filesystem';
import { catchError } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import Panzoom from 'panzoom';
import { map } from 'rxjs/operators';
import { PermissionService } from '../../Services/permission/permission.service'
import { Share } from '@capacitor/share';
import { UserService } from '../../Services/user/user.service'
import html2canvas from 'html2canvas';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import imageCompression from 'browser-image-compression';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-finalreview',
  templateUrl: './finalreview.page.html',
  styleUrls: ['./finalreview.page.scss'],
})
export class FinalreviewPage implements OnInit {
  ids: any;
  Retakeimg: any;
  myimge: any;
  selectedImage: any;
  getdata: any;
  mycompltedata: any;
  SelectedBloodRequestID: any;
  HomeUrl: any;
  staticImage: any;
  dynamicImage: any;
  completedData: any;
  imageBase64: any;
  staticImageBase64: any;
  state: any;
  district: any;
  District: any
  city: any;
  dynamicimageBase64: any;
  Apiurls1: any;
  combinedImageUrl: string | null = null;
  combinedImageBase64: any;
  imagePreview: any;
  userdetail: any;
  UserDetails: any;
  @ViewChild('panzoomContainer') panzoomContainer!: ElementRef;
  retakeimage: any;
  arr2: any;
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  imagePosition = { top: 20, left: 20 };
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  dynamicImage11: any;
  staticImage1: any;
  MySelectedImage: any;
  myDonateddate: any;
  base64DataUrl: any;
  @ViewChild('idCard') idCardElement!: ElementRef;
  val: any;
  MyDonateddate: any;
  Rolestatus: any;
  Rolid: any;
  selectedTemplate: any;
  templateNumber: any;

  constructor(
    public general: GeneralService,
    public http: HttpClient,
    public actionSheetController: ActionSheetController,
    private androidPermissions: AndroidPermissions,
    private modal: ModalController,
    private navCtrl: NavController,
    public activeRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private share: SocialSharing,
    private userService: UserService,
    private location: Location,
    private platform: Platform
  ) {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
    this.state = localStorage.getItem("State");
    this.district = localStorage.getItem("District");
    this.city = localStorage.getItem("City");

    if (this.UserDetails != null) {
      if (this.UserDetails[0].Rolestatus == true) {
        this.Rolestatus = true;
        this.Rolid = 4
      } else {
        this.Rolid = 0
      }
    }

    this.HomeUrl = localStorage.getItem("URL");
    this.myDonateddate = this.activeRoute.snapshot.paramMap.get("Donateddate");

    // Try to get image from route params first
    this.MySelectedImage = this.activeRoute.snapshot.paramMap.get("dynamicimg");

    // If not in route params, try localStorage as fallback
    if (!this.MySelectedImage || this.MySelectedImage === 'null') {
      this.MySelectedImage = localStorage.getItem('framedImage');
      console.log('Retrieved image from localStorage');
    }

    // Get template info
    this.selectedTemplate = this.activeRoute.snapshot.paramMap.get("selectedTemplate");
    this.templateNumber = this.activeRoute.snapshot.paramMap.get("templateNumber");

    console.log('Final Review - Image loaded:', !!this.MySelectedImage);
    console.log('Final Review - Template:', this.selectedTemplate, 'Number:', this.templateNumber);

    if (this.myDonateddate && this.myDonateddate !== "null") {
      this.getdata = this.activeRoute.snapshot.paramMap.get("completedata");

      if (this.getdata && this.getdata !== 'null') {
        try {
          this.mycompltedata = JSON.parse(this.getdata);
          this.MyDonateddate = this.myDonateddate;
          this.SelectedBloodRequestID = this.mycompltedata.BloodRequestID;
        } catch (error) {
          console.error('Error parsing complete data:', error);
        }
      }
    }

    this.ids = this.activeRoute.snapshot.paramMap.get("id");

    if (this.ids) {
      this.myimge = this.activeRoute.snapshot.paramMap.get("image");
      if (this.myimge) {
        this.selectedImage = this.myimge
      }

      this.Retakeimg = this.activeRoute.snapshot.paramMap.get("retakeimage");
      if (this.Retakeimg) {
        this.selectedImage = this.Retakeimg
      }
    }
  }

  ngOnInit() {
    // Verify image is loaded
    if (!this.MySelectedImage) {
      console.error('No image data available!');
      this.general.presentAlert("Error", "Image data not found. Please go back and try again.");
    }
  }

  back() {
    // Clear localStorage on back
    localStorage.removeItem('framedImage');
    localStorage.removeItem('selectedTemplate');
    this.location.back();
  }

  submit() {
    if (!this.MySelectedImage) {
      this.general.presentToast("Image not loaded properly. Please go back and try again.");
      return;
    }

    if (this.SelectedBloodRequestID != null) {
      if (this.MySelectedImage != null) {
        var UploadFile = new FormData();
        UploadFile.append("BloodDonationImage", this.MySelectedImage);
        UploadFile.append("BloodRequestID", this.SelectedBloodRequestID);
        UploadFile.append("RoleId", this.Rolid);
        var url = "api/BG/UploadBloodDonationImagebyDonorwitroleid";

        this.general.PostData(url, UploadFile).subscribe((data: any) => {
          if (data == "SUCCESS") {
            // Clear localStorage after successful submit
            localStorage.removeItem('framedImage');
            localStorage.removeItem('selectedTemplate');

            this.general.presentAlert("SUCCESS", "You successfully uploaded image.");
            this.navCtrl.navigateForward('/home');
            this.sendmailtoadmin();
            this.downloadImage();
          }
        });
      } else {
        this.general.presentToast("Please upload your image..!");
      }
    } else {
      this.noreqqstid()
    }
  }

  noreqqstid() {
    if (this.MySelectedImage != null) {
      var obj = [{
        HospitalName: this.mycompltedata[0].hospitalname,
        Institutionname: this.mycompltedata[0].hospitaladdress,
        newStatename: this.state,
        newDistrictname: this.district,
        newCityname: this.city,
        HospitalAddress: this.mycompltedata[0].hospitaladdress,
        Dateofservice: this.MyDonateddate,
        RoleId: this.Rolid,
        GalleryImages: this.MySelectedImage,
        BloodDonationImage: this.MySelectedImage,
        RegId: this.UserDetails[0].RegId,
        CreatedBy: this.UserDetails[0].RegId,
        ModifiedBy: this.UserDetails[0].RegId,
        BloodRequestID: this.mycompltedata[0].BloodrequestID,
        AdminApprovedStatus: 1,
        Categoryid: 1,
        SYSSubmitted: 1,
      }]

      var UploadFile = new FormData();
      UploadFile.append("Param", JSON.stringify(obj));
      UploadFile.append("Flag", '1');
      var url = "api/BG/UploadBloodDonationImagenorqstId";

      this.general.PostData(url, UploadFile).subscribe((data: any) => {
        if (data == "SUCCESS") {
          // Clear localStorage after successful submit
          localStorage.removeItem('framedImage');
          localStorage.removeItem('selectedTemplate');

          this.general.presentAlert("SUCCESS", "Thank you, once approved, you will receive a certificate to your email and the image will appear in your gallery. And then please share or publish these on your LinkedIn and social platforms.");
          this.navCtrl.navigateForward('/home');
          this.sendmailtoadmin();
          this.downloadImage();
        }
      });
    }
  }

  async downloadImage() {
    const fileName = `${new Date().getTime()}.jpeg`;

    try {
      const fileUri = await this.userService.saveBase64ToGallery(this.MySelectedImage, fileName);

      if (fileUri) {
        console.log('Image saved to:', fileUri);
      } else {
        console.error('Failed to save the image.');
      }
    } catch (error) {
      console.error('Error during image saving:', error);
    }
  }

  async requestPermissions() {
    try {
      const result = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      );
      if (!result.hasPermission) {
        const requestResult = await this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        );
        if (!requestResult.hasPermission) {
          console.error('Permission denied');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error checking permissions', error);
      return false;
    }
  }

  async downloadImageToGallery(imageUrl: string) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const fileName = `image_${new Date().getTime()}.jpg`;
      const base64Data = await this.convertBlobToBase64(blob);

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data.split(',')[1],
        directory: Directory.External,
        recursive: true,
      });

      console.log('Image saved successfully to gallery:', result.uri);
    } catch (error) {
      console.error('Error saving image to gallery:', error);
    }
  }

  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  sendmailtoadmin() {
    var obj = [{
      Email: this.UserDetails[0].Email,
      FullName: this.UserDetails[0].FullName,
      HospitalAddress: this.mycompltedata[0].hospitaladdress,
      Dateofservice: this.MyDonateddate,
    }]

    const UploadFile = new FormData();
    UploadFile.append("Email", JSON.stringify(obj));
    const url = "api/BG/EnquiryMailTo_BloodCustomers";

    this.general.PostData(url, UploadFile).subscribe(data => {
      this.navCtrl.navigateForward('/home')
    });
  }

  send_Mail() {
    this.arr2 = [];
    this.arr2.push({
      FullName: this.UserDetails[0].FullName,
      Email: this.UserDetails[0].Email,
      Dateofservice: this.MyDonateddate,
    });

    var UploadFile = new FormData();
    UploadFile.append("SPR", JSON.stringify(this.arr2));
    UploadFile.append("url", this.HomeUrl);
    var url = "api/BG/MailPlaceOrdercerti";

    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      // Handle the response if needed
    });
  }

  async loadCanvas() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const canvas = await html2canvas(this.idCardElement.nativeElement);
    this.base64DataUrl = canvas.toDataURL();
    console.log(this.base64DataUrl);
  }

  async shareCardViaWhatsApp() {
    if (!this.MySelectedImage) return;

    const text = "Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it's giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe.";
    const fileName = 'blood_donation_card_' + new Date().getTime() + '.jpg';

    try {
      const isNative = this.platform.is('hybrid') ||
        this.platform.is('android') ||
        this.platform.is('ios') ||
        this.platform.is('capacitor') ||
        this.platform.is('cordova');

      if (isNative) {
        // 1. Save Base64 or URL to a temporary file
        let base64Data = this.MySelectedImage;
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }

        const savedFile = await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Cache
        });

        const uriResult = await Filesystem.getUri({
          path: fileName,
          directory: Directory.Cache
        });

        console.log('📤 Sending native ID card attachment:', uriResult.uri);

        // 2. Share the file URI using SocialSharing for better attachment success
        await this.share.share(
          '', // No message
          '', // No subject
          uriResult.uri, // file
          undefined // url
        );
      } else {
        // Web fallback
        await Share.share({
          title: 'My Blood Donation Card',
          url: this.MySelectedImage.startsWith('http') ? this.MySelectedImage : undefined
        });
      }
      console.log('Shared successfully');
    } catch (error: any) {
      console.error('Error sharing card:', error);
      this.general.presentToast('Sharing failed: ' + (error.message || 'Unknown error'));
    }
  }
}

