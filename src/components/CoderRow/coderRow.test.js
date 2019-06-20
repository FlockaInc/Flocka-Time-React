import React from 'react';
import { render, cleanup } from '@testing-library/react';
import CoderRow from './coderRow';

afterEach(cleanup);

it('renders', () => {
  let table = document.createElement('table');
  let tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const { asFragment, container } = render(<CoderRow rank={2} username={'test'} total={6.9} dailyAvg={1.2} currentUser={'test@test.com'} />, {
    container: document.body.appendChild(table)
  });

  expect(asFragment()).toMatchSnapshot();
});