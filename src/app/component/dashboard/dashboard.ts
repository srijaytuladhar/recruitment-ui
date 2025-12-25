import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, CardModule, PanelModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  summaryCards = [
    {
      title: 'Total Users',
      value: 12450,
      icon: 'pi pi-users',
      color: 'bg-blue',
    },
    {
      title: 'Candidates',
      value: '$82,300',
      icon: 'pi pi-wallet',
      color: 'bg-green',
    },
    {
      title: 'Clients',
      value: 1380,
      icon: 'pi pi-shopping-cart',
      color: 'bg-orange',
    },
    {
      title: 'Errors',
      value: 12,
      icon: 'pi pi-exclamation-triangle',
      color: 'bg-red',
    },
  ];

  lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Candidates',
        data: [120, 180, 170, 150, 180, 200],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Clients',
        data: [12, 19, 30, 25, 22, 31, 28],
      },
    ],
  };

  pieData = {
    labels: ['Success', 'Rejected', 'Waiting'],
    datasets: [
      {
        data: [65, 20, 15],
      },
    ],
  };
}
