import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignInResponse } from '../models/sign-in-response';

@Injectable({
  providedIn: 'root',
  
})
export class CommonService {
  
  constructor(private http: HttpClient) { }
 
httpGet<T>(url: string): Observable<T> {
  const accesstoken = JSON.parse(sessionStorage.getItem('userResponse') as string).token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization' : `Bearer ${accesstoken}`
  });
  return this.http.get<T>(url, { headers });
}

httpPost(url:string, payload : any) : Observable<any>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  return this.http.post(url,payload,{headers})
}
httpPostWithAuth(url:string, payload : any) : Observable<any>{
  const encryptedUserResponse = sessionStorage.getItem('userResponse');
    let userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
   const accessToken = userDetails.token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization' : `Bearer ${accessToken}`
  });
  return this.http.post(url,payload,{headers})
}

httpDelete<T>(url:string) : Observable<T>{
  const encryptedUserResponse = sessionStorage.getItem('userResponse');
    let userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
   const accessToken = userDetails.token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
     'Authorization' : `Bearer ${accessToken}`
  });
  return this.http.delete<T>(url, { headers });
} 
}
