import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class ProfilePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  goToOrder() {
    this.router.navigate(['/orders']);
  }

  goBubblePass() {
    this.router.navigate(['/bubblepass']);
  }


}
