import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestedUsersPage } from './suggested-users';

@NgModule({
  declarations: [
    SuggestedUsersPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestedUsersPage),
  ],
})
export class SuggestedUsersPageModule {}
