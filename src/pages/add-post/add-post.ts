import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { Posts } from '../../models/Posts.interface';
import { Camera } from '@ionic-native/camera';
import { AngularFireAuth } from 'angularfire2/auth';
import { PostsList } from '../../app/app.firebase.config';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {

  myPost = {} as Posts;

  postImagePath = '';
  imagePath = '';

  currentUserEmail;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController
    , private camera: Camera, private toastCtrl: ToastController, private AFAuth: AngularFireAuth) {


    const CusrrentUser = this.AFAuth.auth.currentUser;
    this.currentUserEmail = CusrrentUser.email;

  }

  addPost() {
    const postRef = firebase.database().ref(PostsList);

    if (this.myPost.PostContent != null) {
      this.myPost.PostDate = new Date(Date.now()).toISOString();
      this.myPost.PostOwner = this.currentUserEmail;
      this.myPost.PostOwnerId = this.AFAuth.auth.currentUser.uid;
      this.myPost.PostImg = this.postImagePath;
      this.myPost.PostId = this.AFAuth.auth.currentUser.uid + this.myPost.PostDate;

      postRef.push(this.myPost)
        .then((data) => {
          console.log("Post Added Successfully");
          this.toastCtrl.create({
            message: 'Post Added Successfully',
            showCloseButton: true,
            duration: 3000,
            closeButtonText: 'Ok!',
          }).present();
          this.myPost = {} as Posts;
          this.navCtrl.pop();
        }).catch((err) => {
          console.log("Something went wrong : " + err);
          this.alertCtrl.create({
            title: 'Something went wrong !',
            message: 'You Cannot post, try again later',
            buttons: [
              {
                text: 'Ok',
                handler: () => { }
              }
            ]
          }).present();
        });
    }
    else {
      this.alertCtrl.create({
        title: 'Post Is Empty !',
        message: 'You Cannot post an empty post',
        buttons: [
          {
            text: 'Ok',
            handler: () => { }
          }
        ]
      }).present();
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
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
        this.postImagePath = "data:image/jpeg,base64," + imagedata;
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
        this.postImagePath = "data:image/jpeg,base64," + imagedata;
      })
      .catch((error) => {
        this.toastCtrl.create({
          message: 'Can not get image now! ' + error,
          duration: 5000,
        }).present();
      });
  }

}
