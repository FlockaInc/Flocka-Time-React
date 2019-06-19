import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Main from './main';

afterEach(cleanup);

it('renders', () => {
  const { asFragment } = render(<Main />);
  expect(asFragment()).toMatchSnapshot();
});