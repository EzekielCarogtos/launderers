import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  usernameOrEmail: string = '';
  password: string = '';
  
  focusedFields = {
    usernameOrEmail: false,
    password: false
  };
  
  buttonFocused = {
    login: false
  };
  
  errors = {
    usernameOrEmail: '',
    password: '',
    general: ''
  };

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  // Clear form when page is initialized
  async ngOnInit() {
    await this.clearForm();
  }

  // Clear form when page becomes active
  async ionViewDidEnter() {
    await this.clearForm();
  }

  // Method to clear the form
  async clearForm() {
    this.usernameOrEmail = '';
    this.password = '';
    this.focusedFields = {
      usernameOrEmail: false,
      password: false
    };
    this.errors = {
      usernameOrEmail: '',
      password: '',
      general: ''
    };
    console.log('Login form cleared');
  }

  validateForm(): boolean {
    let isValid = true;
    this.errors = { usernameOrEmail: '', password: '', general: '' };

    if (!this.usernameOrEmail) {
      this.errors.usernameOrEmail = 'Username or email is required';
      isValid = false;
    }

    if (!this.password) {
      this.errors.password = 'Password is required';
      isValid = false;
    }

    return isValid;
  }

  async login() {
    if (this.validateForm()) {
      try {
        const users = await this.storageService.get('launderiaUsers') || [];
        const user = users.find((u: any) => 
          u.username === this.usernameOrEmail || u.email === this.usernameOrEmail
        );

        if (user && user.password === this.password) {
          // Create user session
          const userSession = {
            id: user.id,
            username: user.username,
            email: user.email,
            loggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          console.log('Login - Saving user session:', userSession);
          await this.storageService.set('currentUser', userSession);
          
          // Verify the session was saved
          const savedSession = await this.storageService.get('currentUser');
          console.log('Login - Saved session verified:', savedSession);

          console.log('Login successful:', user.username);
          this.router.navigate(['/home']);
        } else {
          this.errors.general = 'Invalid username/email or password';
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errors.general = 'An error occurred during login. Please try again.';
      }
    }
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

  forgotPassword() {
    console.log('Forgot password clicked');
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

  onUsernameOrEmailChange() {
    if (this.usernameOrEmail) {
      this.errors.usernameOrEmail = '';
    }
  }

  onPasswordChange() {
    if (this.password) {
      this.errors.password = '';
    }
  }
}