import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserAddressLocation } from '../../models/UserAddressLocation';


@IonicPage()
@Component({
  selector: 'page-addressmap',
  templateUrl: 'addressmap.html',
})
export class AddressmapPage {

  locationSet = false;
  baseLocation: UserAddressLocation = new UserAddressLocation(29.866866, 31.315270);

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  setLocation() {
    this.viewCtrl.dismiss(this.baseLocation);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  onMapClicked(event) {
    this.baseLocation.Latitude = event.coords.lat;
    this.baseLocation.Longitude = event.coords.lng;
    this.locationSet = true;
  }
}
