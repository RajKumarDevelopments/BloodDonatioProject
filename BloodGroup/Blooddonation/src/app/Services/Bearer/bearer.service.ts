import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BearerService {

   private apiUrl = 'https://localhost:44387/api/Token/Gettoken';
  //private apiUrl = 'https://letshelp.breakingindiaapp.com/webservices/api/Token/Gettoken';
  //private apiUrl = 'https://letshelp.in/webservices/api/Token/Gettoken';
  constructor(private http: HttpClient) { }

  getToken(): Observable<any> {
    debugger
    // Adjust this method based on your authentication API's requirements (e.g., POST request for login)
    return this.http.get<any>(`${this.apiUrl}`,);
  }
}
