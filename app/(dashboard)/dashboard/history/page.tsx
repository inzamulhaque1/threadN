"use client";

import { useEffect, useState } from "react";
import { History, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { userApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import type { IGeneration } from "@/types";

export default function HistoryPage() {
  const [generations, setGenerations] = useState<IGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<"all" | "hooks" | "thread">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [page, filter]);

  const fetchHistory = async () => {
    setIsLoading(true);
    const type = filter === "all" ? undefined : filter;
    const result = await userApi.history(page, 10, type);

    if (result.success && result.data) {
      const data = result.data as {
        generations: IGeneration[];
        pagination: { totalPages: number };
      };
      setGenerations(data.generations);
      setTotalPages(data.pagination.totalPages);
    }
    setIsLoading(false);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <History className="w-8 h-8 text-purple-400" />
            History
          </h1>
          <p className="text-gray-400 mt-1">View your past generations</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "hooks", "thread"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "neon" : "glass"}
              size="sm"
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
              <div className="h-20 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : generations.length === 0 ? (
        <Card className="text-center py-12">
          <History className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">No generations yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Start creating content to see your history here
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {generations.map((gen) => (
              <Card key={gen._id}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`chip ${
                        gen.type === "hooks" ? "chip-neon" : "chip-success"
                      }`}
                    >
                      {gen.type}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDateTime(gen.createdAt)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {gen.tokens} tokens
                  </span>
                </div>

                {gen.type === "hooks" && gen.output.hooks && (
                  <div className="space-y-2">
                    {gen.output.hooks.slice(0, 3).map((hook, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <p className="text-sm">{hook.text}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(hook.text, `${gen._id}-${i}`)}
                        >
                          {copiedId === `${gen._id}-${i}` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                    {gen.output.hooks.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{gen.output.hooks.length - 3} more hooks
                      </p>
                    )}
                  </div>
                )}

                {gen.type === "thread" && gen.output.thread && (
                  <div className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{gen.output.thread.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(gen.output.thread!.body, gen._id)
                        }
                      >
                        {copiedId === gen._id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400 whitespace-pre-wrap line-clamp-4">
                      {gen.output.thread.body}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
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
        </>
      )}
    </div>
  );
}
