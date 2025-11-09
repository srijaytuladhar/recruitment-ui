import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidate } from './view-candidate';

describe('ViewCandidate', () => {
  let component: ViewCandidate;
  let fixture: ComponentFixture<ViewCandidate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCandidate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCandidate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
