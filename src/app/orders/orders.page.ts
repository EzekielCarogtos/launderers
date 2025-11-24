import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class OrdersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
