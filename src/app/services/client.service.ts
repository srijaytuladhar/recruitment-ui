import { Injectable } from '@angular/core';
import { PathConfig } from '../config/path-config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = PathConfig.API_ENDPOINT + 'api/client';

  constructor(private http: HttpClient) { }

  fetchAllClient() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  createClientDetails(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/create`, data);
  }

  fetchClientById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/detail/${id}`);
  }

  updateClient(data: any) {
    return this.http.post<any>(`${this.baseUrl}/update`, data);
  }
}
