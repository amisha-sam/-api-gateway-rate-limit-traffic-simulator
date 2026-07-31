import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Brain, RefreshCw, Cpu, ShieldCheck, ArrowRight, CheckCircle2, Download, Plus, Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { recommendationsApi } from '../api/recommendations';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/SkeletonLoader';
import { SearchInput } from '../components/common/SearchInput';
import { Table } from '../components/common/Table';
import { GatewayExporterModal } from '../components/gateway/GatewayExporterModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import type { Recommendation, ComparisonHistory } from '../types';

export const RecommendationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [exportRec, setExportRec] = useState<Recommendation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const {
    data: recommendations,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.getRecommendations,
    retry: 1,
  });

  const { data: comparisonHistory } = useQuery({
    queryKey: ['comparison-history'],
    queryFn: recommendationsApi.getComparisonHistory,
  });

  const generateDemoMutation = useMutation({
    mutationFn: recommendationsApi.generateDemoRecommendation,
    onSuccess: () => {
      toast.success('Generated test rate limit recommendation!');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });

  const applyMutation = useMutation({
    mutationFn: (id: string) => recommendationsApi.applyRecommendation(id),
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || 'Applied recommendation policy to API Gateway Sandbox');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['comparison-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    },
    onError: () => {
      toast.error('Failed to apply recommendation policy.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recommendationsApi.deleteRecommendation(id),
    onSuccess: () => {
      toast.success('Recommendation deleted');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      setDeleteId(null);
    },
    onError: () => {
      toast.error('Failed to delete recommendation');
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: recommendationsApi.deleteAllRecommendations,
    onSuccess: () => {
      toast.success('All recommendations cleared');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      setIsClearAllOpen(false);
    },
    onError: () => {
      toast.error('Failed to clear recommendations');
    },
  });

  const reRunMutation = useMutation({
    mutationFn: (id: string) => recommendationsApi.reRunRecommendation(id),
    onSuccess: () => {
      toast.success('Re-evaluated recommendation using Python AI Service!');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
    onError: () => {
      toast.error('Failed to re-run AI inference');
    },
  });

  const filtered = (recommendations || []).filter(
    (r: Recommendation) =>
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.modelVersion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">AI Rate Limit Recommendations</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Token bucket policy recommendations computed from your executed traffic simulations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {recommendations && recommendations.length > 0 && (
            <button
              onClick={() => setIsClearAllOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={() => generateDemoMutation.mutate()}
            disabled={generateDemoMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Generate Test Policy</span>
          </button>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Fetch
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 border border-zinc-800 bg-zinc-900/60 p-3 rounded-xl">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filter by reason or model version..."
          className="w-full sm:w-80"
        />
        <div className="text-xs text-zinc-400 font-medium">
          Total: <span className="text-zinc-100 font-semibold">{filtered.length}</span>
        </div>
      </div>

      {/* Grid view */}
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : isError || !recommendations || recommendations.length === 0 ? (
        <EmptyState
          type="no_data"
          title="No Recommendations Yet"
          description="Run a traffic simulation or click 'Generate Test Policy' to view adaptive rate limit suggestions."
          actionButton={
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/simulations')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Run Traffic Simulation
              </button>

              <button
                onClick={() => generateDemoMutation.mutate()}
                disabled={generateDemoMutation.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Generate Test Policy
              </button>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item: Recommendation) => (
            <Card key={item.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-100">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 font-medium block">
                      Recommended Rate Limit
                    </span>
                    <span className="text-xl font-bold text-blue-400">
                      {item.recommendedRateLimitRps} RPS
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={item.applied ? 'emerald' : 'purple'}>
                    {item.applied ? 'Applied to Gateway' : `${Math.round(item.confidenceScore * 100)}% Confidence`}
                  </Badge>

                  {/* Delete Card Button */}
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete recommendation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] font-semibold uppercase text-zinc-500 block mb-1">
                  Analysis Reason
                </span>
                <p className="text-xs text-zinc-200 leading-relaxed">{item.reason}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Model: <strong className="text-zinc-200">{item.modelVersion}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Re-run AI Analysis Button */}
                  <button
                    onClick={() => reRunMutation.mutate(item.id)}
                    disabled={reRunMutation.isPending}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    title="Redo AI Analysis"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${reRunMutation.isPending ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setExportRec(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Export Config</span>
                  </button>

                  <button
                    onClick={() => applyMutation.mutate(item.id)}
                    disabled={item.applied || applyMutation.isPending}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      item.applied
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                        : 'bg-zinc-100 text-zinc-950 hover:bg-white'
                    }`}
                  >
                    {item.applied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied to Sandbox</span>
                      </>
                    ) : (
                      <>
                        <span>Apply to Sandbox</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* BEFORE VS AFTER RESULTS COMPARISON TABLE */}
      {comparisonHistory && comparisonHistory.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-zinc-100">
              Before vs After Comparison Results
            </h2>
          </div>

          <Table<ComparisonHistory>
            data={comparisonHistory}
            keyExtractor={(item: ComparisonHistory) => item.id}
            columns={[
              {
                header: 'Policy Applied',
                accessor: 'policy',
                render: (item: ComparisonHistory) => <span className="font-semibold text-zinc-100">{item.policy}</span>,
              },
              {
                header: 'Before Limit',
                accessor: 'beforeLimit',
                render: (item: ComparisonHistory) => <Badge variant="slate">{item.beforeLimit}</Badge>,
              },
              {
                header: 'After Limit',
                accessor: 'afterLimit',
                render: (item: ComparisonHistory) => <Badge variant="emerald">{item.afterLimit}</Badge>,
              },
              {
                header: 'P99 Latency Reduction',
                accessor: 'latencyReduction',
                render: (item: ComparisonHistory) => <span className="text-emerald-400 font-bold">-{item.latencyReduction}</span>,
              },
              {
                header: 'Error Rate Reduction',
                accessor: 'errorReduction',
                render: (item: ComparisonHistory) => <span className="text-emerald-400 font-bold">-{item.errorReduction}</span>,
              },
            ]}
          />
        </div>
      )}

      {/* Export Modal */}
      <GatewayExporterModal
        isOpen={!!exportRec}
        onClose={() => setExportRec(null)}
        recommendation={exportRec}
      />

      {/* Delete Single Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Recommendation"
        message="Are you sure you want to delete this AI rate limit recommendation?"
        confirmText="Delete"
        isDanger
        isLoading={deleteMutation.isPending}
      />

      {/* Clear All Dialog */}
      <ConfirmationDialog
        isOpen={isClearAllOpen}
        onClose={() => setIsClearAllOpen(false)}
        onConfirm={() => clearAllMutation.mutate()}
        title="Clear All Recommendations"
        message="Are you sure you want to delete all recommendation cards from the database?"
        confirmText="Clear All"
        isDanger
        isLoading={clearAllMutation.isPending}
      />
    </div>
  );
};
