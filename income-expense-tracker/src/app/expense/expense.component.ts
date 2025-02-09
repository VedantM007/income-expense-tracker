import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  totalExpense : number = 500
  myForm!: FormGroup;
  isLoading : boolean = false;
  pastExpenses : any[] = [];

  constructor(private fb : FormBuilder, private router : Router){}

  ngOnInit(): void {
    this.buildForm();
    this.pastExpenses = [
      {
        title : 'Dining Out',
        amount : 1000,
        date : '2025-02-01T00:00:00Z',
        category : 'Food'
      },
      {
        title : 'Utilities',
        amount : 500,
        date : '2025-02-10T00:00:00Z',
        category : 'Bills'
      }
    ]
  }
  
  buildForm(){
    this.myForm = this.fb.group({
     title : ['', [Validators.required, Validators.maxLength(20)]],
     amount : ['', [Validators.required,Validators.pattern(/^\d+$/)]],
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
  
  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;
    }
  }
}
