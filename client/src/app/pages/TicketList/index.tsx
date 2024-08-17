import { Ticket } from '@acme/shared-models';
import {
  Badge,
  Button,
  Center,
  Container,
  Flex,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../../apis/tickets';
import AddTicketModal from '../components/Modal/AddTicketModa';

const TicketList = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [status, setStatus] = useState<string>('');
  const handleStatusChange = (value: string | null) => {
    if (value === 'Completed') {
      setStatus('completed');
      return;
    }
    if (value === 'Incomplete') {
      setStatus('incomplete');
      return;
    }
    setStatus('');
  };

  const { data, isLoading } = useTickets({ status });
  const tickets: Ticket[] = data || [];
  return (
    <Container size="sm">
      <Paper shadow="md" p="xl">
        <Flex justify="space-between">
          <Title order={2}>Tickets list</Title>
          <Button onClick={open} size="xs">
            Add ticket
          </Button>
        </Flex>
        <Flex mt={20} justify="space-between">
          <Select
            defaultValue={'All'}
            data={['All', 'Completed', 'Incomplete']}
            onChange={handleStatusChange}
          />
        </Flex>

        {isLoading && (
          <Center>
            <Loader color="blue" />
          </Center>
        )}

        {!isLoading && !tickets?.length && <Text>No tickets available</Text>}

        {tickets?.length > 0 && (
          <Stack gap="md" mt={20}>
            {tickets.map((item) => (
              <Flex
                style={{ border: '1px solid #f1f3f5', cursor: 'pointer' }}
                p={16}
                align={'center'}
                justify={'space-between'}
                onClick={() => navigate(`/${item.id}`)}
                key={item.id}
              >
                <Text>{item.description}</Text>
                <Badge color={item?.completed ? 'blue' : 'orange'}>
                  {item?.completed ? 'Completed' : 'Incomplete'}
                </Badge>
              </Flex>
            ))}
          </Stack>
        )}
      </Paper>

      <AddTicketModal opened={opened} onClose={close} />
    </Container>
  );
};

export default TicketList;
