import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
//import { Storage } from '@ionic/storage-angular';
//import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from '../Generalservice/generalservice.service'
//import axios from 'axios';
import { DOCUMENT } from '@angular/common';
declare global {
  interface Window {
    google: any;
  }
}
@Injectable({
  providedIn: 'root'
})
export class LanguageTranslatorService {
  private googleTranslateElementInit: () => void;
  public languageChanged = new BehaviorSubject<string>('en');

  public apiUrl = 'https://cors-anywhere.herokuapp.com/https://script.google.com/macros/library/d/1dpKc1EdK-YBACOsNH0AMYAI_dVUQOMLd3jWJ0p_-Y8N2ik9ljEHJrYVb/1';

 // private apiUrl = 'https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbxYllcYPHZXxmYwiOV67T0ekxN6rJ6IiOY75vLLaNOg1PTk3Jou6-TYP3Bvf_2tJPy3LQ/exec'; // Replace with your actual API URL
  HomeUrl: any;
  //apiKey: string = 'YOUR_GOOGLE_TRANSLATE_API_KEY';
  //url: string = 'https://translation.googleapis.com/language/translate/v2';
  private _storage: Storage | null = null;
  private currentLanguage: string = 'en';
  currentLang: any;
  translations: any;
  translatedText: string = '';
    //googleTranslateElementInit: () => void;
  constructor(@Inject(DOCUMENT) private document: Document,public general:GeneralService,private http: HttpClient, ) {
    this.HomeUrl = localStorage.getItem("URL");
    //this.loadLanguage();
    //this.init();
    //this.storage.create();
    //this.translate.setDefaultLang('en');
    this.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          //includedLanguages: 'en,hi,te', // Customize as needed
          pageLanguage: 'en',
          includedLanguages: 'en,hi,te,ta,ml,ur,kn,bn,mr',  // Indian languages // Add or remove languages as needed
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true // Prevents redirection
        },
        'google_translate_element'
      );
      const observer = new MutationObserver(() => {
        const iframe = this.document.querySelector('.goog-te-menu-frame') as HTMLIFrameElement;
        if (iframe) {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const language = iframeDoc.querySelector('.goog-te-menu2-item-selected')?.textContent;
            if (language) {
              this.languageChanged.next(language);
            }
          }
        }
      });

      observer.observe(this.document.body, {
        childList: true,
        subtree: true
      });
    }
  }
  
  
  initGoogleTranslate(): void {
    const script = this.document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;

    (window as any).googleTranslateElementInit = this.googleTranslateElementInit;

    this.document.body.appendChild(script);
  }

  

initGoogleTranslate22(): void {
  // Add Google Translate script dynamically
  const script = this.document.createElement('script');
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  script.defer = true;

    // Assign the init function to window object
    (window as any).googleTranslateElementInit = this.googleTranslateElementInit;

this.document.body.appendChild(script);
  }


// Interface for expected response (adjust based on API)



}
