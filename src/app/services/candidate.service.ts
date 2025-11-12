import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {PathConfig} from '../config/path-config';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private _http:HttpClient) { }

  fetchAllCandidate() {
    return this._http.get<any>(PathConfig.API_ENDPOINT + `api/candidate`);
  }

  createCandidate(data:FormData) {
    return this._http.post<any>(PathConfig.API_ENDPOINT + 'api/candidate/create',data);

  }

  fetchCandidateById(id: string) {
    return this._http.get<any>(PathConfig.API_ENDPOINT + `api/candidate/detail/${id}`, {
    });
  }

}
