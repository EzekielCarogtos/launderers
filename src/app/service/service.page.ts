import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class ServicePage {

  selectedSegment = 'Wash';

  constructor(private router: Router) {}

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    console.log('Selected:', this.selectedSegment);
  }

  goToPage(pageName: string) {
    this.router.navigate([pageName]);
  }
}
