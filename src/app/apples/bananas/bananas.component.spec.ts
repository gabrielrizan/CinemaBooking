import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BananasComponent } from './bananas.component';

describe('BananasComponent', () => {
  let component: BananasComponent;
  let fixture: ComponentFixture<BananasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BananasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BananasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
