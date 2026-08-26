import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActionSheetController, Platform, ToastController } from '@ionic/angular';
import { Share } from '@capacitor/share';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sharevideo',
  templateUrl: './sharevideo.page.html',
  styleUrls: ['./sharevideo.page.scss'],
})
export class SharevideoPage implements OnInit {
  videoUrl: SafeResourceUrl;
  readonly videoLink: string = 'https://www.youtube.com/watch?v=5KWKvYI0U9o';
  readonly shareTitle: string = "Let's Help Foundation Video";
  readonly shareText: string = "Watch the Let's Help Blood Donation video and join our noble cause to save lives! Together, for a Noble Cause.";

  constructor(
    private sanitizer: DomSanitizer,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private location: Location
  ) {
    // Embed URL with parameters to streamline player controls and suppress third-party overlays
    const embedUrl = 'https://www.youtube-nocookie.com/embed/5KWKvYI0U9o?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&showinfo=0&controls=1';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

  async shareVideo() {
    try {
      const isNative = this.platform.is('hybrid') ||
                       this.platform.is('android') ||
                       this.platform.is('ios') ||
                       this.platform.is('capacitor') ||
                       this.platform.is('cordova');

      if (isNative) {
        try {
          await Share.share({
            title: this.shareTitle,
            text: `${this.shareText}\n${this.videoLink}`,
            url: this.videoLink,
            dialogTitle: "Share Let's Help Video"
          });
          return;
        } catch (capErr) {
          await this.socialSharing.share(this.shareText, this.shareTitle, '', this.videoLink);
          return;
        }
      }

      // Web Browser: Web Share API if supported
      if (navigator.share) {
        await navigator.share({
          title: this.shareTitle,
          text: this.shareText,
          url: this.videoLink,
        });
      } else {
        // Fallback for desktop / unsupported browsers
        await this.openShareMenu();
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Share error:', err);
        await this.openShareMenu();
      }
    }
  }

  async openShareMenu() {
    const encodedText = encodeURIComponent(this.shareText + ' ' + this.videoLink);
    const encodedUrl = encodeURIComponent(this.videoLink);
    const encodedTitle = encodeURIComponent(this.shareTitle);

    const actionSheet = await this.actionSheetCtrl.create({
      header: "Share Let's Help Video",
      buttons: [
        {
          text: 'Share on WhatsApp',
          icon: 'logo-whatsapp',
          handler: () => {
            window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
          }
        },
        {
          text: 'Share on Facebook',
          icon: 'logo-facebook',
          handler: () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
          }
        },
        {
          text: 'Share on X / Twitter',
          icon: 'logo-twitter',
          handler: () => {
            window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
          }
        },
        {
          text: 'Share via Email',
          icon: 'mail-outline',
          handler: () => {
            window.open(`mailto:?subject=${encodedTitle}&body=${encodedText}`, '_blank');
          }
        },
        {
          text: 'Copy Video Link',
          icon: 'copy-outline',
          handler: () => {
            this.copyToClipboard(this.videoLink);
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

  async copyToClipboard(text: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    const toast = await this.toastCtrl.create({
      message: 'Video link copied to clipboard!',
      duration: 2000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}

