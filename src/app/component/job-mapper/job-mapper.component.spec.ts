import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMapperComponent } from './job-mapper.component';

describe('JobMapperComponent', () => {
  let component: JobMapperComponent;
  let fixture: ComponentFixture<JobMapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobMapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
