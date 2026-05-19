import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Media } from '@capacitor-community/media';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-letshlpgallerry',
  templateUrl: './letshlpgallerry.page.html',
  styleUrls: ['./letshlpgallerry.page.scss'],
})
export class LetshlpgallerryPage implements OnInit {
  UserDetails1: any;
  UserDetails: any;
  //gallery: any;
  HomeUrl: any;
  avblimg: any; val: any; mygallery: any;
  myid = 2;// otherimgs: any;
  converted_image: any; MySelectedImage: any; //selfimgs: any;
  //leaderimgs: any;
  //selectedTab: number = 1;
  selectedTab: string = 'Self';
  showDownloadToast: boolean = false;
  downloadToastTimer: any;
  downloadedImageUrl: string = '';
  savedFilePath: string = '';
  showImagePreview: boolean = false;
  previewImageUrl: string = '';

  displayedOtherImgs: any[] = []; // Lazy-loaded "All" images
  displayedSelfImgs: any[] = []; // Lazy-loaded "Self" images
  displayedLeaderImgs: any[] = []; // Lazy-loaded "Leaders" images
  itemsPerPage: number = 50; // Number of items to load per scroll
  gallery: any[] = []; // All images from API
  otherimgs: any[] = []; // Images for "All" tab
  selfimgs: any[] = []; // Images for "Self" tab
  leaderimgs: any[] = [];

  constructor(private Fb: FormBuilder,
    private modal: ModalController,
    public datePipe: DatePipe,
    public general: GeneralService,
    public navCtrl: NavController, public activeRoute: ActivatedRoute, private share: SocialSharing,
    private Http: HttpClient, private photoViewer: PhotoViewer, private loadingController: LoadingController,
    private platform: Platform) {

    this.HomeUrl = localStorage.getItem("URL");
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    if (this.UserDetails[0].Status == false) {
      //  this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    } else {
    }
  }

  ngOnInit() {
    this.getgallery();

  }

  back() {
    this.val = 2
    this.getgallery();
  }

  change2(img: any) {

    this.mygallery = img.GalleryImages
    this.val = 1
  }

  selectgallery1(tab: number) {
    //this.selectedTab = tab;

  }

  async setTab(tab: string) {
    // Show loader
    const loading = await this.loadingController.create({
      message: 'Please Wait...',
      spinner: 'crescent',
      duration: 5000, // Fallback timeout
    });
    await loading.present();

    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }

    try {
      // Fetch data and reset displayed images for the selected tab
      if (tab === 'All') {
        this.myid = 1;
        this.displayedOtherImgs = this.otherimgs.slice(0, this.itemsPerPage);
      } else if (tab === 'Self') {
        this.myid = 2;
        this.displayedSelfImgs = this.selfimgs.slice(0, this.itemsPerPage);
      } else if (tab === 'Leaders') {
        this.myid = 3;
        this.displayedLeaderImgs = this.leaderimgs.slice(0, this.itemsPerPage);
      }
    } finally {
      // Dismiss the loader once data is ready
      await loading.dismiss();
    }
  }
  setTab2(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }

    // Fetch data and reset displayed images for the selected tab
    if (tab === 'All') {
      this.myid = 1;
      this.displayedOtherImgs = this.otherimgs.slice(0, this.itemsPerPage);
    } else if (tab === 'Self') {
      this.myid = 2;
      this.displayedSelfImgs = this.selfimgs.slice(0, this.itemsPerPage);
    } else if (tab === 'Leaders') {
      this.myid = 3;
      this.displayedLeaderImgs = this.leaderimgs.slice(0, this.itemsPerPage);
    }
  }

  getgallery() {
    const obj = [{}];
    const uploadfile = new FormData();
    uploadfile.append('Param', JSON.stringify(obj));
    uploadfile.append('Flag', '6');

    const url = 'api/BG/Gallery_Crud'; // Replace with your API endpoint

    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.gallery = Array.isArray(data) ? data : [];

      // Filter images by category
      this.otherimgs = this.gallery.filter((img: any) => img.RegId != this.UserDetails[0].RegId);
      this.selfimgs = this.gallery.filter((img: any) => img.CreatedBy == this.UserDetails[0].RegId);
      this.leaderimgs = this.gallery.filter((img: any) => img.RoleId == 4);

      // Initialize lazy-loaded arrays for the first batch
      this.displayedOtherImgs = this.otherimgs.slice(0, this.itemsPerPage);
      this.displayedSelfImgs = this.selfimgs.slice(0, this.itemsPerPage);
      this.displayedLeaderImgs = this.leaderimgs.slice(0, this.itemsPerPage);
    }, err => {
      this.gallery = [];
      this.otherimgs = [];
      this.selfimgs = [];
      this.leaderimgs = [];
      this.displayedOtherImgs = [];
      this.displayedSelfImgs = [];
      this.displayedLeaderImgs = [];
      this.general.presentToast("something went wrong");
    });
  }

  loadMore(type: string, event: any) {
    setTimeout(() => {
      let displayedImages: any[] = [];
      let allImages: any[] = [];

      // Determine which set of images to load more for
      if (type === 'otherimgs') {
        displayedImages = this.displayedOtherImgs;
        allImages = this.otherimgs;
      } else if (type === 'selfimgs') {
        displayedImages = this.displayedSelfImgs;
        allImages = this.selfimgs;
      } else if (type === 'leaderimgs') {
        displayedImages = this.displayedLeaderImgs;
        allImages = this.leaderimgs;
      }

      const startIndex = displayedImages.length;
      const nextSet = allImages.slice(startIndex, startIndex + this.itemsPerPage);

      // Append new items to the displayed array
      displayedImages.push(...nextSet);

      // Update the displayed array in the component
      if (type === 'otherimgs') {
        this.displayedOtherImgs = displayedImages;
      } else if (type === 'selfimgs') {
        this.displayedSelfImgs = displayedImages;
      } else if (type === 'leaderimgs') {
        this.displayedLeaderImgs = displayedImages;
      }

      event.target.complete();

      // Disable infinite scroll if all items are loaded
      if (displayedImages.length === allImages.length) {
        event.target.disabled = true;
      }
    }, 500); // Simulated delay for better UX
  }

  change(item: any) {
    this.mygallery = item.GalleryImages; // Update the gallery image
    this.val = 1; // Update the view flag if needed
  }




  async shareCardViaWhatsApp(MySelectedImage: any) {
    if (!MySelectedImage) return;

    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingController.create({
        message: 'Preparing image for sharing...',
      });
      await loading.present();

      // 1. Prepare fully qualified URL
      let fullUrl = MySelectedImage;
      if (!MySelectedImage.startsWith('data:') && !MySelectedImage.startsWith('http')) {
        fullUrl = this.HomeUrl + MySelectedImage;
      }
      fullUrl = encodeURI(fullUrl);

      // 2. Prepare Name
      const fileName = 'share_' + new Date().getTime() + '.jpg';
      const text = "Blood donation is the real act of humanity. It costs nothing but saves a life. Donating blood is not just giving blood, it’s giving life. Every drop of blood is like a breath for someone out there. Donate and let them breathe.";

      this.savedFilePath = '';
      this.downloadedImageUrl = fullUrl;

      // 3. Native Share (More robust platform detection)
      const isNative = this.platform.is('hybrid') ||
        this.platform.is('android') ||
        this.platform.is('ios') ||
        this.platform.is('capacitor') ||
        this.platform.is('cordova');

      if (isNative) {
        try {
          const downloadResult = await Filesystem.downloadFile({
            url: fullUrl,
            path: fileName,
            directory: Directory.Cache
          });

          const uriResult = await Filesystem.getUri({
            path: fileName,
            directory: Directory.Cache
          });

          console.log('📤 Sending native gallery attachment:', uriResult.uri);
          // SocialSharing is prime for WhatsApp/Social media file attachments
          await this.share.share(
            '', // No message text
            '', // No subject
            uriResult.uri, // File
            undefined // URL
          );
        } catch (nativeErr) {
          console.error('❌ native share failed:', nativeErr);
          await Share.share({
            title: 'Share Gallery Image',
            url: fullUrl
          });
        }
      } else {
        // Web fallback
        await Share.share({
          title: 'Share Gallery Image',
          url: fullUrl
        });
      }

      // Show success toast
      this.showDownloadToast = true;
      if (this.downloadToastTimer) clearTimeout(this.downloadToastTimer);
      this.downloadToastTimer = setTimeout(() => {
        this.showDownloadToast = false;
      }, 6000);

    } catch (error: any) {
      console.error('Error sharing:', error);
      this.general.presentToast('Sharing failed: ' + (error.message || 'Unknown error'));
    } finally {
      if (loading) await loading.dismiss();
    }
  }

  public async Photozoom(url: any) {

    this.photoViewer.show(url, 'Image Zoom', { share: true });

    const options = {
      share: true,
      closeButton: true,
      copyToReference: true,
      headers: "",
      piccasoOptions: {}
    };
    //var url = this.HomeUrl;
    this.photoViewer.show(url, "", options);
  }
  selectgallery(id: any) {

    if (id == 1) {
      this.myid = 1
      this.getgallery()
    }
    else if (id == 2) {
      this.myid = 2
      this.getgallery()

    }
    else if (id == 3) {
      this.myid = 3
      this.getgallery()

    }
  }

  async downloadImage(imageUrl: string) {
    if (!imageUrl) {
      this.general.presentToast('Image URL is missing.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Downloading...',
      spinner: 'crescent',
    });
    await loading.present();

    this.savedFilePath = ''; // Reset local path for new download action
    try {
      const fileName = 'letshelp_' + new Date().getTime() + '.jpg';
      let base64Data: string;

      if (imageUrl.startsWith('data:')) {
        // Already a Base64 data URI — extract the base64 part only
        base64Data = imageUrl.split(',')[1];
      } else {
        // It's a URL — build the full URL and fetch as blob
        let fullUrl = imageUrl;
        if (!imageUrl.startsWith('http')) {
          fullUrl = this.HomeUrl + imageUrl;
        }
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        const dataUrl = await this.blobToBase64(blob);
        base64Data = dataUrl.split(',')[1];
      }

      // Write the base64 image to the cache directory
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      // Now save to gallery using the file URI
      // On Android, savedFile.uri looks like: file:///data/...
      const filePath = savedFile.uri;

      // Try to create the album first (ignore error if it already exists)
      try {
        await Media.createAlbum({ name: 'LetsHelp' });
      } catch (e) {
        // Album may already exist — that's OK
      }

      // Get album list & find 'LetsHelp' album identifier
      const albums = await Media.getAlbums();
      const letsHelpAlbum = albums.albums.find((a: any) => a.name === 'LetsHelp');

      if (letsHelpAlbum) {
        const result = await Media.savePhoto({
          path: filePath,
          albumIdentifier: letsHelpAlbum.identifier,
        });
        this.savedFilePath = result?.filePath || filePath;
      } else {
        // Fallback: save without specifying album
        const result = await Media.savePhoto({
          path: filePath,
        });
        this.savedFilePath = result?.filePath || filePath;
      }

      // Store the downloaded image for display in the banner
      if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
        this.downloadedImageUrl = imageUrl;
      } else {
        this.downloadedImageUrl = this.HomeUrl + imageUrl;
      }
      // Show clickable download banner
      this.showDownloadToast = true;
      // Auto-dismiss after 5 seconds
      if (this.downloadToastTimer) {
        clearTimeout(this.downloadToastTimer);
      }
    } catch (error: any) {
      console.error('Download error:', error);
      this.general.presentToast('Failed: ' + (error?.message || JSON.stringify(error)));
    } finally {
      loading.dismiss();
    }
  }

  dismissDownloadToast() {
    this.showDownloadToast = false;
    if (this.downloadToastTimer) {
      clearTimeout(this.downloadToastTimer);
    }
  }

  async openGallery() {
    this.dismissDownloadToast();
    try {
      // Show the saved image directly using PhotoViewer
      let imageToShow = this.savedFilePath || this.downloadedImageUrl;
      // If it's a relative URL, prepend the base URL
      if (imageToShow && !imageToShow.startsWith('data:') && !imageToShow.startsWith('file:') && !imageToShow.startsWith('http') && !imageToShow.startsWith('content:')) {
        imageToShow = this.HomeUrl + imageToShow;
      }
      this.photoViewer.show(imageToShow, 'LetsHelp Gallery', { share: true });
    } catch (error) {
      console.error('Could not open image:', error);
      this.general.presentToast('Could not open the image.');
    }
  }

  openImagePreview() {
    this.dismissDownloadToast();

    // Determine the image to show in the preview
    // If we have a saved file path, convert it for display
    if (this.savedFilePath) {
      this.previewImageUrl = Capacitor.convertFileSrc(this.savedFilePath);
    } else {
      this.previewImageUrl = this.downloadedImageUrl;
    }

    this.showImagePreview = true;
  }

  closeImagePreview() {
    this.showImagePreview = false;
    this.previewImageUrl = '';
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }
}
