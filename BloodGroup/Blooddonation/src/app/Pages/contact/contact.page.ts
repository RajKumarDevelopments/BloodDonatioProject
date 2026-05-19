import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
//import Swal from 'sweetalert2';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  @ViewChild('modal1') modal1: IonModal | undefined;

  UserDetails1: any;
  UserDetails: any;
  RequestForm: FormGroup;
  isModalOpen = false;
  FullName: any;
  Emailid: any;
  selecttype: any;
  reasons: any;
   
  SelectedReason: any;
  reason: any;
  val: any;
  SelectedReasons: any;
  uploadedImagePath: string | null = null; // store uploaded path
  // New properties for image upload
  selectedImage: string | null = null;
  selectedImageFile: File | null = null;
    URL: string | null;
    fileToUpload: any;
  selectedReason: string = "";

  constructor(
    public general: GeneralService,
    public navCtrl: NavController,
    public modalctrl: ModalController,
    private Fb: FormBuilder,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.URL = localStorage.getItem("URL");
    this.UserDetails = JSON.parse(this.UserDetails1);

    this.reasons = [
      { value: 'App Issues', label: 'App Issues' },
      { value: 'Feedback', label: 'Feedback' },
      { value: 'Complain', label: 'Complain' },
      { value: 'Other', label: 'Other' }
    ];

    this.RequestForm = this.Fb.group({
      Fullname: [this.UserDetails ? this.UserDetails[0]?.FullName : '', Validators.required],
      email: [this.UserDetails ? this.UserDetails[0]?.Email : '', [Validators.required, Validators.email]],
      selectedReason: ['', Validators.required],
      Message: [''],
      Phonenumber: [this.UserDetails ? this.UserDetails[0]?.Phonenumber : ''],// Not mandatory
    });
  }

  ngOnInit() {
    // Initialize form with user details if available
    if (this.UserDetails && this.UserDetails.length > 0) {
      this.RequestForm.patchValue({
        Fullname: this.UserDetails[0].FullName,
        Phonenumber: this.UserDetails[0].Phonenumber,
        email: this.UserDetails[0].Email
      });
    }
  }

  onReasonChange() {
    // This method will be called when reason is selected
    console.log('Selected reason:', this.selectedReason);
  }


Contactinsert() {

    var obj = [{
      RegId: this.UserDetails[0].RegId,
      Report: this.RequestForm.value.selectedReason,

      Comments: this.RequestForm.value.Message,
      Status:true,
     // Place_name: val.Place_name,
      // Place_name: this.BrocherForm.value.Place_name,
      Createdby: this.UserDetails[0].RegId

    }];

    var UploadFile = new FormData();
    UploadFile.append("param", JSON.stringify(obj));
    var url = "api/BG/InsertContactReport_MOBILE";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      
      if (data === "SUCCESS") {
        // Wait for alert to be presented before opening the PDF
        //this.viewPdf(this.HomeUrl + this.downBanners[0].BannerPath)
       
      
      } else {
        this.general.presentToast('Something went wrong. Please try again later.');
      }
    });
  }





  // Image upload functionality
  async selectImageSource() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.captureImage(CameraSource.Camera);
          }
        },
        {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            this.captureImage(CameraSource.Photos);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async captureImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });

      if (image.dataUrl) {
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'contact_image.jpg', { type: 'image/jpeg' });

        // Upload to API server
        const serverPath = await this.uploadImageToServer(file);

        // Save server path (to show image later & to send in mail API)
        this.selectedImage = serverPath;
        this.selectedImageFile = null; // not needed anymore
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      this.presentAlert("Error", "Failed to capture image. Please try again.");
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadImageToServer(file)
        .then(path => {
          console.log("Image uploaded, path:", path);
          this.selectedImage = this.URL + path;
        })
        .catch(err => {
          this.presentAlert("Error", "Failed to upload image. Please try again.");
        });
    }
  }
  async SendEmail() {
    if (!this.RequestForm.get('selectedReason')?.value) {
      this.presentAlert('Validation Error', 'Please select a reason.');
      return;
    }

    const formValues = this.RequestForm.value;

    if (this.fileToUpload) {
      try {
        await this.uploadImageToServer(this.fileToUpload);
      } catch (error) {
        this.presentAlert('Error', 'Image upload failed. Please try again.');
        return;
      }
    }
    

      await this.Contactinsert();
    const formData = new FormData();
    formData.append('Type', formValues.selectedReason);
    formData.append('Fullname', formValues.Fullname);
    formData.append('Phonenumber', formValues.Phonenumber);
    formData.append('EmailID', formValues.email);
    formData.append('Comments', formValues.Message || '');
    formData.append('AttachmentPath',(this.URL ?? '') + (this.uploadedImagePath ?? ''));


    const url = "api/BG/EnquiryMailTo_BloodCustomerr";

    const loading = await this.loadingController.create({
      message: 'Sending mail...',
      spinner: 'crescent'
    });
    await loading.present();

    this.general.PostData(url, formData).subscribe({
      next: (data) => {
        loading.dismiss();
        this.general.presentToast('Mail sent Successfully');
        this.navCtrl.navigateForward('/home');
      },
      error: (error) => {
        loading.dismiss();
        this.presentAlert('Error', 'Failed to send mail. Please try again.');
        console.error('Error sending mail:', error);
      }
    });
  }


 
  async uploadImageToServer(file: File): Promise<string> {
    
    const formData = new FormData();
    formData.append("attachment", file);

    const url = "api/BG/UploadContactAttachmentImage";

    return new Promise<string>((resolve, reject) => {
      this.general.PostData(url, formData).subscribe({
        next: (response: any) => {
          console.log("Upload response:", response);        
          if (response && response.path) {
            this.uploadedImagePath = response.path;
            console.log("uploadedImagePath set:", this.uploadedImagePath);
            resolve(response.path);
          } else {
            reject("No path returned from server");
          }
        },
        error: (err) => {
          console.error("Error uploading image:", err);
          reject(err);
        }
      });
    });
  }

  removeImage() {
    this.selectedImage = null;
    this.selectedImageFile = null;
  }
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Helper method to check if reason is selected
  isReasonSelected(): boolean {
    return !!this.RequestForm.get('selectedReason')?.value;
  }
}
