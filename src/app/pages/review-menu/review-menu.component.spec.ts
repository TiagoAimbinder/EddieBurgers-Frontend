import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMenuComponent } from './review-menu.component';

describe('ReviewMenuComponent', () => {
  let component: ReviewMenuComponent;
  let fixture: ComponentFixture<ReviewMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewMenuComponent]
    });
    fixture = TestBed.createComponent(ReviewMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
