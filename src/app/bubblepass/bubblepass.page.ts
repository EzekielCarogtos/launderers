import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-bubblepass',
  templateUrl: './bubblepass.page.html',
  styleUrls: ['./bubblepass.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class BubblepassPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/profile']);   // or this.router.back();
  }

  goToReviewPlan() {
    this.router.navigate(['/review-plan']);
  }

}
