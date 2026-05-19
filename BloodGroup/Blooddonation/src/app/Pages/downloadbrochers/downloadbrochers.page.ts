import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ModalController, NavController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Token } from '@angular/compiler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InAppBrowser, InAppBrowserObject } from '@awesome-cordova-plugins/in-app-browser/ngx'
import { Geolocation } from '@capacitor/geolocation';
import { Platform, AlertController } from '@ionic/angular';
declare var google: any;
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Media } from '@capacitor-community/media';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
//import { GeolocationserviceService } from '../../Services/locationservice/geolocationservice.service'
@Component({
  selector: 'app-downloadbrochers',
  templateUrl: './downloadbrochers.page.html',
  styleUrls: ['./downloadbrochers.page.scss'],
})
export class DownloadbrochersPage implements OnInit {
  map: any; selectedarea: any; predictions: any;

  placeService: any;
  autocomplete: any;
  searchQuery: any;
  marker: any;
  @ViewChild('map', { static: true }) mapElement: ElementRef | undefined;
  Placelist: any; BrocherForm: FormGroup;
  StateID: any;
  selectedState: any;
  States: any;
  States1: any;
  searchValue: any;
  Pincodes: any;
  Pincodes1: any;
  Cities: any;
  Districts: any;
  Districts1: any;
  Cities1: any;
  DistrictID: any;
  selectedDistrict: any;
  CityID: any;
  selectedCity: any;
  selectedPincode: any;
  Placelist1: any;
  selectedPlace: any; UserDetails: any; UserDetails1: any;
  StateId: any; WorkID: any; pdfpath: any;
  pdfurl: any;
  Pdflist: any;
  city: any;
  area: any;
  pincode: any;
  state: any;
  place_name: any;
  country: any;
  currentposition: any
  // filePath: any;
  HomeUrl: string = 'https://letshelp.in/webservices/';
  latitude: any;
  longitude: any;
  district: any;
  selectedstateid: any;
  stateids: any;
  selectdistrictid: any;
  districtids: any;
  selectcityid: any;
  cityids: any;
  locationData: any;
  Area: any; loactiondet: any;
  downBanners: any; brochue: any;
  bannerdet: any;
  District: any;
  StateID1: any;
  districtids1: any;
  CityIDs1: any;
  CityID1: any;
  selectedarea1: any;
  selectedpincode: any;
  selectedPlace1: any;
  activeBrochures: any;
  activeBanners: any;
  // State for download success banner and preview (Brochure only)
  showDownloadToast: boolean = false;
  downloadToastTimer: any;
  downloadedImageUrl: string = '';
  savedFilePath: string = '';
  showImagePreview: boolean = false;
  previewImageUrl: string = '';


  constructor(public general: GeneralService, private Fb: FormBuilder,
    private modal: ModalController, public navCtrl: NavController, public http: HttpClient,
    public inAppBrowser: InAppBrowser, private socialSharing: SocialSharing,
    private geolocation: Geolocation, private alertController: AlertController,
    private platform: Platform, public ngZone: NgZone,
    private loadingController: LoadingController, private fileOpener: FileOpener
  ) {

    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);

    this.state = localStorage.getItem("State");
    this.district = localStorage.getItem("Distict");
    this.city = localStorage.getItem("City");

    //if (this.UserDetails[0].Status == false) {
    //  this.general.presentAlert("Alert", "Please activate the mail and proceed with the other operations in the application...");

    //} else {
    //  this.ngOnInit();
    //}

    this.BrocherForm = this.Fb.group({
      Place: ['',],
      stateid: ['',],
      districtid: ['',],
      cityid: ['',],
      Pincode: ['',],
      Location: ['',],
      Place_name: ['',]

    });

  }

  ngOnInit() {
   
    this.platform.ready().then(() => {
      this.loadMap();
    });
    this.GetPlaces();
  
    this.Getviewpdf();
   
  }
  backk(val: any) {
    this.brochue = val; // or set it to the desired value
    this.loactiondet = val; //
  }



  downloadBanner() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
    this.loactiondet = 1;
    
    this.GetBanner();
    this.GetPlaces();
    this.GetStates();
   
    this.Getviewpdf();
    
  }

  // Helper methods for template logic to avoid Regex parser errors
  isImagePath(url: string | undefined | null): boolean {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  }

  isPdfPath(url: string | undefined | null): boolean {
    if (!url) return false;
    return /\.pdf$/i.test(url);
  }

  isDocPath(url: string | undefined | null): boolean {
    if (!url) return false;
    return /\.(doc|docx|xls|xlsx|txt)$/i.test(url);
  }

  // Brochure Success & Preview Helpers
  dismissDownloadToast() {
    this.showDownloadToast = false;
    if (this.downloadToastTimer) {
      clearTimeout(this.downloadToastTimer);
    }
  }

  openImagePreview() {
    this.dismissDownloadToast();

    if (!this.savedFilePath && !this.downloadedImageUrl) return;

    const filePath = this.savedFilePath || this.downloadedImageUrl;
    const isImage = this.isImagePath(filePath);
    const isDocument = this.isPdfPath(filePath) || this.isDocPath(filePath);

    if (isImage) {
      if (this.savedFilePath && this.isImagePath(this.savedFilePath)) {
        this.previewImageUrl = Capacitor.convertFileSrc(this.savedFilePath);
      } else {
        this.previewImageUrl = this.downloadedImageUrl;
      }
      this.showImagePreview = true;
    } else if (isDocument && this.savedFilePath) {
      // Use FileOpener for local documents
      const mimeType = this.getMimeType(this.savedFilePath);
      this.fileOpener.open(this.savedFilePath, mimeType)
        .then(() => console.log('File is opened'))
        .catch(e => {
          console.error('Error opening file with FileOpener:', e);
          // Fallback to system browser
          this.inAppBrowser.create(this.savedFilePath, '_system');
        });
    } else {
      // Fallback for any other file types
      const browser = this.inAppBrowser.create(filePath, '_system');
      browser.show();
    }
  }

  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'txt': return 'text/plain';
      default: return 'application/octet-stream';
    }
  }

  closeImagePreview() {
    this.showImagePreview = false;
    this.previewImageUrl = '';
  }

  triggerSuccessToast() {
    this.showDownloadToast = true;
    if (this.downloadToastTimer) clearTimeout(this.downloadToastTimer);
    this.downloadToastTimer = setTimeout(() => {
      this.showDownloadToast = false;
    }, 6000);
  }

  async downloadbrochure(item: any) {
    if (!item || item.Status != 1) {
      this.general.presentToast('This brochure is not active.');
      return;
    }

    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingController.create({
        message: 'Downloading brochure...',
      });
      await loading.present();

      const brochurePath = item.BrochurePath;
      if (!brochurePath) {
        throw new Error('Invalid file path');
      }

      let fullUrl: string;
      if (brochurePath.startsWith('http')) {
        fullUrl = brochurePath;
      } else {
        // Ensure HomeUrl ends with a slash and cleanedPath does NOT start with one
        const baseUrl = this.HomeUrl.endsWith('/') ? this.HomeUrl : this.HomeUrl + '/';
        let cleanedPath = brochurePath.replace(/^[\\\/]+/, '').replace(/\\/g, '/');

        // Strip ASP.NET tilde if present
        if (cleanedPath.startsWith('~/')) {
          cleanedPath = cleanedPath.substring(2);
        }
        fullUrl = baseUrl + cleanedPath;
      }

      console.log('📥 Targeted Download URL:', fullUrl);
      let fileName = brochurePath.split(/[\\\/]/).pop() ?? 'brochure.pdf';
      // Clean fileName of characters invalid on mobile filesystems
      fileName = fileName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');

      const isImage = this.isImagePath(fileName);
      const isDoc = this.isPdfPath(fileName) || this.isDocPath(fileName);

      // Final URL encoding to handle spaces or special chars in the path
      fullUrl = encodeURI(fullUrl);

      // ---- WEB PLATFORM ----
      if (Capacitor.getPlatform() === 'web') {
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await loading.dismiss();
        this.general.presentToast('✓ Download started');
        return;
      }

      const permissionStatus = await Filesystem.requestPermissions();
      console.log('✓ Permission status:', permissionStatus);

      if (permissionStatus.publicStorage !== 'granted') {
        throw new Error('Please allow storage permission to download files');
      }

      // ---- NATIVE PLATFORM DOWNLOAD (Capacitor 6+) ----
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('📥 Attempting native downloadFile:', fullUrl);
          const downloadResult = await Filesystem.downloadFile({
            url: fullUrl,
            path: fileName,
            directory: isImage ? Directory.Cache : Directory.Documents
          });

          this.savedFilePath = downloadResult.path || '';
          this.downloadedImageUrl = fullUrl;

          // ---- SAVE TO GALLERY (Enhanced logic from Gallery page) ----
          if (isImage && this.savedFilePath) {
            await this.saveToLetsHelpGallery(this.savedFilePath);
          }

          await loading.dismiss();
          this.triggerSuccessToast();
          return;
        } catch (downloadErr: any) {
          console.error('❌ Native downloadFile failed:', downloadErr);
          // If native download fails, we fall back to the base64 method below
        }
      }

      // ---- FALLBACK: BASE64 DOWNLOAD (For older devices or specific failures) ----
      let base64Data: string;

      try {
        const { CapacitorHttp } = await import('@capacitor/core');

        const response = await CapacitorHttp.get({
          url: fullUrl,
          responseType: 'blob'
        });


        if (response.status !== 200) {
          throw new Error(`Server error: ${response.status}`);
        }

        base64Data = response.data;

      } catch (httpError) {
        console.error('❌ Capacitor HTTP failed:', httpError);
        base64Data = await this.downloadViaXHR(fullUrl);
      }

      if (!base64Data) {
        throw new Error('Failed to download file');
      }

      // Remove data URL prefix if present
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }


      // ---- SAVE IMAGE TO GALLERY AND DOWNLOADS ----
      if (isImage) {
        // 1. Save to Gallery (Mandatory)
        await this.saveToLetsHelpGallery("data:image/jpeg;base64," + base64Data);

        // 2. Save to Cache/Documents for Preview
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          this.savedFilePath = result.uri;
        } catch (fsError) {
          console.error("❌ FS save failed:", fsError);
        }
      }
      // ---- SAVE PDF TO DOWNLOADS ----
      else {
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents,
          });
          this.savedFilePath = result.uri;
        } catch (e) {
          console.error('❌ Documents access failed, falling back to External storage:', e);
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.External,
          });
          this.savedFilePath = result.uri;
        }
      }

      this.downloadedImageUrl = fullUrl;
      await loading.dismiss();
      this.triggerSuccessToast();

    } catch (error: any) {
      console.error('❌ Download error:', error);
      if (loading) await loading.dismiss();
      this.general.presentToast(`Download failed: ${error.message || 'Network error'}`);
    }
  }

  async downloadbanner(item: any) {
    if (!item || item.Status != 1) {
      return this.general.presentToast('This banner is not active.');
    }

    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingController.create({
        message: 'Downloading banner...',
      });
      await loading.present();

      const bannerPath = item.BannerPath;
      if (!bannerPath) {
        throw new Error('Invalid file path');
      }

      let fullUrl: string;
      if (bannerPath.startsWith('http')) {
        fullUrl = bannerPath;
      } else {
        const baseUrl = this.HomeUrl.endsWith('/') ? this.HomeUrl : this.HomeUrl + '/';
        let cleanedPath = bannerPath.replace(/^[\\\/]+/, '').replace(/\\/g, '/');

        // Strip ASP.NET tilde if present
        if (cleanedPath.startsWith('~/')) {
          cleanedPath = cleanedPath.substring(2);
        }
        fullUrl = baseUrl + cleanedPath;
      }

      console.log('📥 Targeted Banner URL:', fullUrl);
      let fileName = bannerPath.split(/[\\\/]/).pop() ?? 'banner.jpg';
      // Clean fileName of characters invalid on mobile filesystems
      fileName = fileName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');

      const isImage = this.isImagePath(fileName);
      const isDoc = this.isPdfPath(fileName) || this.isDocPath(fileName);

      // Final URL encoding to handle spaces or special chars in the path
      fullUrl = encodeURI(fullUrl);

      // ---- WEB PLATFORM ----
      if (Capacitor.getPlatform() === 'web') {
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await loading.dismiss();
        this.general.presentToast('✓ Download started');
        return;
      }

      const permissionStatus = await Filesystem.requestPermissions();

      if (permissionStatus.publicStorage !== 'granted') {
        throw new Error('Please allow storage permission to download files');
      }

      // ---- NATIVE PLATFORM DOWNLOAD (Capacitor 6+) ----
      if (Capacitor.isNativePlatform()) {
        try {
          console.log('📥 Attempting native banner downloadFile:', fullUrl);
          const downloadResult = await Filesystem.downloadFile({
            url: fullUrl,
            path: fileName,
            directory: isImage ? Directory.Cache : Directory.Documents
          });

          this.savedFilePath = downloadResult.path || '';
          this.downloadedImageUrl = fullUrl;

          // ---- SAVE TO GALLERY (Enhanced logic from Gallery page) ----
          if (isImage && this.savedFilePath) {
            await this.saveToLetsHelpGallery(this.savedFilePath);
          }

          await loading.dismiss();
          this.triggerSuccessToast();
          return;
        } catch (downloadErr: any) {
          console.error('❌ Native banner downloadFile failed:', downloadErr);
        }
      }

      // ---- FALLBACK: BASE64 DOWNLOAD ----
      let base64Data: string;

      try {
        const { CapacitorHttp } = await import('@capacitor/core');

        const response = await CapacitorHttp.get({
          url: fullUrl,
          responseType: 'blob'
        });

        if (response.status !== 200) {
          throw new Error(`Server error: ${response.status}`);
        }

        base64Data = response.data;

      } catch (httpError) {
        console.error('❌ Banner Capacitor HTTP failed:', httpError);
        base64Data = await this.downloadViaXHR(fullUrl);
      }

      if (!base64Data) {
        throw new Error('Failed to download banner file');
      }

      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }

      // ---- SAVE IMAGE TO GALLERY AND DOWNLOADS ----
      if (isImage) {
        await this.saveToLetsHelpGallery("data:image/jpeg;base64," + base64Data);

        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          this.savedFilePath = result.uri;
        } catch (fsError) {
          console.error("❌ Banner FS save failed:", fsError);
        }
      }
      else {
        try {
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Documents,
          });
          this.savedFilePath = result.uri;
        } catch (e) {
          console.error('❌ Documents access failed, falling back to External storage:', e);
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.External,
          });
          this.savedFilePath = result.uri;
        }
      }

      this.downloadedImageUrl = fullUrl;
      await loading.dismiss();
      this.triggerSuccessToast();

    } catch (error: any) {
      console.error('❌ Download error:', error);
      if (loading) await loading.dismiss();
      this.general.presentToast(`Download failed: ${error.message || 'Network error'}`);
    }
  }

  // Alternative download method using XMLHttpRequest
  downloadViaXHR(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      xhr.onload = async () => {
        if (xhr.status === 200) {
          try {
            const blob = xhr.response;
            const base64 = await this.convertBlobToBase64(blob);
            resolve(base64);
          } catch (err) {
            reject(new Error('Failed to process file data'));
          }
        } else {
          reject(new Error(`Server error: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error: The server could not be reached or request was blocked.'));
      xhr.ontimeout = () => reject(new Error('Download timed out after 30 seconds.'));

      xhr.timeout = 30000; // 30 seconds timeout
      xhr.send();
    });
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }




  private blobToBase64(blob: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }


  openbroch() {
    this.brochue = 1;
  }

  private async saveToLetsHelpGallery(path: string): Promise<void> {
    try {
      // Try to create the album first
      try {
        await Media.createAlbum({ name: 'LetsHelp' });
      } catch (e) { }

      // Get album list & find 'LetsHelp' album identifier
      const albums = await Media.getAlbums();
      const letsHelpAlbum = albums.albums.find((a: any) => a.name === 'LetsHelp');

      await Media.savePhoto({
        path: path,
        albumIdentifier: letsHelpAlbum ? letsHelpAlbum.identifier : undefined,
      });
      console.log('✅ Image saved to LetsHelp Gallery');
    } catch (galleryError) {
      console.error("❌ Gallery save failed:", galleryError);
      // Try fallback without album
      try {
        await Media.savePhoto({ path: path });
      } catch (e) {
        console.error("❌ Fallback Gallery save failed:", e);
      }
    }
  }

  //Sharee() {
  //  this.sharebroch = 1;
  //  this.brochue == 1;
  //}


  //Shareebanner() {
  //  this.sharebroch = 1;
  //  this.brochue == 0;
  //}
  async Sharee(item: any) {
    await this.shareNatively(item, 'brochure');
  }

  async Shareebanner(item: any) {
    await this.shareNatively(item, 'banner');
  }

  private async shareNatively(item: any, type: 'brochure' | 'banner') {
    if (!item || item.Status != 1) {
      this.general.presentToast('This ' + type + ' is not active for sharing.');
      return;
    }

    const itemPath = type === 'brochure' ? item.BrochurePath : item.BannerPath;
    if (!itemPath) return;

    let loading: HTMLIonLoadingElement | null = null;
    try {
      loading = await this.loadingController.create({
        message: 'Preparing ' + type + ' for sharing...',
      });
      await loading.present();

      // 1. Construct the download URL properly
      const baseUrl = this.HomeUrl.endsWith('/') ? this.HomeUrl : this.HomeUrl + '/';
      let cleanedPath = itemPath.replace(/^[\\\/]+/, '').replace(/\\/g, '/');
      if (cleanedPath.startsWith('~/')) cleanedPath = cleanedPath.substring(2);
      const fullUrl = encodeURI(itemPath.startsWith('http') ? itemPath : baseUrl + cleanedPath);

      // 2. Prepare Name
      let fileName = itemPath.split(/[\\\/]/).pop() ?? (type + (this.isPdfPath(itemPath) ? '.pdf' : '.jpg'));
      fileName = fileName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');

      // 3. Native Share (Broad detection for mobile devices)
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

          console.log('📤 Sending native file attachment:', uriResult.uri);
          // SocialSharing is historically more reliable for WhatsApp attachments on Android
          await this.socialSharing.share(
            '', // No message text as requested
            '', // No subject
            uriResult.uri,
            undefined
          );
        } catch (nativeErr) {
          console.error('❌ native share failed:', nativeErr);
          // Last resort fallback to URL sharing if file fails
          await Share.share({
            title: 'Share ' + type,
            url: fullUrl
          });
        }
      } else {
        // Fallback for Web/Browser - only here do we use the URL
        await Share.share({
          title: 'Share ' + type,
          url: fullUrl
        });
      }

    } catch (error: any) {
      console.error('❌ Native share failed:', error);
      this.general.presentToast('Sharing failed: ' + (error.message || 'Unknown error'));
    } finally {
      if (loading) await loading.dismiss();
    }
  }


  GetPlaces() {
    var obj = [{
      RegId: 1,
    }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/BG_Work_Place_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Placelist = data;
      this.Placelist1 = data;

    }, err => {
      this.general.presentToast("something went wrong")
    });
  }

  GetStates() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544"
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/StatesMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.States = data;
      this.States1 = data;
      this.selectedstateid = this.States1.filter((id: any) => id.StateName == this.state)
      this.StateID = this.selectedstateid[0].StateId
      this.GetDistricts();
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  GetDistricts() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      StateId: this.StateID
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/DistrictMaster_crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Districts = data;
      this.Districts1 = data;
      this.selectdistrictid = this.Districts1.filter((id: any) => id.DistrictName == this.district)
      this.DistrictID = this.selectdistrictid[0].DistrictID
      this.GetCities();
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  GetCities() {
    var obj = [{
      RegId: 1,
      TokenId: "4A9493F9-8CD2-42F8-90ED-49C6B28DC544",
      DistrictId: this.DistrictID
    }]
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "5");
    var url = "api/BG/CitiesMaster_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Cities = data;
      this.Cities1 = data;
      this.selectcityid = this.Cities1.filter((id: any) => id.CityName == this.city)
      this.CityID = this.selectcityid[0].CityId
    }, err => {
      this.general.presentToast("something went wrong");
    })
  }
  SearchPlaces() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Placelist = this.Placelist1;
    } else {
      this.Placelist = this.Placelist1.filter((BG: any) => {
        return (
          BG.Place.toLowerCase().includes(searchQuery)
        );
      });
    }
  }

  SearchStates() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.States = this.States1;
    } else {
      this.States = this.States1.filter((BG: any) => {
        return (
          BG.StateName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }

  SearchDistricts() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Districts = this.Districts1;
    } else {
      this.Districts = this.Districts1.filter((BG: any) => {
        return (
          BG.DistrictName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }

  SearchCities() {
    const searchQuery = this.searchValue.trim().toLowerCase();
    if (searchQuery === '') {
      this.Cities = this.Cities1;
    } else {
      this.Cities = this.Cities1.filter((BG: any) => {
        return (
          BG.CityName.toLowerCase().includes(searchQuery)
        );
      });
    }
  }


  selectPlace(val: any) {
    this.WorkID = val.WorkID
    this.selectedPlace = val.WorkPlace;
    this.reg();
  }

  selectState(val: any) {
    this.StateID = val.StateId;
    this.selectedState = val.StateName;
    this.GetDistricts();
    this.reg();
  }
  selectDistrict(val: any) {
    this.DistrictID = val.DistrictId;
    this.selectedDistrict = val.DistrictName;
    this.GetCities();
    this.reg();
  }
  selectCity(val: any) {
    this.CityID = val.CityId;
    this.selectedCity = val.CityName;
    this.reg();
  }


  reg() {
    this.modal.dismiss();
  }

  Brocherinsert(val: any) {
    if (!this.selectedPlace || !val.Location || !val.Pincode || !val.Place_name || !val.cityid) {
      this.general.presentToast("Please select Venu type, state, district, and city."); return;
    }
    var obj = [{
      Place: this.selectedPlace,
      stateid: this.StateID,
      districtid: this.DistrictID,
      cityid: this.CityID,
      newStatename: this.state,
      newDistrictname: this.District,
      newCityname: this.city,
      Pincode: this.pincode,
      Location: this.area,
      Place_name: val.Place_name,
      // Place_name: this.BrocherForm.value.Place_name,
      Createdby: this.UserDetails[0].RegId

    }];

    var UploadFile = new FormData();
    UploadFile.append("param", JSON.stringify(obj));
    var url = "api/BG/InsertBrochures_Deatails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data === "SUCCESS") {
        // Wait for alert to be presented before opening the PDF
        //this.viewPdf(this.HomeUrl + this.downBanners[0].BannerPath)
        this.loactiondet = 0;
        this.brochue = 0;
        this.bannerdet = 0;
      } else {
        this.general.presentToast('Something went wrong. Please try again later.');
      }
    });
  }

  Brocherinsertpdf(val: any) {
    var obj = [{
      Place: this.selectedPlace,
      stateid: this.StateID,
      districtid: this.DistrictID,
      cityid: this.CityID,
      Pincode: this.pincode,
      Place_name: val.Place_name,
      // Place_name: this.BrocherForm.value.Place_name,
      Location: this.area

    }];
    var UploadFile = new FormData();
    UploadFile.append("param", JSON.stringify(obj));
    var url = "api/BG/InsertBrochures_Deatails";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      if (data === "SUCCESS") {
        const path = this.Pdflist[0].BrochurePath;
        const baseUrl = this.HomeUrl.endsWith('/') ? this.HomeUrl : this.HomeUrl + '/';
        const cleanedPath = path.replace(/^[\\\/]+/, '').replace(/\\/g, '/');
        const fullUrl = path.startsWith('http') ? path : baseUrl + cleanedPath;
        this.viewPdf(fullUrl);
      } else {
        alert("Failed to insert brochure details.");
      }
    });
  }

  viewPdf(url: any) {
    //let HomeUrl = this.HomeUrL + this.filePath;
    console.log('Before creating browser');
    const browser = this.inAppBrowser.create(url, '_system');
    browser.show();
    console.log('After creating browser');

  }

  Getviewpdf() {
    var obj = [{
      RegId: 1,
    }];
    var UploadFile = new FormData();
    UploadFile.append("Param", JSON.stringify(obj));
    UploadFile.append("Flag", "4");
    var url = "api/BG/BG_Brochers_Crud";
    this.general.PostData(url, UploadFile).subscribe((data: any) => {
      this.Pdflist = data;

      this.activeBrochures = this.Pdflist.filter((b: any) => b.Status == 1);
    }, err => {
      this.general.presentToast("something went wrong")
    });
  }



  GetBanner() {
    var obj = [{

    }]
    var uploadfile = new FormData();
    uploadfile.append("Param", JSON.stringify(obj));
    uploadfile.append("Flag", '4');
    var url = "api/BG/Crud_Banners";
    this.general.PostData(url, uploadfile).subscribe((data: any) => {
      this.downBanners = data;
      this.activeBanners = this.downBanners.filter((b: any) => b.Status == 1);
    });
  }




  openPDF(item: any) {
    const pdfUrl = this.HomeUrl + item.BrochurePath;
    window.open(pdfUrl, '_blank');
  }

  loadMap() {
    const mapOptions = {
      center: new google.maps.LatLng(0, 0),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      disableDefaultUI: true
    };

    if (this.mapElement && this.mapElement.nativeElement) {
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Initialize the Places Service
      this.placeService = new google.maps.places.PlacesService(this.map);

      // Initialize the Autocomplete Service
      this.autocomplete = new google.maps.places.AutocompleteService();
    } else {
      console.error('Map element is not properly initialized.');
    }
  }




  onSearchInput() {
    if (this.searchQuery.length > 2) {
      this.autocomplete.getPlacePredictions({
        input: this.searchQuery,
        componentRestrictions: { country: 'IN' } // Restrict results to India
      }, (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.predictions = predictions || [];
        } else {
          console.error('Error fetching place predictions:', status);
          this.predictions = [];
        }
      });
    } else {
      this.predictions = [];
    }
  }

  selectPrediction1(prediction: any) {
    this.searchQuery = prediction.description;
    const descriptionParts = prediction.description.split(',');
    const Place1 = descriptionParts[0].trim(); this.predictions = [];
    this.BrocherForm.controls['Place_name'].setValue(Place1);
    this.selectedPlace1 = Place1

    this.getPlaceDetails(prediction.place_id);
  }

  selectPrediction(prediction: any) {
    this.searchQuery = prediction.description;

    // ✅ Handles both "," and "|" separators
    const Place1 = prediction.description.split(/[,|]/)[0].trim();

    // Clear predictions list
    this.predictions = [];

    // ✅ Bind only the first part (like "Grss Garden" or "LK Hospital")
    this.BrocherForm.controls['Place_name'].setValue(Place1);
    this.selectedPlace1 = Place1;

    // Continue to fetch place details (lat/lng, etc.)
    this.getPlaceDetails(prediction.place_id);
  }





  getPlaceDetails(placeId: string) {
    const request = {
      placeId: placeId,
      fields: ['address_components', 'formatted_address', 'geometry']
    };

    this.placeService.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // Extract latitude and longitude from geometry
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        console.log('Latitude:', latitude);
        console.log('Longitude:', longitude);

        // Set the map to the place location
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(15);

        // Remove previous marker if exists
        if (this.marker) {
          this.marker.setMap(null);
        }

        // Add a new marker at the place location
        this.marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map,
          title: place.name || ''
        });

        // Optionally, you can call a method to fetch nearby places
        this.fetchNearbyPlaces(place.geometry.location);

        // Bind address components to form fields or handle them as needed


        // You can now pass the latitude and longitude to any other method if needed
        this.getCityAndArea(latitude, longitude); // For example, passing it to your custom method
      } else {
        console.error('Error fetching place details:', status);
      }
    });
  }



  fetchNearbyPlaces(location: any) {
    const request = {
      location: location,
      radius: '1500', // Radius in meters
      type: ['restaurant', 'hospital'] // Types of places to search
    };

    this.placeService.nearbySearch(request, (results: any[], status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place: any) => {
          new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name
          });
        });
        console.log('loc:', this.placeService)
        //this.handlePlacePredictions(predictions[0].place_id);

      } else {
        console.error('Error fetching nearby places:', status);
      }
    });
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log('Current position:', position);
      this.getCityAndArea(this.latitude, this.longitude);
    } catch (error) {
      console.error('Error getting location', error);
    }
  }

  searchLocation() {
    if (this.searchQuery) {
      this.autocomplete.getPlacePredictions({ input: this.searchQuery }, (predictions: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Handle predictions
          if (predictions.length > 0) {
            this.handlePlacePredictions(predictions[0].place_id);
          }
        } else {
          console.error('Autocomplete request failed due to', status);
        }
      });
    }
  }



  handlePlacePredictions(predictions: any) {
    if (predictions.length > 0) {
      const placeId = predictions[0].place_id;
      this.placeService.getDetails({ placeId }, (place: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Bind state, city, and area
          this.bindLocationDetails(place);
        } else {
          console.error('Place details request failed due to', status);
        }
      });
    }
  }

  bindLocationDetails(place: any) {
    const addressComponents = place.address_components;

    // Extract location details using helper function
    this.city = this.getAddressComponent(addressComponents, 'locality') ||
      this.getAddressComponent(addressComponents, 'administrative_area_level_2') || '';

    this.area = this.getAddressComponent(addressComponents, 'sublocality') ||
      this.getAddressComponent(addressComponents, 'sublocality_level_1') ||
      this.getAddressComponent(addressComponents, 'neighborhood') || '';

    this.pincode = this.getAddressComponent(addressComponents, 'postal_code') || '';

    this.state = this.getAddressComponent(addressComponents, 'administrative_area_level_1') || '';

    this.country = this.getAddressComponent(addressComponents, 'country') || '';
    this.District = this.getAddressComponent(addressComponents, 'administrative_area_level_3') || '';

    // Update the form fields with the extracted details
    this.BrocherForm.controls['stateid'].setValue(this.area);
    this.BrocherForm.controls['Pincode'].setValue(this.pincode);
    this.BrocherForm.controls['districtid'].setValue(this.District);
    this.BrocherForm.controls['cityid'].setValue(this.city);
    this.BrocherForm.controls['Location'].setValue(this.area);

    console.log('Details:', {
      city: this.city,
      area: this.area,
      pincode: this.pincode,
      state: this.state,
      country: this.country
    });
  }
  getCityAndArea(lat: number, lng: number) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBPFXmwHMaoN_CVZ2K1w2kMLm5qpSXD_s8`; // Replace with your API key
    this.http.get(url).subscribe((response: any) => {
      if (response && response.results && response.results.length > 0) {
        const result = response.results[0];
        this.latitude = lat;
        this.longitude = lng;
        this.city = this.getAddressComponent(result.address_components, 'locality');
        this.selectedCity = this.city
        this.area = this.getAddressComponent(result.address_components, 'sublocality') ||
          this.getAddressComponent(result.address_components, 'sublocality_level_1');
        this.selectedarea = this.area
        this.pincode = this.getAddressComponent(result.address_components, 'postal_code');
        this.selectedpincode = this.pincode
        //this.HsptalForm.controls['Pincode'].setValue(this.pincode);

        this.state = this.getAddressComponent(result.address_components, 'administrative_area_level_1');
        this.selectedState = this.state
        this.country = this.getAddressComponent(result.address_components, 'country');
        //this.District = this.getAddressComponent(result.address_components, 'administrative_area_level_2');
        this.District = this.getAddressComponent(result.address_components, 'administrative_area_level_3');
        this.selectedDistrict = this.District

        this.BrocherForm.controls['stateid'].setValue(this.area);
        this.BrocherForm.controls['Pincode'].setValue(this.pincode);
        this.BrocherForm.controls['districtid'].setValue(this.District);
        this.BrocherForm.controls['cityid'].setValue(this.city);
        this.BrocherForm.controls['Location'].setValue(this.area);

        // ✅ Prevent overwriting Place_name with full formatted address
        const currentVenue = this.BrocherForm.controls['Place_name'].value;
        this.BrocherForm.controls['Place_name'].setValue(currentVenue);


        this.StateID1 = this.States1.filter((id: any) => id.StateName == this.selectedState)
        this.StateID = this.StateID1[0].StateId
        this.districtids1 = this.Districts1.filter((id: any) => id.DistrictName == this.selectedDistrict)
        this.districtids = this.districtids1[0].DistrictId
        this.CityIDs1 = this.Cities1.filter((id: any) => id.CityName == this.selectedCity)
        this.CityID1 = this.CityIDs1[0].CityId


        localStorage.setItem("District", this.District);
        localStorage.setItem("City", this.city);
        localStorage.setItem("State", this.state);


        console.log('District:', this.District, 'City:', this.city, 'Area:', this.area, 'Pincode:', this.pincode, 'State:', this.state, 'Country:', this.country);
      } else {
        console.log('No results found');
      }
    }, (error: any) => {
      console.error('Error getting geocode', error);
    });
  }
  getAddressComponent(components: any[], type: string) {
    for (const component of components) {
      if (component.types.includes(type)) {
        return component.long_name;
      }
    }
  }

}
