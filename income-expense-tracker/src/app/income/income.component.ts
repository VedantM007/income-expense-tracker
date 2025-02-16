import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from '../services/income.service';
import { Category } from '../models/category';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IncomePayload } from '../models/income-payload';
import { SignInResponse } from '../models/sign-in-response';
import { Income } from '../models/income';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit{
totalIncome : number = 0
myForm!: FormGroup;
isLoading : boolean = false;
pastIncomes : Income[] = [];
incomeCategories : Category[] = [];
payload : IncomePayload = {};
userId : string = '';
isResponseLoading : boolean = false;
isOpen : boolean = false;
showModal : boolean = false;
incomeId : string = '';
constructor(private fb : FormBuilder, private router : Router, private incomeService : IncomeService, private toastrService : ToastrService){}

ngOnInit(): void {
  const encryptedUserResponse = sessionStorage.getItem('userResponse');
  const userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
   this.userId = userDetails.userId;
  this.buildForm();
  this.getAllIncomeCategories();
   if(encryptedUserResponse){
    this.getAllIncomesByUserId();
   }
}

buildForm(){
  this.myForm = this.fb.group({
   title : ['', [Validators.required, Validators.maxLength(20)]],
   amount : ['', [Validators.required, Validators.minLength(4),
    Validators.pattern(/^\d+$/)]],
   date : ['', Validators.required],
   description : ['', Validators.required],
   category : ['', Validators.required],
  })
}

getAllIncomeCategories(){
  this.incomeService.getAllIncomeCategories().pipe(first()).subscribe({
    next : (response : Category[])=>{
      this.incomeCategories =response;
    },
    error : (error : HttpErrorResponse)=>{
       this.toastrService.error(error.error.error, "Error while loading Income Categories");
    }
  })
}

getAllIncomesByUserId(){
  this.isResponseLoading = true;
  this.incomeService.getAllIncomesByUserId(this.userId).pipe(first()).subscribe({
    next : (response)=>{
      this.pastIncomes = response
      this.totalIncome = this.pastIncomes.reduce((sum, income) => sum + income.amount, 0);
      this.isResponseLoading = false;
    },
    error : (error : HttpErrorResponse)=>{
      this.isResponseLoading = false;
      this.toastrService.error(error.error.error, "Error while fetching Past Incomes");
    }
  })
}
allowNumbersOnly(event: KeyboardEvent) {
  const key = event.key;
  if (!/^\d$/.test(key)) {
    event.preventDefault();
  }
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

    this.incomeService.addNewIncome(this.payload).pipe(first()).subscribe({
      next : (response)=>{
        this.isLoading = false;
        this.myForm.reset();
        this.myForm.get('category')?.setValue("")
        this.toastrService.success('New Income added', 'Success');
        this.getAllIncomesByUserId();
      },
      error : (error : HttpErrorResponse)=>{
        this.isLoading = false;
        this.toastrService.error(error.error.error, "Error")
        this.myForm.reset();
        this.myForm.get('category')?.setValue("")
      }
    })
  }
}

openModal(id:string){
  this.showModal = true; 
    setTimeout(() => this.isOpen = true, 10);
    this.incomeId = id;
}

closeModal() {
  this.isOpen = false;
  setTimeout(() => this.showModal = false, 300); // Remove from DOM after animation
}

deleteIncomeById(){
  this.incomeService.deleteIncomeById(this.incomeId).pipe(first()).subscribe({
    next : (response)=>{
      this.toastrService.info('Selected Income deleted', 'Deleted');
     this.getAllIncomesByUserId();
     this.closeModal();
    },
    error : (error : HttpErrorResponse)=>{
      this.toastrService.error(error.message, 'Error')
      this.closeModal();
    }
  })
}
}
