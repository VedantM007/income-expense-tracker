import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { Category, CategoryList } from '../models/category';
import { environment } from '../../environments/environment';
import { IncomePayload } from '../models/income-payload';
import { Income, IncomeList } from '../models/income';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(private commonService : CommonService) { }

  getAllIncomeCategories():Observable<CategoryList>{
    return this.commonService.httpGet(`${environment.apiURL}/income/getAllIncomeCategories`)
  }

  addNewIncome(payload : IncomePayload):Observable<any>{
    return this.commonService.httpPostWithAuth(`${environment.apiURL}/income/addIncome`, payload)
  }

  getAllIncomesByUserId(userId : string):Observable<IncomeList>{
    return this.commonService.httpGet(`${environment.apiURL}/income/getAllIncomesByUserId?userId=${userId}`);
  }

  deleteIncomeById(id:string):Observable<any>{
    return this.commonService.httpDelete(`${environment.apiURL}/income/deleteIncomeById?id=${id}`);
  }

  getIncomeByIncomeId(incomeId : string):Observable<any>{
    return this.commonService.httpGet(`${environment.apiURL}/income/getIncomeByIncomeId?_id=${incomeId}`)
  }

  updateIncome(payload:IncomePayload):Observable<any>{
    return this.commonService.httpPostWithAuth(`${environment.apiURL}/income/updateIncome`, payload);
  }
}
