import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BubblepassPageRoutingModule } from './bubblepass-routing.module';

import { BubblepassPage } from './bubblepass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BubblepassPageRoutingModule
  ],
  declarations: [BubblepassPage]
})
export class BubblepassPageModule {}
