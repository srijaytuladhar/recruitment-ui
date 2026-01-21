import { Component, signal, computed } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CandidateService } from '../../services/candidate.service';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [CardModule, PanelModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  candidateCount = signal(0);
  clientCount = signal(0);

  totalUsers = computed(() => this.candidateCount() + this.clientCount());

  summaryCards = computed(() => [
    {
      title: 'Total Users',
      value: this.totalUsers(),
      icon: 'pi pi-users',
      color: 'bg-blue',
    },
    {
      title: 'Candidates',
      value: this.candidateCount(),
      icon: 'pi pi-wallet',
      color: 'bg-green',
    },
    {
      title: 'Clients',
      value: this.clientCount(),
      icon: 'pi pi-shopping-cart',
      color: 'bg-orange',
    }
  ]);

  constructor(
    private candidateService: CandidateService,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.candidateService.fetchAllCandidate().subscribe({
      next: (response: any) => {
        const data = response?.data || response;
        if (Array.isArray(data)) {
          this.candidateCount.set(data.length);
        }
      },
      error: (err) => console.error('Error fetching candidates:', err)
    });

    this.clientService.fetchAllClient().subscribe({
      next: (response: any) => {
        const data = response?.data || response;
        if (Array.isArray(data)) {
          this.clientCount.set(data.length);
        }
      },
      error: (err) => console.error('Error fetching clients:', err)
    });
  }
}
