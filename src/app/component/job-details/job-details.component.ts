import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {Menu} from 'primeng/menu';
import {MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {CommonModule, Location} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TagModule} from 'primeng/tag';
import {SplitButtonModule} from 'primeng/splitbutton';
import {DialogModule} from 'primeng/dialog';
import {UtilService} from '../../services/util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {JobService} from '../../services/job.service';
import { ClientService } from '../../services/client.service';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'app-job-details',
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
    Menu,
    ReactiveFormsModule,
    Badge
  ],
  providers: [JobService, UtilService, MessageService, ClientService],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
  jobList: any[] = [];
  clientMap = new Map<string, string>();
  clientIdFilter: string | null = null;
  isFilteredByClient = false;
  itemsTemplate = [
    // { label: 'Edit', icon: 'pi pi-refresh', command: (client: any) => console.log('Edit', client) },
    { label: 'View', icon: 'pi pi-eye', command: (client: any) => this.router.navigate(['job-details/view', client.id]) },
    // { label: 'Proceed Further', icon: 'pi pi-forward', command: (candidate: any) => this.router.navigate(['candidates/proceed', candidate.id]) },
    // { label: 'Quit', icon: 'pi pi-power-off', command: () => window.open('https://angular.io/', '_blank') },
  ];

  constructor(
    private router: Router,
    private service: JobService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.clientIdFilter = params['clientId'] || null;
      this.isFilteredByClient = !!this.clientIdFilter;
      this.fetchClients();
    });
  }

  fetchClients() {
    this.clientService.fetchAllClient().subscribe({
      next: (res) => {
        const clients = res.data || [];
        clients.forEach((client: any) => {
          this.clientMap.set(client.id, client.companyName);
        });
        this.cd.detectChanges();
        this.fetchAll();
      },
      error: () => this.utilService.toastr('Failed to load clients', true)
    });
  }

  fetchAll() {
    this.service.fetchAllJobs().subscribe({
      next: (res) => {
        let jobs = res.data || [];
        if (this.clientIdFilter) {
          jobs = jobs.filter((job: { clientId: string | null; }) => job.clientId === this.clientIdFilter);
        }

        this.jobList = jobs.map((job: { clientId: string; }) => ({
          ...job,
          clientName: this.clientMap.get(job.clientId) || 'N/A',
          items: this.itemsTemplate.map(item => ({ ...item, command: () => item.command(job) }))
        }));

        this.cd.detectChanges();
      },
      error: (err) => this.utilService.toastr(err.error?.message || 'Failed to fetch jobs', true)
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToView(id: string) {
    this.router.navigate(['job-details/view', id]);
  }

  goBack(){
    this.location.back();
  }
}
