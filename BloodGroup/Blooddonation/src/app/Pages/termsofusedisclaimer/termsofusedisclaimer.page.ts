import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router'

@Component({
  selector: 'app-termsofusedisclaimer',
  templateUrl: './termsofusedisclaimer.page.html',
  styleUrls: ['./termsofusedisclaimer.page.scss'],
})
export class TermsofusedisclaimerPage implements OnInit {
  UserDetails1: any; UserDetails: any;
  data1: any; Object: any; mydata: any;
  constructor(public navCtrl: NavController, private activeRoute: ActivatedRoute) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.data1 = this.activeRoute.snapshot.paramMap.get("data");
    this.Object = JSON.parse(this.data1);
    this.mydata = this.Object[0]
  }

  ngOnInit() {
  }

  Accept() {
    this.navCtrl.navigateRoot(['/requsetform', { TandCValue: 1, objs: JSON.stringify(this.Object), }]);
  }
  GotoSignup() {
    this.navCtrl.navigateRoot(['/signup', { TandCValue: 1, objs: JSON.stringify(this.Object), }]);
  }

}
