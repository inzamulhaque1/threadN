"use client";

import { useEffect, useState } from "react";
import {
  Ticket,
  Plus,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button, Input, Modal, Card } from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface AccessCode {
  _id: string;
  code: string;
  type: string;
  value: number;
  plan?: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCode, setNewCode] = useState({
    code: "",
    type: "coins",
    value: 100,
    plan: "pro",
    maxUses: 1,
    expiresAt: "",
  });

  useEffect(() => {
    fetchCodes();
  }, [page]);

  const fetchCodes = async () => {
    setIsLoading(true);
    const result = await adminApi.codes.list(page, 20);
    if (result.success && result.data) {
      const data = result.data as {
        codes: AccessCode[];
        pagination: { totalPages: number };
      };
      setCodes(data.codes);
      setTotalPages(data.pagination.totalPages);
    }
    setIsLoading(false);
  };

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCode = async () => {
    setIsCreating(true);
    const result = await adminApi.codes.create({
      code: newCode.code || undefined,
      type: newCode.type,
      value: newCode.value,
      plan: newCode.type === "subscription" ? newCode.plan : undefined,
      maxUses: newCode.maxUses,
      expiresAt: newCode.expiresAt || undefined,
    });

    if (result.success) {
      fetchCodes();
      setShowCreateModal(false);
      setNewCode({
        code: "",
        type: "coins",
        value: 100,
        plan: "pro",
        maxUses: 1,
        expiresAt: "",
      });
    }
    setIsCreating(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const result = await adminApi.codes.update(id, { isActive: !currentStatus });
    if (result.success) {
      fetchCodes();
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this code?")) return;

    const result = await adminApi.codes.delete(id);
    if (result.success) {
      fetchCodes();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Ticket className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
            Access Codes
          </h1>
          <p className="text-gray-400 mt-1">Create and manage access codes</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          Create Code
        </Button>
      </div>

      {/* Codes Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mx-auto" />
          </div>
        ) : codes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No codes yet. Create your first code.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm">
                          {code.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(code.code)}
                        >
                          {copiedCode === code.code ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`chip ${
                          code.type === "subscription"
                            ? "chip-success"
                            : code.type === "coins"
                            ? "chip-warning"
                            : "chip-neon"
                        }`}
                      >
                        {code.type}
                      </span>
                    </td>
                    <td>
                      {code.type === "subscription"
                        ? `${code.value} days (${code.plan})`
                        : code.type === "coins"
                        ? `${code.value} coins`
                        : `${code.value} days trial`}
                    </td>
                    <td>
                      <span
                        className={
                          code.usedCount >= code.maxUses ? "text-red-400" : ""
                        }
                      >
                        {code.usedCount} / {code.maxUses}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`chip ${
                          code.isActive ? "chip-success" : "chip-danger"
                        }`}
                      >
                        {code.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-gray-400">{formatDate(code.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(code._id, code.isActive)}
                        >
                          {code.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCode(code._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

      {/* Create Code Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Access Code"
      >
        <div className="space-y-4">
          <Input
            label="Code (leave empty to auto-generate)"
            placeholder="e.g., PROMO-2024"
            value={newCode.code}
            onChange={(e) =>
              setNewCode({ ...newCode, code: e.target.value.toUpperCase() })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={newCode.type}
              onChange={(e) => setNewCode({ ...newCode, type: e.target.value })}
              className="input-dark w-full"
            >
              <option value="coins">Coins</option>
              <option value="subscription">Subscription</option>
              <option value="trial">Trial</option>
            </select>
          </div>

          {newCode.type === "subscription" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plan
              </label>
              <select
                value={newCode.plan}
                onChange={(e) => setNewCode({ ...newCode, plan: e.target.value })}
                className="input-dark w-full"
              >
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          )}

          <Input
            label={
              newCode.type === "coins"
                ? "Number of Coins"
                : "Duration (days)"
            }
            type="number"
            value={newCode.value}
            onChange={(e) =>
              setNewCode({ ...newCode, value: parseInt(e.target.value) || 0 })
            }
          />

          <Input
            label="Max Uses"
            type="number"
            value={newCode.maxUses}
            onChange={(e) =>
              setNewCode({ ...newCode, maxUses: parseInt(e.target.value) || 1 })
            }
          />

          <Input
            label="Expiry Date (optional)"
            type="date"
            value={newCode.expiresAt}
            onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="glass"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCode} isLoading={isCreating} className="flex-1">
              Create Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
