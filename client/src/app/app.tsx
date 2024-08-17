import { Ticket, User } from '@acme/shared-models';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import styles from './app.module.css';
import TicketDetail from './pages/TicketDetail';
import TicketList from './pages/TicketList';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchTickets() {
      const data = await fetch('/api/tickets').then();
      setTickets(await data.json());
    }

    async function fetchUsers() {
      const data = await fetch('/api/users').then();
      setUsers(await data.json());
    }

    fetchTickets();
    fetchUsers();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <div className={styles['app']}>
          <h1>Ticketing App</h1>
          <Routes>
            <Route path="/" element={<TicketList />} />
            {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
            <Route path="/:id" element={<TicketDetail />} />
          </Routes>
        </div>
        <ToastContainer />
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
