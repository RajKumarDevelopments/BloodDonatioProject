import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service'
declare var google: any;

@Component({
  selector: 'app-searchcomponent',
  templateUrl: './searchcomponent.component.html',
  styleUrls: ['./searchcomponent.component.scss'],
})
export class SearchcomponentComponent  implements OnInit {
  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  location1: any;
  Id: any;
  getlogindata: any;
  setlocation: any;
  items: any = [];
  searchText: any;
  clang: any;
  clong: any;
  LoginDet: any;
  Addr1: any;
  HomeUrl: any;
  address: any;
  Address: any;
  constructor(public navCtrl: NavController, public activatedRoute: ActivatedRoute,
    public popoverctrl: PopoverController, public general: GeneralService, public navParams: NavParams,
    public zone: NgZone,) {
    this.Addr1 = navParams.get('Addr');
    this.Id = navParams.get('Id');
    this.clang = navParams.get('CLANG');
    this.clong = navParams.get('CLONG');
    debugger
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];


  }

  ngOnInit() { }

  
}
