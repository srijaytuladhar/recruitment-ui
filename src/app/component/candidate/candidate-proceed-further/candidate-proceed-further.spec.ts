import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProceedFurther } from './candidate-proceed-further';

describe('CandidateProceedFurther', () => {
  let component: CandidateProceedFurther;
  let fixture: ComponentFixture<CandidateProceedFurther>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateProceedFurther]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateProceedFurther);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
