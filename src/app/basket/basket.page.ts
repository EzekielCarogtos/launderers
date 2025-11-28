import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';

type SegmentType = 'wash' | 'dry' | 'special' | 'press';

interface LoadItem {
  id: number;
  segment: SegmentType;
  casual: string | null;
  weight: string | null;
  additionals: string[];
  qty: number;
  selected?: boolean;
  timestamp: number;
}

interface GroupedItems {
  segment: SegmentType;
  segmentName: string;
  checked: boolean;
  items: LoadItem[];
}

@Component({
  selector: 'app-basket',
  standalone: true,
  templateUrl: './basket.page.html',
  styleUrls: ['./basket.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BasketPage implements OnInit {
  basket: LoadItem[] = [];
  groups: GroupedItems[] = [];
  total = 0;
  selectAll = false;

  // Modal state
  checkoutOpen = false;
  datePickerOpen = false;
  timePickerOpen = false;
  isLoading = false; // Add loading state

  checkoutData = {
    address: '',
    payment: 'cash',
    type: 'delivery' as 'delivery' | 'pickup',
    selectedDate: '',
    selectedTime: ''
  };

  // Add this property to store the user's address
  userAddress: string = '';

  productImageMap: Record<string, string> = {
    c1: 'assets/img/everydayW.png',
    c2: 'assets/img/casualW.png',
    c3: 'assets/img/delicates.png',
    c4: 'assets/img/bedsheet.png'
  };

  segmentLabel: Record<SegmentType, string> = {
    wash: 'Wash',
    dry: 'Dry',
    special: 'Special',
    press: 'Press'
  };

  // Available dates (next 7 days)
  availableDates: string[] = [];
  
  // Available time slots
  availableTimes: string[] = [
    '8:00–8:15 AM', '8:30–8:45 AM', '9:00–9:15 AM', '9:30–9:45 AM',
    '10:00–10:15 AM', '10:30–10:45 AM', '11:00–11:15 AM', '11:30–11:45 AM',
    '12:00–12:15 PM', '12:30–12:45 PM', '1:00–1:15 PM', '1:30–1:45 PM',
    '2:00–2:15 PM', '2:30–2:45 PM', '3:00–3:15 PM', '3:30–3:45 PM',
    '4:00–4:15 PM', '4:30–4:45 PM', '5:00–5:15 PM', '5:30–5:45 PM',
    '6:00–6:15 PM', '6:30–6:45 PM', '7:00–7:15 PM', '7:30–7:45 PM'
  ];

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.loadBasket();
    await this.loadUserAddress();
    this.generateAvailableDates();
    this.setDefaultDateTime();
  }

  // Generate available dates (next 7 days)
  generateAvailableDates() {
    const today = new Date();
    this.availableDates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      this.availableDates.push(formattedDate);
    }
  }

  // Set default date and time
  setDefaultDateTime() {
    const today = new Date();
    const defaultDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Set default to today and a reasonable time (2:00 PM)
    this.checkoutData.selectedDate = defaultDate;
    this.checkoutData.selectedTime = '2:00–2:15 PM';
  }

  // Add this method to load saved address
  async loadUserAddress() {
    const savedAddress = await this.storage.get('userAddress');
    this.userAddress = savedAddress || '';
    // Pre-fill checkout data with saved address
    if (this.userAddress) {
      this.checkoutData.address = this.userAddress;
    }
  }

  async loadBasket() {
    try {
      const raw = await this.storage.get('basket');
      console.log('Loaded basket data:', raw);
      
      this.basket = Array.isArray(raw) ? raw : [];
      console.log('Processed basket:', this.basket);

      // Ensure all items have required properties
      this.basket = this.basket.map((i: LoadItem) => ({
        qty: i.qty ?? 1,
        selected: i.selected ?? true,
        additionals: i.additionals ?? [],
        casual: i.casual ?? null,
        weight: i.weight ?? null,
        id: i.id ?? Date.now() + Math.random(),
        segment: i.segment ?? 'wash',
        timestamp: i.timestamp ?? Date.now()
      }));

      this.buildGroups();
      this.updateTotal();
    } catch (error) {
      console.error('Error loading basket:', error);
      this.basket = [];
      this.buildGroups();
      this.updateTotal();
    }
  }

  buildGroups() {
    console.log('Building groups from basket:', this.basket);
    
    const map = new Map<SegmentType, GroupedItems>();
    
    // Initialize all segment types
    (['wash', 'dry', 'special', 'press'] as SegmentType[]).forEach(s => {
      map.set(s, {
        segment: s,
        segmentName: this.segmentLabel[s],
        checked: false,
        items: []
      });
    });

    // Group items by segment
    for (const item of this.basket) {
      if (item.segment && map.has(item.segment)) {
        const g = map.get(item.segment)!;
        g.items.push(item);
      }
    }

    const groups: GroupedItems[] = [];
    map.forEach((g: GroupedItems) => {
      g.checked = g.items.length > 0 && g.items.every((it: LoadItem) => it.selected);
      groups.push(g);
    });

    this.groups = groups.filter((g: GroupedItems) => g.items.length > 0);
    this.selectAll = this.groups.length > 0 && this.groups.every((g: GroupedItems) => g.checked);
    
    console.log('Final groups:', this.groups);
  }

  imageFor(item: LoadItem) {
    if (item.casual && this.productImageMap[item.casual]) {
      return this.productImageMap[item.casual];
    }

    const fallbackMap: Record<SegmentType, string> = {
      wash: 'assets/img/washservice.png',
      dry: 'assets/img/dryService.png',
      special: 'assets/img/specialService.png',
      press: 'assets/img/pressService.png'
    };

    return fallbackMap[item.segment] || 'assets/img/everydayW.png';
  }

  onGroupToggle(group: GroupedItems) {
    group.items.forEach((it: LoadItem) => (it.selected = group.checked));
    this.saveAndRefresh();
  }

  onItemToggle() {
    for (const g of this.groups) {
      g.checked = g.items.length > 0 && g.items.every((it: LoadItem) => it.selected);
    }
    this.selectAll = this.groups.length > 0 && this.groups.every((g: GroupedItems) => g.checked);
    this.saveAndRefresh(false);
  }

  increase(item: LoadItem) {
    item.qty = (item.qty || 1) + 1;
    this.saveAndRefresh();
  }

  decrease(item: LoadItem) {
    if (!item.qty) item.qty = 1;
    if (item.qty > 1) {
      item.qty--;
      this.saveAndRefresh();
    }
  }

  toggleSelectAll() {
    this.groups.forEach((g: GroupedItems) => {
      g.checked = this.selectAll;
      g.items.forEach((i: LoadItem) => (i.selected = this.selectAll));
    });
    this.saveAndRefresh();
  }

  updateTotal() {
    console.log('Updating total from groups:', this.groups);
    
    const flattenedItems = this.groups
      .map((g: GroupedItems) => g.items)
      .reduce((acc: LoadItem[], val: LoadItem[]) => acc.concat(val), []);
    
    this.total = flattenedItems
      .filter((i: LoadItem) => i.selected)
      .reduce((sum: number, it: LoadItem) => {
        const price = this.getPriceForCasual(it.casual) ?? 0;
        return sum + price * (it.qty || 1);
      }, 0);
    
    console.log('Final total:', this.total);
  }

  getPriceForCasual(casualId: string | null): number {
    if (!casualId) return 0;
    const priceMap: Record<string, number> = {
      c1: 140,
      c2: 140,
      c3: 140,
      c4: 140
    };
    return priceMap[casualId] ?? 0;
  }

  async saveAndRefresh(saveToStorage = true) {
    const flattened = this.groups
      .map((g: GroupedItems) => g.items)
      .reduce((acc: LoadItem[], val: LoadItem[]) => acc.concat(val), []);

    const others = this.basket.filter(
      (b: LoadItem) => !flattened.some((f: LoadItem) => f.id === b.id)
    );

    const newBasket = [...flattened, ...others];

    if (saveToStorage) {
      await this.storage.set('basket', newBasket);
    }

    this.basket = newBasket;
    this.buildGroups();
    this.updateTotal();
  }

  async removeItem(item: LoadItem) {
    this.basket = this.basket.filter((i: LoadItem) => i.id !== item.id);
    await this.storage.set('basket', this.basket);
    this.buildGroups();
    this.updateTotal();
  }

  // ================================
  // CHECKOUT WITH MODAL
  // ================================

  openCheckoutModal() {
    const selected = this.groups
      .map((g: GroupedItems) => g.items.filter((i: LoadItem) => i.selected))
      .reduce((acc: LoadItem[], val: LoadItem[]) => acc.concat(val), []);

    if (selected.length === 0) {
      alert('Please select at least one item.');
      return;
    }

    // Pre-fill the address if available
    if (this.userAddress) {
      this.checkoutData.address = this.userAddress;
    }

    this.checkoutOpen = true;
  }

  async confirmCheckout() {
    if (!this.checkoutData.address.trim()) {
      alert('Please enter your address.');
      return;
    }

    if (!this.checkoutData.selectedDate || !this.checkoutData.selectedTime) {
      alert('Please select a date and time for your order.');
      return;
    }

    // Show loading screen
    this.isLoading = true;

    try {
      // Simulate processing time (2 seconds)
      await this.delay(2000);

      // Save the address for future use
      this.userAddress = this.checkoutData.address.trim();
      await this.storage.set('userAddress', this.userAddress);

      const selectedItems = this.groups
        .map((g: GroupedItems) => g.items.filter((i: LoadItem) => i.selected))
        .reduce((acc: LoadItem[], val: LoadItem[]) => acc.concat(val), []);

      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Save order to storage
      await this.storage.pushToArray('orders', {
        items: selectedItems,
        total: this.getTotalWithFees(),
        ...this.checkoutData,
        orderId: orderId,
        status: 'pending',
        createdAt: Date.now()
      });

      // Remove selected items from basket
      this.basket = this.basket.filter(i => !i.selected);
      await this.storage.set('basket', this.basket);
      this.buildGroups();
      this.updateTotal();

      this.checkoutOpen = false;

      // Navigate to Orders page after successful checkout
      await this.delay(500); // Small delay to show success state
      this.goToOrders();

    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  // Helper method for delays
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCasualName(casualId: string | null) {
    const map: Record<string, string> = {
      c1: 'Everyday Wear',
      c2: 'Casual Wear',
      c3: 'Delicates',
      c4: 'Bedsheets'
    };
    return casualId ? map[casualId] ?? casualId : 'Custom';
  }

  // ================================
  // NEW METHODS FOR CHECKOUT MODAL
  // ================================

  openDatePicker() {
    this.datePickerOpen = true;
    this.timePickerOpen = false;
  }

  openTimePicker() {
    this.timePickerOpen = true;
    this.datePickerOpen = false;
  }

  closePickers() {
    this.datePickerOpen = false;
    this.timePickerOpen = false;
  }

  selectDate(date: string) {
    this.checkoutData.selectedDate = date;
    this.datePickerOpen = false;
  }

  selectTime(time: string) {
    this.checkoutData.selectedTime = time;
    this.timePickerOpen = false;
  }

  getSelectedItemsCount(): number {
    let count = 0;
    for (const group of this.groups) {
      count += group.items.filter(item => item.selected).length;
    }
    return count;
  }

  getTotalWithFees(): number {
    const deliveryFee = this.checkoutData.type === 'delivery' ? 30 : 0;
    return this.total + deliveryFee;
  }

  onAddressInput() {
    // Update the user address as they type
    this.userAddress = this.checkoutData.address;
  }

  // ================================
  // NAVIGATION METHODS
  // ================================

  goToOrders() {
    window.location.href = '/orders';
  }

  goToServices() {
    window.location.href = '/service';
  }

  // Method to handle the "Place an Order" button click
  async placeOrder() {
    if (this.basket.length === 0) {
      alert('Your basket is empty. Please add items first.');
      return;
    }

    // Check if any items are selected
    const hasSelectedItems = this.groups.some(group => 
      group.items.some(item => item.selected)
    );

    if (!hasSelectedItems) {
      alert('Please select at least one item to place an order.');
      return;
    }

    // If address is not set, open checkout modal
    if (!this.userAddress) {
      this.openCheckoutModal();
    } else {
      // If address is already set, proceed directly to checkout
      await this.confirmCheckout();
    }
  }

  // Debug method to add sample data
  addSampleData() {
    const sampleItem: LoadItem = {
      id: Date.now(),
      segment: 'wash',
      casual: 'c1',
      weight: '< 8KG',
      additionals: ['fold'],
      qty: 1,
      selected: true,
      timestamp: Date.now()
    };
    
    this.basket.push(sampleItem);
    this.saveAndRefresh();
  }
}