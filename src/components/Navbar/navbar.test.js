import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Navbar from './navbar';

afterEach(cleanup);

it('renders', () => {
  const { asFragment } = render(<Navbar />);
  expect(asFragment()).toMatchSnapshot();
});