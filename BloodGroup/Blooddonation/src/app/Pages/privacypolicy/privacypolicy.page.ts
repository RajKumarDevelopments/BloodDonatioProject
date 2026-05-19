import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.page.html',
  styleUrls: ['./privacypolicy.page.scss'],
})
export class PrivacypolicyPage implements OnInit {
  UserDetails1: any; UserDetails: any;
  Object: any;
  data1: any; mydata: any;
  constructor(public navCtrl: NavController, private activeRoute: ActivatedRoute) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.data1 = this.activeRoute.snapshot.paramMap.get("data");
    this.Object = JSON.parse(this.data1);
    this.mydata = this.Object[0]
  }

  ngOnInit() {
  }

  GotoSignup() {
    this.navCtrl.navigateForward(['/signup', { PolicyValue: 1, objs: JSON.stringify(this.Object)}]);
  }
  Accept() {
    this.navCtrl.navigateRoot(['/requsetform', { PolicyValue: 1, objs: JSON.stringify(this.Object) }]);
  }
}
