import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { UtilService } from '../../../services/util.service';
import { CandidateService } from '../../../services/candidate.service';
import { MessageService } from 'primeng/api';
import { SafePipe } from '../../../config/safe.pipe';

@Component({
  selector: 'app-view-candidate',
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
    SafePipe
  ],
  providers: [CandidateService, UtilService, MessageService],
  templateUrl: './view-candidate.html',
  styleUrls: ['./view-candidate.css']
})
export class ViewCandidate implements OnInit {
  candidate: any = null;
  displayResumeModal = false;
  resumeSrc: string = '';
  resumeMimeType: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService,
    private service: CandidateService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchCandidate();
  }

  fetchCandidate() {
    const email = this.route.snapshot.paramMap.get('id');
    if (!email) return this.util.toastr('Invalid id', true);

    this.service.fetchCandidateByEmail(email).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.candidate = res.data;

          if (this.candidate?.resumeBase64) {
            if (this.candidate.resumeBase64.startsWith('data:')) {
              this.resumeSrc = this.candidate.resumeBase64;
              this.resumeMimeType = this.candidate.resumeBase64.split(';')[0].split(':')[1];
            } else {
              this.resumeSrc = `data:application/pdf;base64,${this.candidate.resumeBase64}`;
              this.resumeMimeType = 'application/pdf';
            }
          }

          this.cd.detectChanges();
        } else {
          this.util.toastr(res.message || 'Candidate not found', true);
        }
      },
      error: (err) => {
        this.util.toastr(err.error?.message || 'Failed to fetch candidate', true);
      }
    });
  }

  goBack() {
    this.router.navigate(['/candidates']);
  }

  downloadResume() {
    if (!this.candidate?.resumeBase64) {
      this.util.toastr('No resume available', true);
      return;
    }

    const base64Data = this.candidate.resumeBase64.startsWith('data:')
      ? this.candidate.resumeBase64.split(',')[1]
      : this.candidate.resumeBase64;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: this.resumeMimeType || 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${this.candidate.name}_resume.${this.resumeMimeType === 'application/pdf' ? 'pdf' : 'jpg'}`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  viewResume() {
    if (!this.candidate?.resumeBase64) {
      this.util.toastr('No resume available', true);
      return;
    }
    this.displayResumeModal = true;
  }
}
