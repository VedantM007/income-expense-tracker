import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit{
totalIncome : number = 5000
myForm!: FormGroup;
isLoading : boolean = false;
pastIncomes : any[] = [];
constructor(private fb : FormBuilder, private router : Router){}

ngOnInit(): void {
  this.buildForm();
  this.pastIncomes = [
    {
      title : 'Bonus',
      amount : 1000,
      date : '2025-02-01T00:00:00Z',
      category : 'Income'
    },
    {
      title : 'Freelance Project',
      amount : 500,
      date : '2025-02-10T00:00:00Z',
      category : 'Income'
    }
  ]
}

buildForm(){
  this.myForm = this.fb.group({
   title : ['', [Validators.required, Validators.maxLength(20)]],
   amount : ['', [Validators.required, Validators.minLength(5),
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

onSave(): void {
  if (this.myForm.valid) {
    this.isLoading = true;
  }
}
}
