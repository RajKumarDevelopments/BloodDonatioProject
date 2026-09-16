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
  isLoading: boolean = false;
  showDownloadToast: boolean = false;
  downloadToastTimer: any;
  downloadedImageUrl: string = '';
  savedFilePath: string = '';
  showImagePreview: boolean = false;
  previewImageUrl: string = '';
  previewRawImage: string = '';
  downloadedImagesSet: Set<string> = new Set<string>();
  isCurrentPreviewDownloaded: boolean = false;
  isNotificationPreview: boolean = false;

  userGalleryImages: any[] = []; // Only logged-in user's gallery images
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

    this.HomeUrl = this.general?.getBaseUrl() || localStorage.getItem("URL") || 'https://localhost:44387/';
    this.refreshUserDetails();
  }

  ngOnInit() {
    this.HomeUrl = this.general?.getBaseUrl() || localStorage.getItem("URL") || this.HomeUrl || 'https://localhost:44387/';
    this.refreshUserDetails();
    this.getgallery();
  }

  ionViewWillEnter() {
    this.refreshUserDetails();
    this.getgallery();
  }

  refreshUserDetails() {
    try {
      this.UserDetails1 = localStorage.getItem("UserDetails");
      if (this.UserDetails1) {
        this.UserDetails = JSON.parse(this.UserDetails1);
      }
    } catch (e) {
      console.error('Error reading UserDetails from localStorage', e);
    }
  }

  getLoggedInUserId(): any {
    try {
      const userStr = localStorage.getItem("UserDetails") || this.UserDetails1;
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (Array.isArray(userObj) && userObj.length > 0) {
          return userObj[0].RegId ?? userObj[0].UserId ?? userObj[0].RegistrationId;
        } else if (userObj && typeof userObj === 'object') {
          return userObj.RegId ?? userObj.UserId ?? userObj.RegistrationId;
        }
      }
    } catch (e) {
      console.error('Error getting logged-in user id:', e);
    }
    return this.UserDetails && this.UserDetails[0] ? this.UserDetails[0].RegId : null;
  }

  back() {
    this.val = 2;
    this.getgallery();
  }

  change2(img: any) {
    this.openEnlargedPreview(img.GalleryImages);
  }

  selectgallery1(tab: number) {
    //this.selectedTab = tab;
  }

  async setTab(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }

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

  setTab2(tab: string) {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
    }

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
    this.isLoading = true;
    const obj = [{}];
    const uploadfile = new FormData();
    uploadfile.append('Param', JSON.stringify(obj));
    uploadfile.append('Flag', '6');

    const url = 'api/BG/Gallery_Crud';

    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.isLoading = false;
      this.gallery = Array.isArray(data) ? data : [];
      console.log('Gallery total loaded:', this.gallery.length);

      const currentRegId = this.getLoggedInUserId();
      console.log('Filtering gallery for logged-in RegId:', currentRegId);

      // Filter gallery images associated with the logged-in user considering both RegId and CreatedBy
      this.userGalleryImages = this.gallery.filter((img: any) => {
        if (!img || !img.GalleryImages) return false;
        if (currentRegId !== undefined && currentRegId !== null) {
          const matchRegId = img.RegId != null && String(img.RegId) === String(currentRegId);
          const matchCreatedBy = img.CreatedBy != null && String(img.CreatedBy) === String(currentRegId);
          return matchRegId || matchCreatedBy;
        }
        return false;
      });

      this.selfimgs = this.userGalleryImages;
      this.displayedSelfImgs = this.userGalleryImages.slice(0, this.itemsPerPage);
      this.otherimgs = this.gallery.filter((img: any) => {
        if (currentRegId == null) return true;
        const matchRegId = img.RegId != null && String(img.RegId) === String(currentRegId);
        const matchCreatedBy = img.CreatedBy != null && String(img.CreatedBy) === String(currentRegId);
        return !(matchRegId || matchCreatedBy);
      });
      this.leaderimgs = this.gallery.filter((img: any) => img.RoleId == 4);
    }, err => {
      this.isLoading = false;
      this.gallery = [];
      this.userGalleryImages = [];
      this.otherimgs = [];
      this.selfimgs = [];
      this.leaderimgs = [];
      this.displayedOtherImgs = [];
      this.displayedSelfImgs = [];
      this.displayedLeaderImgs = [];
      this.general.presentToast("Could not load gallery images.");
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

  openEnlargedPreview(image: string) {
    if (!image) return;
    this.previewRawImage = image;
    this.previewImageUrl = this.getImageUrl(image);
    this.mygallery = image;
    this.isNotificationPreview = false;
    this.showImagePreview = true;
  }

  change(item: any) {
    this.openEnlargedPreview(item.GalleryImages);
  }

  async shareCardViaWhatsApp(MySelectedImage: any) {
    if (!MySelectedImage) return;

    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingController.create({
        message: 'Preparing image for sharing...',
      });
      await loading.present();

      // 1. Prepare fully qualified URL or Data URI
      let fullUrl = this.getImageUrl(MySelectedImage);
      if (!this.isBase64Image(fullUrl)) {
        fullUrl = encodeURI(fullUrl);
      }

      // 2. Prepare Name
      const fileName = 'share_' + new Date().getTime() + '.jpg';

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
          await this.share.share(
            '',
            '',
            uriResult.uri,
            undefined
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
    this.photoViewer.show(url, "", options);
  }

  selectgallery(id: any) {
    this.myid = Number(id);
    if (!this.gallery || this.gallery.length === 0) {
      this.getgallery();
    }
  }

  isBase64Image(str: string): boolean {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    if (trimmed.startsWith('data:image/') || trimmed.startsWith('data:')) {
      return true;
    }
    const hasImageExtension = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(trimmed);
    if (hasImageExtension) {
      return false;
    }
    if (
      trimmed.startsWith('Image/') ||
      trimmed.startsWith('/Image/') ||
      trimmed.startsWith('Content/') ||
      trimmed.startsWith('/Content/') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://')
    ) {
      return false;
    }
    if (
      trimmed.startsWith('iVBORw') ||
      trimmed.startsWith('/9j/') ||
      trimmed.startsWith('R0lGOD') ||
      trimmed.startsWith('UklGR') ||
      trimmed.length > 500
    ) {
      return true;
    }
    return false;
  }

  getImageUrl(image: string): string {
    if (!image || typeof image !== 'string') return '';
    const trimmed = image.trim();

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    if (this.isBase64Image(trimmed)) {
      if (trimmed.startsWith('data:')) {
        return trimmed;
      }
      let mime = 'image/png';
      if (trimmed.startsWith('/9j/')) {
        mime = 'image/jpeg';
      } else if (trimmed.startsWith('R0lGOD')) {
        mime = 'image/gif';
      } else if (trimmed.startsWith('UklGR')) {
        mime = 'image/webp';
      }
      return `data:${mime};base64,${trimmed}`;
    }

    const baseUrl = (this.HomeUrl || this.general?.getBaseUrl() || localStorage.getItem('URL') || 'https://localhost:44387/').trim();
    const formattedBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const cleanPath = trimmed.startsWith('/') ? trimmed.substring(1) : trimmed;

    return formattedBaseUrl + cleanPath;
  }

  async downloadImage(imageUrl: string) {
    if (!imageUrl) {
      this.general.presentToast('Image is missing.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Downloading image...',
      spinner: 'crescent',
    });
    await loading.present();

    this.savedFilePath = '';
    try {
      const isBase64 = this.isBase64Image(imageUrl);
      const fullUrl = this.getImageUrl(imageUrl);

      // Determine file extension
      let ext = '.jpg';
      if (isBase64) {
        if (imageUrl.includes('image/png') || imageUrl.startsWith('iVBORw')) ext = '.png';
        else if (imageUrl.includes('image/webp') || imageUrl.startsWith('UklGR')) ext = '.webp';
      } else {
        const match = fullUrl.match(/\.(png|jpe?g|gif|webp|bmp)/i);
        if (match) ext = match[0].toLowerCase();
      }
      const fileName = 'letshelp_' + Date.now() + ext;

      const isNative = Capacitor.isNativePlatform() ||
        this.platform.is('hybrid') ||
        this.platform.is('android') ||
        this.platform.is('ios') ||
        this.platform.is('capacitor') ||
        this.platform.is('cordova');

      if (isNative) {
        // 1. Resolve / create album
        let albumId: string | undefined;
        try {
          await Media.createAlbum({ name: 'LetsHelp' });
        } catch (e) { }

        try {
          const albums = await Media.getAlbums();
          const letsHelpAlbum = albums?.albums?.find((a: any) => a.name === 'LetsHelp');
          if (letsHelpAlbum) {
            albumId = letsHelpAlbum.identifier;
          }
        } catch (e) { }

        let cachedFileUri = '';

        if (isBase64) {
          // Base64 format: extract pure data and write to cache
          let base64Data = imageUrl.trim();
          if (base64Data.startsWith('data:')) {
            base64Data = base64Data.split(',')[1] || '';
          }
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          cachedFileUri = savedFile.uri;
        } else {
          // Folder / Server Path Image (e.g. Image/WelcomeTemplate/WelcomeCard_...png)
          // Try 1: Filesystem.downloadFile (native background download, bypasses CORS)
          try {
            const dlRes = await Filesystem.downloadFile({
              url: fullUrl,
              path: fileName,
              directory: Directory.Cache
            });
            if (dlRes?.path) {
              cachedFileUri = dlRes.path;
            }
          } catch (dlErr) {
            console.warn('Filesystem.downloadFile error:', dlErr);
          }

          // Try 2: CapacitorHttp (native HTTP request for blob)
          if (!cachedFileUri) {
            try {
              const { CapacitorHttp } = await import('@capacitor/core');
              const httpRes = await CapacitorHttp.get({
                url: fullUrl,
                responseType: 'blob'
              });
              if (httpRes?.status === 200 && httpRes.data) {
                let data = httpRes.data;
                if (data.includes(',')) data = data.split(',')[1];
                const saved = await Filesystem.writeFile({
                  path: fileName,
                  data: data,
                  directory: Directory.Cache
                });
                cachedFileUri = saved.uri;
              }
            } catch (httpErr) {
              console.warn('CapacitorHttp download error:', httpErr);
            }
          }

          // Try 3: Standard fetch blob fallback
          if (!cachedFileUri) {
            try {
              const fetchRes = await fetch(fullUrl);
              if (fetchRes.ok) {
                const blob = await fetchRes.blob();
                const dataUrl = await this.blobToBase64(blob);
                const base64Data = dataUrl.split(',')[1];
                const saved = await Filesystem.writeFile({
                  path: fileName,
                  data: base64Data,
                  directory: Directory.Cache
                });
                cachedFileUri = saved.uri;
              }
            } catch (fetchErr) {
              console.warn('Fetch fallback error:', fetchErr);
            }
          }
        }

        // Save directly to mobile Photos/Gallery via Media plugin
        let savedToGallery = false;
        if (cachedFileUri) {
          try {
            const result = await Media.savePhoto({
              path: cachedFileUri,
              albumIdentifier: albumId,
              fileName: 'letshelp_' + Date.now(),
            });
            this.savedFilePath = result?.filePath || cachedFileUri;
            savedToGallery = true;
          } catch (mediaErr) {
            console.warn('Media.savePhoto with cached URI failed:', mediaErr);
          }
        }

        // If not yet saved and it's a URL, Media.savePhoto natively supports web URLs
        if (!savedToGallery && !isBase64) {
          try {
            const result = await Media.savePhoto({
              path: fullUrl,
              albumIdentifier: albumId,
              fileName: 'letshelp_' + Date.now(),
            });
            this.savedFilePath = result?.filePath || fullUrl;
            savedToGallery = true;
          } catch (urlSaveErr) {
            console.warn('Media.savePhoto with fullUrl failed:', urlSaveErr);
          }
        }

        // If not saved and it's base64, try data URI directly
        if (!savedToGallery && isBase64) {
          try {
            let dataUri = imageUrl.trim();
            if (!dataUri.startsWith('data:')) {
              dataUri = `data:image/jpeg;base64,${dataUri}`;
            }
            const result = await Media.savePhoto({
              path: dataUri,
              albumIdentifier: albumId,
            });
            this.savedFilePath = result?.filePath || cachedFileUri;
            savedToGallery = true;
          } catch (dataErr) {
            console.warn('Media.savePhoto with dataUri failed:', dataErr);
          }
        }

        if (!savedToGallery && !cachedFileUri) {
          throw new Error('Could not download image file to device.');
        }

        // Copy to Documents directory for file manager visibility
        if (cachedFileUri) {
          try {
            const fileData = await Filesystem.readFile({
              path: fileName,
              directory: Directory.Cache
            });
            await Filesystem.writeFile({
              path: fileName,
              data: fileData.data,
              directory: Directory.Documents
            });
          } catch (docErr) {
            console.warn('Documents directory copy skipped:', docErr);
          }
        }

      } else {
        // Web / Desktop browser download
        if (isBase64) {
          let dataUri = imageUrl.trim();
          if (!dataUri.startsWith('data:')) {
            dataUri = `data:image/jpeg;base64,${dataUri}`;
          }
          const a = document.createElement('a');
          a.href = dataUri;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.savedFilePath = dataUri;
        } else {
          try {
            const res = await fetch(fullUrl);
            if (res.ok) {
              const blob = await res.blob();
              const objectUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = objectUrl;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
              this.savedFilePath = objectUrl;
            } else {
              throw new Error('Fetch not ok');
            }
          } catch (webErr) {
            const a = document.createElement('a');
            a.href = fullUrl;
            a.download = fileName;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.savedFilePath = fullUrl;
          }
        }
      }

      this.downloadedImageUrl = fullUrl;
      this.downloadedImagesSet.add(imageUrl);
      this.downloadedImagesSet.add(fullUrl);
      this.isCurrentPreviewDownloaded = true;

      // Toast notification: Image downloaded successfully
      await this.general.presentToast('Image downloaded successfully');

      // Also trigger the top notification banner
      this.showDownloadToast = true;
      if (this.downloadToastTimer) clearTimeout(this.downloadToastTimer);
      this.downloadToastTimer = setTimeout(() => {
        this.showDownloadToast = false;
      }, 5000);

    } catch (error: any) {
      console.error('Download error:', error);
      await this.general.presentToast('Failed to download image. Please try again.');
    } finally {
      await loading.dismiss();
    }
  }

  dismissDownloadToast() {
    this.showDownloadToast = false;
    if (this.downloadToastTimer) {
      clearTimeout(this.downloadToastTimer);
    }
  }

  openImagePreview() {
    this.dismissDownloadToast();
    if (this.savedFilePath && !this.savedFilePath.startsWith('http') && !this.savedFilePath.startsWith('blob:') && !this.savedFilePath.startsWith('data:')) {
      try {
        this.previewImageUrl = Capacitor.convertFileSrc(this.savedFilePath);
      } catch (e) {
        this.previewImageUrl = this.downloadedImageUrl;
      }
    } else {
      this.previewImageUrl = this.downloadedImageUrl;
    }
    this.isNotificationPreview = true;
    this.showImagePreview = true;
  }

  closeImagePreview() {
    this.showImagePreview = false;
    this.isNotificationPreview = false;
    this.previewImageUrl = '';
    this.previewRawImage = '';
  }

  downloadViaXHR(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = async () => {
        if (xhr.status === 200 || xhr.status === 0) {
          try {
            const blob = xhr.response;
            const base64 = await this.blobToBase64(blob);
            resolve(base64);
          } catch (err) {
            reject(new Error('Failed to convert blob to base64'));
          }
        } else {
          reject(new Error(`Server error: ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('Network error downloading image'));
      xhr.ontimeout = () => reject(new Error('Image download timed out'));
      xhr.timeout = 25000;
      xhr.send();
    });
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
