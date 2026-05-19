import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions, } from '@capacitor/camera'
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController, GestureController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import html2canvas from 'html2canvas';

interface ImageTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

@Component({
  selector: 'app-imagetemplates',
  templateUrl: './imagetemplates.page.html',
  styleUrls: ['./imagetemplates.page.scss'],
})
export class ImagetemplatesPage implements OnInit {
  UserDetails1: any; UserDetails: any;
  HomeUrl: any;
  selectedImage: any;
  Donategallery: any;
  temp: any = 1;
  retakeselectedImage: any;
  completedata: any;
  mycompltedata: any;
  ids1: any;
  ids: boolean = true;
  ids2: boolean = false;
  mytempaltes: boolean = false;
  noids: any;
  static1: any;
  Apiurls: any;

  @ViewChild('canvasElement', { static: false })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageElement', { static: false })
  imageElement!: ElementRef<HTMLImageElement>;
  @ViewChild('frameElement', { static: false })
  frameElement!: ElementRef<HTMLImageElement>;
  @ViewChild('captureElement', { static: false }) captureElement!: ElementRef;
  @ViewChild('adjustableImage', { static: false }) adjustableImage!: ElementRef<HTMLImageElement>;

  @ViewChild('canvasRef', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;



  Rolestatus: any;
  imageLoaded: boolean = false;
  framedBase64Image: any;
  elementInitialized: boolean = false;
  Donatedate: any;
  isProcessing: boolean = false;

  // Image adjustment properties
  imageTransform: ImageTransform = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0
  };

  showAdjustmentControls: boolean = false;
  private startDistance: number = 0;
  private startScale: number = 1;
  private startRotation: number = 0; // NEW: Track initial rotation
  private initialFingerAngle: number = 0; // NEW: Track initial angle between fingers
  private lastTouchX: number = 0;
  private lastTouchY: number = 0;
  private isDragging: boolean = false;

  // Template image cache and error tracking
  private templateImageCache: Map<string, HTMLImageElement> = new Map();
  private templateLoadErrors: Set<string> = new Set();
  templateLoading: boolean = false;

  constructor(
    public general: GeneralService,
    private modal: ModalController,
    public activeRoute: ActivatedRoute,
    private nav: NavController,
    private loadingController: LoadingController,
    public actionSheetController: ActionSheetController,
    private alert: AlertController,
    private http: HttpClient,
    private gestureCtrl: GestureController
  ) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.HomeUrl = localStorage.getItem("URL")

    if (this.UserDetails != null) {
      if (this.UserDetails[0].Rolestatus == true) {
        this.Rolestatus = true;
      }
    }
    this.Apiurls = this.activeRoute.snapshot.paramMap.get("apiurl");
    this.ids1 = this.activeRoute.snapshot.paramMap.get("ids");
    this.Donatedate = this.activeRoute.snapshot.paramMap.get("donatedate");

    if (this.ids1) {
      this.cameraselectImage();
      this.selectedImage = this.Donategallery
      if (this.selectedImage) {
        this.ids = true;
        this.ids2 = false;
      }
      this.completedata = this.activeRoute.snapshot.paramMap.get("totaldata");
      this.mycompltedata = JSON.parse(this.completedata);
      if (!this.Donatedate) {
        this.Donatedate = this.mycompltedata[0].date
      }
    }

    this.static1 = '../../../assets/Images/circleframe.png';
  }

  ngOnInit() {
    // Preload all template images on init
    this.preloadTemplateImages();
  }

  ngAfterViewInit() {
    this.elementInitialized = true;
  }

  /**
   * Preload all template images to catch errors early
   */
  private async preloadTemplateImages() {
    const templates = [
      '../../../assets/Images/circleframe.png',
      '../../../assets/Images/framelove.png',
      '../../../assets/Images/framepentagoncopy.png',
      '../../../assets/Images/framepentagon.png',
      '../../../assets/Images/frame1.png',
      '../../../assets/Images/frame2.png',
      '../../../assets/Images/leftlogo.png'
    ];

    for (const templatePath of templates) {
      try {
        await this.loadAndCacheTemplateImage(templatePath);
      } catch (error) {
        console.error(`Failed to preload template: ${templatePath}`, error);
        this.templateLoadErrors.add(templatePath);
      }
    }
  }

  /**
   * Load and cache a template image
   */
  private loadAndCacheTemplateImage(src: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.templateImageCache.has(src)) {
      return Promise.resolve(this.templateImageCache.get(src)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.templateImageCache.set(src, img);
        this.templateLoadErrors.delete(src); // Remove from error set if previously failed
        resolve(img);
      };

      img.onerror = (error) => {
        this.templateLoadErrors.add(src);
        reject(new Error(`Failed to load template image: ${src}`));
      };

      // Only set crossOrigin for external URLs
      if (src.startsWith('http://') || src.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }

      img.src = src;
    });
  }

  /**
   * Select template with error handling and preserved transforms
   */
  async select(val: any, staticimg: any) {
    // Check if this template has load errors
    if (this.templateLoadErrors.has(staticimg)) {
      await this.general.presentAlert(
        'Template Error',
        'This template failed to load. Please try another template or restart the app.'
      );
      return;
    }

    this.templateLoading = true;

    try {
      // Attempt to load the template image
      await this.loadAndCacheTemplateImage(staticimg);

      // Update template selection
      this.temp = val;
      this.static1 = staticimg;

      // PRESERVE TRANSFORMS - Don't reset anymore
      // this.resetImageTransform(); // REMOVED

      console.log('Template selected:', val, staticimg);

    } catch (error) {
      console.error('Error selecting template:', error);
      await this.general.presentAlert(
        'Template Load Error',
        'Failed to load the selected template. Please try another one.'
      );
    } finally {
      this.templateLoading = false;
    }
  }

  // Enable adjustment mode
  enableAdjustment() {
    this.showAdjustmentControls = true;
  }

  // Reset image transform
  resetImageTransform() {
    this.imageTransform = {
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      rotation: 0
    };
  }

  // Get transform style for the image
  getImageTransformStyle() {
    return {
      transform: `translate(${this.imageTransform.offsetX}px, ${this.imageTransform.offsetY}px) 
                  scale(${this.imageTransform.scale}) 
                  rotate(${this.imageTransform.rotation}deg)`,
      transition: this.isDragging ? 'none' : 'transform 0.1s ease-out'
    };
  }

  // Touch start handler
  onTouchStart(event: TouchEvent) {
    event.preventDefault();

    if (event.touches.length === 1) {
      // Single touch - dragging
      this.isDragging = true;
      this.lastTouchX = event.touches[0].clientX;
      this.lastTouchY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
      // Two fingers - pinch zoom and rotation
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      this.startDistance = this.getDistance(touch1, touch2);
      this.startScale = this.imageTransform.scale;
      
      // NEW: Rotation initialization
      this.initialFingerAngle = this.getAngle(touch1, touch2);
      this.startRotation = this.imageTransform.rotation;
    }
  }

  // NEW: Calculate angle between two points
  private getAngle(touch1: Touch, touch2: Touch): number {
    const dy = touch2.clientY - touch1.clientY;
    const dx = touch2.clientX - touch1.clientX;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  // Touch move handler
  onTouchMove(event: TouchEvent) {
    event.preventDefault();

    if (event.touches.length === 1 && this.isDragging) {
      // Single touch - dragging
      const deltaX = event.touches[0].clientX - this.lastTouchX;
      const deltaY = event.touches[0].clientY - this.lastTouchY;

      this.imageTransform.offsetX += deltaX;
      this.imageTransform.offsetY += deltaY;

      this.lastTouchX = event.touches[0].clientX;
      this.lastTouchY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
      // Two fingers - pinch zoom and rotation
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      // Zoom logic
      const currentDistance = this.getDistance(touch1, touch2);
      if (this.startDistance > 0) {
        const scale = (currentDistance / this.startDistance) * this.startScale;
        this.imageTransform.scale = Math.max(0.5, Math.min(scale, 3)); 
      }

      // NEW: Rotation logic
      const currentAngle = this.getAngle(touch1, touch2);
      const rotationDelta = currentAngle - this.initialFingerAngle;
      this.imageTransform.rotation = this.startRotation + rotationDelta;
    }
  }

  // Touch end handler
  onTouchEnd(event: TouchEvent) {
    this.isDragging = false;
    if (event.touches.length < 2) {
      this.startDistance = 0;
    }
  }

  // Calculate distance between two touches
  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Zoom controls
  zoomIn() {
    this.imageTransform.scale = Math.min(this.imageTransform.scale + 0.1, 3);
  }

  zoomOut() {
    this.imageTransform.scale = Math.max(this.imageTransform.scale - 0.1, 0.5);
  }

  // Rotation controls
  rotateLeft() {
    this.imageTransform.rotation -= 15;
  }

  rotateRight() {
    this.imageTransform.rotation += 15;
  }

  // Position controls
  moveUp() {
    this.imageTransform.offsetY -= 10;
  }

  moveDown() {
    this.imageTransform.offsetY += 10;
  }

  moveLeft() {
    this.imageTransform.offsetX -= 10;
  }

  moveRight() {
    this.imageTransform.offsetX += 10;
  }

  // Done with adjustment
  doneAdjusting() {
    this.showAdjustmentControls = false;
  }

  async takePicture2(source: CameraSource) {
    const image = await Camera.getPhoto({
      source,
      resultType: CameraResultType.Uri,
      quality: 40,
      width: 700,
      height: 700,
      correctOrientation: true,
      allowEditing: false
    });
    const customFilename = this.createFileName();
    const FileuploadUrl = this.HomeUrl + "api/BG/UploadGallery";
    const imageUrl = Capacitor.convertFileSrc(image.path ? image.path : "");
    const blob = await fetch(imageUrl).then(r => r.blob());
    const formData = new FormData();
    formData.append("UploadedImage", blob, customFilename);

    this.http.post(FileuploadUrl, formData).subscribe((data: any) => {
      this.general.presentAlert("SUCCESS", "You successfully uploaded prescription/Requisition Slip .")
      this.retakeselectedImage = data;
      if (this.retakeselectedImage) {
        this.ids = false;
        this.ids2 = true;
      }
    });
  }

  cancel() {
    this.temp = 1
    if (this.temp == 1) {
      this.selectedImage = this.selectedImage
      this.static1 = this.static1
    }
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.selectedImage = image.dataUrl;
    this.resetImageTransform();
  }

  async cameraselectImage() {
    this.mytempaltes = true
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Camera,
            });
            this.selectedImage = image.dataUrl;
            this.resetImageTransform();
          }
        },
        {
          text: 'Photo Library',
          icon: 'image',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Photos,
            });
            this.selectedImage = image.dataUrl;
            this.resetImageTransform();
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            this.nav.navigateBack('/registerdonation');
          }
        }
      ]
    });

    await actionSheet.present();
  }

  async retakeImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Replace Image',
      subHeader: 'Choose a new image source',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: async () => {
            try {
              const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
              });

              // Replace the image
              this.selectedImage = image.dataUrl;

              // Reset transformations for new image
              this.resetImageTransform();

              // Show success message
              this.general.presentAlert('Success', 'Image replaced successfully!');
            } catch (error) {
              console.error('Camera error:', error);
              this.general.presentAlert('Error', 'Failed to take photo. Please try again.');
            }
          }
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: async () => {
            try {
              const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos,
              });

              // Replace the image
              this.selectedImage = image.dataUrl;

              // Reset transformations for new image
              this.resetImageTransform();             
            } catch (error) {
              console.error('Gallery error:', error);
              this.general.presentAlert('Error', 'Failed to select image. Please try again.');
            }
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

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Camera,
            });
            this.selectedImage = image.dataUrl;
            this.resetImageTransform();
          }
        },
        {
          text: 'Photo Library',
          icon: 'image',
          handler: async () => {
            const image = await Camera.getPhoto({
              quality: 90,
              allowEditing: false,
              resultType: CameraResultType.DataUrl,
              source: CameraSource.Photos,
            });
            this.selectedImage = image.dataUrl;
            this.resetImageTransform();
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


  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Only set crossOrigin for external URLs
      if (src.startsWith('http://') || src.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  async convertToBase64() {
    if (this.isProcessing) return;

    if (!this.selectedImage) {
      this.general.presentAlert('Error', 'Please select an image first!');
      return;
    }

    this.static1 ||= '../../../assets/Images/circleframe.png';

    // Check if selected template has errors
    if (this.templateLoadErrors.has(this.static1)) {
      this.general.presentAlert(
        'Template Error',
        'The selected template could not be loaded. Please choose a different template.'
      );
      return;
    }

    this.isProcessing = true;

    const loading = await this.loadingController.create({
      message: 'Processing image...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      // Load camera image with error handling
      let cameraImage: HTMLImageElement;
      try {
        cameraImage = await this.loadImage(this.selectedImage);
      } catch (error) {
        throw new Error('Failed to load camera image. Please try taking another photo.');
      }

      // Load template image with error handling (use cached if available)
      let templateImage: HTMLImageElement;
      try {
        templateImage = await this.loadAndCacheTemplateImage(this.static1);
      } catch (error) {
        throw new Error('Failed to load template image. Please try selecting a different template.');
      }

      // Render the canvas
      await this.manualCanvasRender(cameraImage, templateImage);

      await loading.dismiss();

      await this.nav.navigateForward(['/finalreview', {
        dynamicimg: this.framedBase64Image,
        completedata: JSON.stringify(this.mycompltedata),
        Donateddate: this.Donatedate,
        selectedTemplate: this.static1,
        templateNumber: this.temp
      }]);

    } catch (err: any) {
      console.error('Canvas error:', err);
      await loading.dismiss();

      const errorMessage = err.message || 'Image processing failed. Please try again.';
      this.general.presentAlert('Error', errorMessage);
    } finally {
      this.isProcessing = false;
    }
  }

  async manualCanvasRender(
    cameraImage: HTMLImageElement,
    templateImage: HTMLImageElement
  ): Promise<void> {

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const W = templateImage.naturalWidth;
    const H = templateImage.naturalHeight;

    if (W === 0 || H === 0) {
      throw new Error('Template image has invalid dimensions');
    }

    canvas.width = W;
    canvas.height = H;

    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    const TEMPLATE_DISPLAY_SIZE = 300; 
    const DRAW_AREA_SIZE = 300; // Increased to 300 to match full container size

    // Calculate scaling ratio
    const ratio = W / TEMPLATE_DISPLAY_SIZE;

    // Scale draw area to canvas size
    const canvasDrawSize = DRAW_AREA_SIZE * ratio;

    const cx = W / 2;
    const cy = H / 2;

    // Scale to fit image in template area (same as UI)
    const baseScale = canvasDrawSize / Math.max(cameraImage.naturalWidth, cameraImage.naturalHeight);
    const finalScale = baseScale * this.imageTransform.scale;

    const drawW = cameraImage.naturalWidth * finalScale;
    const drawH = cameraImage.naturalHeight * finalScale;

    // Scale offsets to canvas
    const offsetX = this.imageTransform.offsetX * ratio;
    const offsetY = this.imageTransform.offsetY * ratio;

    const dx = cx - (drawW / 2) + offsetX;
    const dy = cy - (drawH / 2) + offsetY;


    // ---- STEP 1: WHITE BACKGROUND ----
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // ---- STEP 2: DRAW USER IMAGE ----
    ctx.save();

    // Apply rotation and translation
    if (this.imageTransform.rotation !== 0) {
      const rotCenterX = cx + offsetX;
      const rotCenterY = cy + offsetY;
      ctx.translate(rotCenterX, rotCenterY);
      ctx.rotate((this.imageTransform.rotation * Math.PI) / 180);
      ctx.translate(-rotCenterX, -rotCenterY);
    }

    // Draw image (no clipping, let the template mask it)
    ctx.drawImage(cameraImage, dx, dy, drawW, drawH);

    ctx.restore(); 



    // ---- STEP 3: DRAW TEMPLATE FRAME ----
    ctx.drawImage(templateImage, 0, 0, W, H);



    // ---- STEP 4: CONVERT TO HIGH QUALITY BASE64 ----
    // Use quality 1.0 for maximum quality
    this.framedBase64Image = canvas.toDataURL('image/jpeg', 1.0);

  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  createFileName() {
    const timestamp = new Date().getTime();
    return `${timestamp}.jpg`;
  }

  save() {
    this.nav.navigateForward(['/finalreview', {
      dynamicimg: this.framedBase64Image,
      completedata: JSON.stringify(this.mycompltedata)
    }]);
  }
}
