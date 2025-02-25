import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../models/category';
import { IncomePayload } from '../models/income-payload';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../services/expense.service';
import { ToastrService } from 'ngx-toastr';
import { SignInResponse } from '../models/sign-in-response';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Income } from '../models/income';

@Component({
  selector: 'app-edit-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-expense.component.html',
  styleUrl: './edit-expense.component.css'
})
export class EditExpenseComponent implements OnInit {
  expenseId : string = "";
  myForm!:FormGroup;
  isLoading : boolean = false;
  expenseCategories : Category[] = [];
  isResponseLoading : boolean = false;
  payload : IncomePayload = {};
  userId : string = "";

  constructor(private activatedRoute : ActivatedRoute, private fb : FormBuilder, private expenseService : ExpenseService, private toastrService : ToastrService, private router : Router){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.expenseId = params['id'];
    })
    const encryptedUserResponse = sessionStorage.getItem('userResponse');
    let userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
    this.userId = userDetails.userId;
    this.buildForm();
    this.getAllExpenseCategories();

    if(this.expenseId !== ""){
       this.getexpenseByExpenseId();
    }
  }

  buildForm(){
    this.myForm = this.fb.group({
      title : ['', [Validators.required, Validators.maxLength(20)]],
      amount : ['', [Validators.required,
       Validators.pattern(/^\d+$/)]],
      date : ['', Validators.required],
      description : ['', Validators.required],
      category : ['', Validators.required],
     })
  }
  allowNumbersOnly(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
  }

  getAllExpenseCategories(){
    this.expenseService.getAllExpenseCategories().pipe(first()).subscribe({
      next : (response : Category[])=>{
        this.expenseCategories =response;
      },
      error : (error : HttpErrorResponse)=>{
         this.toastrService.error(error.error.error, "Error while loading Expense Categories");
      }
    })
  }

  getexpenseByExpenseId(){
    this.isResponseLoading = true;
    this.expenseService.getExpenseByExpenseId(this.expenseId).pipe(first()).subscribe({
      next : (response : Income)=>{
       this.myForm.get('title')?.setValue(response.title);
       this.myForm.get('amount')?.setValue((response.amount).toString());
       this.myForm.get('date')?.setValue(new Date(response.date).toISOString().split('T')[0]);
       this.myForm.get('description')?.setValue(response.description);
       this.myForm.get('category')?.setValue((response.category).toString());
       this.isResponseLoading = false;
      },
      error : (error :HttpErrorResponse)=>{
        this.isResponseLoading = false;
        this.toastrService.error(error.error.error, "Error while loading Expense Details");
      }
    })
  }

  onSave(): void {
    if (this.myForm.valid) {
    this.isLoading = true;

    this.payload = new IncomePayload();

    this.payload.title = this.myForm.get('title')?.value;
    this.payload.amount = parseInt(this.myForm.get('amount')?.value);
    this.payload.date = new Date(this.myForm.get('date')?.value).toISOString();
    this.payload.description = this.myForm.get('description')?.value;
    this.payload.category = parseInt(this.myForm.get('category')?.value);
    this.payload.userId = this.userId;

      this.expenseService.updateExpense(this.expenseId, this.payload).pipe(first()).subscribe({
        next : (response)=>{
          this.isLoading = false;
          this.toastrService.success('Selected Expense updated', 'Success');
          this.router.navigate(['expense']);
        },
        error : (error : HttpErrorResponse)=>{
          this.isLoading = false;
          this.toastrService.error(error.error.error, "Error");
        }
      })
    }
      
  }
}
