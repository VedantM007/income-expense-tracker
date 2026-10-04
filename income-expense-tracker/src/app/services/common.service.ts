import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignInResponse } from '../models/sign-in-response';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  constructor(private http: HttpClient) {}

  private getAccessToken(): string {
    const encryptedUserResponse = sessionStorage.getItem('userResponse');

    if (!encryptedUserResponse) {
      return '';
    }

    const userDetails: SignInResponse = JSON.parse(
      atob(encryptedUserResponse)
    );

    return userDetails.data.token;
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
  }

  httpGet<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getAuthHeaders()
    });
  }

  httpGetWithoutAuth<T>(url: string): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get<T>(url, { headers });
  }

  httpPost(url: string, payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, payload, { headers });
  }

  httpPostWithAuth(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload, {
      headers: this.getAuthHeaders()
    });
  }

  httpDelete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, {
      headers: this.getAuthHeaders()
    });
  }

  httpPut(url: string, param: string, payload: any): Observable<any> {
    const urlWithParam = `${url}?_id=${param}`;

    return this.http.put(urlWithParam, payload, {
      headers: this.getAuthHeaders()
    });
  }

  httpPostWithTokenParam(
    url: string,
    token: string,
    payload: any
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const urlWithParam = `${url}?token=${token}`;

    return this.http.post(urlWithParam, payload, { headers });
  }
}