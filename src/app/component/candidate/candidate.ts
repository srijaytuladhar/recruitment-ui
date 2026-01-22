import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from '../../config/safe.pipe';

import { CandidateService } from '../../services/candidate.service';
import { UtilService } from '../../services/util.service';
import { MessageService } from 'primeng/api';
import { Tooltip } from 'primeng/tooltip';
import { Menu } from "primeng/menu";
import { Select } from 'primeng/select';
import { JobMapperService } from '../../services/jobMapper.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.html',
  styleUrls: ['./candidate.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    ButtonModule,
    TagModule,
    SplitButtonModule,
    DialogModule,
    SafePipe,
    Tooltip,
    Menu,
    Select,
    ReactiveFormsModule
  ],
  providers: [CandidateService, UtilService, MessageService, JobMapperService],
})
export class Candidate implements OnInit {

  candidateList: any[] = [];
  displayResumeModal = false;
  resumeSrc: string = '';
  resumeMimeType: string = '';
  selectedCandidates: any[] = [];
  selectedWorkStatus: string = '';
  workStatus: { label: string; value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Open to Work', value: 'OPEN_TO_WORK' },
    { label: 'Working', value: 'WORKING' },
    { label: 'Not Looking', value: 'NOT_LOOKING' }
  ];

  itemsTemplate = [
    { label: 'Edit', icon: 'pi pi-refresh', command: (candidate: any) => console.log('Edit', candidate) },
    { label: 'View', icon: 'pi pi-eye', command: (candidate: any) => this.router.navigate(['candidates/view', candidate.id]) },
    { label: 'Pre-Screening', icon: 'pi pi-briefcase', command: (candidate: any) => this.navigateToPreScreening(candidate.id) },

    { label: 'Quit', icon: 'pi pi-power-off', command: () => window.open('https://angular.io/', '_blank') },
  ];

  jobRequestId: string | null = null;
  isJobContext = false;

  constructor(
    private router: Router,
    private service: CandidateService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private jobMapperService: JobMapperService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jobRequestId = params['jobRequest'] || null;
      this.isJobContext = !!this.jobRequestId;
      this.fetchCandidates();
    });
  }


  fetchCandidates() {
    this.service.fetchAllCandidate().subscribe({
      next: (res) => {
        this.candidateList = res.data || [];
        this.candidateList.forEach(candidate => {
          candidate.items = this.itemsTemplate.map(item => ({ ...item, command: () => item.command(candidate) }));
        });
        this.cd.detectChanges();
      },
      error: (err) => this.utilService.toastr(err.error?.message || 'Failed to fetch candidates', true)
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToView(id: string) {
    this.router.navigate(['candidates/view', id]);
  }

  viewResume(candidate: any) {
    if (!candidate?.resumeBase64) {
      this.utilService.toastr('No resume available', true);
      return;
    }

    if (candidate.resumeBase64.startsWith('data:')) {
      this.resumeSrc = candidate.resumeBase64;
      this.resumeMimeType = candidate.resumeBase64.split(';')[0].split(':')[1];
    } else {
      this.resumeSrc = `data:application/pdf;base64,${candidate.resumeBase64}`;
      this.resumeMimeType = 'application/pdf';
    }

    this.displayResumeModal = true;
  }

  navigateToPreScreening(id: string) {
    this.router.navigate(['workflow/pre-screening', id]);
  }

  getWorkStatusClass(status: string): string {
    switch (status) {
      case 'OPEN_TO_WORK':
        return 'badge-open';
      case 'WORKING':
        return 'badge-working';
      case 'NOT_LOOKING':
        return 'badge-not-looking';
      default:
        return 'badge-default';
    }
  }

  getWorkStatusLabel(value: string): string {
    const map: Record<string, string> = {
      OPEN_TO_WORK: 'Open to Work',
      WORKING: 'Working',
      NOT_LOOKING: 'Not Looking'
    };
    return map[value] || 'N/A';
  }

  mapCandidate(candidate: any) {
    if (!this.jobRequestId) return;

    const payload = {
      jobId: this.jobRequestId,
      candidateId: candidate.id
    };

    this.jobMapperService.mapCandidateToJob(payload).subscribe({
      next: () => {
        this.utilService.toastr('Candidate mapped successfully', false);

        this.router.navigate(
          ['/job-mapper'],
          { queryParams: { jobId: this.jobRequestId } }
        );
      },
      error: err =>
        this.utilService.toastr(
          err.error?.message || 'Failed to map candidate',
          true
        )
    });
  }

  goBack() {
    this.location.back();
  }

  mapSelectedCandidates() {
    if (!this.jobRequestId || !this.selectedCandidates.length) return;

    const candidateIds = this.selectedCandidates.map(c => c.id);

    const payload = {
      jobId: this.jobRequestId,
      candidateIds: candidateIds
    };

    this.jobMapperService.mapCandidateToJob(payload).subscribe({
      next: () => {
        this.utilService.toastr('Candidate mapped successfully', false);
        this.router.navigate(
          ['/job-mapper'],
          { queryParams: { jobId: this.jobRequestId } }
        );
      },
      error: err =>
        this.utilService.toastr(
          err.error?.message || 'Failed to map candidates',
          true
        )
    });
  }
}
