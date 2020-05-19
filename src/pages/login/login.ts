import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Users } from '../../models/Users.interface';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as Users;

  constructor(public navCtrl: NavController, public navParam: NavParams, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
    
  }

  Login() {
    const loading = this.loadingCtrl.create({
      content: 'Signing you in...'
    });
    loading.present();

    firebase.auth().signInWithEmailAndPassword(this.user.Email, this.user.Password)
      .then(() => {
        loading.dismiss();
        this.navCtrl.push('TabsPage');
      })
      .catch((err) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Logging in is failed! please try again later',
          message: err.message,
          buttons: ['Ok']
        });
        alert.present();
      })
  }

  Register() {
    this.navCtrl.push('RegisterPage');
  }

}


