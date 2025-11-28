import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SignupPage {
  username: string = '';
  email: string = '';
  password: string = '';
  
  focusedFields = {
    username: false,
    email: false,
    password: false
  };
  
  buttonFocused = {
    signup: false
  };
  
  errors = {
    username: '',
    email: '',
    password: '',
    general: ''
  };

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  validateForm(): boolean {
    let isValid = true;
    this.errors = { username: '', email: '', password: '', general: '' };

    if (!this.username) {
      this.errors.username = 'Username is required';
      isValid = false;
    } else if (this.username.length < 3) {
      this.errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!this.email) {
      this.errors.email = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!this.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    } else if (this.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async signUp() {
    if (this.validateForm()) {
      try {
        const existingUsers = await this.storageService.get('launderiaUsers') || [];
        const userExists = existingUsers.find((user: any) => 
          user.email === this.email || user.username === this.username
        );

        if (userExists) {
          this.errors.email = 'User with this email or username already exists';
          return;
        }

        const userData = {
          id: this.generateUserId(),
          username: this.username,
          email: this.email,
          password: this.password,
          createdAt: new Date().toISOString()
        };

        await this.storageService.pushToArray('launderiaUsers', userData);
        
        console.log('Signup successful:', this.username);
        
        this.username = '';
        this.email = '';
        this.password = '';
        this.focusedFields = { username: false, email: false, password: false };
        
        this.errors.general = 'Account created successfully! Redirecting to login...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
        
      } catch (error) {
        console.error('Signup error:', error);
        this.errors.general = 'An error occurred during signup. Please try again.';
      }
    }
  }

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  login() {
    this.router.navigate(['/login']);
  }

  onInputFocus(field: keyof typeof this.focusedFields) {
    this.focusedFields[field] = true;
  }

  onInputBlur(field: keyof typeof this.focusedFields) {
    this.focusedFields[field] = false;
  }

  onButtonFocus(button: keyof typeof this.buttonFocused) {
    this.buttonFocused[button] = true;
  }

  onButtonBlur(button: keyof typeof this.buttonFocused) {
    this.buttonFocused[button] = false;
  }

  shouldFloat(field: keyof typeof this.focusedFields): boolean {
    const value = this[field as keyof this] as string;
    return this.focusedFields[field] || !!value;
  }

  onUsernameChange() {
    if (this.username && this.username.length < 3) {
      this.errors.username = 'Username must be at least 3 characters';
    } else {
      this.errors.username = '';
    }
  }

  onEmailChange() {
    if (this.email && !this.isValidEmail(this.email)) {
      this.errors.email = 'Please enter a valid email address';
    } else {
      this.errors.email = '';
    }
  }

  onPasswordChange() {
    if (this.password && this.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters';
    } else {
      this.errors.password = '';
    }
  }
}