import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { FollowersList, UnFollowersList, PostsList, UsersMirrorList } from '../../app/app.firebase.config';

@Injectable()
export class FuctionProvider {

  arrayOfFollowingsIds;

  constructor(public afauth: AngularFireAuth, public afdb: AngularFireDatabase) {
  }

  LikeCheck(key) {
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref('UsersLikePosts').once('value', snap => {
        var res = snap.val()
        let array = []
        for (var i in res) {
          if (res[i].UserId == this.afauth.auth.currentUser.uid && res[i].PostId == key) {
            array.push(i)
            console.log('in function ' + res[i].UserId)
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  DisLikeCheck(key) {
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref('UsersDislikePosts').once('value', snap => {
        var res = snap.val()
        let array = []
        for (var i in res) {
          if (res[i].UserId == this.afauth.auth.currentUser.uid && res[i].PostId == key) {
            array.push(i)
            console.log('in function ' + res[i].UserId)
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  FollowCheck(key) {
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(FollowersList).once('value', snap => {
        var res = snap.val()
        let array = []
        for (var i in res) {
          if (res[i].FollowerId == this.afauth.auth.currentUser.uid && res[i].FollowingId == key) {
            array.push(i)
            console.log('in function ' + res[i].un)
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  UnFollowCheck(key) {
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(UnFollowersList).once('value', snap => {
        var res = snap.val()
        let array = []
        for (var i in res) {
          if (res[i].UnFollowerId == this.afauth.auth.currentUser.uid && res[i].UnFollowingId == key) {
            array.push(i)
            console.log('in function ' + res[i].UnFollowerId)
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  SearchCheck(key) { // searchQuery
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(UsersMirrorList).once('value', snap => {
        var res = snap.val();
        let array = []; // list of users
        for (var i in res) {
          if (res[i].Email == key) {
            array.push(res[i]);
            console.log('in function ' + res[i].Email);
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  FollowingsCheck(key) { // follower = current
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(FollowersList).once('value', snap => {
        var res = snap.val();
        let array = []; // list of followings
        for (var i in res) {
          if (res[i].FollowerId == this.afauth.auth.currentUser.uid) {
            array.push(res[i].FolloweId);
            console.log('in function ' + res[i].un);
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  FollowingsPostsCheck(key) { // following id
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(PostsList).once('value', snap => {
        var res = snap.val();
        let array = []; // list of posts of my followings
        for (var i in res) {
          if (res[i].PostOwnerId == key) {
            array.push(i);
            console.log('in function ' + res[i].un);
          }
        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  getFollowerID() {
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(FollowersList).once('value', snap => {
        var res = snap.val();
        this.arrayOfFollowingsIds = []; 
        for (var i in res) {
          if (res[i].FollowerId == this.afauth.auth.currentUser.uid) {
            this.arrayOfFollowingsIds.push(res[i].FollowingId);
          }
        }
        resolve(this.arrayOfFollowingsIds)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }

  getFollowingPosts(key) { 
    var promi = new Promise((resolve, reject) => {
      this.afdb.database.ref(PostsList).once('value', snap => {
        console.log('this is get follower posts  ' + key[0].FollowingId)
        var res = snap.val();
        let array = []; 
        console.log('this is length of array ' + this.arrayOfFollowingsIds.length)
        for (var i in res) {
          for (var x = 0; x < this.arrayOfFollowingsIds.length; x++) {
            // console.log('this is get follower posts  '+ key[x].FollowingId)

            if (res[i].PostOwnerId == key[x]) {
              // console.log('this is get follower posts  '+ res[i])
              array.push(res[i]);
            }
          }

        }
        resolve(array)
      }).catch((err) => {
        reject(err)
      })
    })
    return promi
  }


}
