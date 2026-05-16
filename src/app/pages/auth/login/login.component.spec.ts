import { LoginComponent } from './login.component';
import { FormBuilder, Validators } from '@angular/forms';
import { of, throwError, Observable } from 'rxjs';

/**
 * Isolated Unit Test for LoginComponent
 * This test file tests the component class directly without relying on 
 * Angular's TestBed dependencies.
 */
describe('LoginComponent Isolated Unit Test', () => {
  let component: LoginComponent;
  let formBuilder: FormBuilder;
  let mockAuthService: any;
  let mockRouter: any;
  let mockRoute: any;
  let mockSnackBar: any;

  beforeEach(() => {
    // 1. Setup isolated mocks using Jest
    formBuilder = new FormBuilder();
    
    mockAuthService = {
      login: jest.fn(),
      isAuthenticated: jest.fn().mockReturnValue(false),
      getUserRole: jest.fn()
    };
    
    mockRouter = {
      navigateByUrl: jest.fn().mockResolvedValue(true)
    };
    
    mockRoute = {
      snapshot: { queryParams: {} }
    };
    
    mockSnackBar = {
      open: jest.fn()
    };

    // 2. Instantiate the component directly, passing in the mocks
    component = new LoginComponent(
      formBuilder,
      mockAuthService,
      mockRouter,
      mockRoute,
      mockSnackBar
    );

    // 3. Initialize the form manually with validators
    component.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should not call authService.login if form is invalid', () => {
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid and submitted', () => {
    // Fill the form
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Mock the backend response
    const mockResponse = { user: { role: 'CANDIDATE' } };
    mockAuthService.login.mockReturnValue(of(mockResponse));

    // Submit
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('should show error snackbar on login failure', () => {
    // Fill the form
    component.loginForm.patchValue({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });

    // Mock a failure response
    const errorResponse = { userMessage: 'Invalid credentials' };
    mockAuthService.login.mockReturnValue({
      subscribe: (handlers: any) => {
        handlers.error(errorResponse);
        return { unsubscribe: () => {} };
      }
    });

    // Submit
    component.onSubmit();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Invalid credentials',
      'Close',
      expect.any(Object)
    );
    expect(component.isLoading).toBe(false);
  });
});