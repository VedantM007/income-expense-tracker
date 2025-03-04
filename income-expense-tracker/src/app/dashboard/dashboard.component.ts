import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { DashboardService } from '../services/dashboard.service';
import { SignInResponse } from '../models/sign-in-response';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardStats } from '../models/dashboard-stats';
import { ToastrService } from 'ngx-toastr';
import { IncomeService } from '../services/income.service';
import { Income } from '../models/income';
import { ExpenseService } from '../services/expense.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{

  balance : number = 0;
  totalExpense : number = 0;
  totalIncome : number = 0;
  userId : string = "";
  dashboardStats?: DashboardStats;
  isResponseLoading : boolean = false;
  incomes : Income[] = [];
  incomeDateArray?: string[];
  incomeAmountArray?: number[];
  expenseDateArray?: string[];
  expenseAmountArray?: number[];
  maxIncome : number = 0;
  maxExpense : number = 0;
  constructor(private dashboardService : DashboardService, private toastrService : ToastrService, private incomeService : IncomeService, private expenseService : ExpenseService){}

  ngOnInit(): void {
    const encryptedUserResponse = sessionStorage.getItem('userResponse');
    const userDetails : SignInResponse = JSON.parse(atob(encryptedUserResponse as string));
     this.userId = userDetails.userId;

     if(this.userId !== ""){
      this.getAllDashboardStats();
      this.getAllIncomesByUserId();
      this.getAllExpensesByUserId();
   }
      setTimeout(()=>{
        if(this.incomeDateArray?.length !== 0 && this.incomeAmountArray?.length !== 0){
          this.incomeChart();
        }
        if(this.expenseDateArray?.length !== 0 && this.expenseAmountArray?.length !== 0){
          this.expenseChart();
        }

    },2000)
      window.dispatchEvent(new Event('resize'));
   
  }

 getAllIncomesByUserId(){
  this.incomeService.getAllIncomesByUserId(this.userId).subscribe({
    next : (response)=>{
      const formattedDates = response.map((item) => {
        const date = new Date(item.date); // Convert to Date object
        const day = (`0${date.getDate()}`).slice(-2); // Ensures two digits
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Ensures two digits (Months are 0-based)
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      });

      this.incomeAmountArray = response.map((item) => item.amount)
       this.incomeDateArray = formattedDates

       console.log(formattedDates)
       console.log(this.incomeAmountArray)
    },
    error : (error : HttpErrorResponse)=>{
      this.toastrService.error(error.error.error, "Error While loading Incomes")
    }
  })
 }

 getAllExpensesByUserId(){
  this.expenseService.getAllExpensesByUserId(this.userId).subscribe({
    next : (response)=>{
      const formattedDates = response.map((item) => {
        const date = new Date(item.date); // Convert to Date object
        const day = (`0${date.getDate()}`).slice(-2); // Ensures two digits
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Ensures two digits (Months are 0-based)
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      });

      this.expenseAmountArray = response.map((item) => item.amount)
       this.expenseDateArray = formattedDates
    },
    error : (error : HttpErrorResponse)=>{
      this.toastrService.error(error.error.error, "Error While loading Expenses")
    }
  })
 }

  incomeChart(): void {
    const chartDom = document.getElementById('income-chart')!;
    const myChart = echarts.init(chartDom);

    // X-axis and Y-axis fixed values
    const xAxisLabels = this.incomeDateArray;
    // Data for the series
    const yAxisValues = this.incomeAmountArray;

    const option = {
      xAxis: {
        type: 'category',
        data: xAxisLabels, // Fixed dates as X-axis labels
        boundaryGap: false, // Align labels directly on points
        splitLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        min: 0, // Start value of the Y-axis
        max: this.maxIncome, // End value of the Y-axis
        interval: 1000, // Interval between values
        splitLine: {
          show: true
        },
        axisLabel: {
          formatter: '{value}' // Format for Y-axis labels
        }
      },
      series: [
        {
          data: yAxisValues, // Y-axis data points
          type: 'line',
          lineStyle: {
            color: '#4fa56f'
          },
          itemStyle: {
            color: '#4fa56f'
          },
        }
      ],
      tooltip: {
        trigger: 'axis', // Show tooltip for both X and Y-axis values
        formatter: (params: any) => {
          const point = params[0];
          return `
            <div style="padding: 5px; font-family: Arial, sans-serif; line-height: 1.5;">
              <div style="font-weight: bold; margin-bottom: 5px;">${point.axisValue}</div>
              <div style="display: flex; align-items: center;">
                <div style="width: 10px; height: 10px; background-color: #28a745; margin-right: 5px; margin-bottom:1px;"></div>
                <span>Income:</span>
                <span style="font-weight: bold; margin-left: 5px;">${point.data}</span>
              </div>
            </div>
          `;
        }
      }
    };

    myChart.setOption(option);
    
  }

  expenseChart(): void {
    const chartDom = document.getElementById('expense-chart')!;
    const myChart = echarts.init(chartDom);

    // X-axis and Y-axis fixed values
    const xAxisLabels = this.expenseDateArray;
    // Data for the series
    const yAxisValues = this.expenseAmountArray;

    const option = {
      xAxis: {
        type: 'category',
        data: xAxisLabels, // Fixed dates as X-axis labels
        boundaryGap: false, // Align labels directly on points
        splitLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        min: 0, // Start value of the Y-axis
        max: this.maxExpense, // End value of the Y-axis
        interval: 500, // Interval between values
        splitLine: {
          show: true
        },
        axisLabel: {
          formatter: '{value}' // Format for Y-axis labels
        }
      },
      series: [
        {
          data: yAxisValues, // Y-axis data points
          type: 'line',
          lineStyle: {
            color: '#DC2627'
          },
          itemStyle: {
            color: '#DC2627'
          },
        }
      ],
      tooltip: {
        trigger: 'axis', // Show tooltip for both X and Y-axis values
        formatter: (params: any) => {
          const point = params[0];
          return `
            <div style="padding: 5px; font-family: Arial, sans-serif; line-height: 1.5;">
              <div style="font-weight: bold; margin-bottom: 5px;">${point.axisValue}</div>
              <div style="display: flex; align-items: center;">
                <div style="width: 10px; height: 10px; background-color: #DC2627; margin-right: 5px; margin-bottom:1px;"></div>
                <span>Expense:</span>
                <span style="font-weight: bold; margin-left: 5px;">${point.data}</span>
              </div>
            </div>
          `;
        }
      }
    };

    myChart.setOption(option);
    
  }

  getAllDashboardStats(){
    this.isResponseLoading = true;
    this.dashboardService.getDashboardStats(this.userId).pipe(first()).subscribe({
      next: (response : DashboardStats)=>{
        this.dashboardStats = response;
        this.isResponseLoading = false;
        this.maxIncome = response.maxIncome;
        this.maxExpense = response.maxExpense;
      },
      error : (err : HttpErrorResponse)=>{
       this.toastrService.error(err.error.error, "Error While loading Dashboard Stats")
       this.isResponseLoading = false;
      }
    })
  }

}
