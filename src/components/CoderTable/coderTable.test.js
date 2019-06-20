import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CoderTable from './coderTable';

afterEach(cleanup);

it('renders', () => {
  const { asFragment } = render(<CoderTable />);
  expect(asFragment()).toMatchSnapshot();
});