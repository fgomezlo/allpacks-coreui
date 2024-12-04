import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConsolidacionTrackingComponent } from './print-consolidacion-tracking.component';

describe('PrintConsolidacionTrackingComponent', () => {
  let component: PrintConsolidacionTrackingComponent;
  let fixture: ComponentFixture<PrintConsolidacionTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintConsolidacionTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintConsolidacionTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
