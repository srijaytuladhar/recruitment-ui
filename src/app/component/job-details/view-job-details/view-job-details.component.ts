import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Badge} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {CommonModule} from '@angular/common';
import {ToastModule} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {UtilService} from '../../../services/util.service';
import {MessageService} from 'primeng/api';
import {JobService} from '../../../services/job.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientService} from '../../../services/client.service';

@Component({
  selector: 'app-view-job-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    AccordionModule,
    Badge,
    Tooltip
  ],
  providers: [JobService, UtilService, MessageService, ClientService],
  templateUrl: './view-job-details.component.html',
  styleUrls: ['./view-job-details.component.css']
})
export class ViewJobDetailsComponent implements OnInit {
  job: any = null;
  clientMap = new Map<string, string>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService,
    private service: JobService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private clientService: ClientService,
  ) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {
    this.clientService.fetchAllClient().subscribe({
      next: (res) => {
        const clients = res.data || [];
        clients.forEach((client: any) => {
          this.clientMap.set(client.id, client.companyName);
        });
        this.cd.detectChanges();
        this.fetchJobDetails();
      },
      error: () => this.util.toastr('Failed to load clients', true)
    });
  }

  fetchJobDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return this.util.toastr('Invalid id', true);

    this.service.fetchJobById(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.job = res.data;

          this.job.clientName = this.clientMap.get(this.job.clientId) || 'N/A';

          this.cd.detectChanges();
        } else {
          this.util.toastr(res.message || 'Job not found', true);
        }
      },
      error: (err) => {
        this.util.toastr(err.error?.message || 'Failed to fetch job', true);
      }
    });
  }

  goBack() {
    this.router.navigate(['/job-details']);
  }

  goToEligibleCandidatesPage() {
    if (!this.job || !this.job.id) {
      this.util.toastr('Invalid job selected', true);
      return;
    }

    // Navigate to your new eligible candidates page
    this.router.navigate(['/eligible-candidates'], { queryParams: { jobId: this.job.id } });
  }
}
