import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';

// Services
import { CandidateService } from '../../../services/candidate.service';
import { UtilService } from '../../../services/util.service';
import { MessageService } from 'primeng/api';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-create-candidate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    CheckboxModule,
    DatePicker
  ],
  templateUrl: './create-candidate.html',
  styleUrls: ['./create-candidate.css'],
  providers: [CandidateService, UtilService, MessageService],
})
export class CreateCandidate implements OnInit {

  candidateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private util: UtilService,
    private service: CandidateService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      currentAddress: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(7)]],
      jobLocationDesired: ['', Validators.required],
      jobVertical: ['', Validators.required],
      totalYearsOfExperience: ['', Validators.required],
      resumeBase64: ['', Validators.required],
      education: this.fb.array([]),
      experience: this.fb.array([])
    });
  }

  get education(): FormArray {
    return this.candidateForm.get('education') as FormArray;
  }

  addEducation() {
    const eduGroup = this.fb.group({
      college: ['', Validators.required],
      university: ['', Validators.required],
      degree: ['', Validators.required],
      major: [''],
      gpa: [''],
      completionDate: [null, Validators.required]
    });
    this.education.push(eduGroup);
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  get experience(): FormArray {
    return this.candidateForm.get('experience') as FormArray;
  }

  addExperience() {
    const expGroup = this.fb.group({
      companyName: ['', Validators.required],
      location: [''],
      role: ['', Validators.required],
      description: [''],
      startDate: [null, Validators.required],
      endDate: [null],
      current: [false]
    });

    expGroup.get('current')?.valueChanges.subscribe(currentValue => {
      if (currentValue) {
        expGroup.get('endDate')?.disable();
        expGroup.get('endDate')?.setValue(null);
      } else {
        expGroup.get('endDate')?.enable();
      }
    });

    this.experience.push(expGroup);
  }

  removeExperience(index: number) {
    this.experience.removeAt(index);
  }

  saveCandidate() {
    if (this.candidateForm.invalid) {
      this.util.toastr('Please fill all required fields', true);
      this.candidateForm.markAllAsTouched();
      return;
    }

    this.service.createCandidate(this.candidateForm.value).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          if (!res.success) {
            this.util.toastr(res.message || 'Failed to create candidate', true);
          } else {
            this.util.toastr(res.message || 'Candidate created successfully', false, 3000);
            this.candidateForm.reset();
            this.education.clear();
            this.experience.clear();
            this.addEducation();
            this.addExperience();
            setTimeout(() => this.goBack(), 3000);
          }
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.util.toastr(err.error?.message || 'Failed to create candidate', true);
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/candidates']);
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.candidateForm.patchValue({ resumeBase64: reader.result });
        this.util.toastr('File uploaded successfully!', false);
      };
      reader.onerror = (error) => {
        console.error('Error: ', error);
        this.util.toastr('Failed to upload file', true);
      };
    }
  }
}
