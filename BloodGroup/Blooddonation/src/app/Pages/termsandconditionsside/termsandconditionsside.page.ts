import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-termsandconditionsside',
  templateUrl: './termsandconditionsside.page.html',
  styleUrls: ['./termsandconditionsside.page.scss'],
})
export class TermsandconditionssidePage implements OnInit {
  UserDetails1: any; UserDetails: any;
  constructor(public navCtrl: NavController) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
  }

  ngOnInit() {
  }
  GotoSignup() {
    this.navCtrl.navigateRoot(['/home']);
  }
}
