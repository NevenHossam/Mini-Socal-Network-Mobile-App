import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { FIREBASE_CONFIG } from './app.firebase.config';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    this.pages = [
      { title: 'Home', component: 'TabsPage', icon: 'home' },
      { title: 'Profile', component: 'ProfilePage', icon: 'person' },
      { title: 'Suggested Friends', component: 'SuggestedUsersPage', icon: 'contacts' },
      { title: 'About', component: 'AboutPage', icon: 'information-circle' },
      { title: 'Search', component: 'SearchPage', icon: 'search' },
      { title: 'Nearby Friends', component: 'NearbyPage', icon: 'person' },
      { title: 'Logout', component: 'LogoutPage', icon: 'log-out' },
    ];

  }

  initializeApp() {
    firebase.initializeApp(FIREBASE_CONFIG);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
