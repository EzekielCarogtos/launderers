import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BubblepassPage } from './bubblepass.page';

describe('BubblepassPage', () => {
  let component: BubblepassPage;
  let fixture: ComponentFixture<BubblepassPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BubblepassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
