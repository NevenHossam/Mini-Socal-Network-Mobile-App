import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Users } from '../../models/Users.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { Camera } from '@ionic-native/camera';
import { UserAddressLocation } from '../../models/UserAddressLocation';
import { Geolocation } from '@ionic-native/geolocation';
import firebase from 'firebase';
import { UsersList, UsersMirrorList } from '../../app/app.firebase.config';
import { UsersMirror } from '../../models/UserMiror.interface';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as Users;
  userMirror = {} as UsersMirror;
  //UserList: Users;
  //userRef: FirebaseListObservable<Users[]>;
  //newUser = {} as Users;


  imagePath = '';

  locationSet = false;
  baseLocation: UserAddressLocation = new UserAddressLocation(29.866866, 31.315270);

  currentUserId;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation,
    private loadingCtrl: LoadingController, private camera: Camera, private AFAuth: AngularFireAuth, private modalCtrl: ModalController,
    private toastCtrl: ToastController) {

  }


  continue(userData: Users) {

    try {
      const result = this.AFAuth.auth.createUserWithEmailAndPassword(this.user.Email, this.user.Password);
      if (result) {
        this.navCtrl.push('FollowregisterPage');
        console.log('Done');
      }
    }
    catch (e) {
      console.log(e);
    }

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

  /**
   * register(userData: Users) {
    try {
      const accountResult = this.AFAuth.auth.createUserWithEmailAndPassword(this.user.Email, this.user.Password);
      this.navCtrl.push('TimelinePage');
    } catch (e) {
      console.error(e);
    }


    /**
  * 
  * this.newUser.Email = userData.Email;
   this.newUser.Password = userData.Password;
   this.newUser.$key = userData.$key;
   this.newUser.Followers = [''];
   this.newUser.Followings = [''];
   this.newUser.UserImg = userData.UserImg;
   this.newUser.UserLocation = userData.UserLocation;
   this.userRef.push(this.newUser);

   this.newUser = {} as Users;
   this.navCtrl.pop();
  */

  /**
  * try {
   const accountResult = this.AFAuth.auth.createUserWithEmailAndPassword(user.Email, user.Password);
   this.navCtrl.push('TimelinePage');
 } catch (e) {
   console.error(e);
 }
  */

  /**
   * const userRef = firebase.database().ref(UsersList);
  const loading = this.loadingCtrl.create({
    content: 'Registering, please wait ...'
  });
  loading.present();
   */

  /**
   * 
   * const userRef = firebase.database().ref(UsersList);
  firebase.auth().createUserWithEmailAndPassword(this.newUser.Email, this.newUser.Password)
    .then((data) => {
      this.newUser.$key = data.user.uid;
      this.newUser.Email = null;
      this.newUser.Password = null;
      userRef.push(this.newUser);
      // loading.dismiss();
    })
    .catch((err) => {
      // loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Registering failed!',
        message: err.message,
        buttons: ['Ok']
      });
      alert.present();
    })
 
  this.navCtrl.push('TimelinePage');
   */

  /**
   * let data = this.form.value;
 let credentials = {
   email: data.email,
   password: data.password
 };
 this.AFAuth.auth.signUp(credentials)
   .then(() => this.navCtrl.setRoot('TabsPage'),
     (error) => this.signupError = error.message
   );
*/


  registerAuth() {
    this.AFAuth.auth.createUserWithEmailAndPassword(this.user.Email, this.user.Password);
    console.log('done email w pass ');
    this.navCtrl.push('TabsPage');
  }

  register() {
    try {
      const userMirrorRef = firebase.database().ref(UsersMirrorList);

      this.registerAuth();

      this.userMirror.Age = this.user.Age;
      this.userMirror.Email = this.user.Email;
      this.userMirror.Password = this.user.Password;
      this.userMirror.IsFollowed = false;
      this.userMirror.userid = this.AFAuth.auth.currentUser.uid;

      userMirrorRef.push(this.userMirror)
        .then((data) => {
          console.log("User Added Successfully");
          this.userMirror = {} as UsersMirror;
          this.navCtrl.push('TabsPage');
        }, (err) => {
          console.log("Something went wrong : " + err);
        });


      console.log('done mirror ');
    } catch (e) {
      console.error(e);
    }
  }

  save() {
    const loading = this.loadingCtrl.create({
      content: 'Wait ..'
    });
    loading.present();

    this.user.UserLocation = this.baseLocation;

    const userMirrorRef = firebase.database().ref(UsersMirrorList);

    this.userMirror.Age = 22;
    this.userMirror.Email = this.user.Email;
    this.userMirror.Password = this.user.Password;
    this.userMirror.userid = this.AFAuth.auth.currentUser.uid;
    this.userMirror.IsFollowed = false;

    this.userMirror.UserImg = this.imagePath;
    this.userMirror.UserLocation = this.user.UserLocation;

    this.user.userid = this.AFAuth.auth.currentUser.uid;

    const imageRef = firebase.storage().ref('Images/image-' + new Date().getMilliseconds() + '.jpg');
    imageRef.putString(this.imagePath, firebase.storage.StringFormat.DATA_URL)
      .then((snapshot) => {
        this.user.UserImg = snapshot.downloadURL;
        const userListRef = firebase.database().ref(UsersList);
        userListRef.push(this.user)
          .then(() => {
            this.navCtrl.pop();
            loading.dismiss();
          })
          .catch((e) => {
            this.toastCtrl.create({
              message: 'Error : ' + e,
              duration: 5000,
              closeButtonText: 'Close',
              showCloseButton: true
            }).present();
          }).present();
      })
      .catch((e) => {
        this.toastCtrl.create({
          message: 'Error in saving the photo!' + e,
          duration: 5000,
          closeButtonText: 'Close',
          showCloseButton: true
        }).present();
        loading.dismiss();
      });

    userMirrorRef.push(this.userMirror)
      .then((data) => {
        console.log("User Added Successfully");
        this.userMirror = {} as UsersMirror;
        this.navCtrl.push('TabsPage');
      }, (err) => {
        console.log("Something went wrong : " + err);
      });
  }

  cancel() {
    this.AFAuth.auth.signOut();
    this.navCtrl.pop();
  }

}
