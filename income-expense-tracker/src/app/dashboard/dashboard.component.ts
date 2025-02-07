import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{

  balance : number = 4500;
  totalExpense : number = 500;
  totalIncome : number = 5000;
  ngOnInit(): void {
    setTimeout(()=>{
      this.incomeChart();
      this.expenseChart();
    },500)
      window.dispatchEvent(new Event('resize'));
  }


  incomeChart(): void {
    const chartDom = document.getElementById('income-chart')!;
    const myChart = echarts.init(chartDom);

    // X-axis and Y-axis fixed values
    const xAxisLabels = ['01-02-2024', '02-02-2024', '03-02-2024', '04-02-2024', '05-02-2024'];
    // Data for the series
    const yAxisValues = [3000, 500, 200, 375, 1000]; // Y-axis values corresponding to the dates on X-axis

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
        max: 3000, // End value of the Y-axis
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
    const xAxisLabels = ['01-02-2024', '02-02-2024', '03-02-2024', '04-02-2024', '05-02-2024'];
    // Data for the series
    const yAxisValues = [50, 100, 30, 25, 80]; // Y-axis values corresponding to the dates on X-axis

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
        max: 100, // End value of the Y-axis
        interval: 10, // Interval between values
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

}
