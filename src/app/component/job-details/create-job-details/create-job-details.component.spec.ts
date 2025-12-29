import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobDetailsComponent } from './create-job-details.component';

describe('CreateJobDetailsComponent', () => {
  let component: CreateJobDetailsComponent;
  let fixture: ComponentFixture<CreateJobDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateJobDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
