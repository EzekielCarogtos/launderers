import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../storage.service';

type SegmentType = 'wash' | 'dry' | 'special' | 'press';

interface LoadItem {
  id: number;
  segment: SegmentType;
  casual: string | null;
  weight: string | null;
  additionals: string[];
  qty: number;
  selected?: boolean; // for checkout
  timestamp: number;
}

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
  quantity = 0;

  products: { id: string; name: string; price: number; image: string }[] = [];

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
      { id: 'c1', name: 'Everyday Wear', price: 80, image: 'assets/img/everydayW.png' },
      { id: 'c2', name: 'Casual Wear', price: 80, image: 'assets/img/casualW.png' },
      { id: 'c3', name: 'Delicates', price: 100, image: 'assets/img/delicates.png' },
      { id: 'c4', name: 'Bedsheets', price: 120, image: 'assets/img/bedsheet.png' }
    ]
  };

  headerImages: Record<SegmentType, string> = {
    wash: 'assets/img/washservice.png',
    dry: 'assets/img/dryService.png',
    special: 'assets/img/specialService.png',
    press: 'assets/img/pressService.png'
  };

  weights = [
    { value: '8KG or less', priceText: 'Free' },
    { value: 'Over 8KG', priceText: '₱20.00' }
  ];

  additionals = [
    { value: 'fold', name: 'Fold', priceText: '₱20.00' },
    { value: 'iron', name: 'Iron', priceText: '₱50.00' },
    { value: 'dry', name: 'Dry', priceText: '₱70.00' }
  ];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    this.loadProducts();
  }

  segmentChanged(ev: any) {
    this.selectedSegment = ev.detail.value as SegmentType;
    this.loadProducts();
    this.resetSelections();
  }

  loadProducts() {
    this.products = this.productData[this.selectedSegment] || [];
    this.headerImage = this.headerImages[this.selectedSegment];
  }

  toggleCasual(value: string) {
    this.selectedCasual = this.selectedCasual === value ? null : value;
    this.updateQuantity();
  }

  toggleWeight(value: string) {
    this.selectedWeight = this.selectedWeight === value ? null : value;
    this.updateQuantity();
  }

  toggleAdditional(value: string) {
    if (this.selectedAdditionals.includes(value)) {
      this.selectedAdditionals = this.selectedAdditionals.filter(v => v !== value);
    } else if (this.selectedAdditionals.length < 3) {
      this.selectedAdditionals.push(value);
    }
    this.updateQuantity();
  }

  updateQuantity() {
    if (this.selectedSegment === 'press') {
      // For press service, only casual selection is required
      this.quantity = this.selectedCasual ? 1 : 0;
    } else {
      // For other services, both casual and weight are required
      const requiredFilled = this.selectedCasual && this.selectedWeight;
      this.quantity = requiredFilled ? 1 : 0;
    }
  }

  resetSelections() {
    this.selectedCasual = null;
    this.selectedWeight = null;
    this.selectedAdditionals = [];
    this.quantity = 0;
  }

  // Check if plus button should be enabled
  canIncreaseQuantity(): boolean {
    if (this.selectedSegment === 'press') {
      // For press service, only casual selection is required
      return this.selectedCasual !== null;
    } else {
      // For other services, both casual and weight are required
      return this.selectedCasual !== null && this.selectedWeight !== null;
    }
  }

  // Updated increase method with validation
  increaseQuantity() {
    if (this.canIncreaseQuantity()) {
      this.quantity++;
    }
  }

  // Updated decrease method
  decreaseQuantity() {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  // Check if weight section should be shown
  showWeightSection(): boolean {
    return this.selectedSegment !== 'press';
  }

  // Check if additional services section should be shown
  showAdditionalServices(): boolean {
    return this.selectedSegment !== 'press';
  }

  // Get section title based on selected segment
  getSectionTitle(): string {
    switch (this.selectedSegment) {
      case 'wash':
        return '';
      case 'dry':
        return '';
      case 'special':
        return '';
      case 'press':
        return '';
      default:
        return '';
    }
  }

  // Get unit text based on selected segment
  getUnitText(): string {
    switch (this.selectedSegment) {
      case 'press':
        return 'per item';
      default:
        return 'per load';
    }
  }

  // Get button text based on selected segment
  getButtonText(): string {
    switch (this.selectedSegment) {
      case 'press':
        return 'Add Item';
      default:
        return 'Add Load';
    }
  }

  async addLoadToBasket() {
    if (this.quantity < 1) return;

    const load: LoadItem = {
      id: Date.now(),
      segment: this.selectedSegment,
      casual: this.selectedCasual,
      weight: this.selectedSegment === 'press' ? null : this.selectedWeight,
      additionals: this.selectedSegment === 'press' ? [] : this.selectedAdditionals,
      qty: this.quantity,
      selected: true,
      timestamp: Date.now()
    };

    await this.storage.pushToArray('basket', load);
    alert('Service added to basket!');
    this.resetSelections();
  }
}