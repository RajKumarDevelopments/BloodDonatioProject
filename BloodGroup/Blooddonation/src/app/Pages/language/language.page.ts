import { Component, OnInit, Inject } from '@angular/core';
import { LanguageTranslatorService } from '../../Services/LanguageServices/language-translator.service';
//import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { NavController } from '@ionic/angular';

// Define the function that initializes the Google Translate widget



@Component({
  selector: 'app-language',
  templateUrl: './language.page.html',
  styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

  mylang: any;
  selectedLanguage: string = 'en';
  currentLanguage: string = 'English';

  languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'te', name: 'Telugu' },
    { code: 'ur', name: 'Urdu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'bn', name: 'Bengali' }
  ];
  userdetail: any;
  UserDetails: any;
  constructor(

    private translateService: LanguageTranslatorService, public navCtrl: NavController,

  ) {
    this.userdetail = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.userdetail);
  }

  //ngOnInit() {
  //  if (!this.UserDetails || this.UserDetails.length === 0 || this.UserDetails[0] === "") {

  //  }
  //  else {
  //    this.translateService.initGoogleTranslate(); // Initialize Google Translate
  //  }
  //}

  ngOnInit() {
    // Check for existing translation cookie
    const cookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (cookie) {
      const langCode = cookie.split('=')[1].split('/').pop();
      if (langCode) {
        this.selectedLanguage = langCode;
        const selectedLangObj = this.languages.find(l => l.code === this.selectedLanguage);
        if (selectedLangObj) {
          this.currentLanguage = selectedLangObj.name;
          this.mylang = 1; // Ensure next button is valid if we have a language
        }
      }
    }

    // Set an interval to check UserDetails every 5 seconds (5000 milliseconds)
    setInterval(() => {
      if (!this.UserDetails || this.UserDetails.length === 0 || this.UserDetails[0] === "") {
        // Do nothing if UserDetails is empty or invalid
      } else {
        this.translateService.initGoogleTranslate(); // Initialize Google Translate
      }
    }, 5000); // Check every 5 seconds
  }
  lan(val: any) {
    this.mylang = val;
  }

  onLanguageChange(event: any) {
    this.selectedLanguage = event.detail.value;
    const selectedLangObj = this.languages.find(l => l.code === this.selectedLanguage);
    if (selectedLangObj) {
      this.currentLanguage = selectedLangObj.name;
    }

    // Trigger Google Translate
    this.setGoogleTranslateLanguage(this.selectedLanguage);

    this.mylang = 1; // Show Next button
    console.log('Language selected:', this.currentLanguage, this.selectedLanguage);
  }

  setGoogleTranslateLanguage(langCode: string) {
    // Set the google translate cookie
    document.cookie = `googtrans=/auto/${langCode}`;
    document.cookie = `googtrans=/auto/${langCode}; domain=.${window.location.hostname}`; // For some setups

    // Find the Google Translate dropdown and trigger change
    const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = langCode;
      googleCombo.dispatchEvent(new Event('change'));
    } else {
      // Fallback: reload if cookie is set but widget wasn't ready (though usually widget is ready by now)
      window.location.reload();
    }
  }




  // Global declaration to avoid TypeScript errors



  // Make sure to initialize the Google Translate widget
  onButtonClick() {
    // Set a timeout to execute after 2 seconds (2000 ms)
    setTimeout(() => {
      this.gotohome();
    }, 2000); // Change the duration as needed
  }


  // Translate text using Google Translate
  gotohome() {


    // Ensure LoginDetails is initialized
    if (!this.UserDetails || this.UserDetails.length === 0 || this.UserDetails[0] === "") {
      this.navCtrl.navigateForward('/login');
    } else {
      this.navCtrl.navigateForward('/home');
    }
  }
}



// Define the function that initializes the Google Translate widget

