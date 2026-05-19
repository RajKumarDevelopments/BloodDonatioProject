import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-privacypolicyside',
  templateUrl: './privacypolicyside.page.html',
  styleUrls: ['./privacypolicyside.page.scss'],
})
export class PrivacypolicysidePage implements OnInit {
  UserDetails1: any; UserDetails: any;
  constructor(public navCtrl: NavController) {
   
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
  }

  ngOnInit() {
  }
  GotoSignup() {
    this.navCtrl.navigateForward(['/home']);
  }
}
