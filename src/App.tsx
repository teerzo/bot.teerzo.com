import { useCallback, useEffect, useState } from 'react';
import { getCommands, getStatus } from './api';
import { CommandForm } from './components/CommandForm';
import { CommandList } from './components/CommandList';
import { StatusCard } from './components/StatusCard';
import type { BotStatus, Command } from './types';

export default function App() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [nextStatus, nextCommands] = await Promise.all([getStatus(), getCommands()]);
      setStatus(nextStatus);
      setCommands(nextCommands.commands);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bot data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">bot.teerzo.com</p>
        <h1>teerzobot</h1>
        <p className="muted">Status and custom chat commands for the Twitch bot.</p>
      </header>

      {error ? <p className="banner">{error}</p> : null}

      <StatusCard status={status} loading={loading} onRefresh={() => void refresh()} />
      <CommandForm onCreated={refresh} onError={setError} />
      <CommandList commands={commands} onChanged={refresh} onError={setError} />
    </main>
  );
}
