import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stringify } from '../utils/url';
import { toast } from 'react-toastify';

export const useTickets = (query: Record<string, any>) => {
  const q = stringify(query);
  return useQuery({
    queryKey: ['ticket', 'list', query],
    queryFn: () => fetch(`/api/tickets?${q}`).then((result) => result.json()),
  });
};

export const useTicket = (ticketId?: string) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () =>
      fetch(`/api/tickets/${ticketId}`).then((result) => result.json()),
    enabled: !!ticketId,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { description: string }) => {
      return fetch(`/api/tickets`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'post',
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (response) => {
      if (!response?.ok) {
        const body = await response.json();
        toast.error(body.message || 'Create fail');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast.success('Create success!');
    },
  });
};

export const useCompleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) =>
      fetch(`/api/tickets/${ticketId}/complete`, { method: 'put' }),
    onSuccess: async (response) => {
      if (!response?.ok) {
        const body = await response.json();
        toast.error(body.message || 'Update fail');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast.success('Update success!');
    },
  });
};

export const useIncompleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) =>
      fetch(`/api/tickets/${ticketId}/complete`, { method: 'delete' }),
    onSuccess: async (response) => {
      if (!response?.ok) {
        const body = await response.json();
        toast.error(body.message || 'Update fail');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast.success('Update success!');
    },
  });
};

export const useAssignUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      assignee,
    }: {
      ticketId: number;
      assignee: string;
    }) =>
      fetch(`/api/tickets/${ticketId}/assign/${assignee}`, {
        method: 'put',
      }),
    onSuccess: async (response) => {
      if (!response?.ok) {
        const body = await response.json();
        toast.error(body.message || 'Update fail');
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast.success('Update success!');
    },
    onError: () => {
      toast.error('Update fail!');
    },
  });
};

export const useUnassignUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: number) =>
      fetch(`/api/tickets/${ticketId}/unassign`, {
        method: 'put',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      toast.success('Update success!');
    },
    onError: () => {
      toast.error('Update fail!');
    },
  });
};
