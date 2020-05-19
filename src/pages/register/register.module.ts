import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyASltD9hcCPVYZHg9fU_LaOO6YLxoMm2-s'
    })
  ],
})
export class RegisterPageModule { }
