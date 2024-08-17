import { Ticket, User } from '@acme/shared-models';
import {
  Badge,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Loader,
  Paper,
  Select,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAssignUser,
  useCompleteTicket,
  useIncompleteTicket,
  useTicket,
  useUnassignUser,
} from '../../apis/tickets';
import { useUsers } from '../../apis/users';

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id: ticketId } = useParams();

  const [description, setDescription] = useState('');

  const { data: ticketData, isLoading } = useTicket(ticketId);
  const ticket: Ticket | undefined = ticketData?.error ? undefined : ticketData;

  const { data: userData } = useUsers();
  const users: User[] = userData ?? [];
  const userOptions = users.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }));

  const { mutate: completeTicket, isPending: isCompleting } =
    useCompleteTicket();

  const { mutate: incompleteTicket, isPending: isIncompleting } =
    useIncompleteTicket();

  const { mutate: assignUser, isPending: isAssigning } = useAssignUser();

  const { mutate: unassignUser, isPending: isUnassigning } = useUnassignUser();

  const handleCompleteTicket = () => {
    if (!ticket) return;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return ticket?.completed
      ? incompleteTicket(ticket?.id)
      : completeTicket(ticket?.id);
  };

  useEffect(() => {
    if (!ticket) return;
    setDescription(ticket.description);
  }, [ticket]);

  const [value, setValue] = useState<string | undefined>();

  const handleAssigneeChange = (value?: string) => {
    if (!ticket) return;
    if (value) {
      assignUser({ ticketId: ticket?.id, assignee: value });
    } else {
      unassignUser(ticket.id);
    }
  };

  useEffect(() => {
    handleAssigneeChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (!ticket) return;
    setValue(ticket.assigneeId?.toString());
  }, [ticket]);

  // console.log('ticket', ticket);
  // console.log('ticket?.assigneeId?.toString()', ticket?.assigneeId?.toString());
  console.log('value', value);

  return (
    <Container size="sm">
      <Paper shadow="md" p="xl">
        <Flex justify="space-between">
          <Flex gap={8} align="center">
            <Text
              style={{ cursor: 'pointer' }}
              c="blue"
              onClick={() => navigate('/')}
            >{`< Back`}</Text>
            <Title order={2}>Ticket detail</Title>
          </Flex>
          {ticket && (
            <Badge color={ticket?.completed ? 'blue' : 'orange'}>
              {ticket?.completed ? 'Completed' : 'Incomplete'}
            </Badge>
          )}
        </Flex>

        {isLoading && (
          <Center>
            <Loader color="blue" />
          </Center>
        )}

        {!isLoading && !ticket && <Text>Ticket not found</Text>}

        {ticket && (
          <>
            <Grid grow>
              <Grid.Col span={8}>
                <Textarea
                  disabled
                  label="Description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Select
                  label="Assignee"
                  placeholder="Pick value"
                  data={userOptions}
                  // value={ticket?.assigneeId?.toString()}
                  // onChange={handleAssigneeChange}
                  value={value}
                  onChange={(value) => setValue(value ?? undefined)}
                  disabled={isAssigning || isUnassigning}
                />
              </Grid.Col>
            </Grid>
            {
              <Flex mt={20} justify={'flex-end'}>
                <Button
                  size="xs"
                  onClick={() => handleCompleteTicket()}
                  loading={isCompleting || isIncompleting}
                  color={'green'}
                >
                  {ticket?.completed ? 'Incomplete' : 'Complete'}
                </Button>
              </Flex>
            }
          </>
        )}
      </Paper>
    </Container>
  );
};

export default TicketDetail;
