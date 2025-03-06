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
  const encryptedUserResponse = sessionStorage.getItem('userResponse');
  let userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
 const accessToken = userDetails.token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization' : `Bearer ${accessToken}`
  });
  return this.http.get<T>(url, { headers });
}

httpGetWithoutAuth<T>(url: string): Observable<T>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
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

httpPut(url:string, param : string, payload : any) : Observable<any>{
  const encryptedUserResponse = sessionStorage.getItem('userResponse');
    let userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
   const accessToken = userDetails.token
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization' : `Bearer ${accessToken}`
  });
  const urlWithParam = `${url}?_id=${param}`;
  return this.http.put(urlWithParam ,payload, {headers})
}

httpPostWithTokenParam(url:string, token : string, payload : any) : Observable<any>{
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  const urlWithParam = `${url}?token=${token}`;
  return this.http.post(urlWithParam,payload,{headers})
}

}
