import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import axios from '../axios';
import SignInForm from '../Components/SiginForm';
import userReducer from '../state/reducers';
import { store } from '../state';

jest.mock('../axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

type RootState = ReturnType<typeof store.getState>;

describe('SignInForm', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <SignInForm />
        </MemoryRouter>
      </Provider>
    );
  };

  const fillForm = (email: string, password: string) => {
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: email } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: password } });
  };

  const submitForm = () => fireEvent.click(screen.getByTestId('button-sigin'));

  test('renders the sign in form', () => {
    renderComponent();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId('button-sigin')).toBeInTheDocument();
    expect(screen.getByText(/need an account/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderComponent();
    submitForm();
    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    const mockResponse = {
      data: {
        userData: { id: 1, email: 'test@example.com' },
        expirationDate: '2023-12-31',
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    renderComponent();
    fillForm('test@example.com', 'password123');
    submitForm();
    
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/auth/signin', {
        params: { email: 'test@example.com', password: 'password123' },
      });
    });

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'token_expires_at',
        mockResponse.data.expirationDate
      );
    });
    const state = store.getState() as any;
    expect(state?.user.user).toEqual(mockResponse.data.userData);
  });

  test('shows server error for invalid credentials', async () => {
    const errorResponse = {
      response: {
        data: { msg: 'Invalid email or password' },
        status: 401,
      },
    };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    
    renderComponent();
    fillForm('test@example.com', 'wrongpassword');
    submitForm();
    
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  test('shows email error when server responds with email error', async () => {
    const errorResponse = {
      response: {
        data: { msg: 'Email not found' },
        status: 404,
      },
    };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    
    renderComponent();
    fillForm('nonexistent@example.com', 'password123');
    submitForm();
    
    expect(await screen.findByText(/email not found/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveClass('border-red-500');
  });

  test('shows password error when server responds with password error', async () => {
    const errorResponse = {
      response: {
        data: { msg: 'Incorrect password' },
        status: 401,
      },
    };
    mockedAxios.get.mockRejectedValueOnce(errorResponse);
    
    renderComponent();
    fillForm('test@example.com', 'wrongpassword');
    submitForm();
    
    expect(await screen.findByText(/incorrect password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toHaveClass('border-red-500');
  });

  test('disables submit button during form submission', async () => {
    const mockResponse = {
      data: {
        userData: { id: 1, email: 'test@example.com' },
        expirationDate: '2023-12-31',
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);
    
    renderComponent();
    fillForm('test@example.com', 'password123');
    submitForm();
    
    const button = screen.getByTestId('button-sigin');
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});