import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutCreationComponent } from './layout-creation.component';

describe('LayoutCreationComponent', () => {
  let component: LayoutCreationComponent;
  let fixture: ComponentFixture<LayoutCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
