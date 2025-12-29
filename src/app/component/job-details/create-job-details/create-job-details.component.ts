import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {UtilService} from '../../../services/util.service';
import {MessageService} from 'primeng/api';
import {JobService} from '../../../services/job.service';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {FileUploadModule} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';
import {Router} from '@angular/router';
import {ClientService} from '../../../services/client.service';
import {Select} from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-create-job-details',
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
    Select,
    Textarea,
    FloatLabelModule
  ],
  templateUrl: './create-job-details.component.html',
  styleUrls: ['./create-job-details.component.css'],
  providers: [JobService, UtilService, MessageService, ClientService],
})
export class CreateJobDetailsComponent implements OnInit {
  jobForm!: FormGroup;
  clientOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private util: UtilService,
    private service: JobService,
    private clientService: ClientService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      clientId: ['', Validators.required],
    });

    this.fetchClient();
  }

  fetchClient() {
    this.clientService.fetchAllClient().subscribe({
      next: (res) => {
        const clients = res.data || [];

        this.clientOptions = clients.map((client: any) => ({
          label: client.companyName,
          value: client.id
        }));

        this.cd.detectChanges();
      },
      error: () => this.util.toastr('Failed to load client list', true)
    });
  }

  saveJobDetails(){
    if (this.jobForm.invalid) {
      this.util.toastr('Please fill all required fields', true);
      this.jobForm.markAllAsTouched();
      return;
    }

    this.service.createJobDetails(this.jobForm.value).subscribe({
      next: (res: any) => {
        this.ngZone.run(() => {
          if (!res.success) {
            this.util.toastr(res.message || 'Failed to create job', true);
          } else {
            this.util.toastr(res.message || 'job created successfully', false, 3000);
            this.jobForm.reset();
            setTimeout(() => this.goBack(), 2000);
          }
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.util.toastr(err.error?.message || 'Failed to create job', true);
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/job-details']);
  }
}
