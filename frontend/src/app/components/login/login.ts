import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

type Modo = 'login' | 'recuperar' | 'cambiar';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent implements OnInit {
  modo = signal<Modo>('login');
  email = signal('');
  password = signal('');
  nuevaPassword = signal('');
  confirmarPassword = signal('');
  cargando = signal(false);
  error = signal<string | null>(null);
  exito = signal<string | null>(null);
  token = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.token.set(token);
      this.modo.set('cambiar');
    }
    if (this.authService.estaAutenticado()) {
      this.router.navigate(['/certificar']);
    }
  }

  login(): void {
    if (!this.email() || !this.password()) return;

    this.cargando.set(true);
    this.error.set(null);

    this.authService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: () => {
        this.router.navigate(['/certificar']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al iniciar sesión');
        this.cargando.set(false);
      }
    });
  }

  recuperar(): void {
    if (!this.email()) return;

    this.cargando.set(true);
    this.error.set(null);

    this.authService.recuperarPassword(this.email()).subscribe({
      next: (res) => {
        this.exito.set(res.mensaje);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al recuperar contraseña');
        this.cargando.set(false);
      }
    });
  }

  cambiar(): void {
    if (!this.nuevaPassword() || !this.confirmarPassword()) return;

    if (this.nuevaPassword() !== this.confirmarPassword()) {
      this.error.set('Las contraseñas no coinciden');
      return;
    }

    if (this.nuevaPassword().length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.cambiarPassword(this.token()!, this.nuevaPassword()).subscribe({
      next: () => {
        this.exito.set('Contraseña actualizada. Redirigiendo al login...');
        this.cargando.set(false);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Error al cambiar contraseña');
        this.cargando.set(false);
      }
    });
  }
}
