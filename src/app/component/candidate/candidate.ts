import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

// Services
import { CandidateService } from '../../services/candidate.service';
import { UtilService } from '../../services/util.service';
import { MessageService } from 'primeng/api';
import {Tooltip} from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SpeedDial } from 'primeng/speeddial';

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
    Tooltip,
    SplitButtonModule,
    SpeedDial
  ],
  providers: [CandidateService, UtilService, MessageService],
})
export class Candidate implements OnInit {

  candidateList: any[] = [];
  items:any[] = [];
  constructor(
    private router: Router,
    private service: CandidateService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef // inject ChangeDetectorRef
  ) {
     this.items = [
            {
                label: 'Edit',
                icon: 'pi pi-refresh',
                command: () => {
                },
            },
            {
                label: 'View',
                icon: 'pi pi-times',
                command: () => {
                },
            },

            // {
            //     separator: true,
            // },
            {
                label: 'Proceed Further',
                icon: 'pi pi-times',
                command: () => {
                },
            },
            // {
            //     separator: true,
            // },
            {
                label: 'Quit',
                icon: 'pi pi-power-off',
                command: () => {
                    window.open('https://angular.io/', '_blank');
                },
            },
        ];
  }

  ngOnInit(): void {
    this.fetchAll();
  }

  fetchAll() {
    this.service.fetchAllCandidate().subscribe({
      next: (res) => {
        this.candidateList = res.data || [];
        // Notify Angular that view should be updated
        this.cd.detectChanges();
      },
      error: (err) => {
        this.utilService.toastr(err.error?.message || 'Failed to fetch candidates', true);
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToView(email: string) {
    this.router.navigate(['candidates/view', email]);
  }

}
