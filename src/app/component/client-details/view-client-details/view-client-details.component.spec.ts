import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientDetailsComponent } from './view-client-details.component';

describe('ViewClientDetailsComponent', () => {
  let component: ViewClientDetailsComponent;
  let fixture: ComponentFixture<ViewClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClientDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
