import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReempaqueComponent } from './reempaque.component';

describe('ReempaqueComponent', () => {
  let component: ReempaqueComponent;
  let fixture: ComponentFixture<ReempaqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReempaqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReempaqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
