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

interface CandidateProcess {
  id?: string;
  resumeSource?: string;
  detailEntryNotes?: string;
  interviewMode?: string;
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
    ToastModule
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

  interviewModes = [
    { label: 'Virtual', value: 'Virtual' },
    { label: 'In Person', value: 'In Person' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: CandidateService,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.candidateId = this.route.snapshot.paramMap.get('id') || undefined;

    if (this.candidateId) {
      this.service.getByCandidateProcessById(this.candidateId).subscribe({
        next: res => {
          this.process = res.data || {};
          this.currentStep = this.process.currentStep || 1;
        },
        error: () => this.util.toastr('Failed to fetch candidate process', true)
      });
    }

    setTimeout(() => {
      if (!this.currentStep) this.currentStep = 1;
    });
  }

  goBack() {
    this.router.navigate(['/candidates']);
  }

  saveAndNext(activateCallback: any, nextStep: number) {
    if (!this.isStepValid(this.currentStep)) {
      this.util.toastr('Please fill all required fields in this step', true);
      return;
    }

    this.process.currentStep = nextStep;
    this.process.status = 'IN_PROGRESS';

    const request$ = this.process.id
      ? this.service.updateCandidateProcess(this.process.id, this.process)
      : this.service.createCandidateProcess(this.process);

    request$.subscribe({
      next: res => {
        this.process = res.data;
        this.currentStep = nextStep;
        activateCallback(nextStep);
        this.util.toastr(`Step ${nextStep - 1} saved successfully!`, false);
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

    const request$ = this.process.id
      ? this.service.updateCandidateProcess(this.process.id, this.process)
      : this.service.createCandidateProcess(this.process);

    request$.subscribe({
      next: () => {
        this.util.toastr('Candidate process completed successfully!', false);
        this.router.navigate(['/candidates']);
      },
      error: () => this.util.toastr('Failed to complete the process', true)
    });
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
}
