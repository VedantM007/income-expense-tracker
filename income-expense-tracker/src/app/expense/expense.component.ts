import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../services/expense.service';
import { first } from 'rxjs';
import { CategoryList } from '../models/category';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IncomePayload } from '../models/income-payload';
import { Expense, ExpenseList } from '../models/expense';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  totalExpense: number = 0;
  myForm!: FormGroup;
  isLoading: boolean = false;
  pastExpenses: Expense[] = [];
  expenseCategories!: CategoryList;
  payload: IncomePayload = {};
  isResponseLoading: boolean = false;
  isOpen: boolean = false;
  showModal: boolean = false;
  expenseId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private expenseService: ExpenseService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const encryptedUserResponse = sessionStorage.getItem('userResponse');

    this.buildForm();
    this.pastExpenses = [];
    this.getAllExpenseCategories();

    if (encryptedUserResponse) {
      this.getAllExpensesByUserId();
    }
  }

  buildForm() {
    this.myForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ]
      ],
      amount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d+)?$/),
          this.positiveAmountValidator
        ]
      ],
      date: ['', Validators.required],
      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],
      category: ['', Validators.required]
    });
  }

  positiveAmountValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
      return { positiveAmount: true };
    }

    return null;
  }

  getAllExpenseCategories() {
    this.expenseService.getAllExpenseCategories().pipe(first()).subscribe({
      next: (response: CategoryList) => {
        this.expenseCategories = response;
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.error(
          error.error.error,
          "Error while loading Expense Categories"
        );
      }
    });
  }

  getAllExpensesByUserId() {
    this.isResponseLoading = true;

    this.expenseService.getAllExpensesByUserId().pipe(first()).subscribe({
      next: (response: ExpenseList) => {
        this.pastExpenses = response.data;
        this.totalExpense = this.pastExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        this.isResponseLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isResponseLoading = false;
        this.toastrService.error(
          error.error.error,
          "Error while fetching Past Expenses"
        );
      }
    });
  }

  onSave(): void {
    if (this.myForm.valid) {
      this.isLoading = true;

      this.payload = new IncomePayload();

      this.payload.title = this.myForm.get('title')?.value;
      this.payload.amount = parseFloat(this.myForm.get('amount')?.value);
      this.payload.date = new Date(
        this.myForm.get('date')?.value
      ).toISOString();
      this.payload.description = this.myForm.get('description')?.value;
      this.payload.category = parseInt(
        this.myForm.get('category')?.value
      );

      this.expenseService.addNewExpense(this.payload).pipe(first()).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.getAllExpensesByUserId();
          this.myForm.reset();
          this.myForm.get('category')?.setValue('');
          this.toastrService.success('New Expense added', 'Success');
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.toastrService.error(error.error.error, "Error");
          this.myForm.reset();
          this.myForm.get('category')?.setValue('');
        }
      });
    }
  }

  openModal(id: string) {
    this.showModal = true;

    setTimeout(() => this.isOpen = true, 10);

    this.expenseId = id;
  }

  closeModal() {
    this.isOpen = false;

    setTimeout(() => this.showModal = false, 300);
  }

  deleteExpenseById() {
    this.expenseService.deleteExpenseById(this.expenseId).pipe(first()).subscribe({
      next: (response) => {
        this.toastrService.info('Selected Expense deleted', 'Deleted');
        this.getAllExpensesByUserId();
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.error(error.message, 'Error');
        this.closeModal();
      }
    });
  }

  navigateToEditExpense(id: string) {
    this.router.navigate(['edit-expense/' + id]);
  }
}