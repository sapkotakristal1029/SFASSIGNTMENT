// login.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        const user = response.user;
        if (user.roles.includes('Super Admin')) {
          this.router.navigate(['/super-admin']);
        } else if (user.roles.includes('Group Admin')) {
          this.router.navigate(['/group']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
