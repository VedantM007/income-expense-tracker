import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { Observable } from 'rxjs';
import { CategoryList } from '../models/category';
import { environment } from '../../environments/environment';
import { IncomePayload } from '../models/income-payload';
import { ExpenseList } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private commonService: CommonService) {}

  getAllExpenseCategories(): Observable<CategoryList> {
    return this.commonService.httpGet(
      `${environment.apiURL}/expense/getAllExpenseCategories`
    );
  }

  addNewExpense(payload: IncomePayload): Observable<any> {
    return this.commonService.httpPostWithAuth(
      `${environment.apiURL}/expense/addExpense`,
      payload
    );
  }

  getAllExpensesByUserId(): Observable<ExpenseList> {
    return this.commonService.httpGet(
      `${environment.apiURL}/expense/getAllExpensesByUserId`
    );
  }

  deleteExpenseById(id: string): Observable<any> {
    return this.commonService.httpDelete(
      `${environment.apiURL}/expense/deleteExpenseById?id=${id}`
    );
  }

  getExpenseByExpenseId(expenseId: string): Observable<any> {
    return this.commonService.httpGet(
      `${environment.apiURL}/expense/getExpenseByExpenseId?_id=${expenseId}`
    );
  }

  updateExpense(payload: IncomePayload): Observable<any> {
    return this.commonService.httpPostWithAuth(
      `${environment.apiURL}/expense/updateExpense`,
      payload
    );
  }
}