import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { Stepper, Step, StepItem, StepPanel } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { CandidateService } from '../../../services/candidate.service';
import { UtilService } from '../../../services/util.service';
import { Location, NgIf } from '@angular/common';
import { Badge } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';
import { Textarea } from 'primeng/textarea';

interface CandidateProcess {
  id?: string;
  preScreeningId?: string; // Add explicit field for pre-screening ID
  jobProcessId?: string;   // Add explicit field for job process ID
  candidateId?: string;
  jobId?: string;
  resumeSource?: string;
  detailEntryNotes?: string;
  interviewMode?: any;
  interviewDate?: Date;
  interviewName?: string;
  interviewFor?: string;
  interviewRemarks?: string;
  profileAssessment?: string;
  profileForwardedDate?: Date;
  followUp1Date?: Date;
  followUp2Date?: Date;
  followUp3Date?: Date;
  clientInterviewDate?: Date;
  clientInterviewRounds?: number;
  clientInterviewAssessment?: string;
  clientSelectionOfferDate?: Date;
  offerAmount?: number;
  offerStartDate?: Date;
  currentStep?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED';
  workingStatus?: string;
}

@Component({
  selector: 'app-candidate-proceed-further',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    Stepper,
    Step,
    StepItem,
    StepPanel,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    HttpClientModule,
    ToastModule,
    NgIf,
    Badge,
    Tooltip,
    Textarea
  ],
  templateUrl: './candidate-proceed-further.html',
  styleUrls: ['./candidate-proceed-further.css'],
  providers: [MessageService, CandidateService, UtilService],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateY(5px)' })),
      transition(':enter', [animate('250ms ease-out')]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ])
  ]
})
export class CandidateProceedFurtherComponent implements OnInit {
  process: CandidateProcess = {};
  currentStep: number = 1;
  candidateId?: string;
  jobId?: string;

  interviewModes = [
    { label: 'Virtual', value: 'Virtual' },
    { label: 'In Person', value: 'In Person' }
  ];

  workStatuses = [
    { label: 'Open to Work', value: 'OPEN_TO_WORK' },
    { label: 'Working', value: 'WORKING' },
    { label: 'Not Looking', value: 'NOT_LOOKING' }
  ];

  candidateName: string = '';
  flowType: 'PRE_SCREENING' | 'PROCEED_FURTHER' = 'PRE_SCREENING';
  preScreeningCompleted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: CandidateService,
    private util: UtilService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('proceed-further')) {
      this.flowType = 'PROCEED_FURTHER';
    } else {
      this.flowType = 'PRE_SCREENING';
    }

    this.candidateId = this.route.snapshot.paramMap.get('id') || undefined;
    const jobId = this.route.snapshot.paramMap.get('jobId') || undefined;

    if (this.candidateId) {
      this.service.fetchCandidateById(this.candidateId).subscribe({
        next: res => {
          if (res.data) {
            this.candidateName = res.data.name || `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim();

            if (res.data.workStatus) {
              this.process.workingStatus = res.data.workStatus;
            }
          }
        },
        error: () => console.error('Failed to fetch candidate details')
      });

      if (this.flowType === 'PROCEED_FURTHER' && jobId) {
        const preScreening$ = this.service.getPreScreening(this.candidateId);
        const jobProcess$ = this.service.getJobProcess(this.candidateId, jobId);

        import('rxjs').then(({ forkJoin }) => {
          forkJoin([preScreening$, jobProcess$]).subscribe({
            next: ([preRes, jobRes]) => {
              console.log('Pre-Screening Data:', preRes.data);
              console.log('Job Process Data:', jobRes.data);

              this.process = { ...preRes.data, ...jobRes.data };

              // Store IDs separately to avoid conflict
              this.process.preScreeningId = preRes.data?.id;
              this.process.jobProcessId = jobRes.data?.id;

              // If in PROCEED_FURTHER flow, allow job process status to override pre-screening status
              // If job process status is missing (new), default to IN_PROGRESS
              if (this.flowType === 'PROCEED_FURTHER') {
                this.process.status = jobRes.data?.status || 'IN_PROGRESS';
              }

              this.process.jobId = jobId;

              this.service.fetchCandidateById(this.candidateId!).subscribe(cRes => {
                if (cRes.data && cRes.data.workStatus) {
                  this.process.workingStatus = cRes.data.workStatus;
                }
              });

              console.log('Merged Process Data:', this.process);
              this.convertDatesToObjects();

              this.preScreeningCompleted = preRes.data?.status?.toUpperCase() === 'COMPLETED';

              // Determine starting step
              const jobStep = jobRes.data?.currentStep;
              const preStatus = preRes.data?.status?.toUpperCase();

              if (jobRes.data?.status?.toUpperCase() === 'COMPLETED') {
                this.currentStep = 0;
              } else if (preStatus === 'COMPLETED') {
                // Resume from job process ONLY if pre-screening is explicitly done
                this.currentStep = (jobStep && jobStep >= 5) ? jobStep : 5;
              } else {
                // Resume from pre-screening
                const preScreeningStep = preRes.data?.currentStep || 1;
                this.currentStep = preScreeningStep <= 4 ? preScreeningStep : 1;
              }
            },
            error: (err: any) => {
              console.error('Fetch error:', err);
              this.util.toastr('Failed to fetch candidate process', true);
            }
          });
        });

      } else {
        this.service.getPreScreening(this.candidateId).subscribe({
          next: res => {
            console.log('API Response:', res);
            this.process = res.data || {};
            // For single flow, the ID is just the ID
            // process.id is already set
            this.convertDatesToObjects();

            if (this.process.status?.toUpperCase() === 'COMPLETED') {
              this.currentStep = 0;
            } else {
              this.currentStep = (this.process.currentStep && this.process.currentStep >= 4) ? 4 : (this.process.currentStep || 1);
            }
          },
          error: (err: any) => {
            console.error('Fetch error:', err);
            this.util.toastr('Failed to fetch candidate process', true);
          }
        });
      }
    }
  }

  goBack() {
    this.location.back();
  }

  saveAndNext(activateCallback: any, nextStep: number, customStatus?: 'IN_PROGRESS' | 'COMPLETED') {
    if (!this.isStepValid(this.currentStep)) {
      this.util.toastr('Please complete all required fields.', true);
      return;
    }

    this.process.currentStep = nextStep;
    this.process.status = customStatus || 'IN_PROGRESS';
    this.process.candidateId = this.candidateId;


    if (this.flowType === 'PROCEED_FURTHER' && this.currentStep === 4 && nextStep === 5) {
      // Save Pre-Screening as COMPLETED when moving to Stage 5

      // Create a clean payload to avoid type errors and extra fields
      const preScreeningPayload: CandidateProcess = {
        candidateId: this.process.candidateId,
        resumeSource: this.process.resumeSource,
        detailEntryNotes: this.process.detailEntryNotes,
        interviewMode: this.process.interviewMode,
        interviewDate: this.process.interviewDate,
        interviewName: this.process.interviewName,
        interviewFor: this.process.interviewFor,
        interviewRemarks: this.process.interviewRemarks,
        profileAssessment: this.process.profileAssessment,
        currentStep: 4, // Ensure we stay at 4 for the pre-screening record
        status: 'COMPLETED'
      };

      // Use preScreeningId if available
      if (this.process.preScreeningId) {
        preScreeningPayload.id = this.process.preScreeningId;
      }

      this.service.savePreScreening(preScreeningPayload).subscribe({
        next: preRes => {
          this.util.toastr('Pre-Screening completed!', false);
          this.preScreeningCompleted = true;
          this.currentStep = 5;
          activateCallback(5);
        },
        error: () => this.util.toastr('Failed to save pre-screening', true)
      });
      return;
    }

    // For stages 1-3 (and 4 if not completing), we should strictly save to pre-screening
    // For stages 5+, we save to job process
    let request$;
    if (this.currentStep < 5) {
      // Saving Pre-Screening
      // Create a clean payload with ONLY pre-screening fields to avoid backend issues with extra fields like jobId
      const payload: CandidateProcess = {
        candidateId: this.process.candidateId,
        resumeSource: this.process.resumeSource,
        detailEntryNotes: this.process.detailEntryNotes,
        interviewMode: this.process.interviewMode,
        interviewDate: this.process.interviewDate,
        interviewName: this.process.interviewName,
        interviewFor: this.process.interviewFor,
        interviewRemarks: this.process.interviewRemarks,
        profileAssessment: this.process.profileAssessment,
        currentStep: nextStep, // update to next step
        status: customStatus || 'IN_PROGRESS'
      };

      // Use the correct ID if available
      if (this.process.preScreeningId) {
        payload.id = this.process.preScreeningId;
      } else if (this.process.id && this.flowType === 'PRE_SCREENING') {
        // If we are in PRE_SCREENING flow, the main ID is the pre-screening ID
        payload.id = this.process.id;
      }

      request$ = this.service.savePreScreening(payload);
    } else {
      // Saving Job Process
      // Ensure we use the Job Process ID if we have it
      const payload = { ...this.process };
      if (this.process.jobProcessId && this.flowType === 'PROCEED_FURTHER') {
        payload.id = this.process.jobProcessId;
      }
      request$ = this.service.saveJobProcess(payload);
    }

    request$.subscribe({
      next: res => {
        // If we saved pre-screening, we might only get pre-screening data back.
        // We need to be careful not to lose job process data if we are in PROCEED_FURTHER flow.
        // Merging response data into existing process is safer.
        this.process = { ...this.process, ...res.data };
        this.convertDatesToObjects();
        this.currentStep = nextStep;
        activateCallback(nextStep);

        const isCompleted = this.process.status?.toUpperCase() === 'COMPLETED';
        if (isCompleted && ((this.currentStep === 0) || (this.flowType === 'PRE_SCREENING'))) {
          // Only show completion message if we are actually finishing the flow (Step 0)
          // or if we are in PRE_SCREENING flow and just finished it.
          if (this.currentStep === 0) {
            const message = this.flowType === 'PROCEED_FURTHER'
              ? 'Candidate Process Completed!'
              : 'Candidate Pre-Screening Completed!';
            this.util.toastr(message, false);
          }
        } else {
          this.util.toastr(`Step ${this.currentStep - 1} saved successfully!`, false); // currentStep is already advanced
        }
      },
      error: () => this.util.toastr('Failed to save this step', true)
    });
  }

  finish() {
    if (!this.isStepValid(this.currentStep)) {
      this.util.toastr('Please complete required fields before finishing.', true);
      return;
    }

    this.process.status = 'COMPLETED';
    this.process.currentStep = this.currentStep;

    const request$ = this.flowType === 'PROCEED_FURTHER'
      ? this.service.saveJobProcess(this.process)
      : this.service.savePreScreening(this.process);

    request$.subscribe({
      next: () => {
        const message = this.flowType === 'PROCEED_FURTHER' ? 'Candidate Selected!' : 'Candidate process completed successfully!';
        this.util.toastr(message, false);
        this.currentStep = 0;
      },
      error: () => this.util.toastr('Failed to complete the process', true)
    });
  }

  getWorkStatusLabel(value?: string): string {
    const status = this.workStatuses.find(s => s.value === value);
    return status ? status.label : 'N/A';
  }

  isPreScreeningCompleted(): boolean {
    return this.process?.status?.toUpperCase() === 'COMPLETED' && this.flowType === 'PRE_SCREENING';
  }

  private isStepValid(step: number): boolean {
    switch (step) {
      case 1: return !!this.process.resumeSource;
      case 2: return !!this.process.detailEntryNotes;
      case 3: return !!this.process.interviewMode && !!this.process.interviewDate;
      case 4: return !!this.process.interviewName && !!this.process.interviewFor;
      case 5: return !!this.process.profileForwardedDate;
      case 6: return !!this.process.clientInterviewDate && !!this.process.clientInterviewRounds;
      case 7: return !!this.process.clientSelectionOfferDate && !!this.process.offerAmount && !!this.process.offerStartDate;
      default: return true;
    }
  }

  private convertDatesToObjects() {
    const dateFields: (keyof CandidateProcess)[] = [
      'interviewDate',
      'profileForwardedDate',
      'followUp1Date',
      'followUp2Date',
      'followUp3Date',
      'clientInterviewDate',
      'clientSelectionOfferDate',
      'offerStartDate'
    ];

    dateFields.forEach(field => {
      const value = this.process[field];
      if (value && typeof value === 'string') {
        this.process[field] = new Date(value);
      }
    });
  }
}
