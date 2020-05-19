import { Component } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { Users } from '../../models/Users.interface';
import firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  newUser: Users = new Users();

  constructor(private alertCtrl: AlertController) {

  }

  signUp() {
    const userRef = firebase.database().ref('Users');

    firebase.auth().createUserWithEmailAndPassword(this.newUser.Email, this.newUser.Password)
      .then((data) => {
        this.newUser.$key = data.user.uid;
        this.newUser.Email = null;
        this.newUser.Password = null;
        userRef.push(this.newUser);
      })
      .catch((err) => {
        const alert = this.alertCtrl.create({
          title: 'Signup failed!',
          message: err.message,
          buttons: ['Ok']
        });
        alert.present();
      })
  }

}
