import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async get(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async pushToArray(key: string, item: any) {
    const existing = await this.get(key) || [];
    existing.push(item);
    await this.set(key, existing);
  }

  // ================================
  // NEW: Required for BasketPage
  // ================================

  async getBasket() {
    return await this.get('basket') || [];
  }

  async updateBasket(updatedItems: any[]) {
    await this.set('basket', updatedItems);
  }

  async addToBasket(item: any) {
    const basket = await this.getBasket();

    // check if exists
    const existing = basket.find((i: any) => i.id === item.id);

    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      basket.push({
        ...item,
        quantity: item.quantity || 1,
        selected: true
      });
    }

    await this.updateBasket(basket);
  }

  async removeFromBasket(id: any) {
    const basket = await this.getBasket();
    const updated = basket.filter((i: any) => i.id !== id);
    await this.updateBasket(updated);
  }

  async clearBasket() {
    await this.set('basket', []);
  }
}
