import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressmapPage } from './addressmap';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AddressmapPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressmapPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyASltD9hcCPVYZHg9fU_LaOO6YLxoMm2-s'
    }),
  ],
})
export class AddressmapPageModule { }
