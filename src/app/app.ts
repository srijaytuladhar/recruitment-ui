import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    PanelMenuModule,
    ButtonModule,
    RippleModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    RouterOutlet,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('hr-recruiter-ui');
  sidebarVisible = true;
  menuItems: MenuItem[] = [];

  constructor(
    private router: Router
  ) {

  }

   navigateTo(path: string) {
    this.router.navigate([path]);
  }
  
  ngOnInit() {
    this.menuItems = [
      { label: 'Dashboard', icon: 'pi pi-home' },
      {
        label: 'Users',
        icon: 'pi pi-users',
        items: [
          { label: 'Add User', icon: 'pi pi-user-plus' },
          { label: 'Manage Users', icon: 'pi pi-cog' },
        ],
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-line',
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
      },
    ];
  }

  collapsed = false;
  currentYear = new Date().getFullYear();

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }
}
