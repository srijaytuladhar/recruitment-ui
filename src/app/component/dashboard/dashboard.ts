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
      title: 'Revenue',
      value: '$82,300',
      icon: 'pi pi-wallet',
      color: 'bg-green',
    },
    {
      title: 'Orders',
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
        label: 'Revenue',
        data: [12000, 15000, 18000, 17000, 21000, 25000],
        fill: false,
        tension: 0.4,
      },
    ],
  };

  barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [120, 190, 300, 250, 220, 310, 280],
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
