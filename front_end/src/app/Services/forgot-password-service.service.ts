import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private baseUrl = 'http://localhost:8034/forgotPassword' ;

  constructor(private http: HttpClient) { }

  sendVerificationEmail(email: string):Observable<string>{
    return this.http.post<string>(`${this.baseUrl}/VerifyMail/${email}`, {});
  }

  sendHtmlEmail(email: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/send-html-email/${email}`, {});
  }

  verifyOtp(otp: number, email: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/verifyOtp/${otp}/${email}`, {});
  }

  changePassword(email: string, passwordData: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/changePassword/${email}`, passwordData);
  }
}
