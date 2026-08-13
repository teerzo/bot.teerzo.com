import { useState, type FormEvent } from 'react';
import { createCommand } from '../api';

type CommandFormProps = {
  onCreated: () => Promise<void> | void;
  onError: (message: string | null) => void;
};

export function CommandForm({ onCreated, onError }: CommandFormProps) {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    onError(null);

    try {
      await createCommand(name, response);
      setName('');
      setResponse('');
      await onCreated();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to create command');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Add command</h2>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="discord"
            autoComplete="off"
            required
          />
        </label>
        <label>
          Response
          <input
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            placeholder="Join the Discord: …"
            required
          />
        </label>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Adding…' : 'Add command'}
        </button>
      </form>
    </section>
  );
}
