import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private plt: Platform, ) { //private localNotification: LocalNotifications) {
    /**
     * this.plt.ready().then((rdy) => {
        this.localNotification.on('click');
        (notification) => {
          let json = JSON.parse(notification.data);
  
          let alert = this.alertCtrl.create({
            title: notification.title,
            subTitle: json.mydata
          });
          alert.present();
        }
      });
     */
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  /**
   * ScheduleNotification() {
    this.localNotification.schedule({
      id: 1,
      title: 'Attention',
      text: 'Single ILocalNotification',
      sound: 'file://sound.mp3',
      data: { mydata: 'My hidden msg this is ' }

    });
  }
   */

}
