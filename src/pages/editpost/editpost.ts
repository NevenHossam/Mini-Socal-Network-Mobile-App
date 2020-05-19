import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { Posts } from '../../models/Posts.interface';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-editpost',
  templateUrl: 'editpost.html',
})
export class EditpostPage {

  myPost = {} as Posts;
  postRef: FirebaseObjectObservable<Posts>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private context: AngularFireDatabase, private AFAuth: AngularFireAuth) {

    this.myPost = this.navParams.data;
    this.postRef = this.context.object('Posts/' + this.myPost.$key);

  }

  EditPost(post: Posts) {
    if (this.AFAuth.auth.currentUser.email == post.PostOwner) {
      this.postRef.update(this.myPost);
      this.myPost = {} as Posts;
      this.navCtrl.pop();
    }
  }

  cancel() {
    this.navCtrl.pop();
  }

}
