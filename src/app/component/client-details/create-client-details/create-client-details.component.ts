import {Component, NgZone, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {HttpClientModule} from '@angular/common/http';
import {UtilService} from '../../../services/util.service';
import {MessageService} from 'primeng/api';
import {ClientService} from '../../../services/client.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-client-details',
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
    CheckboxModule
  ],
  templateUrl: './create-client-details.component.html',
  styleUrls: ['./create-client-details.component.css'],
  providers: [ClientService, UtilService, MessageService],
})
export class CreateClientDetailsComponent implements OnInit {
  clientForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private util: UtilService,
    private service: ClientService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void{
    this.clientForm = this.fb.group({
      companyName: ['', Validators.required],
      companyUrl: ['', Validators.required],
      companyLogoBase64: ['', Validators.required],
      ceoName: ['', Validators.required],
      email: ['', Validators.required],
      contactNumber: ['', Validators.required],
      hiringContactPerson: ['', Validators.required],
      billingContactPerson: ['', Validators.required],
    });
  }

  saveClientDetails(){
    if (this.clientForm.invalid) {
      this.util.toastr('Please fill all required fields', true);
      this.clientForm.markAllAsTouched();
      return;
    }

    this.service.createClientDetails(this.clientForm.value).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          if (!res.success) {
            this.util.toastr(res.message || 'Failed to create client', true);
          } else {
            this.util.toastr(res.message || 'Client created successfully', false, 3000);
            this.clientForm.reset();
            setTimeout(() => this.goBack(), 2000);
          }
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.util.toastr(err.error?.message || 'Failed to create client', true);
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/client']);
  }

  onUpload(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.clientForm.patchValue({ companyLogoBase64: reader.result });
        this.util.toastr('File uploaded successfully!', false);
      };
      reader.onerror = (error) => {
        console.error('Error: ', error);
        this.util.toastr('Failed to upload file', true);
      };
    }
  }
}
