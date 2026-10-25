import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

// Fetch all snippets with optional filters
export const useSnippets = (filters = {}) => {
  return useQuery({
    queryKey: ['snippets', filters],
    queryFn: async () => {
      const res = await api.get('/snippets', { params: filters });
      return res.data.snippets;
    },
  });
};

// Fetch a single snippet by ID
export const useSnippet = (id) => {
  const numericId = id ? Number(id) : null;
  return useQuery({
    queryKey: ['snippet', numericId],
    queryFn: async () => {
      const res = await api.get(`/snippets/${numericId}`);
      return res.data.snippet;
    },
    enabled: !!numericId,
  });
};

// Fetch available languages and tags for active user
export const useLanguagesAndTags = () => {
  return useQuery({
    queryKey: ['meta-languages-tags'],
    queryFn: async () => {
      const res = await api.get('/snippets/meta/languages-and-tags');
      return res.data;
    },
  });
};

// Fetch snippet revision history from MongoDB (Module 3)
export const useSnippetRevisions = (snippetId) => {
  const numericId = snippetId ? Number(snippetId) : null;
  return useQuery({
    queryKey: ['snippet-revisions', numericId],
    queryFn: async () => {
      const res = await api.get(`/snippets/${numericId}/revisions`);
      return res.data.revisions;
    },
    enabled: !!numericId,
  });
};

// Mutation: Create a snippet
export const useCreateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snippetData) => {
      const res = await api.post('/snippets', snippetData);
      return res.data.snippet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['meta-languages-tags'] });
    },
  });
};

// Mutation: Update an existing snippet
export const useUpdateSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...snippetData }) => {
      const numericId = Number(id);
      const res = await api.put(`/snippets/${numericId}`, snippetData);
      return res.data.snippet;
    },
    onSuccess: (data, variables) => {
      const numericId = Number(variables.id);
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['snippet', numericId] });
      queryClient.invalidateQueries({ queryKey: ['snippet-revisions', numericId] });
      queryClient.invalidateQueries({ queryKey: ['meta-languages-tags'] });
    },
  });
};

// Mutation: Delete a snippet
export const useDeleteSnippet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const numericId = Number(id);
      const res = await api.delete(`/snippets/${numericId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['meta-languages-tags'] });
    },
  });
};

// Mutation: Toggle favorite status
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const numericId = Number(id);
      const res = await api.patch(`/snippets/${numericId}/favorite`);
      return res.data.snippet;
    },
    onSuccess: (data, id) => {
      const numericId = Number(id);
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      queryClient.invalidateQueries({ queryKey: ['snippet', numericId] });
    },
  });
};
