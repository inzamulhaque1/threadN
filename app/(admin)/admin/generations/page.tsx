"use client";

import { useEffect, useState } from "react";
import { FileText, ChevronLeft, ChevronRight, DollarSign } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatDateTime, truncate } from "@/lib/utils";

interface Generation {
  _id: string;
  type: string;
  tokens: number;
  cost: number;
  createdAt: string;
  user: { name: string; email: string };
  input: { transcript: string; selectedHook?: string };
  output: {
    hooks?: Array<{ text: string }>;
    thread?: { title: string; body: string };
  };
}

export default function AdminGenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totals, setTotals] = useState({ total: 0, tokens: 0 });
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchGenerations();
  }, [page, typeFilter]);

  const fetchGenerations = async () => {
    setIsLoading(true);
    const result = await adminApi.generations.list(
      page,
      20,
      typeFilter || undefined
    );
    if (result.success && result.data) {
      const data = result.data as {
        generations: Generation[];
        pagination: { totalPages: number };
        totals: { total: number; tokens: number };
      };
      setGenerations(data.generations);
      setTotalPages(data.pagination.totalPages);
      setTotals(data.totals);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
            Generations
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-accent mt-1">View all AI generations</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Cost</p>
            <p className="text-xl font-bold text-yellow-400">
              ${totals.total.toFixed(4)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Total Tokens</p>
            <p className="text-xl font-bold">{totals.tokens.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="input-dark w-auto"
          >
            <option value="">All Types</option>
            <option value="hooks">Hooks</option>
            <option value="thread">Threads</option>
          </select>
        </div>
      </Card>

      {/* Generations Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>User</th>
                  <th>Content</th>
                  <th>Tokens</th>
                  <th>Cost</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {generations.map((gen) => (
                  <tr key={gen._id}>
                    <td>
                      <span
                        className={`chip ${
                          gen.type === "hooks" ? "chip-neon" : "chip-success"
                        }`}
                      >
                        {gen.type}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{gen.user?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-400">
                          {gen.user?.email || ""}
                        </p>
                      </div>
                    </td>
                    <td className="max-w-xs">
                      {gen.type === "hooks" ? (
                        <p className="text-sm text-gray-400">
                          {gen.output.hooks?.length || 0} hooks generated
                        </p>
                      ) : (
                        <div>
                          <p className="font-medium text-sm">
                            {gen.output.thread?.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {truncate(gen.input.selectedHook || "", 50)}
                          </p>
                        </div>
                      )}
                    </td>
                    <td>{gen.tokens.toLocaleString()}</td>
                    <td className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-yellow-400" />
                      {gen.cost.toFixed(4)}
                    </td>
                    <td className="text-gray-400">
                      {formatDateTime(gen.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="glass"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="glass"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
