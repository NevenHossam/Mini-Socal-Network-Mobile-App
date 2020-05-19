import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Posts } from '../../models/Posts.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { Users } from '../../models/Users.interface';
import { FuctionProvider } from '../../providers/fuction/fuction';
import { UsersLikePosts } from '../../models/UsersLikePosts';
import { PostsList, UsersLikePostsList, UsersDisikePostsList } from '../../app/app.firebase.config';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  chk
  posts = {} as Posts;
  postRef: FirebaseListObservable<Posts[]>;
  postsList: Array<Posts>;
  postsListInDb;
  userLikePostObj = {} as UsersLikePosts;
  userDisLikePostObj = {} as UsersLikePosts;

  userLikePostRef;
  userLikePostListInDb;
  userDislikePostRef;
  userDislikePostListInDb;

  user = {} as Users;
  currentUserid: string;
  currentUserInfo;

  imagePath = '';
  postImagePath = '';
  currentUserEmail: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController, private context: AngularFireDatabase,
    private AFAuth: AngularFireAuth, private modalCtrl: ModalController, public funcAuth: FuctionProvider) {

    this.postRef = this.context.list(PostsList);
    this.postRef.subscribe((postsAfterChanges) => { this.postsList = postsAfterChanges });
    this.postsListInDb = firebase.database().ref(PostsList);

    this.userLikePostListInDb = firebase.database().ref(UsersLikePostsList);
    this.userLikePostRef = this.context.list(UsersLikePostsList);

    this.userDislikePostListInDb = firebase.database().ref(UsersDisikePostsList);
    this.userDislikePostRef = this.context.list(UsersDisikePostsList);

    const currentUserInfo = this.AFAuth.auth.currentUser;
    this.currentUserEmail = currentUserInfo.email;
    this.currentUserid = this.AFAuth.auth.currentUser.uid;

    if (currentUserInfo) {
      console.log(this.currentUserEmail);
    }
    else {
      console.log('anonymouse');
    }
  }

  goToAddPostPage() {
    this.navCtrl.push('AddPostPage');
  }

  OnPostClicked(post: Posts) {
    this.actionSheetCtrl.create(
      {
        title: post.PostContent,
        buttons: [
          {
            text: 'Edit',
            icon: 'build',
            handler: () => { this.navCtrl.push('EditpostPage', post); }
          },
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              this.alertCtrl.create({
                title: 'Confirm Delete Post',
                message: 'Are you sure you want to permanently delete this post?',
                buttons: [
                  {
                    text: 'No',
                    handler: () => { }
                  },
                  {
                    text: 'Yes',
                    handler: () => { this.postRef.remove(post.$key); }
                  }
                ]
              }).present();
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            handler: () => { }
          },
        ]
      }
    ).present();
  }

  LikeClicked(post: Posts) {

    this.funcAuth.LikeCheck(post.PostId).then((res: any) => {
      this.chk = res
      console.log(res)
      if (res[0] == null) {

        this.userLikePostObj.PostId = post.PostId;
        this.userLikePostObj.UserId = this.AFAuth.auth.currentUser.uid;

        this.userLikePostRef.push(this.userLikePostObj)
          .then(data => {
            console.log("Post Liked Successfully");
            this.alertCtrl.create({
              title: 'Post Liked Successfully',
              buttons: ['Ok']
            }).present();
          }).catch(err => {
            console.log("Something went wrong : " + err);
            this.alertCtrl.create({
              title: 'Something went wrong',
              message: 'couldnot like this post right now, pls try again later..' + err.message,
              buttons: ['Ok']
            }).present();
          });
      }
      else {
        console.log('this is alrealdy .. ');
        this.alertCtrl.create({
          title: 'You did this already',
          buttons: ['Ok']
        }).present();
      }
    })

    this.funcAuth.DisLikeCheck(post.PostId).then((result: any) => {
      console.log('outer is .... ' + (result[0]))
      if (result[0] != null) {
        console.log('inner is .... ' + (result[0]))
        this.userDislikePostRef.remove(result[0]);
      }
    })
  }

  DislikeClicked(post: Posts) {

    this.funcAuth.DisLikeCheck(post.PostId).then((res: any) => {
      this.chk = res
      console.log(res)
      if (res[0] == null) {

        // add user in list of dislikers

        this.userDisLikePostObj.PostId = post.PostId;
        this.userDisLikePostObj.UserId = this.AFAuth.auth.currentUser.uid;

        this.userDislikePostRef.push(this.userDisLikePostObj)
          .then(data => {
            console.log("Post disLiked Successfully");
            this.alertCtrl.create({
              title: 'Post Disiked Successfully',
              buttons: ['Ok']
            }).present();
          }).catch(err => {
            console.log("Something went wrong : " + err);
            this.alertCtrl.create({
              title: 'Something went wrong',
              message: 'couldnot dislike this post right now, pls try again later..' + err.message,
              buttons: ['Ok']
            }).present();
          });
      }

      else {
        console.log('this is alrealdy .. ');
        this.alertCtrl.create({
          title: 'You did this already',
          buttons: ['Ok']
        }).present();
      }
    })

    this.funcAuth.LikeCheck(post.PostId).then((result: any) => {
      console.log('outer is .... ' + (result[0]))
      if (result[0] != null) {
        console.log('inner is .... ' + (result[0]))
        this.userLikePostRef.remove(result[0]);
      }
    })


  }

  addPost() {
    const modal = this.modalCtrl.create('AddPostPage')
    modal.present();
  }


}


