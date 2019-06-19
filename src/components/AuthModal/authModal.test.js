import React from 'react';
import { render, cleanup } from '@testing-library/react';
import AuthModal from './authModal';

afterEach(cleanup);

it('renders', () => {
  const { asFragment } = render(<AuthModal />);
  expect(asFragment()).toMatchSnapshot();
});