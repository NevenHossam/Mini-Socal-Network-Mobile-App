import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { UsersMirror } from '../../models/UserMiror.interface';
import { UsersMirrorList, FollowersList, UnFollowersList } from '../../app/app.firebase.config';
import firebase from 'firebase';
import { FuctionProvider } from '../../providers/fuction/fuction';
import { AngularFireAuth } from 'angularfire2/auth';
import { Followers } from '../../models/Followers';
import { UnFollowers } from '../../models/UnFollowers';
import { Users } from '../../models/Users.interface';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  userMirrorRef;
  userMirrorMatchedObject;
  userMirrorList: UsersMirror[];
  searchQuery;
  userMirrorInDb;
  userMirrorObj = {} as UsersMirror;

  chk;

  flag: Boolean;

  followerObj = {} as Followers;
  unfollowerObj = {} as UnFollowers;
  followRef;
  unfollowRef;

  usersMirrorList: UsersMirror[];
  currentUserID;

  imagePath = '';
  postImagePath = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private context: AngularFireDatabase, private alertCtrl: AlertController,
    private funcAuth: FuctionProvider, private AFAuth: AngularFireAuth) {

    this.userMirrorRef = this.context.list(UsersMirrorList);
    this.userMirrorInDb = firebase.database().ref(UsersMirrorList);
    console.log(this.userMirrorInDb);

    this.followRef = this.context.list(FollowersList);
    this.unfollowRef = this.context.list(UnFollowersList);

  }

  ionViewWillEnter() {
    this.userMirrorRef.subscribe((UserMirrorAfterChanges) => { this.userMirrorList = UserMirrorAfterChanges });
  }

  getItems() {
    this.funcAuth.SearchCheck(this.searchQuery).then((res: any) => {
      this.chk = res
      console.log(res);
      if (res[0] == null) {
        this.userMirrorObj.Email = this.searchQuery;
        this.userMirrorRef.push(this.userMirrorObj)
          .then(data => {
            console.log("Search is done successfully");
          }).catch(err => {
            console.log("Something went wrong : " + err);
            this.alertCtrl.create({
              title: 'Something went wrong',
              message: 'couldnot search for your friend right now, pls try again later..' + err.message,
              buttons: ['Ok']
            }).present();
          });
      }
    })
  }

  FollowClicked(user: Users) {
    console.log('this is  the first test ' + user.Email)

    this.funcAuth.FollowCheck(user.userid).then((res: any) => {

      this.chk = res
      console.log(res)
      if (res[0] == null) {

        this.followerObj.FollowerId = this.AFAuth.auth.currentUser.uid;
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
 * getItems(searchQuery) {
    if (searchQuery && searchQuery.trim() != '') {
      console.log(searchQuery);
      this.userMirrorMatchedObject = this.userMirrorInDb.filter((item) => {
        var result = (item.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1);
        return result;
      })
    }
  }
 */


  /**
   * console.log(this.searchQuery);
  console.log(this.usersMirrorList);

  let obj: Array<UsersMirror>;

  for (let i; i < 5; i++) {
    if (obj[i].Email == this.searchQuery) {
      this.flag = true;
      console.log('l2et l email w d5lt fl ifff' + this.flag);
      this.userMirrorMatchedObject.Email = this.searchQuery;
      this.userMirrorMatchedObject.Age = this.userMirrorRef[i].Age;
      this.userMirrorMatchedObject.UserImg = this.userMirrorRef[i].UserImg;
      this.searchQuery = '';
      break;
    }
    else {
      console.log('msh l2ya l email');
    }
    console.log('end for')
   */


  /**
   * for (let i = 0; i < 3; i++) {
      if (this.usersMirrorList[i].Email == this.searchQuery) {
        console.log('l2et l user ' + this.usersMirrorList[i]);
      }
      else {
        console.log('yasser gazma');
      }
    }
   */


  /**
   * //for (let userMirrorObj of this.usersMirrorList) {
      //console.log(userMirrorObj);
      // if (userMirrorObj.Email == this.searchQuery) {
   * if (this.userMirrorRef[i] == this.searchQuery) {
        this.flag = true;
        console.log('yasseeerrrr l2et l email' + this.flag);
        this.userMirrorMatchedObject.Email = this.searchQuery;
        this.userMirrorMatchedObject.Age = this.userMirrorRef[i].Age;
        this.userMirrorMatchedObject.UserImg = this.userMirrorRef[i].UserImg;
        this.searchQuery = '';
        break;
      }
      else {
        this.flag = false;
        console.log('laaaa' + this.flag);
        this.alertCtrl.create({
          title: 'No result',
          message: 'There is no user with this email, please try again..',
          buttons: [
            {
              text: 'Ok',
              handler: () => { }
            },
          ]
        }).present();
        break;
      }
   */


