import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {Menu} from "primeng/menu";
import {CommonModule} from "@angular/common";
import {MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {TagModule} from 'primeng/tag';
import {SplitButtonModule} from 'primeng/splitbutton';
import {UtilService} from '../../services/util.service';
import {Router} from '@angular/router';
import {ClientService} from '../../services/client.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
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
    ReactiveFormsModule
  ],
  providers: [ClientService, UtilService, MessageService],
})
export class ClientDetailsComponent implements OnInit {
  clientList: any[] = [];
  itemsTemplate = [
    { label: 'Edit', icon: 'pi pi-refresh', command: (client: any) => console.log('Edit', client) },
    { label: 'View', icon: 'pi pi-eye', command: (client: any) => this.router.navigate(['client/view', client.id]) },
    // { label: 'Proceed Further', icon: 'pi pi-forward', command: (candidate: any) => this.router.navigate(['candidates/proceed', candidate.id]) },
    { label: 'Quit', icon: 'pi pi-power-off', command: () => window.open('https://angular.io/', '_blank') },
  ];

  constructor(
    private router: Router,
    private service: ClientService,
    private utilService: UtilService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAll();
  }


  fetchAll() {
    this.service.fetchAllClient().subscribe({
      next: (res) => {
        this.clientList = res.data || [];
        this.clientList.forEach(client => {
          client.items = this.itemsTemplate.map(item => ({ ...item, command: () => item.command(client) }));
        });
        this.cd.detectChanges();
      },
      error: (err) => this.utilService.toastr(err.error?.message || 'Failed to fetch clients', true)
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  navigateToView(id: string) {
    this.router.navigate(['client/view', id]);
  }
}
