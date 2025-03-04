import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '../../environments/environment.dev';
import { IncomePayload } from '../models/income-payload';
import { Income } from '../models/income';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private commonService : CommonService) { }

  getAllIncomeCategories():Observable<Category[]>{
    return this.commonService.httpGet(`${environment.apiURL}/income/getAllIncomeCategories`)
  }

  addNewIncome(payload : IncomePayload):Observable<any>{
    return this.commonService.httpPostWithAuth(`${environment.apiURL}/income/addIncome`, payload)
  }

  getAllIncomesByUserId(userId : string):Observable<Income[]>{
    return this.commonService.httpGet(`${environment.apiURL}/income/getAllIncomesByUserId?userId=${userId}`);
  }

  deleteIncomeById(id:string):Observable<any>{
    return this.commonService.httpDelete(`${environment.apiURL}/income/deleteIncomeById?id=${id}`);
  }

  getIncomeByIncomeId(incomeId : string):Observable<Income>{
    return this.commonService.httpGet(`${environment.apiURL}/income/getIncomeByIncomeId?_id=${incomeId}`)
  }

  updateIncome(incomeId : string, payload:IncomePayload):Observable<any>{
    return this.commonService.httpPut(`${environment.apiURL}/income/updateIncome`, incomeId, payload);
  }
}
