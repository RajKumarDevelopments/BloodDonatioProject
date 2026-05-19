import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@awesome-cordova-plugins/in-app-browser/ngx'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AndroidFullScreen } from '@awesome-cordova-plugins/android-full-screen/ngx'
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@awesome-cordova-plugins/launch-navigator/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { GooglePlaceModule, GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { LanguageTranslatorService } from './Services/LanguageServices/language-translator.service'
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot({ animated: false }), AppRoutingModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [File,
    SocialSharing, LanguageTranslatorService, LocalNotifications, PhotoViewer, GooglePlaceModule, LaunchNavigator, InAppBrowser,
    AndroidFullScreen, DatePipe, AndroidPermissions, LocationAccuracy, FileTransfer, FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }

