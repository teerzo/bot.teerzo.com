import type { BotStatus } from '../types';

type StatusCardProps = {
  status: BotStatus | null;
  loading: boolean;
  onRefresh: () => void;
};

export function StatusCard({ status, loading, onRefresh }: StatusCardProps) {
  const connected = status?.connected ?? false;

  return (
    <section className="card">
      <div className="card-header">
        <h2>Status</h2>
        <button type="button" className="btn btn-ghost" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {status ? (
        <dl className="status-grid">
          <div>
            <dt>Connection</dt>
            <dd>
              <span className={`badge ${connected ? 'badge-ok' : 'badge-off'}`}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </dd>
          </div>
          <div>
            <dt>Channel</dt>
            <dd>#{status.channel}</dd>
          </div>
          <div>
            <dt>Bot user id</dt>
            <dd>{status.botUserId ?? '—'}</dd>
          </div>
        </dl>
      ) : (
        <p className="muted">{loading ? 'Loading status…' : 'Status unavailable.'}</p>
      )}
    </section>
  );
}
