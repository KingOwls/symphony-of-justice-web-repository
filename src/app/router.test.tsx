import { render, screen } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from './router';

test('renders home and world routes', async () => {
  window.location.hash = '#/';
  const { unmount } = render(<RouterProvider router={createAppRouter()} />);
  expect(await screen.findByRole('heading', {name:/Symphony of Justice/i})).toBeInTheDocument();
  unmount();
  window.location.hash = '#/world';
  render(<RouterProvider router={createAppRouter()} />);
  expect(await screen.findByRole('heading', {name:/The World/i})).toBeInTheDocument();
});

test('unknown route shows branded not found', async () => {
  window.location.hash = '#/unknown';
  render(<RouterProvider router={createAppRouter()} />);
  expect(await screen.findByText(/Record Not Found/i)).toBeInTheDocument();
});
