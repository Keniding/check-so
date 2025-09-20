import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Avatar } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    Card, InputText, Password, Checkbox, ButtonDirective,
    Message, Divider, Avatar, Ripple, InputGroup, InputGroupAddon, RouterLink
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <p-card class="w-full max-w-6xl shadow-2xl border-0 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 auto-rows-auto">
          <!-- Columna Izquierda: Imagen (invertida respecto a login) -->
          <div class="relative h-56 md:h-auto order-1 md:order-none">
            <div class="m-6 md:m-8 rounded-2xl overflow-hidden ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600&auto=format&fit=crop"
                alt="Personas felices planificando finanzas"
                class="h-48 md:h-[26rem] lg:h-[28rem] xl:h-[30rem] w-full object-cover"
              />
              <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8 mx-4 my-2">
                <div class="flex items-center gap-3 mb-3">
                  <i class="pi pi-chart-line text-lg md:text-xl text-black"></i>
                  <h3 class="text-xl md:text-2xl font-semibold text-black">Crea tu cuenta</h3>
                </div>
                <p class="text-sm md:text-base text-black/90">
                  Regístrate y gestiona tu dinero con tranquilidad.
                </p>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Formulario de Registro -->
          <div class="p-6 md:p-8 flex flex-col">
            <div class="flex items-center gap-3 mb-4">
              <p-avatar icon="pi pi-user-plus" shape="circle" size="large" class="!bg-primary-500 !text-white shadow-md"></p-avatar>
              <div>
                <h2 class="text-2xl font-semibold text-gray-800">Regístrate</h2>
                <p class="text-sm text-gray-500">Crea tu cuenta en minutos</p>
              </div>
            </div>

            @if (error()) {
              <p-message severity="error" class="w-full mb-4">{{ error() }}</p-message>
            }

            <form class="space-y-4 flex-1" [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 gap-4">
                <!-- Nombre -->
                <div class="flex flex-col gap-2">
                  <label for="name" class="font-medium text-gray-700">Nombre</label>
                  <p-inputgroup>
                    <p-inputgroup-addon class="!bg-gray-50"><i class="pi pi-id-card text-gray-500"></i></p-inputgroup-addon>
                    <input
                      pInputText
                      id="name"
                      type="text"
                      formControlName="name"
                      placeholder="Tu nombre"
                      class="w-full"
                      autocomplete="name"
                    />
                  </p-inputgroup>
                  @if (submitted() && form.controls.name.invalid) {
                    <p-message severity="error">El nombre es requerido</p-message>
                  }
                </div>

                <!-- Usuario -->
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

                <!-- Email -->
                <div class="flex flex-col gap-2">
                  <label for="email" class="font-medium text-gray-700">Email</label>
                  <p-inputgroup>
                    <p-inputgroup-addon class="!bg-gray-50"><i class="pi pi-envelope text-gray-500"></i></p-inputgroup-addon>
                    <input
                      pInputText
                      id="email"
                      type="email"
                      formControlName="email"
                      placeholder="tu@email.com"
                      class="w-full"
                      autocomplete="email"
                    />
                  </p-inputgroup>
                  @if (submitted() && form.controls.email.invalid) {
                    <p-message severity="error">Email inválido</p-message>
                  }
                </div>

                <!-- Password -->
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
                      autocomplete="new-password"
                      [inputStyle]="{ width: '100%' }"
                      [style]="{ width: '100%' }"
                    ></p-password>
                  </p-inputgroup>
                  @if (submitted() && form.controls.password.invalid) {
                    <p-message severity="error">La contraseña es requerida</p-message>
                  }
                </div>

                <!-- Confirmación Password -->
                <div class="flex flex-col gap-2">
                  <label for="confirm" class="font-medium text-gray-700">Confirmar contraseña</label>
                  <p-inputgroup>
                    <p-inputgroup-addon class="!bg-gray-50"><i class="pi pi-lock-open text-gray-500"></i></p-inputgroup-addon>
                    <p-password
                      [toggleMask]="true"
                      [feedback]="false"
                      inputId="confirm"
                      formControlName="confirm"
                      placeholder="••••••••"
                      autocomplete="new-password"
                      [inputStyle]="{ width: '100%' }"
                      [style]="{ width: '100%' }"
                    ></p-password>
                  </p-inputgroup>
                  @if (submitted() && form.controls.confirm.invalid) {
                    <p-message severity="error">Confirma tu contraseña</p-message>
                  }
                  @if (submitted() && form.errors?.['passwordMismatch']) {
                    <p-message severity="error">Las contraseñas no coinciden</p-message>
                  }
                </div>

                <!-- Términos -->
                <div class="flex items-start gap-2">
                  <p-checkbox inputId="terms" formControlName="terms"></p-checkbox>
                  <label for="terms" class="text-sm">Acepto los términos y condiciones</label>
                </div>

                <!-- Botón principal -->
                <div class="grid grid-cols-1 gap-3 pt-2">
                  <button
                    pButton
                    type="submit"
                    label="Crear cuenta"
                    icon="pi pi-user-plus"
                    class="w-full p-button-rounded"
                    [loading]="loading()"
                    pRipple
                  ></button>
                  <button
                    pButton
                    type="button"
                    label="¿Ya tienes cuenta? Inicia sesión"
                    class="w-full p-button-text"
                    routerLink="/login"
                    pRipple
                  ></button>
                </div>
              </div>

              <p-divider align="center" type="solid" class="!my-4">
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
        </div>
      </p-card>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group(
    {
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    },
    { validators: [passwordsMatchValidator] }
  );

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
      this.router.navigateByUrl('/login');
    } catch {
      this._error.set('No se pudo completar el registro. Inténtalo nuevamente.');
    } finally {
      this._loading.set(false);
    }
  }
}

function passwordsMatchValidator(group: any) {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pass && confirm && pass === confirm ? null : { passwordMismatch: true };
}
