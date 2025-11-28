import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class ProfilePage implements OnInit {
  username: string = 'Guest';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

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

  async logout() {
    try {
      // Clear the current user session
      await this.storageService.set('currentUser', {
        loggedIn: false
      });
      
      console.log('User logged out successfully');
      
      // Redirect to login page with hard navigation
      this.router.navigate(['/login'], { 
        replaceUrl: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  goToOrder() {
    this.router.navigate(['/orders']);
  }

  goBubblePass() {
    this.router.navigate(['/bubblepass']);
  }
}