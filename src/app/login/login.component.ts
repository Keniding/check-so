import { Component, inject, signal } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Password} from 'primeng/password';
import {Checkbox} from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Avatar } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    // PrimeNG
    Card, PrimeTemplate, InputText, Password, Checkbox, ButtonDirective,
    Message, Divider, Avatar, Ripple, Tooltip, InputGroup, InputGroupAddon
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <p-card class="w-full max-w-lg shadow-2xl border-0">
        <ng-template pTemplate="header">
          <div class="flex flex-col items-center gap-3 py-2">
            <p-avatar icon="pi pi-shield" shape="circle" size="large" class="!bg-primary-500 !text-white shadow-md"></p-avatar>
            <div class="text-center">
              <h2 class="text-2xl font-semibold text-gray-800">Bienvenido</h2>
              <p class="text-sm text-gray-500">Accede con tus credenciales</p>
            </div>
          </div>
        </ng-template>

        <div class="space-y-5">
          @if (error()) {
            <p-message severity="error" class="w-full">{{ error() }}</p-message>
          }

          <form class="space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="flex flex-col gap-2">
              <label for="username" class="font-medium text-gray-700">Usuario</label>

              <p-inputgroup>
                <p-inputgroup-addon class="!bg-gray-50"><i class="pi pi-user text-gray-500"></i></p-inputgroup-addon>
                <input
                  pInputText
                  id="username"
                  type="text"
                  formControlName="username"
                  placeholder="tu.usuario"
                  class="w-full"
                  autocomplete="username"
                />
              </p-inputgroup>

              @if (submitted() && form.controls.username.invalid) {
                <p-message severity="error">El usuario es requerido</p-message>
              }
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="font-medium text-gray-700">Contraseña</label>

              <p-inputgroup>
                <p-inputgroup-addon class="!bg-gray-50"><i class="pi pi-lock text-gray-500"></i></p-inputgroup-addon>
                <p-password
                  [toggleMask]="true"
                  [feedback]="false"
                  inputId="password"
                  formControlName="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  [inputStyle]="{ width: '100%' }"
                  [style]="{ width: '100%' }"
                ></p-password>
              </p-inputgroup>

              @if (submitted() && form.controls.password.invalid) {
                <p-message severity="error">La contraseña es requerida</p-message>
              }
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <p-checkbox inputId="remember" formControlName="remember"></p-checkbox>
                <label for="remember" class="text-sm">Recordarme</label>
              </div>

              <button
                pButton
                type="button"
                label="¿Olvidaste tu contraseña?"
                class="p-button-text p-button-sm text-primary-600 hover:underline"
                pRipple
                pTooltip="Recuperar contraseña"
                tooltipPosition="top"
              ></button>
            </div>

            <div class="grid grid-cols-1 gap-3 pt-2">
              <button
                pButton
                type="submit"
                label="Ingresar"
                icon="pi pi-sign-in"
                class="w-full p-button-rounded"
                [loading]="loading()"
                pRipple
              ></button>
            </div>

            <p-divider align="center" type="solid">
              <span class="text-xs text-gray-400">o</span>
            </p-divider>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                pButton
                type="button"
                label="Google"
                icon="pi pi-google"
                class="w-full p-button-outlined"
                pRipple
              ></button>
              <button
                pButton
                type="button"
                label="Microsoft"
                icon="pi pi-microsoft"
                class="w-full p-button-outlined"
                pRipple
              ></button>
            </div>
          </form>
        </div>

        <ng-template pTemplate="footer">
          <div class="text-center text-xs text-gray-400">
            <p>Protegido con autenticación segura</p>
          </div>
        </ng-template>
      </p-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    remember: [true]
  });

  private _submitted = signal(false);
  submitted = this._submitted.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  async onSubmit() {
    this._submitted.set(true);
    this._error.set(null);

    if (this.form.invalid) return;

    this._loading.set(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      this.router.navigateByUrl('/');
    } catch {
      this._error.set('No se pudo iniciar sesión. Inténtalo nuevamente.');
    } finally {
      this._loading.set(false);
    }
  }
}
