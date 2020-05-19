import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  profile = 'ProfilePage';
  search = 'SearchPage';
  notifications = 'NotificationsPage';
  timeline = 'TimelinePage';

}
