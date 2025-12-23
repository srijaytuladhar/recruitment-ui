import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClientDetailsComponent } from './create-client-details.component';

describe('CreateClientDetailsComponent', () => {
  let component: CreateClientDetailsComponent;
  let fixture: ComponentFixture<CreateClientDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClientDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClientDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
