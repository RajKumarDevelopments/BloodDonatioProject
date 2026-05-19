import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { BearerService } from '../Bearer/bearer.service';
import { Subject } from 'rxjs';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  [x: string]: any;
  token: any;
  private GlobalData = new Subject<any>();

  publishSomeData(data: any) {
    this.GlobalData.next(data);
  }

  getObservable(): Subject<any> {
    return this.GlobalData;
  }

  loading: any;
  isLoading = false;

  HomeUrl: any;
  constructor(

    public toastController: ToastController,
    public http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController, public bearer: BearerService) {

    this.HomeUrl = 'https://localhost:44387/';
    // this.HomeUrl = "https://letshelp.breakingindiaapp.com/webservices/";
    //this.HomeUrl = "https://letshelp.in/webservices/";


    localStorage.setItem('URL', this.HomeUrl);

  }
  getBaseUrl(): string {
    return this.HomeUrl;
  }
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top'
    });
    toast.present();
  }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Loading....',
      //  duration: 5000
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'custom-class custom-loading '
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss()
        }
      });
    });
  }
  async presentToastt(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      cssClass: 'custom-class custom-loading ',
      position: 'top'
    });
    toast.present();
  }


  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss()
  }

  async presentAlert(Header: any, message: any) {
    const alert = await this.alertController.create({
      header: Header,
      message: message,
      buttons: ['OK']
    });
    return await alert.present();
  }
  GetData1(url: any): Observable<any> {

    this.HomeUrl = localStorage.getItem('URL');
    url = this.HomeUrl + url;
    return this.http.get(url).pipe(map(res => res));

  }


  GetData(url: any): Observable<any> {
    return from(this.bearer.getToken()).pipe(
      map((data: any) => {
        if (data && data.access_token) {
          this.token = data.access_token;
        }
        return this.token;
      }),
      switchMap((accessToken: string) => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}`
        });
        this.HomeUrl = localStorage.getItem('URL');
        url = this.HomeUrl + url;
        return this.http.get(url, { headers }).pipe(map(res => res));
      })
    );
  }
  PostData1(url: any, formData: any) {


    return this.http.get(url, formData).pipe(map(res => res))
  }


  //PostData(url: any, formData: any) {
  //  this.HomeUrl = localStorage.getItem('URL');
  //  url = this.HomeUrl + url;

  //  return this.http.get(url, formData).pipe(map(res => res))
  //}
  async presentMap() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait we are finding your location..',
      duration: 1000
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss()
        }
      });
    });
  }

  PostData(url: any, formData: any): Observable<any> {
    return from(this.bearer.getToken()).pipe(
      map((data: any) => {

        if (data && data.access_token) {
          this.token = data.access_token;
        }
        return this.token;
      }),
      switchMap((accessToken: string) => {

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${accessToken}` // Set the Authorization header with the Bearer token
        });
        this.HomeUrl = localStorage.getItem('URL');
        url = this.HomeUrl + url;
        return this.http.post(url, formData, { headers }).pipe(map(res => res));
      })
    );
  }

  login(url: any, formData: any) {
    this.HomeUrl = localStorage.getItem("URL");
    var URL = this.HomeUrl + url;
    return this.http.post(URL, formData).pipe(map(res => res))
  }

  DateFormat(value: any) {
    var date = new Date(value);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
  }
}
