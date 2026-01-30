import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsMenuComponent } from './costs-menu.component';

describe('CostsMenuComponent', () => {
  let component: CostsMenuComponent;
  let fixture: ComponentFixture<CostsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CostsMenuComponent]
    });
    fixture = TestBed.createComponent(CostsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
