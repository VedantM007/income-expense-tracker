import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category';
import { IncomeService } from '../services/income.service';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SignInResponse } from '../models/sign-in-response';
import { Income } from '../models/income';
import { IncomePayload } from '../models/income-payload';

@Component({
  selector: 'app-edit-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-income.component.html',
  styleUrl: './edit-income.component.css'
})
export class EditIncomeComponent implements OnInit {

  incomeId : string = "";
  myForm!:FormGroup;
  isLoading : boolean = false;
  incomeCategories : Category[] = [];
  isResponseLoading : boolean = false;
  payload : IncomePayload = {};
  userId : string = "";
  constructor(private activatedRoute : ActivatedRoute, private fb : FormBuilder, private incomeService : IncomeService, private toastrService : ToastrService, private router : Router){}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.incomeId = params['id'];
    })
    const encryptedUserResponse = sessionStorage.getItem('userResponse');
    let userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
    this.userId = userDetails.userId;
    this.buildForm();
    this.getAllIncomeCategories();

    if(this.incomeId !== ""){
       this.getIncomeByIncomeId();
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
  allowNumbersOnly(event: KeyboardEvent) {
    const key = event.key;
    if (!/^\d$/.test(key)) {
      event.preventDefault();
    }
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

  getIncomeByIncomeId(){
    this.isResponseLoading = true;
    this.incomeService.getIncomeByIncomeId(this.incomeId).pipe(first()).subscribe({
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
        this.toastrService.error(error.error.error, "Error while loading Income Categories");
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

      this.incomeService.updateIncome(this.incomeId, this.payload).pipe(first()).subscribe({
        next : (response)=>{
          this.isLoading = false;
          this.toastrService.success('Selected Income updated', 'Success');
          this.router.navigate(['income']);
        },
        error : (error : HttpErrorResponse)=>{
          this.isLoading = false;
          this.toastrService.error(error.error.error, "Error");
        }
      })
    }
      
  }
}
