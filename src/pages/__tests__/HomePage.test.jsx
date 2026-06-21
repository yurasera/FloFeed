import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';

test('renders HomePage with hero and CTA', () => {
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
  const title = screen.getByRole('heading', { name: /flofeed/i });
  expect(title).toBeInTheDocument();

  const cta = screen.getByRole('link', { name: /give feedback/i });
  expect(cta).toBeInTheDocument();
  expect(cta).toHaveAttribute('href', '/feedback');
});
