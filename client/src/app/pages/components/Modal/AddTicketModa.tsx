import { Button, Flex, Modal, ModalProps, Text, Textarea } from '@mantine/core';
import { useCreateTicket } from '../../../apis/tickets';
import { useState } from 'react';

type Props = ModalProps;

const AddTicketModal: React.FC<Props> = (props) => {
  const [description, setDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();

  const { mutate, isPending } = useCreateTicket();

  const handleCreateTicket = () => {
    if (description === '') {
      setDescriptionError('Please input description');
      return;
    }

    mutate(
      { description },
      {
        onSuccess: () => {
          setDescriptionError(undefined);
          setDescription('');
          props.onClose();
        },
      }
    );
  };

  return (
    <Modal title="Add ticket" centered {...props}>
      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
      />
      {descriptionError && <Text c="red">{descriptionError}</Text>}
      <Flex mt={20} justify="flex-end">
        <Button size="sm" loading={isPending} onClick={handleCreateTicket}>
          Create
        </Button>
      </Flex>
    </Modal>
  );
};

export default AddTicketModal;
