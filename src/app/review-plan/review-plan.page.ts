import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-plan',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './review-plan.page.html',
  styleUrls: ['./review-plan.page.scss'],
})
export class ReviewPlanPage {
  selectedPlan: string = '1m'; 
}
