import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NowShowingComponent } from './now-showing.component';

describe('NowShowingComponent', () => {
  let component: NowShowingComponent;
  let fixture: ComponentFixture<NowShowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowShowingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NowShowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
