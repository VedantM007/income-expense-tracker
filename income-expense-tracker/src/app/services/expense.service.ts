import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '../../environments/environment.dev';
import { IncomePayload } from '../models/income-payload';
import { Expense } from '../models/expense';
import { Income } from '../models/income';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private commonService : CommonService) { }

  getAllExpenseCategories():Observable<Category[]>{
    return this.commonService.httpGet(`${environment.apiURL}/expense/getAllExpenseCategories`)
  }

  addNewExpense(payload : IncomePayload):Observable<any>{
    return this.commonService.httpPostWithAuth(`${environment.apiURL}/expense/addExpense`, payload)
  }

  getAllExpensesByUserId(userId : string):Observable<Expense[]>{
    return this.commonService.httpGet(`${environment.apiURL}/expense/getAllExpensesByUserId?userId=${userId}`);
  }

  deleteExpenseById(id:string):Observable<any>{
    return this.commonService.httpDelete(`${environment.apiURL}/expense/deleteExpenseById?id=${id}`);
  }

  getExpenseByExpenseId(expenseId : string):Observable<Income>{
    return this.commonService.httpGet(`${environment.apiURL}/expense/getExpenseByExpenseId?_id=${expenseId}`)
  }

  updateExpense(expenseId : string, payload:IncomePayload):Observable<any>{
    return this.commonService.httpPut(`${environment.apiURL}/expense/updateExpense`, expenseId, payload);
  }
}
