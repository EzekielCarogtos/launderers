import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get an item', () => {
    service.set('testKey', { foo: 'bar' });
    const value = service.get('testKey');
    expect(value).toEqual({ foo: 'bar' });
  });

  it('should remove an item', () => {
    service.set('testKey', 'value');
    service.remove('testKey');
    const value = service.get('testKey');
    expect(value).toBeNull();
  });
});
