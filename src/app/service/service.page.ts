import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../storage.service';

type SegmentType = 'wash' | 'dry' | 'special' | 'press';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ServicePage {
  selectedSegment: SegmentType = 'wash';
  headerImage: string = '';
  selectedCasual: string | null = null;
  selectedWeight: string | null = null;
  selectedAdditionals: string[] = [];

  // Dynamic products for each segment
  productData: Record<SegmentType, { id: string; name: string; price: number; image: string }[]> = {
    wash: [
      { id: 'c1', name: 'Everyday Wear', price: 140, image: 'assets/img/everydayW.png' },
      { id: 'c2', name: 'Casual Wear', price: 140, image: 'assets/img/casualW.png' },
      { id: 'c3', name: 'Delicates', price: 140, image: 'assets/img/delicates.png' },
      { id: 'c4', name: 'Bedsheets', price: 140, image: 'assets/img/bedsheet.png' }
    ],
    dry: [
      { id: 'c1', name: 'Everyday Wear', price: 140, image: 'assets/img/everydayW.png' },
      { id: 'c2', name: 'Casual Wear', price: 140, image: 'assets/img/casualW.png' },
      { id: 'c3', name: 'Delicates', price: 140, image: 'assets/img/delicates.png' },
      { id: 'c4', name: 'Bedsheets', price: 140, image: 'assets/img/bedsheet.png' }
    ],
    special: [
      { id: 'c1', name: 'Everyday Wear', price: 140, image: 'assets/img/everydayW.png' },
      { id: 'c2', name: 'Casual Wear', price: 140, image: 'assets/img/casualW.png' },
      { id: 'c3', name: 'Delicates', price: 140, image: 'assets/img/delicates.png' },
      { id: 'c4', name: 'Bedsheets', price: 140, image: 'assets/img/bedsheet.png' }
    ],
    press: [
      { id: 'c1', name: 'Everyday Wear', price: 140, image: 'assets/img/everydayW.png' },
      { id: 'c2', name: 'Casual Wear', price: 140, image: 'assets/img/casualW.png' },
      { id: 'c3', name: 'Delicates', price: 140, image: 'assets/img/delicates.png' },
      { id: 'c4', name: 'Bedsheets', price: 140, image: 'assets/img/bedsheet.png' }
    ]
  };

  // Custom header images for each segment
  headerImages: Record<SegmentType, string> = {
    wash: 'assets/img/washservice.png',
    dry: 'assets/img/dryService.png',
    special: 'assets/img/specialService.png',
    press: 'assets/img/pressService.png'
  };

  // Weight options
  weights = [
    { value: '≤ 8KG', priceText: 'Free' },
    { value: '› 8KG', priceText: '+₱20.00' }
  ];

  // Additional services
  additionals = [
    { value: 'fold', name: 'Fold', priceText: '+₱20.00' },
    { value: 'iron', name: 'Iron', priceText: '+₱50.00' },
    { value: 'dry', name: 'Dry', priceText: '+₱70.00' }
  ];

  products: { id: string; name: string; price: number; image: string }[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.loadProducts();
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value as SegmentType;
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.productData[this.selectedSegment] || [];
    this.headerImage = this.headerImages[this.selectedSegment]; // update header image dynamically
  }

  toggleCasual(value: string) {
    this.selectedCasual = this.selectedCasual === value ? null : value;
    this.saveToStorage();
  }

  toggleWeight(value: string) {
    this.selectedWeight = this.selectedWeight === value ? null : value;
    this.saveToStorage();
  }

  toggleAdditional(value: string) {
    if (this.selectedAdditionals.includes(value)) {
      this.selectedAdditionals = this.selectedAdditionals.filter(v => v !== value);
    } else if (this.selectedAdditionals.length < 3) {
      this.selectedAdditionals.push(value);
    }
    this.saveToStorage();
  }

  saveToStorage() {
    const data = {
      segment: this.selectedSegment,
      casual: this.selectedCasual,
      weight: this.selectedWeight,
      additionals: this.selectedAdditionals
    };
    this.storage.set('serviceSelection', data);
  }
}
