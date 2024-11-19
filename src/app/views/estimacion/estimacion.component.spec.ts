import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimacionComponent } from './estimacion.component';

describe('EstimacionComponent', () => {
  let component: EstimacionComponent;
  let fixture: ComponentFixture<EstimacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
