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
  regUsername: string = ''; // Registration Username
  regEmail: string = ''; // Registration Email
  regPassword: string = ''; // Registration Password
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        const user = response.user;

        // Store the authenticated user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.roles.includes('Super Admin')) {
          this.router.navigate(['/super-admin']);
        } else if (user.roles.includes('Group Admin')) {
          console.log('hi');
          this.router.navigate(['/group']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
      },
    });
  }

  onRegister() {
    const newUser = {
      username: this.regUsername,
      email: this.regEmail,
      password: this.regPassword,
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        alert('Registration successful. Please log in.');
        this.clearRegistrationForm();
      },
      error: (error) => {
        alert(error.message); // This will catch and show the custom error message from AuthService
        this.errorMessage = error.message;
      },
    });
  }

  clearRegistrationForm() {
    this.regUsername = '';
    this.regEmail = '';
    this.regPassword = '';
  }
}
