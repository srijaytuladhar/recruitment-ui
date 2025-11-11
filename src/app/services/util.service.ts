import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private _http: HttpClient,
    private messageService: MessageService
  ) {}

  toastr(message: string, isError: boolean = false, life: number = 3000) {
    this.messageService.add({
      severity: isError ? 'error' : 'success',
      summary: isError ? 'Error' : 'Success',
      detail: message,
      life: life
    });
  }

}
