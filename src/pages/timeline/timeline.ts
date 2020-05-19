import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Posts } from '../../models/Posts.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { Users } from '../../models/Users.interface';
import { PostsList, UsersLikePostsList, UsersDisikePostsList } from '../../app/app.firebase.config';
import firebase from 'firebase';
import { UsersLikePosts } from '../../models/UsersLikePosts';
import { FuctionProvider } from '../../providers/fuction/fuction';

@IonicPage()
@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {
  chk
  FollowerPosts
  posts = {} as Posts;
  postRef;
  postsList: Posts[];
  userPosts: Array<Posts>;
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

  followersList;

  followingPostsList;

  imagePath = '';
  postImagePath = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public funcAuth: FuctionProvider,
    private context: AngularFireDatabase, private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController, private AFAuth: AngularFireAuth, private modalCtrl: ModalController) {

    this.postRef = this.context.list(PostsList);

    this.currentUserInfo = this.AFAuth.auth.currentUser;
    this.currentUserid = this.currentUserInfo.userid;

    this.postsListInDb = firebase.database().ref(PostsList);

    this.userLikePostListInDb = firebase.database().ref(UsersLikePostsList);
    this.userLikePostRef = this.context.list(UsersLikePostsList);

    this.userDislikePostListInDb = firebase.database().ref(UsersDisikePostsList);
    this.userDislikePostRef = this.context.list(UsersDisikePostsList);
  }

  ionViewWillEnter() {
    this.postRef.subscribe((postsAfterChanges) => { this.postsList = postsAfterChanges });
    /**
     * this.followingPostsList = this.funcAuth.getFollowerID().then((res: any) => {
      this.funcAuth.getFollowingPosts(res).then((result: any) => {
        this.FollowerPosts = result
      }).catch((err) => {
        console.log(err)
      })

    }).catch((err) => {
      console.log(err)
    })
     */

  }

  ionViewWillLoad() {
    console.log(this.AFAuth.authState.subscribe());
  }

  goToAddPostPage() {
    this.navCtrl.push('AddPostPage');
  }

  OnPostClicked(post: Posts) {
    //if (post.PostOwner == this.AFAuth.auth.currentUser.email) {

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
    //}
  }

  removeLiker(post) {
    let index = this.postsListInDb.indexOf(post);

    if (index > -1) {
      this.postsListInDb.splice(index, 1);
    }
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


/**
   * for (let i; i < this.userLikePostListInDb.length; i++) {
      console.log('d5lt awl for loop');
    }
  
    for (let isUserLikedThisPost of this.userDislikePostListInDb) {
  
      console.log('d5lt awl loop');
      console.log(isUserLikedThisPost);
  
      if (isUserLikedThisPost.UserEmail == this.currentUserEmail) {
        this.likeBtn = true;
        console.log('likebtn is true .. user 3aml like');
      }
      else if (isUserLikedThisPost.UserEmail != this.currentUserEmail) {
        this.likeBtn = false;
        console.log('likebtn is false .. user msh 3aml like');
      }
    }
  
    for (let isUserDisLikedThisPost of this.userDislikePostRef) {
  
      console.log(isUserDisLikedThisPost);
  
      if (isUserDisLikedThisPost.UserEmail == this.currentUserEmail) {
        this.dislikeBtn = true;
        console.log('dislikebtn is true .. user 3aml dislike');
      }
      else if (isUserDisLikedThisPost.UserEmail != this.currentUserEmail) {
        this.dislikeBtn = false;
        console.log('dislikebtn is false .. user msh 3aml dislike');
      }
    }
  
    if (this.dislikeBtn == true && this.likeBtn == false) {
      console.log('user 3aml dislike w hwa das 3la like >> h3mlo pop mn dislike w h3mlo push fl like');
      delete post.DisLikers[this.currentUserEmail];
  
      this.userLikePostObj.PostId = post.$key;
      this.userLikePostObj.UserEmail = this.currentUserEmail;
  
      this.userLikePostRef.push(this.userLikePostObj)
        .then(data => {
          console.log("Post Likes Successfully");
        }).catch(err => {
          console.log("Something went wrong : " + err);
          const alert = this.alertCtrl.create({
            title: 'Something went wrong',
            message: 'couldnot like this post right now, pls try again later..' + err.message,
            buttons: ['Ok']
          });
          alert.present();
        });
  
      this.userDislikePostRef.remove(this.currentUserEmail);
  
    }
    else if (this.dislikeBtn == false && this.likeBtn == true) {
      console.log('user 3aml like w hwa das 3la like >> msh h3ml 7aga');
  
  
    }
  
  
    else if (this.dislikeBtn == false && this.likeBtn == false) {
      console.log('user msh 3aml 7aga 5als w hwa das 3la like >> h3mlo push f like');
  
      this.userLikePostObj.PostId = post.$key;
      this.userLikePostObj.UserEmail = this.currentUserEmail;
  
      this.userLikePostRef.push(this.userLikePostObj)
        .then(data => {
          console.log("Post Likes Successfully");
        }).catch(err => {
          console.log("Something went wrong : " + err);
          const alert = this.alertCtrl.create({
            title: 'Something went wrong',
            message: 'couldnot like this post right now, pls try again later..' + err.message,
            buttons: ['Ok']
          });
          alert.present();
        });
    }
 
    else if (this.dislikeBtn == true && this.likeBtn == true) {
      console.log('like true w dislike true w da kda 5ra');
    }
  
    this.likeBtn;
    this.dislikeBtn;
   */



  /**
   * firebase.database().ref(UsersLikePostsList).on("value", (snapshot) => {
    snapshot.forEach((snap) => {
      if(snap)
      likersObj.push({
        Key: snap.key,
        Name: snap.val().Name,
        Description: snap.val().Description,
        Points: snap.val().Points
      });
      return false;
    });
  });
  return charites;
   */

/**
 * 
 * @param post var promi = new Promise((resolve, reject) => {
    firebase.database().ref(UsersLikePostsList).once('value', snap => {
      var userEmail = window.localStorage.getItem('UserEmail');

      
    })
  })
 */

/**
 * 
 * @param post console.log('length ' + this.userLikePostRef.length);

  
 */


/**
 * 
 * @param post this.userLikePostObj.PostId = post.$key;
    this.userLikePostObj.UserEmail = this.currentUserEmail;
 
    this.userLikePostRef.push(this.userLikePostObj)
      .then(data => {
        console.log("Post Likes Successfully");
      }).catch(err => {
        console.log("Something went wrong : " + err);
        const alert = this.alertCtrl.create({
          title: 'Something went wrong',
          message: 'couldnot like this post right now, pls try again later..' + err.message,
          buttons: ['Ok']
        });
        alert.present();
      });
 */

/*
DislikeClicked(post: Posts) {
  console.log('start dislike');
  for (let i = 0; i < post.DisLikers.length; i++) {
    if (post.DisLikers[i] == this.currentUserEmail) {
      this.dislikeBtn = true;
      console.log('dislikebtn is true .. user 3aml dislike')
    }
    else if (post.DisLikers[i] != this.currentUserEmail) {
      this.dislikeBtn = false;
      console.log('dislikebtn is false .. user msh 3aml dislike')
    }
  }
  for (let j = 0; j < post.Likers.length; j++) {
    if (post.Likers[j] == this.currentUserEmail) {
      this.likeBtn = true;
      console.log('likebtn is true .. user 3aml like');
    }
    else if (post.Likers[j] != this.currentUserEmail) {
      this.likeBtn = false;
      console.log('likebtn is false .. user msh 3aml like');
    }
  }

  if (this.dislikeBtn == true && this.likeBtn == false) {
    console.log('user 3aml dislike w hwa das 3la dislike f msh h3ml 7aga');
  }
  else if (this.dislikeBtn == false && this.likeBtn == true) {
    post.DisLikers.push(this.currentUserEmail);
    console.log('user 3aml like w hwa das 3la dislike yb2a hshel l like w a3ml push fl dislike');
  }
  else if (this.dislikeBtn == false && this.likeBtn == false) {
    post.DisLikers.push(this.currentUserEmail);
    console.log('user msh 3aml 7aga 5als w hwa das 3la dislike f h3mlo push f dislike');
  }
  else if (this.dislikeBtn == true && this.likeBtn == true) {
    console.log('like true w dislike true w da kda 5ra');
  }

  this.likeBtn;
  this.dislikeBtn;
}



*/




