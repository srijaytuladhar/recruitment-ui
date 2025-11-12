import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from '../../config/safe.pipe'; // Needed for iframe | safe

// Services
import { CandidateService } from '../../services/candidate.service';
import { UtilService } from '../../services/util.service';
import { MessageService } from 'primeng/api';
import {Tooltip} from 'primeng/tooltip';

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
    Tooltip
  ],
  providers: [CandidateService, UtilService, MessageService],
})
export class Candidate implements OnInit {

  candidateList: any[] = [];
  displayResumeModal = false;
  resumeSrc: string = '';
  resumeMimeType: string = '';

  itemsTemplate = [
    { label: 'Edit', icon: 'pi pi-refresh', command: (candidate: any) => console.log('Edit', candidate) },
    { label: 'View', icon: 'pi pi-eye', command: (candidate: any) => this.router.navigate(['candidates/view', candidate.id]) },
    { label: 'Proceed Further', icon: 'pi pi-forward', command: (candidate: any) => this.router.navigate(['candidates/proceed', candidate.id]) },
    { label: 'Quit', icon: 'pi pi-power-off', command: () => window.open('https://angular.io/', '_blank') },
  ];

  constructor(
    private router: Router,
    private service: CandidateService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAll();
  }

  fetchAll() {
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
}
