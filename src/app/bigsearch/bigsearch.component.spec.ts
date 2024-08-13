import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigsearchComponent } from './bigsearch.component';

describe('BigsearchComponent', () => {
  let component: BigsearchComponent;
  let fixture: ComponentFixture<BigsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigsearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
