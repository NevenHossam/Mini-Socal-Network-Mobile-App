import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {


  constructor(public navCtrl: NavController, public navParams: NavParams, private AFAuth: AngularFireAuth, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {
  }

  LogMeOut() {
    console.log('Loggiing out ..');
    const loading = this.loadingCtrl.create({
      content: 'Logging you out ..'
    });
    loading.present();
    localStorage.clear();
    this.navCtrl.setRoot('LoginPage')
      .then(event => {
        loading.dismiss();
      })
      .catch(e => {
        console.log('Something Went Wrong ..' + e);
        loading.dismiss();
        this.alertCtrl.create({
          title: 'Ops !',
          message: 'Something Went Wrong .. pls try again later',
          buttons: [{
            text: 'Ok!',
            handler: () => { }
          }]
        }).present();
      });
  }

  logout() {
    this.alertCtrl.create({
      title: 'Confirm SignOut',
      message: 'Are you sure you want to Logout?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            this.navCtrl.setRoot('WelcomePage');
          }
        }
      ]
    }).present();
  }

  /**
   * this.logou().then(()=>{
      this.navCtrl.setRoot('LoginPage')

    }).catch((err)=>{
      console.log(err)
    })
   */

  donnotLogMeOut() {
    console.log('Going back to timeline ..');
    this.navCtrl.push('TabsPage', this.AFAuth.auth.currentUser);
  }

  /**
   * logou(){
    var promi = new Promise((resolve , reject) => {
      this.AFAuth.auth.signOut().then(()=>{
        resolve(true)
      }).catch ((err)=>{
        reject(true)
      })
    })
    return promi
  }
   */

}
