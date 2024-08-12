import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplesComponent } from './apples.component';

describe('ApplesComponent', () => {
  let component: ApplesComponent;
  let fixture: ComponentFixture<ApplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
