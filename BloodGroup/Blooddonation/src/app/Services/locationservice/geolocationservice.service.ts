import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PermissionService } from '../permission/permission.service'; // Assuming the PermissionService is defined in a separate file
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';
declare var google: any;
import { GeneralService } from '../../Services/Generalservice/generalservice.service'
@Injectable({
  providedIn: 'root'
})
export class GeolocationserviceService {
  Latitude: any;
  Longitude: any;

  constructor(private http: HttpClient,
    private platform: Platform,
    private permissionService: PermissionService, // Assuming you have a PermissionService for handling permissions,
    private locationAccuracy: LocationAccuracy, private general: GeneralService) {


  }
  async getCurrentLocations1() {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Increase the timeout to 10 seconds
      maximumAge: 0
    };

    try {
      const resp = await Geolocation.getCurrentPosition(options);
      // Location successfully retrieved
      console.log('Current position:', resp.coords.latitude, resp.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      if (error === 3) {
        // Timeout expired
        this.general.presentToast("Timeout expired. Please check your network connection and try again.");
      } else {
        // Handle other errors
        this.general.presentToast("Error getting location. Please try again later.");
      }
    }
  }

  async getCurrentLocation(): Promise<any> {
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status: ', permissionStatus.location);
      if (permissionStatus?.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location !== 'granted') {
          await this.openSettings(true);
          return;
        }
      }

      if (Capacitor.getPlatform() === 'android') {
        this.enableGps();
      }

      const position = await this.getCurrentPosition();
      this.Latitude = position.coords.latitude;
      this.Longitude = position.coords.longitude;

      const geocodeResult = await this.geocodeLocation(this.Latitude, this.Longitude);
      console.log(position);
      return geocodeResult;
    } catch (e: any) {
      if (e?.message === 'Location services are not enabled') {
        await this.openSettings();
      }
      console.error(e);
      throw e;
    }
  }

  async getCurrentPosition(): Promise<GeolocationPosition> {
    const options = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true
    };
    return await Geolocation.getCurrentPosition(options);
  }

  async geocodeLocation(latitude: number, longitude: number): Promise<any> {
    
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(latitude, longitude);
      const request = { location: latlng };

      geocoder.geocode(request, (results: any, status: any) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          
          // let fullAddress = results[1].formatted_address;

          const addressComponents = results[0].address_components;
          let areaName = null;
          for (let i = 0; i < addressComponents.length; i++) {
            const types = addressComponents[i].types;
            if (types.includes('sublocality_level_2')) {
              areaName = addressComponents[i].long_name;
              break;
            }
          }
          resolve({ lat: latitude, lng: longitude, area: areaName });
        } else {
          reject('Geocoder failed: ' + status);
        }
      });
    });
  }


  openSettings(app = false) {
    console.log('open settings...');
    return NativeSettings.open({
      optionAndroid: app ? AndroidSettings.ApplicationDetails : AndroidSettings.Location,
      optionIOS: app ? IOSSettings.App : IOSSettings.LocationServices
    });
  }

  async enableGps() {
    const canRequest = await this.locationAccuracy.canRequest();
    if (canRequest) {
      await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    }
  }

}
