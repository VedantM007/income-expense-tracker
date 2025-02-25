import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardStats } from '../models/dashboard-stats';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private commonService : CommonService) { }

  getDashboardStats(userId : string):Observable<DashboardStats>{
    return this.commonService.httpGet(`${environment.apiURL}/dashboard/getDashboardStats?userId=${userId}`);
  }
}
