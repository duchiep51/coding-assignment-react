import { render, screen } from '@testing-library/react';

import TicketList from './index';
import { Ticket } from '@acme/shared-models';

const dummyTickets: Ticket[] = [
  {
    id: 1,
    description: 'Install a monitor arm',
    assigneeId: 1,
    completed: false,
  },
  {
    id: 2,
    description: 'Move the desk to the new location',
    assigneeId: 1,
    completed: false,
  },
  {
    id: 3,
    description: '23123',
    assigneeId: 1,
    completed: false,
  },
  {
    id: 4,
    description: '123',
    assigneeId: null,
    completed: false,
  },
  {
    id: 5,
    description: '123',
    assigneeId: null,
    completed: false,
  },
  {
    id: 6,
    description: '124124',
    assigneeId: null,
    completed: false,
  },
];

describe('Tickets list title', () => {
  it('should render successfully', () => {
    render(<TicketList />);
    const input = screen.getByText('Tickets list');
    expect(input).toBeVisible();
  });
});
