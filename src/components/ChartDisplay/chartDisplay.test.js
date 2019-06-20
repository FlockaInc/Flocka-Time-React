import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ChartDisplay from './chartDisplay';

afterEach(cleanup);

it('renders', () => {
  const { asFragment } = render(<ChartDisplay />);
  expect(asFragment()).toMatchSnapshot();
});