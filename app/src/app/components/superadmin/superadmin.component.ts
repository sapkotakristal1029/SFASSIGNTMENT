import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.css'],
})
export class SuperAdminComponent implements OnInit {
  users: any[] = []; // To hold the list of users

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  promoteToGroupAdmin(userId: number): void {
    this.authService.promoteToGroupAdmin(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after promotion
    });
  }

  removeUser(userId: number): void {
    this.authService.removeUser(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after removal
    });
  }

  upgradeToSuperAdmin(userId: number): void {
    this.authService.upgradeToSuperAdmin(userId).subscribe(() => {
      this.loadUsers(); // Refresh user list after upgrade
    });
  }
}
