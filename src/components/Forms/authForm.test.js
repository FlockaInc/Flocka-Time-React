import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AuthForm from './authForm';

afterAll(cleanup);

it('renders with sign in button', () => {
  const { getByTestId } = render(<AuthForm authType='signin' />);

  expect(getByTestId('submitBtn')).toHaveTextContent('Sign In');
});

it('renders with sign up button', () => {
  const { getByTestId } = render(<AuthForm authType='signup' />);

  expect(getByTestId('submitBtn').toHaveTextContent('Sign Up'));
});