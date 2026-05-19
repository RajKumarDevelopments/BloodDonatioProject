import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../Generalservice/generalservice.service';
import { isPlatform } from '@ionic/angular'; // To handle platform-specific logic
import { Filesystem, Directory, FilesystemEncoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public general:GeneralService) { }

  getusersData(Pincode: string): Observable<any> {
    const formData = new FormData();
    formData.append('Pincode', Pincode);
    const url = 'api/BG/BG_GetNotificationForUsers';
    return this.general.PostData(url, formData);
  }

  getAdmin(): Observable<any> {
    const url = 'api/BG/BG_Getbloodrequest_notification';
    return this.general.GetData(url);
  }

  getreferalcodeusers(RegId: string): Observable<any> {
    const formData = new FormData();
    formData.append('RegId', RegId);
    const url = 'api/BG/BG_Get_Referalcode_Notification';
    return this.general.PostData(url, formData);
  }

  combineBase64Images(frameBase64: string, photoBase64: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const frameImg = new Image();
      const photoImg = new Image();
      frameImg.crossOrigin = 'Anonymous';  // To handle CORS issues
      photoImg.crossOrigin = 'Anonymous';  // To handle CORS issues

      frameImg.onload = () => {
        photoImg.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = frameImg.width;
          canvas.height = frameImg.height;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.drawImage(frameImg, 0, 0); // Draw the frame image
            ctx.drawImage(photoImg, 0, 0, frameImg.width, frameImg.height); // Draw the photo image

            const combinedBase64 = canvas.toDataURL('image/png');
            resolve(combinedBase64);
          } else {
            reject('Could not get canvas context');
          }
        };
        photoImg.src = photoBase64;
      };
      frameImg.src = frameBase64;
    });
  }


  async saveBase64ToGallery(base64Image: string, fileName: string): Promise<string | null> {
    try {
      // Ensure base64 image has no prefix (like data:image/jpeg;base64,)
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

      // Save the file in the appropriate directory
      const savedFile = await Filesystem.writeFile({
        path: `Pictures/${fileName}`, // Save inside Pictures folder
        data: base64Data,
        directory: isPlatform('android') ? Directory.External : Directory.Documents, // Save to External storage for Android
        recursive: true,
      });

      console.log('File saved successfully:', savedFile.uri);

      // Return the file URI so you can use it later (e.g., to display it)
      return savedFile.uri;
    } catch (error) {
      console.error('Error saving file:', error);
      return null; // Return null on error
    }
  }


}
