import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowregisterPage } from './followregister';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    FollowregisterPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowregisterPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyASltD9hcCPVYZHg9fU_LaOO6YLxoMm2-s'
    })
  ],
})
export class FollowregisterPageModule { }
