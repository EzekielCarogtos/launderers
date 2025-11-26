import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgFor, FormsModule, DatePipe]
})
export class CheckoutPage {

  // COMING FROM BASKET
  items: any[] = [];
  subtotal: number = 0;
  deliveryFee: number = 30;
  total: number = 0;

  pickupDate: Date = new Date();
  deliveryDate: Date = new Date();

  // MODE
  deliveryType: string = 'delivery';

  // ADDRESS
  deliveryAddress: string = '';
  showAddressModal = false;
  deliveryInstructions = '';

  leaveDoor = false;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? history.state;

    if (state) {
      this.items = state['items'] ?? [];

      this.subtotal = this.items.reduce((sum: number, i:any) => sum + i.price, 0);

      this.deliveryType = state['deliveryType'] ?? 'delivery';

      this.pickupDate = state['pickupDate'] ? new Date(state['pickupDate']) : new Date();
      this.deliveryDate = state['deliveryDate'] ? new Date(state['deliveryDate']) : new Date();

      // If PICKUP → no delivery fee
      if (this.deliveryType === 'pickup') {
        this.deliveryFee = 0;
      }

      this.total = this.subtotal + this.deliveryFee;
    }
  }
}
