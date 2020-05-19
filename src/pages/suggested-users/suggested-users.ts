import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Users } from '../../models/Users.interface';
import { FuctionProvider } from '../../providers/fuction/fuction';
import { Followers } from '../../models/Followers';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FollowersList, UnFollowersList, UsersMirrorList } from '../../app/app.firebase.config';
import { UnFollowers } from '../../models/UnFollowers';
import { UsersMirror } from '../../models/UserMiror.interface';

@IonicPage()
@Component({
  selector: 'page-suggested-users',
  templateUrl: 'suggested-users.html',
})
export class SuggestedUsersPage {

  chk;
  followerObj = {} as Followers;
  unfollowerObj = {} as UnFollowers;
  followRef;
  unfollowRef;

  userMirrorRef;
  usersMirrorList: UsersMirror[];
  currentUserID;

  imagePath = '';
  postImagePath = '';

  followBtn; unfollowBtn;

  constructor(public navCtrl: NavController, public navParams: NavParams, private funcAuth: FuctionProvider, private context: AngularFireDatabase,
    private AFAuth: AngularFireAuth, private alertCtrl: AlertController) {
    this.followRef = this.context.list(FollowersList);
    this.unfollowRef = this.context.list(UnFollowersList);
    this.userMirrorRef = this.context.list(UsersMirrorList);
    this.currentUserID = this.AFAuth.auth.currentUser.uid;
    console.log('current user id is' + this.currentUserID);
  }

  ionViewWillEnter() {
    this.userMirrorRef.subscribe((usersAfterChanges) => { this.usersMirrorList = usersAfterChanges });
  }

  CheckCurrentUser(user: UsersMirror) {
    if (this.AFAuth.auth.currentUser.email == user.Email) {
      return true;
    }
    else {
      return false;
    }
  }

  FollowClicked(user: Users) {
    console.log('this is  the first test ' + user.Email)

    this.funcAuth.FollowCheck(user.userid).then((res: any) => {

      this.chk = res
      console.log(res)
      if (res[0] == null) {

        this.followerObj.FollowerId = this.currentUserID;
        console.log('this is test ' + this.followerObj.FollowerId)
        this.followerObj.FollowingId = user.userid;
        console.log('this is  second test ' + this.followerObj.FollowingId)

        this.followRef.push(this.followerObj)
          .then(data => {
            console.log("Followed Successfully!");
            this.alertCtrl.create({
              title: 'You Followed ' + user.Email + ' Successfully',
              buttons: ['Ok']
            }).present();
          }).catch(err => {
            console.log("Something went wrong : " + err);
            const alert = this.alertCtrl.create({
              title: 'Something went wrong',
              message: 'couldnot follow him right now, pls try again later..' + err.message,
              buttons: ['Ok']
            });
            alert.present();
          });
      }
      else {
        console.log('this is already .. ');
        this.alertCtrl.create({
          title: 'You Already Follow ' + user.Email,
          buttons: ['Ok']
        }).present();
      }
    })

    this.funcAuth.UnFollowCheck(user.userid).then((result: any) => {
      console.log('outer is .... ' + (result[0]))
      if (result[0] != null) {
        console.log('inner is .... ' + (result[0]))
        this.unfollowRef.remove(result[0]);
      }
    })
  }

  UnFollowClicked(user: Users) {
    console.log(' in start function  ' + this.AFAuth.auth.currentUser.uid)

    this.funcAuth.UnFollowCheck(user.userid).then((res: any) => {
      this.chk = res
      console.log(res)
      if (res[0] == null) {

        console.log(' current ' + this.AFAuth.auth.currentUser.uid)
        console.log(' current ' + user.userid)

        this.unfollowerObj.UnFollowerId = this.AFAuth.auth.currentUser.uid;
        this.unfollowerObj.UnFollowingId = user.userid;

        this.unfollowRef.push(this.unfollowerObj)
          .then(data => {
            console.log("UnFollowed Successfully!");
            this.alertCtrl.create({
              title: 'You Unfollowed ' + user.Email + ' Successfully',
              buttons: ['Ok']
            }).present();
          }).catch(err => {
            console.log("Something went wrong : " + err);
            this.alertCtrl.create({
              title: 'Something went wrong',
              message: 'couldnot unfollow him right now, pls try again later..' + err.message,
              buttons: ['Ok']
            }).present();
          });
      }
      else {
        console.log('this is already .. ');
        this.alertCtrl.create({
          title: 'You Already Unfollow ' + user.Email,
          buttons: ['Ok']
        }).present();
      }
    })

    this.funcAuth.FollowCheck(user.userid).then((result: any) => {
      console.log('outer is .... ' + (result[0]))
      if (result[0] != null) {
        console.log('inner is .... ' + (result[0]))
        this.followRef.remove(result[0]);
      }
    })
  }

}


/**
   * FollowClicked(user: Users) {

    this.followerObj.FollowingId = user.$key;
    this.followerObj.FollowerId = this.currentUserID;
    console.log('Follow is done' + this.followerObj);
    this.followRef.push(this.followerObj)
      .then(data => {
        console.log('Follow is done successfully!');
        const toast = this.toastCtrl.create({
          message: 'You Followed' + user.Email,
          duration: 3000,
          showCloseButton: true,
          closeButtonText: 'Ok!'
        }).present();
      })
      .catch(e => {
        console.log('Cannot follow, ' + e);
        this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'couldnot follow him right now, pls try again later..' + e.message,
          buttons: ['Ok']
        }).present();
      });
  }

  UnFollowClicked(user: Users) {
    this.unfollowerObj.UnFollowingId = this.currentUserID;
    this.unfollowerObj.UnFollowerId = user.$key;
    console.log('UnFollow is done' + this.unfollowerObj);
    this.unfollowRef.push(this.unfollowerObj)
      .then(data => {
        console.log('UnFollow is done successfully!');
      })
      .catch(e => {
        console.log('Cannot follow, ' + e);
        this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'couldnot unfollow him right now, pls try again later..' + e.message,
          buttons: ['Ok']
        }).present();
      });
  }
   */