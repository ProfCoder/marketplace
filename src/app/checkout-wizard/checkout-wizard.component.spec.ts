import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutWizardComponent } from './checkout-wizard.component';

describe('CheckoutWizardComponent', () => {
  let component: CheckoutWizardComponent;
  let fixture: ComponentFixture<CheckoutWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckoutWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
