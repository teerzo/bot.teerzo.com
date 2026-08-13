import type { BotStatus, Command, CommandsResponse, HealthResponse } from './types';

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

type ErrorBody = {
  error?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = (await res.json().catch(() => ({}))) as T & ErrorBody;
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export function getHealth() {
  return request<HealthResponse>('/health');
}

export function getStatus() {
  return request<BotStatus>('/api/status');
}

export function getCommands() {
  return request<CommandsResponse>('/api/commands');
}

export function createCommand(name: string, response: string) {
  return request<Command>('/api/commands', {
    method: 'POST',
    body: JSON.stringify({ name, response }),
  });
}

export function updateCommand(name: string, response: string) {
  return request<Command>(`/api/commands/${encodeURIComponent(name)}`, {
    method: 'PATCH',
    body: JSON.stringify({ response }),
  });
}

export function deleteCommand(name: string) {
  return request<void>(`/api/commands/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  });
}
