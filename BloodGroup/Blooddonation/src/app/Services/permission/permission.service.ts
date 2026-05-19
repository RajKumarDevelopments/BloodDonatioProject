import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private androidPermissions: AndroidPermissions) { }

  checkAndRequestPermission(permission: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(permission).then(
        result => {
          if (result.hasPermission) {
            resolve(true); // Permission already granted
          } else {
            this.androidPermissions.requestPermission(permission).then(
              success => {
                if (success.hasPermission) {
                  resolve(true); // Permission granted after request
                } else {
                  resolve(false); // Permission denied after request
                }
              },
              err => {
                console.error('Error requesting permission:', err);
                resolve(false); // Error occurred while requesting permission
              }
            );
          }
        },
        err => {
          console.error('Error checking permission:', err);
          resolve(false); // Error occurred while checking permission
        }
      );
    });



  }
 


}
