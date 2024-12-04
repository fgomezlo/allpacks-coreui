import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConsolidacionListComponent } from './print-consolidacion-list.component';

describe('PrintConsolidacionListComponent', () => {
  let component: PrintConsolidacionListComponent;
  let fixture: ComponentFixture<PrintConsolidacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintConsolidacionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintConsolidacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
