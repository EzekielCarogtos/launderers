import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StorageService } from '../storage.service';

interface OrderItem {
  id: number;
  segment: string;
  casual: string | null;
  weight: string | null;
  additionals: string[];
  qty: number;
  selected?: boolean;
  timestamp: number;
}

interface Order {
  items: OrderItem[];
  total: number;
  address: string;
  payment: string;
  type: 'delivery' | 'pickup';
  selectedDate: string;
  selectedTime: string;
  createdAt: number;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  orderId: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedFilter: string = 'all';
  isLoading: boolean = true;

  // Modal state
  isOrderDetailsOpen: boolean = false;
  selectedOrder: Order | null = null;
  showReorderSuccess: boolean = false;

  // Filter options
  filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Status colors
  statusColors: { [key: string]: string } = {
    pending: 'warning',
    processing: 'primary',
    ready: 'success',
    completed: 'medium',
    cancelled: 'danger'
  };

  // Status labels
  statusLabels: { [key: string]: string } = {
    pending: 'Pending',
    processing: 'Processing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  // Product image mapping
  productImageMap: Record<string, string> = {
    c1: 'assets/img/everydayW.png',
    c2: 'assets/img/casualW.png',
    c3: 'assets/img/delicates.png',
    c4: 'assets/img/bedsheet.png'
  };

  // Segment labels
  segmentLabels: Record<string, string> = {
    wash: 'Wash',
    dry: 'Dry',
    special: 'Special',
    press: 'Press'
  };

  constructor(private storage: StorageService) {}

  async ngOnInit() {
    await this.loadOrders();
    this.setupAutoRefresh();
  }

  async loadOrders() {
    try {
      this.isLoading = true;
      const rawOrders = await this.storage.get('orders');
      console.log('Loaded orders:', rawOrders);
      
      if (Array.isArray(rawOrders)) {
        // Process orders and ensure they have all required properties
        this.orders = rawOrders.map((order: any, index: number) => ({
          items: order.items || [],
          total: order.total || 0,
          address: order.address || 'No address provided',
          payment: order.payment || 'cash',
          type: order.type || 'delivery',
          selectedDate: order.selectedDate || 'Not specified',
          selectedTime: order.selectedTime || 'Not specified',
          createdAt: order.createdAt || Date.now(),
          status: order.status || this.determineInitialStatus(order),
          orderId: order.orderId || `ORD-${Date.now()}-${index}`
        }));

        // Sort orders by creation date (newest first)
        this.orders.sort((a, b) => b.createdAt - a.createdAt);
        
        // Simulate order progress for demo purposes
        this.simulateOrderProgress();
      } else {
        this.orders = [];
      }
      
      this.applyFilter();
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = [];
      this.applyFilter();
    } finally {
      this.isLoading = false;
    }
  }

  // ================================
  // ORDER DETAILS MODAL METHODS
  // ================================

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.isOrderDetailsOpen = true;
  }

  closeOrderDetails() {
    this.isOrderDetailsOpen = false;
    this.selectedOrder = null;
  }

  // ================================
  // REORDER FUNCTIONALITY
  // ================================

  async reorderItems(order: Order) {
    try {
      // Get current basket
      const currentBasket = await this.storage.get('basket') || [];
      
      // Create new items with fresh IDs and timestamps
      const newItems = order.items.map(item => ({
        ...item,
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
        selected: true
      }));

      // Add new items to basket
      const updatedBasket = [...currentBasket, ...newItems];
      
      // Save to storage
      await this.storage.set('basket', updatedBasket);
      
      // Show success message
      this.showReorderSuccess = true;
      
      // Close modal if open
      if (this.isOrderDetailsOpen) {
        this.closeOrderDetails();
      }
      
      console.log('Reorder successful. Items added to basket:', newItems.length);
      
    } catch (error) {
      console.error('Error during reorder:', error);
      // You might want to show an error toast here
    }
  }

  // ================================
  // ORDER DETAILS HELPER METHODS
  // ================================

  getItemImage(item: OrderItem): string {
    if (item.casual && this.productImageMap[item.casual]) {
      return this.productImageMap[item.casual];
    }

    const fallbackMap: Record<string, string> = {
      wash: 'assets/img/washservice.png',
      dry: 'assets/img/dryService.png',
      special: 'assets/img/specialService.png',
      press: 'assets/img/pressService.png'
    };

    return fallbackMap[item.segment] || 'assets/img/everydayW.png';
  }

  getSegmentName(segment: string): string {
    return this.segmentLabels[segment] || segment;
  }

  getItemPrice(item: OrderItem): number {
    const priceMap: Record<string, number> = {
      c1: 140,
      c2: 140,
      c3: 140,
      c4: 140
    };
    return priceMap[item.casual || ''] || 0;
  }

  calculateSubtotal(order: Order): number {
    return order.items.reduce((total, item) => {
      const price = this.getItemPrice(item);
      return total + (price * (item.qty || 1));
    }, 0);
  }

  isStatusActive(order: Order, status: string): boolean {
    const statusOrder = ['pending', 'processing', 'ready', 'completed'];
    const currentIndex = statusOrder.indexOf(order.status);
    const targetIndex = statusOrder.indexOf(status);
    return currentIndex >= targetIndex;
  }

  getProcessingDate(createdAt: number): string {
    const date = new Date(createdAt + 2 * 60 * 1000); // +2 minutes
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getReadyDate(createdAt: number): string {
    const date = new Date(createdAt + 5 * 60 * 1000); // +5 minutes
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCompletedDate(createdAt: number): string {
    const date = new Date(createdAt + 10 * 60 * 1000); // +10 minutes
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ================================
  // EXISTING METHODS (keep these)
  // ================================

  determineInitialStatus(order: any): 'pending' | 'processing' {
    const orderAge = Date.now() - (order.createdAt || Date.now());
    return orderAge > 5 * 60 * 1000 ? 'processing' : 'pending';
  }

  simulateOrderProgress() {
    this.orders.forEach((order, index) => {
      const orderAge = Date.now() - order.createdAt;
      
      if (order.status === 'pending' && orderAge > 2 * 60 * 1000) {
        order.status = 'processing';
      } else if (order.status === 'processing' && orderAge > 5 * 60 * 1000) {
        order.status = 'ready';
      } else if (order.status === 'ready' && orderAge > 10 * 60 * 1000) {
        order.status = 'completed';
      }
    });

    this.saveOrders();
  }

  async saveOrders() {
    await this.storage.set('orders', this.orders);
  }

  setupAutoRefresh() {
    setInterval(() => {
      this.simulateOrderProgress();
      this.applyFilter();
    }, 30000);
  }

  applyFilter() {
    if (this.selectedFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedFilter);
    }
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

  getOrderStatus(order: Order): string {
    if (order.status === 'ready') {
      return order.type === 'delivery' ? 'Ready for Delivery' : 'Ready for Pickup';
    }
    return this.statusLabels[order.status];
  }

  getStatusColor(order: Order): string {
    return this.statusColors[order.status];
  }

  getOrderDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeRemaining(order: Order): string {
    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  getItemsCount(order: Order): number {
    return order.items.reduce((total, item) => total + (item.qty || 1), 0);
  }

  getCasualName(casualId: string | null): string {
    const map: Record<string, string> = {
      c1: 'Everyday Wear',
      c2: 'Casual Wear',
      c3: 'Delicates',
      c4: 'Bedsheets'
    };
    return casualId ? map[casualId] ?? casualId : 'Custom';
  }

  async refreshOrders(event: any) {
    await this.loadOrders();
    event.target.complete();
  }

  trackByOrderId(index: number, order: Order): string {
    return order.orderId;
  }

  getDeliveryTypeIcon(order: Order): string {
    return order.type === 'delivery' ? 'car-outline' : 'bag-handle-outline';
  }

  getDeliveryTypeText(order: Order): string {
    return order.type === 'delivery' ? 'Delivery' : 'Pickup';
  }

  canCancelOrder(order: Order): boolean {
    return order.status !== 'completed' && order.status !== 'cancelled';
  }

  async updateOrderStatus(order: Order, newStatus: Order['status']) {
    order.status = newStatus;
    await this.saveOrders();
    this.applyFilter();
  }

  async cancelOrder(order: Order) {
    order.status = 'cancelled';
    await this.saveOrders();
    this.applyFilter();
  }

  goToServices() {
    window.location.href = '/service';
  }
}