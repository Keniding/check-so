import { Component, OnInit, signal, inject } from '@angular/core';
import {Router} from '@angular/router';
import { Card } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Avatar } from 'primeng/avatar';
import { Toolbar } from 'primeng/toolbar';
import { Menu } from 'primeng/menu';
import { InputText } from 'primeng/inputtext';
import { MenuItem } from 'primeng/api';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';
import {BadgeDirective} from 'primeng/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Card, ChartModule, Toast, ButtonDirective, Divider, Avatar, Toolbar, Menu, InputText, NgClass, DatePipe, CurrencyPipe, BadgeDirective],
  template: `
    <p-toast />
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4 md:p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header con más opciones -->
        <p-toolbar class="!bg-white/70 !backdrop-blur-sm !border-none shadow-md rounded-xl">
          <div class="p-toolbar-group-start flex items-center gap-4">
            <p-avatar icon="pi pi-chart-bar" shape="circle" size="large" class="!bg-primary-500 !text-white shadow-md"></p-avatar>
            <div class="hidden sm:block">
              <h1 class="text-2xl font-semibold text-gray-800 leading-none">Dashboard</h1>
              <p class="text-xs text-gray-500">Resumen al 20/09/2025</p>
            </div>
            <span class="relative hidden md:inline-flex">
              <i class="pi pi-bell text-xl text-gray-600"></i>
              <span pBadge value="3" severity="danger" class="!absolute -top-2 -right-2"></span>
            </span>
          </div>
          <!-- Haz el contenedor relativo para posicionar el overlay -->
          <div class="p-toolbar-group-end flex items-center gap-3 relative">
            <span class="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
              <i class="pi pi-search text-gray-500"></i>
              <input pInputText type="text" placeholder="Buscar..." class="!bg-transparent !border-0 focus:!ring-0 focus:!outline-none" />
            </span>

            <!-- Menú de usuario: popup anclado al contenedor y forzado a abrir hacia la izquierda -->
            <p-menu
              #userMenu
              [model]="userMenuItems"
              [popup]="true"
              appendTo="body"
              styleClass="user-menu-left"
            ></p-menu>

            <button pButton type="button" class="p-button-text" (click)="userMenu.toggle($event)">
              <span class="flex items-center gap-2">
                <p-avatar icon="pi pi-user" shape="circle" class="!bg-primary-500 !text-white"></p-avatar>
                <span class="font-medium text-gray-700">keniding</span>
                <i class="pi pi-angle-down text-gray-500"></i>
              </span>
            </button>
          </div>
        </p-toolbar>

        <!-- Cards resumen -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <p-card class="shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Monto semanal</p>
                <p class="text-2xl font-semibold text-gray-800">{{ weeklyAmount() | currency:'PEN':'symbol' }}</p>
              </div>
              <i class="pi pi-calendar-week text-3xl text-primary-500"></i>
            </div>
          </p-card>

          <p-card class="shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Monto mensual</p>
                <p class="text-2xl font-semibold text-gray-800">{{ monthlyAmount() | currency:'PEN':'symbol' }}</p>
              </div>
              <i class="pi pi-calendar text-3xl text-primary-500"></i>
            </div>
          </p-card>

          <p-card class="shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Ingresos</p>
                <p class="text-2xl font-semibold text-emerald-600">{{ income() | currency:'PEN':'symbol' }}</p>
              </div>
              <i class="pi pi-arrow-down-left text-3xl text-emerald-500"></i>
            </div>
          </p-card>

          <p-card class="shadow-md">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Gastos</p>
                <p class="text-2xl font-semibold text-rose-600">{{ expenses() | currency:'PEN':'symbol' }}</p>
              </div>
              <i class="pi pi-arrow-up-right text-3xl text-rose-500"></i>
            </div>
          </p-card>
        </div>

        <p-divider type="solid" />

        <!-- Charts -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <p-card class="xl:col-span-2 shadow-md">
            <h2 class="text-lg font-medium text-gray-800 mb-4">Gastos por semana</h2>
            <p-chart type="bar" [data]="barData()" [options]="barOptions()" [height]="'300px'"></p-chart>
          </p-card>

          <p-card class="shadow-md">
            <h2 class="text-lg font-medium text-gray-800 mb-4">Distribución mensual</h2>
            <p-chart type="doughnut" [data]="doughnutData()" [options]="doughnutOptions()" [height]="'300px'"></p-chart>
          </p-card>
        </div>

        <!-- Últimos registros -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @if (records().length === 0) {
            <p-card class="shadow-md">
              <div class="text-center text-gray-500 py-10">Sin registros</div>
            </p-card>
          }
          @for (r of records(); track r; let i = $index) {
            <p-card class="shadow-md">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">{{ r.category }}</p>
                  <p class="text-xl font-semibold" [class.text-emerald-600]="r.type === 'Ingreso'" [class.text-rose-600]="r.type === 'Gasto'">
                    {{ (r.type === 'Ingreso' ? '+' : '-') }}{{ r.amount | currency:'PEN':'symbol' }}
                  </p>
                  <p class="text-xs text-gray-400">{{ r.date | date:'mediumDate' }}</p>
                </div>
                <i class="pi" [ngClass]="r.icon"></i>
              </div>
            </p-card>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private messageService = inject(MessageService);

  weeklyAmount = signal(350);
  monthlyAmount = signal(1450);
  income = signal(2200);
  expenses = signal(750);

  records = signal<Array<{ category: string; type: 'Ingreso' | 'Gasto'; amount: number; date: Date; icon: string }>>([
    { category: 'Salario', type: 'Ingreso', amount: 1200, date: new Date(2025, 8, 20), icon: 'pi-money-bill text-2xl text-emerald-500' },
    { category: 'Supermercado', type: 'Gasto', amount: 180, date: new Date(2025, 8, 18), icon: 'pi-shopping-cart text-2xl text-rose-500' },
    { category: 'Transporte', type: 'Gasto', amount: 60, date: new Date(2025, 8, 17), icon: 'pi-car text-2xl text-rose-500' }
  ]);

  userMenuItems: MenuItem[] = [
    { label: 'Perfil', icon: 'pi pi-id-card' },
    { label: 'Ajustes', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Ir a Login', icon: 'pi pi-sign-out', routerLink: '/login' }
  ];

  ngOnInit() {
    // Mostrar toast sin mutar datos ni opciones (evita re-render de charts)
    const date = '20/09/2025';
    queueMicrotask(() => {
      this.messageService.add({
        severity: 'success',
        summary: `Hola, keniding`,
        detail: `Gasto semanal: ${this.asCurrencyPEN(this.weeklyAmount())} | Gasto mensual: ${this.asCurrencyPEN(this.monthlyAmount())} · ${date}`,
        life: 4500
      });
    });
  }

  asCurrencyPEN(n: number) {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', currencyDisplay: 'symbol' }).format(n);
  }

  barData() {
    return {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Gastos',
          backgroundColor: '#43B02A22',
          borderColor: '#43B02A',
          borderWidth: 1,
          data: [50, 70, 65, 90, 110, 80, 45]
        }
      ]
    };
  }

  barOptions() {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#334155' } }
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } },
        y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' } }
      }
    };
  }

  doughnutData() {
    return {
      labels: ['Vivienda', 'Alimentos', 'Transporte', 'Ocio', 'Otros'],
      datasets: [
        {
          data: [35, 25, 15, 10, 15],
          backgroundColor: ['#43B02A', '#86efac', '#bbf7d0', '#22c55e', '#134e4a'],
          hoverBackgroundColor: ['#3aa126', '#6ee7b7', '#a7f3d0', '#16a34a', '#115e59']
        }
      ]
    };
  }

  doughnutOptions() {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#334155' } }
      }
    };
  }
}
