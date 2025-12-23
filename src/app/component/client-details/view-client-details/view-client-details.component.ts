import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {Badge} from 'primeng/badge';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {SafePipe} from '../../../config/safe.pipe';
import {ToastModule} from 'primeng/toast';
import {Tooltip} from 'primeng/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InputTextModule} from 'primeng/inputtext';
import {AccordionModule} from 'primeng/accordion';
import {UtilService} from '../../../services/util.service';
import {MessageService} from 'primeng/api';
import {ClientService} from '../../../services/client.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-view-client-details',
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
    SafePipe,
    AccordionModule,
    Badge,
    Tooltip
  ],
  providers: [ClientService, UtilService, MessageService],
  templateUrl: './view-client-details.component.html',
  styleUrls: ['./view-client-details.component.css']
})
export class ViewClientDetailsComponent  implements OnInit {
  client: any = null;

  displayResumeModal = false;
  resumeSrc: string = '';
  resumeMimeType: string = '';
  showInformation = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService,
    private service: ClientService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchClientDetails();
  }

  fetchClientDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return this.util.toastr('Invalid id', true);

    this.service.fetchClientById(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.client = res.data;

          if (this.client?.companyLogoBase64) {
            if (this.client.companyLogoBase64.startsWith('data:')) {
              this.resumeSrc = this.client.companyLogoBase64;
              this.resumeMimeType = this.client.companyLogoBase64.split(';')[0].split(':')[1];
            } else {
              this.resumeSrc = `data:application/pdf;base64,${this.client.companyLogoBase64}`;
              this.resumeMimeType = 'application/pdf';
            }
          }
          this.cd.detectChanges();
        } else {
          this.util.toastr(res.message || 'Client not found', true);
        }
      },
      error: (err) => {
        this.util.toastr(err.error?.message || 'Failed to fetch client', true);
      }
    });
  }

  goBack() {
    this.router.navigate(['/client']);
  }

  downloadResume() {
    if (!this.client?.companyLogoBase64) {
      this.util.toastr('No resume available', true);
      return;
    }

    const base64Data = this.client.companyLogoBase64.startsWith('data:')
      ? this.client.companyLogoBase64.split(',')[1]
      : this.client.companyLogoBase64;

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: this.resumeMimeType || 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${this.client.name}_resume.${this.resumeMimeType === 'application/pdf' ? 'pdf' : 'jpg'}`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  viewResume() {
    if (!this.client?.companyLogoBase64) {
      this.util.toastr('No resume available', true);
      return;
    }
    this.displayResumeModal = true;
  }

  togglePersonalInformation() {
    this.showInformation = !this.showInformation;
  }
}
