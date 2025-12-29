import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {Menu} from 'primeng/menu';
import {CommonModule} from '@angular/common';
import {MessageService} from 'primeng/api';
import {SafePipe} from '../../config/safe.pipe';
import {Select} from 'primeng/select';
import {TableModule} from 'primeng/table';
import {Tooltip} from 'primeng/tooltip';
import {ActivatedRoute, Router} from '@angular/router';
import {CandidateService} from '../../services/candidate.service';
import {UtilService} from '../../services/util.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TagModule} from 'primeng/tag';
import {SplitButtonModule} from 'primeng/splitbutton';
import {JobMapperService} from '../../services/jobMapper.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-job-mapper',
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
  templateUrl: './job-mapper.component.html',
  styleUrls: ['./job-mapper.component.css'],
  providers: [CandidateService, UtilService, MessageService, JobMapperService],
})
export class JobMapperComponent implements OnInit{
  candidateList: any[] = [];
  displayResumeModal = false;
  resumeSrc: string = '';
  resumeMimeType: string = '';
  selectedWorkStatus: string = '';
  workStatus: { label: string; value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Open to Work', value: 'OPEN_TO_WORK' },
    { label: 'Working', value: 'WORKING' },
    { label: 'Not Looking', value: 'NOT_LOOKING' }
  ];
  jobId: string | null = null;
  itemsTemplate = [
    { label: 'Edit', icon: 'pi pi-refresh', command: (candidate: any) => console.log('Edit', candidate) },
    { label: 'View', icon: 'pi pi-eye', command: (candidate: any) => this.router.navigate(['candidates/view', candidate.id]) },
    { label: 'Proceed Further', icon: 'pi pi-forward', command: (candidate: any) => this.router.navigate(['candidates/proceed', candidate.id]) },
    { label: 'Quit', icon: 'pi pi-power-off', command: () => window.open('https://angular.io/', '_blank') },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: CandidateService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef,
    private jobMapperService: JobMapperService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['jobId'] || null;
      if (this.jobId) {
        this.fetchJobMapperAndCandidates(this.jobId);
      }
    });
  }

  fetchJobMapperAndCandidates(jobId: string) {
    this.jobMapperService.fetchAlljobMapperBy(jobId).subscribe({
      next: (res) => {
        const jobMapperList = res.data || [];
        if (!jobMapperList.length) {
          this.candidateList = [];
          return;
        }
        const candidateIds = jobMapperList.map(
          (jm: any) => jm.candidateId
        );
        this.fetchCandidatesByIds(candidateIds);
      },
      error: (err) =>
        this.utilService.toastr(
          err.error?.message || 'Failed to fetch job mapper data',
          true
        )
    });
  }

  fetchCandidatesByIds(candidateIds: string[]) {
    this.service.fetchCandidatesByIds(candidateIds).subscribe({
      next: (res) => {
        this.candidateList = res.data || [];

        this.candidateList.forEach(candidate => {
          candidate.items = this.itemsTemplate.map(item => ({
            ...item,
            command: () => item.command(candidate)
          }));
        });

        this.cd.detectChanges();
      },
      error: (err) =>
        this.utilService.toastr(
          err.error?.message || 'Failed to fetch candidate details',
          true
        )
    });
  }


  navigateToView(id: string) {
    this.router.navigate(['candidates/view', id]);
  }

  viewResumes(candidates: any) {
    if (!candidates?.resumeBase64) {
      this.utilService.toastr('No resume available', true);
      return;
    }

    if (candidates.resumeBase64.startsWith('data:')) {
      this.resumeSrc = candidates.resumeBase64;
      this.resumeMimeType = candidates.resumeBase64.split(';')[0].split(':')[1];
    } else {
      this.resumeSrc = `data:application/pdf;base64,${candidates.resumeBase64}`;
      this.resumeMimeType = 'application/pdf';
    }

    this.displayResumeModal = true;
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

  goBack() {
    if (this.jobId) {
      this.router.navigate(['job-details/view', this.jobId]);
    } else {
      this.location.back();
    }
  }


}
