import {Injectable} from '@angular/core';
import {PathConfig} from '../config/path-config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private baseUrl = PathConfig.API_ENDPOINT + 'api/jobs';

  constructor(private http: HttpClient) { }

  fetchAllJobs() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  createJobDetails(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/create`, data);
  }

  fetchJobById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/detail/${id}`);
  }
}
