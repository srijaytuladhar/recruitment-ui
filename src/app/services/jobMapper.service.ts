import {Injectable} from '@angular/core';
import {PathConfig} from '../config/path-config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobMapperService {

  private baseUrl = PathConfig.API_ENDPOINT + 'api/job-mapper';

  constructor(private http: HttpClient) { }

  fetchAlljobMapperBy(id: string) {
    return this.http.get<any>(`${this.baseUrl}/detail/${id}`);
  }

  mapCandidateToJob(payload: any) {
    return this.http.post<any>(`${this.baseUrl}/create`, payload);
  }

  getTotalCountByJobId(id: string) {
    return this.http.get<any>(`${this.baseUrl}/count/${id}`);
  }
}
