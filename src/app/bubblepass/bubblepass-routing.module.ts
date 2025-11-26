import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BubblepassPage } from './bubblepass.page';

const routes: Routes = [
  {
    path: '',
    component: BubblepassPage
  }

  
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BubblepassPageRoutingModule {}
