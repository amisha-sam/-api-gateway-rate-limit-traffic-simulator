import React from 'react';
import {
  Activity,
  WifiOff,
  Clock,
  Gauge,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { useLiveTelemetry } from '../hooks/useLiveTelemetry';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const LiveTelemetryPage: React.FC = () => {
  const { telemetry, status, reconnect } = useLiveTelemetry(
    'ws://localhost:8080/api/telemetry/ws'
  );

  const isConnected = status === 'CONNECTED';

  const telemetryCards = [
    {
      title: 'Current Latency',
      value: telemetry ? `${telemetry.latencyMs || 0} ms` : 'Waiting...',
      icon: Clock,
    },
    {
      title: 'P95 Latency',
      value: telemetry ? `${telemetry.p95LatencyMs || 0} ms` : 'Waiting...',
      icon: Gauge,
    },
    {
      title: 'P99 Latency',
      value: telemetry ? `${telemetry.p99LatencyMs || 0} ms` : 'Waiting...',
      icon: Gauge,
    },
    {
      title: 'Throughput',
      value: telemetry ? `${telemetry.throughputRps || 0} RPS` : 'Waiting...',
      icon: Activity,
    },
    {
      title: 'CPU Usage',
      value: telemetry ? `${telemetry.cpuUsagePercent || 0}%` : 'Waiting...',
      icon: Cpu,
    },
    {
      title: 'Memory Usage',
      value: telemetry ? `${telemetry.memoryUsagePercent || 0}%` : 'Waiting...',
      icon: HardDrive,
    },
    {
      title: 'Error Rate',
      value: telemetry ? `${telemetry.errorRatePercent || 0}%` : 'Waiting...',
      icon: AlertTriangle,
    },
    {
      title: 'Successful Requests',
      value: telemetry ? (telemetry.successfulRequests ?? 0).toLocaleString() : 'Waiting...',
      icon: CheckCircle2,
    },
    {
      title: 'Failed Requests',
      value: telemetry ? (telemetry.failedRequests ?? 0).toLocaleString() : 'Waiting...',
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Live Telemetry</h1>
            <Badge variant={isConnected ? 'emerald' : 'amber'}>
              {isConnected ? 'Stream Connected' : status}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time streaming socket feed from ws://localhost:8080/api/telemetry/ws
          </p>
        </div>

        <button
          onClick={reconnect}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reconnect WebSocket
        </button>
      </div>

      {/* Connection Banner if Disconnected */}
      {!isConnected && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-xs font-bold">Waiting for Live Socket Connection</h3>
              <p className="text-[11px] text-amber-300 mt-0.5">
                Socket status: <strong>{status}</strong>. Ensure backend WebSocket server is running.
              </p>
            </div>
          </div>
          <button
            onClick={reconnect}
            className="px-3 py-1 text-xs font-medium bg-amber-500/20 text-amber-200 rounded-lg shrink-0"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{card.title}</span>
                <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {!isConnected || !telemetry ? (
                <div className="py-1">
                  <span className="text-xs font-medium text-zinc-500">
                    Connecting...
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-2xl font-bold text-zinc-100 tracking-tight">
                    {card.value}
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {!isConnected && (
        <EmptyState
          type="waiting_for_backend"
          title="Live Connection Offline"
          description="Streaming live telemetry requires WebSocket server connection at ws://localhost:8080/api/telemetry/ws."
          onRetry={reconnect}
        />
      )}
    </div>
  );
};
