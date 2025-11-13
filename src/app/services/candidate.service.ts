import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PathConfig } from '../config/path-config';

export class CandidateProcess {
  id?: string; // MongoDB ObjectId
  resumeSource?: string;
  detailEntryNotes?: string;
  interviewMode?: string;
  interviewDate?: Date;
  interviewName?: string;
  interviewFor?: string;
  interviewRemarks?: string;
  profileAssessment?: string;
  profileForwardedDate?: Date;
  followUp1Date?: Date;
  followUp2Date?: Date;
  followUp3Date?: Date;
  clientInterviewDate?: Date;
  clientInterviewRounds?: number;
  clientInterviewAssessment?: string;
  clientSelectionOfferDate?: Date;
  offerAmount?: number;
  offerStartDate?: Date;
  currentStep?: number;
  status?: 'IN_PROGRESS' | 'COMPLETED';
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  private baseUrl = PathConfig.API_ENDPOINT + 'api/candidate';

  constructor(private http: HttpClient) { }

  fetchAllCandidate() {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  createCandidate(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/create`, data);
  }

  fetchCandidateById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/detail/${id}`);
  }

  getByCandidateProcessById(candidateId: string) {
    return this.http.get<any>(`${this.baseUrl}/process/${candidateId}`);
  }

  updateCandidateProcess(id: string, process: CandidateProcess) {
    return this.http.put<any>(`${this.baseUrl}/process/${id}`, process);
  }

  createCandidateProcess(process: CandidateProcess) {
    return this.http.post<any>(`${this.baseUrl}/process`, process);
  }
}
