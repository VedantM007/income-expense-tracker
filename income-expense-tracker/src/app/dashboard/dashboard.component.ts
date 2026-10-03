import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import * as echarts from 'echarts';
import { DashboardService } from '../services/dashboard.service';
import { first } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardStats } from '../models/dashboard-stats';
import { ToastrService } from 'ngx-toastr';
import { IncomeService } from '../services/income.service';
import { Income, IncomeList } from '../models/income';
import { ExpenseService } from '../services/expense.service';
import { ExpenseList } from '../models/expense';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {

  private incomeChartInstance?: echarts.ECharts;
  private expenseChartInstance?: echarts.ECharts;

  balance: number = 0;
  totalExpense: number = 0;
  totalIncome: number = 0;
  dashboardStats?: DashboardStats;
  isResponseLoading: boolean = false;

  incomes: Income[] = [];

  incomeDateArray?: string[];
  incomeAmountArray?: number[];

  expenseDateArray?: string[];
  expenseAmountArray?: number[];

  maxIncome: number = 0;
  maxExpense: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private toastrService: ToastrService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    const encryptedUserResponse = sessionStorage.getItem('userResponse');

    if (encryptedUserResponse) {
      this.getAllDashboardStats();
      this.getAllIncomesByUserId();
      this.getAllExpensesByUserId();
    }

    setTimeout(() => {
      if (
        this.incomeDateArray?.length !== 0 &&
        this.incomeAmountArray?.length !== 0
      ) {
        this.incomeChart();
      }

      if (
        this.expenseDateArray?.length !== 0 &&
        this.expenseAmountArray?.length !== 0
      ) {
        this.expenseChart();
      }
    }, 1000);

    window.dispatchEvent(new Event('resize'));
  }

  getAllIncomesByUserId() {
    this.incomeService.getAllIncomesByUserId().subscribe({
      next: (response: IncomeList) => {
        const formattedDates = response.data.map((item) => {
          const date = new Date(item.date);
          const day = (`0${date.getDate()}`).slice(-2);
          const month = (`0${date.getMonth() + 1}`).slice(-2);
          const year = date.getFullYear();

          return `${day}-${month}-${year}`;
        });

        this.incomeAmountArray = response.data.map((item) => item.amount);
        this.incomeDateArray = formattedDates;

        console.log(formattedDates);
        console.log(this.incomeAmountArray);
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.error(
          error.error.error,
          "Error While loading Incomes"
        );
      }
    });
  }

  getAllExpensesByUserId() {
    this.expenseService.getAllExpensesByUserId().subscribe({
      next: (response: ExpenseList) => {
        const formattedDates = response.data.map((item) => {
          const date = new Date(item.date);
          const day = (`0${date.getDate()}`).slice(-2);
          const month = (`0${date.getMonth() + 1}`).slice(-2);
          const year = date.getFullYear();

          return `${day}-${month}-${year}`;
        });

        this.expenseAmountArray = response.data.map((item) => item.amount);
        this.expenseDateArray = formattedDates;
      },
      error: (error: HttpErrorResponse) => {
        this.toastrService.error(
          error.error.error,
          "Error While loading Expenses"
        );
      }
    });
  }

  incomeChart(): void {
    const chartDom = document.getElementById('income-chart')!;

    if (this.incomeChartInstance) {
      this.incomeChartInstance.dispose();
    }

    const myChart = echarts.init(chartDom);
    this.incomeChartInstance = myChart;

    const xAxisLabels = this.incomeDateArray;
    const yAxisValues = this.incomeAmountArray;

    const option = {
      grid: {
        top: 20,
        bottom: 40,
        left: 50,
        right: 20
      },

      xAxis: {
        type: 'category',
        data: xAxisLabels,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisLine: {
          lineStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      },

      yAxis: {
        type: 'value',
        min: 0,
        max: this.maxIncome,
        interval: this.maxIncome > 5000
          ? Math.ceil(this.maxIncome / 5)
          : 1000,
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11,
          formatter: '{value}'
        }
      },

      series: [
        {
          data: yAxisValues,
          type: 'line',
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            color: '#10B981',
            width: 3
          },
          itemStyle: {
            color: '#10B981'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
            ])
          }
        }
      ],

      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#FFFFFF', fontSize: 12 },
        formatter: (params: any) => {
          const point = params[0];

          return `
            <div style="padding: 4px; font-family: sans-serif; line-height: 1.4;">
              <div style="font-weight: 600; font-size: 11px; color: #94a3b8; margin-bottom: 4px;">
                ${point.axisValue}
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 8px; height: 8px; background-color: #10B981; border-radius: 2px;"></div>
                <span style="font-weight: 500;">Income:</span>
                <span style="font-weight: 600; margin-left: 2px;">&#8377;${point.data}</span>
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

    if (this.expenseChartInstance) {
      this.expenseChartInstance.dispose();
    }

    const myChart = echarts.init(chartDom);
    this.expenseChartInstance = myChart;

    const xAxisLabels = this.expenseDateArray;
    const yAxisValues = this.expenseAmountArray;

    const option = {
      grid: {
        top: 20,
        bottom: 40,
        left: 50,
        right: 20
      },

      xAxis: {
        type: 'category',
        data: xAxisLabels,
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        axisLine: {
          lineStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      },

      yAxis: {
        type: 'value',
        min: 0,
        max: this.maxExpense,
        interval: this.maxExpense > 2500
          ? Math.ceil(this.maxExpense / 5)
          : 500,
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11,
          formatter: '{value}'
        }
      },

      series: [
        {
          data: yAxisValues,
          type: 'line',
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            color: '#EF4444',
            width: 3
          },
          itemStyle: {
            color: '#EF4444'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(239, 68, 68, 0.25)' },
              { offset: 1, color: 'rgba(239, 68, 68, 0.0)' }
            ])
          }
        }
      ],

      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#FFFFFF', fontSize: 12 },
        formatter: (params: any) => {
          const point = params[0];

          return `
            <div style="padding: 4px; font-family: sans-serif; line-height: 1.4;">
              <div style="font-weight: 600; font-size: 11px; color: #94a3b8; margin-bottom: 4px;">
                ${point.axisValue}
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="width: 8px; height: 8px; background-color: #EF4444; border-radius: 2px;"></div>
                <span style="font-weight: 500;">Expense:</span>
                <span style="font-weight: 600; margin-left: 2px;">&#8377;${point.data}</span>
              </div>
            </div>
          `;
        }
      }
    };

    myChart.setOption(option);
  }

  getAllDashboardStats() {
    this.isResponseLoading = true;

    this.dashboardService.getDashboardStats().pipe(first()).subscribe({
      next: (response: DashboardStats) => {
        this.dashboardStats = response;
        this.isResponseLoading = false;
        this.maxIncome = response.data.maxIncome;
        this.maxExpense = response.data.maxExpense;
      },
      error: (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error.error,
          "Error While loading Dashboard Stats"
        );
        this.isResponseLoading = false;
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.incomeChartInstance?.resize();
    this.expenseChartInstance?.resize();
  }

  ngOnDestroy(): void {
    if (this.incomeChartInstance) {
      this.incomeChartInstance.dispose();
    }

    if (this.expenseChartInstance) {
      this.expenseChartInstance.dispose();
    }
  }
}