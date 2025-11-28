import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  username: string = 'Guest';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    await this.loadCurrentUser();
  }

  async loadCurrentUser() {
    try {
      const currentUser = await this.storageService.get('currentUser');
      
      if (currentUser && currentUser.loggedIn) {
        this.username = currentUser.username;
      } else {
        this.username = 'Guest';
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.username = 'Guest';
    }
  }

  goToPage(pageName: string) {
    this.router.navigate([pageName]);
  }
}