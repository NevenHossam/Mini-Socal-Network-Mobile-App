import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserAddressLocation } from '../../models/UserAddressLocation';
import { Geolocation } from '@ionic-native/geolocation';
import { Users } from '../../models/Users.interface';
import { FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-followregister',
  templateUrl: 'followregister.html',
})
export class FollowregisterPage {

  user = {} as Users;
  UserList: Users;
  userRef: FirebaseListObservable<Users[]>;
  newUser = {} as Users;

  imagePath = '';

  locationSet = false;
  baseLocation: UserAddressLocation = new UserAddressLocation(29.866866, 31.315270);

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
    private loadingCtrl: LoadingController, private camera: Camera, private AFAuth: AngularFireAuth, private modalCtrl: ModalController,
    private toastCtrl: ToastController) {

  }

  getLocation() {
    const loading = this.loadingCtrl.create({
      content: 'Updating your location..',
    });
    this.geolocation.getCurrentPosition()
      .then((locationdata) => {
        this.baseLocation.Latitude = locationdata.coords.latitude;
        this.baseLocation.Longitude = locationdata.coords.longitude;
        this.locationSet = true;
        loading.dismiss();
      }).catch((error) => {
        console.log(error);
      });
  }

  setLocationOnMap() {
    const modal = this.modalCtrl.create('AddressmapPage');
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.baseLocation = data;
        this.locationSet = true;
      }
    });
  }

  takePhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      targetHeight: 200,
      targetWidth: 200,
      cameraDirection: this.camera.Direction.FRONT,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
    })
      .then((imagedata) => {
        this.imagePath = "data:image/jpeg,base64," + imagedata;
      })
      .catch((error) => {
        this.toastCtrl.create({
          message: 'Can not capture image now! ' + error,
          duration: 5000,
        }).present();
      });
  }

  openGallery() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      targetHeight: 200,
      targetWidth: 200,
      cameraDirection: this.camera.Direction.FRONT,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
    })
      .then((imagedata) => {
        this.imagePath = "data:image/jpeg,base64," + imagedata;
      })
      .catch((error) => {
        this.toastCtrl.create({
          message: 'Can not get image now! ' + error,
          duration: 5000,
        }).present();
      });
  }

  register(userData: Users) {
    this.newUser.Email = userData.Email;
    this.newUser.Password = userData.Password;
    this.newUser.$key = userData.$key;
    this.newUser.UserImg = userData.UserImg;
    this.newUser.UserLocation = userData.UserLocation;

    this.userRef.push(this.newUser);

    this.newUser = {} as Users;
    this.navCtrl.pop();

  }

  cancel() {
    this.AFAuth.auth.signOut();
    this.navCtrl.pop();
  }

}
