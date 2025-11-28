import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.page.html',
  styleUrls: ['./getting-started.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class GettingStartedPage {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  getStarted() {
    this.router.navigate(['/signup']);
  }

  async skip() {
    // Set guest session
    await this.storageService.set('currentUser', {
      loggedIn: false,
      isGuest: true
    });
    this.router.navigate(['/home']);
  }
}