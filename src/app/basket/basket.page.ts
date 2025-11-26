import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgFor, FormsModule, DatePipe]
})
export class BasketPage implements OnInit {

  // ⭐ Modal controls
  showPickupModal = false;
  showDeliveryModal = false;

  // ⭐ Default values
  deliveryType = 'delivery';
  pickupDate = new Date();
  deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // today +2 days

  // ⭐ Items
  items = [
    { id: 1, name: 'Everyday Wear', note: 'Wash & dry', price: 70 }
  ];

  deliveryFee = 30;

  constructor(private router: Router) {}

  ngOnInit() {}

  // ⭐ Update dates from modal
  setPickupDate(event: any) {
    this.pickupDate = new Date(event.detail.value);
    this.showPickupModal = false;
  }

  setDeliveryDate(event: any) {
    this.deliveryDate = new Date(event.detail.value);
    this.showDeliveryModal = false;
  }

  // ⭐ Computed totals
  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  get total() {
    return this.subtotal + this.deliveryFee;
  }

  // ⭐ Go to checkout
  goToCheckout() {
    this.router.navigate(['/checkout'], {
      state: {
        items: this.items,
        total: this.total,
        deliveryType: this.deliveryType,
        pickupDate: this.pickupDate,
        deliveryDate: this.deliveryDate
      }
    });
  }
}
