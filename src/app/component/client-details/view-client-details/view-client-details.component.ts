
import { ChangeDetectorRef, Component, NgZone, OnInit, computed, signal } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SafePipe } from '../../../config/safe.pipe';
import { ToastModule } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { UtilService } from '../../../services/util.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { Textarea } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';

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

    Tooltip,
    DatePickerModule,
    CheckboxModule,
    Textarea,
    FileUploadModule,
    ConfirmDialogModule
  ],
  providers: [ClientService, UtilService, MessageService, ConfirmationService],
  templateUrl: './view-client-details.component.html',
  styleUrls: ['./view-client-details.component.css']
})
export class ViewClientDetailsComponent implements OnInit {
  client: any = null;

  displayResumeModal = false;
  resumeSrc: string = '';
  resumeMimeType: string = '';
  showInformation = true;

  editingField: string | null = null;
  tempValue: any = null;

  displayContractModal = false;
  contractSrc: string = '';
  contractMimeType: string = '';
  contracts: any[] = [];
  editingContractIndex: number | null = null;

  showExpiryWarning = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService,
    private service: ClientService,
    private confirmationService: ConfirmationService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) { }

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

          if (this.client.contractList && Array.isArray(this.client.contractList) && this.client.contractList.length > 0) {
            this.contracts = this.client.contractList;
          } else {
            // Check if legacy fields have data
            if (this.client.contractPrice || this.client.contractExpiryDate) {
              // Map legacy fields to first contract
              this.contracts = [{
                contractPrice: this.client.contractPrice,
                contractExpiryDate: this.client.contractExpiryDate,
                isClosedEnded: this.client.isClosedEnded,
                contractExpiredMessage: this.client.contractExpiredMessage,
                contractBase64: this.client.contractBase64,
                name: 'Contract Document'
              }];
            } else {
              // No contracts at all, open add form
              this.contracts = [];
              this.addContract();
            }
          }

          this.checkContractExpiry();
          this.setupLogoPreview();
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

  setupLogoPreview() {
    if (this.client?.companyLogoBase64) {
      if (this.client.companyLogoBase64.startsWith('data:')) {
        this.resumeSrc = this.client.companyLogoBase64;
        this.resumeMimeType = this.client.companyLogoBase64.split(';')[0].split(':')[1];
      } else {
        this.resumeSrc = `data:application/pdf;base64,${this.client.companyLogoBase64}`;
        this.resumeMimeType = 'application/pdf';
      }
    }
  }

  warningMessage: string = '';

  checkContractExpiry() {
    for (const contract of this.contracts) {
      contract.expiryWarning = null; // Reset
      if (contract.contractExpiryDate && contract.isClosedEnded) {
        const expiryDate = new Date(contract.contractExpiryDate);
        const today = new Date();
        expiryDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const timeDiff = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays >= 0 && diffDays <= 30) {
          if (diffDays === 30) {
            contract.expiryWarning = '1 month';
          } else {
            contract.expiryWarning = `${diffDays} days`;
          }
        }
      }
    }
  }

  enableEdit(field: string) {
    this.editingField = field;
    this.tempValue = this.client[field];
    if (field === 'contractExpiryDate' && this.tempValue) {
      this.tempValue = new Date(this.tempValue);
    }
  }

  onClosedEndedChange() {
    if (!this.client.isClosedEnded) {
      this.service.updateClient(this.client).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.util.toastr('Updated successfully');
          } else {
            this.client.isClosedEnded = true;
            this.util.toastr(res.message || 'Update failed', true);
          }
        },
        error: (err) => {
          this.client.isClosedEnded = true;
          this.util.toastr('Update failed', true);
        }
      });
    }
  }

  saveEdit(field: string) {
    if (this.editingField !== field) return;

    const id = this.client.id;
    const updatePayload: any = { ...this.client };
    updatePayload[field] = this.tempValue;

    const previousValue = this.client[field];
    this.client[field] = this.tempValue;
    this.editingField = null;

    this.service.updateClient(updatePayload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.util.toastr('Updated successfully');
          this.checkContractExpiry(); // Re-check if date changed
        } else {
          this.client[field] = previousValue; // Revert
          this.util.toastr(res.message || 'Update failed', true);
        }
      },
      error: (err) => {
        this.client[field] = previousValue; // Revert
        this.util.toastr('Update failed', true);
      }
    });
  }

  cancelEdit() {
    this.editingField = null;
    this.tempValue = null;
    this.editingContractIndex = null;
  }

  isAddingContract = false;
  newContract: any = {
    contractPrice: null,
    contractExpiryDate: null,
    isClosedEnded: false,
    contractExpiredMessage: '',
    contractBase64: null,
    name: ''
  };

  // Contract Methods
  addContract() {
    this.isAddingContract = true;
    this.newContract = {
      contractPrice: null,
      contractExpiryDate: null,
      isClosedEnded: false,
      contractExpiredMessage: '',
      contractBase64: null,
      name: ''
    };
  }

  cancelAddContract() {
    this.isAddingContract = false;
    this.newContract = null;
  }

  saveNewContract() {
    // Basic validation
    if (!this.newContract.contractPrice || !this.newContract.contractExpiryDate) {
      this.util.toastr('Please fill in price and expiry date', true);
      return;
    }
    if (this.newContract.isClosedEnded && !this.newContract.contractExpiredMessage) {
      this.util.toastr('Please fill in expired message', true);
      return;
    }

    if (!this.newContract.name) {
      this.newContract.name = "Contract Document";
    }

    if (!this.newContract.isClosedEnded) {
      this.newContract.contractExpiredMessage = null;
    }

    // Add to list and save
    this.contracts.unshift({ ...this.newContract });
    this.isAddingContract = false;
    this.newContract = null;
    this.updateClientContracts();
  }

  enableContractEdit(index: number, field: string) {
    this.editingContractIndex = index;
    this.editingField = field;
    this.tempValue = this.contracts[index][field];
    if (field === 'contractExpiryDate' && this.tempValue) {
      this.tempValue = new Date(this.tempValue);
    }
  }

  saveContractEdit(index: number, field: string) {
    this.contracts[index][field] = this.tempValue;
    this.editingContractIndex = null;
    this.editingField = null;
    this.updateClientContracts();
  }

  onContractClosedEndedChange(event: any, index: number) {
    if (!event.checked) {
      this.contracts[index].isClosedEnded = false;
      this.contracts[index].contractExpiredMessage = null;
      this.updateClientContracts();
    }
  }

  onContractUpload(event: any, index: number) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        this.contracts[index].contractBase64 = base64String;
        this.contracts[index].name = file.name;
        this.contracts[index].uploadDate = new Date();
        this.updateClientContracts();
      };
    }
  }

  onNewContractUpload(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        this.newContract.contractBase64 = base64String;
        this.newContract.name = file.name;
        this.newContract.uploadDate = new Date();
      };
    }
  }

  updateClientContracts() {
    const payload = { ...this.client };
    payload.contractList = this.contracts; // Changed key to match backend DTO

    // Update legacy fields for backward compatibility
    if (this.contracts.length > 0) {
      const first = this.contracts[0];
      payload.contractPrice = first.contractPrice;
      payload.contractExpiryDate = first.contractExpiryDate;
      payload.isClosedEnded = first.isClosedEnded;
      payload.contractExpiredMessage = first.contractExpiredMessage;
      payload.contractBase64 = first.contractBase64;
    } else {
      payload.contractPrice = null;
      payload.contractExpiryDate = null;
      payload.isClosedEnded = false;
      payload.contractExpiredMessage = null;
      payload.contractBase64 = null;
    }

    this.service.updateClient(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.util.toastr('Contract updated successfully');
          this.checkContractExpiry();
        } else {
          this.util.toastr('Update failed', true);
        }
      },
      error: (err) => this.util.toastr('Update failed', true)
    });
  }

  deleteContract(index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contract?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.contracts.splice(index, 1);
        this.updateClientContracts();
        this.util.toastr('Contract deleted successfully');
      }
    });
  }

  downloadContract(contract: any) {
    if (!contract?.contractBase64) {
      this.util.toastr('Invalid contract file', true);
      return;
    }
    this.downloadFile(contract.contractBase64, contract.name || 'contract.pdf');
  }

  viewContract(contract: any) {
    if (!contract?.contractBase64) return;
    this.displayContractModal = true;
    this.contractSrc = contract.contractBase64.startsWith('data:')
      ? contract.contractBase64
      : `data:application/pdf;base64,${contract.contractBase64}`;
  }

  downloadFile(base64Data: string, fileName: string) {
    const data = base64Data.startsWith('data:') ? base64Data.split(',')[1] : base64Data;
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  goBack() {
    this.router.navigate(['/client']);
  }

  // downloadResume() {
  //   if (!this.client?.companyLogoBase64) {
  //     this.util.toastr('No resume available', true);
  //     return;
  //   }
  //
  //   const base64Data = this.client.companyLogoBase64.startsWith('data:')
  //     ? this.client.companyLogoBase64.split(',')[1]
  //     : this.client.companyLogoBase64;
  //
  //   const byteCharacters = atob(base64Data);
  //   const byteNumbers = new Array(byteCharacters.length);
  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: this.resumeMimeType || 'application/pdf' });
  //   const link = document.createElement('a');
  //   link.href = window.URL.createObjectURL(blob);
  //   link.download = `${this.client.name}_resume.${this.resumeMimeType === 'application/pdf' ? 'pdf' : 'jpg'}`;
  //   link.click();
  //   window.URL.revokeObjectURL(link.href);
  // }
  //
  // viewResume() {
  //   if (!this.client?.companyLogoBase64) {
  //     this.util.toastr('No resume available', true);
  //     return;
  //   }
  //   this.displayResumeModal = true;
  // }

  togglePersonalInformation() {
    this.showInformation = !this.showInformation;
  }
}
