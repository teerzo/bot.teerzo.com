import { useState } from 'react';
import { deleteCommand, updateCommand } from '../api';
import type { Command } from '../types';

type CommandListProps = {
  commands: Command[];
  onChanged: () => Promise<void> | void;
  onError: (message: string | null) => void;
};

export function CommandList({ commands, onChanged, onError }: CommandListProps) {
  const [editingName, setEditingName] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [busyName, setBusyName] = useState<string | null>(null);

  function startEdit(command: Command) {
    setEditingName(command.name);
    setDraft(command.response);
    onError(null);
  }

  function cancelEdit() {
    setEditingName(null);
    setDraft('');
  }

  async function saveEdit(name: string) {
    setBusyName(name);
    onError(null);

    try {
      await updateCommand(name, draft);
      cancelEdit();
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update command');
    } finally {
      setBusyName(null);
    }
  }

  async function remove(name: string) {
    if (!window.confirm(`Delete !${name}?`)) {
      return;
    }

    setBusyName(name);
    onError(null);

    try {
      await deleteCommand(name);
      if (editingName === name) {
        cancelEdit();
      }
      await onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to delete command');
    } finally {
      setBusyName(null);
    }
  }

  return (
    <section className="card">
      <div className="card-header">
        <h2>Commands</h2>
        <span className="muted">{commands.length} total</span>
      </div>

      {commands.length === 0 ? (
        <p className="muted">No commands yet.</p>
      ) : (
        <ul className="command-list">
          {commands.map((command) => {
            const editing = editingName === command.name;
            const busy = busyName === command.name;

            return (
              <li key={command.name} className="command-row">
                <div className="command-meta">
                  <code>!{command.name}</code>
                  {command.builtin ? <span className="badge badge-muted">Built-in</span> : null}
                </div>

                {editing ? (
                  <div className="command-edit">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      disabled={busy}
                    />
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => saveEdit(command.name)}
                        disabled={busy || !draft.trim()}
                      >
                        Save
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={cancelEdit} disabled={busy}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="command-response">{command.response}</p>
                    {!command.builtin ? (
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => startEdit(command)}
                          disabled={busy}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => remove(command.name)}
                          disabled={busy}
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
