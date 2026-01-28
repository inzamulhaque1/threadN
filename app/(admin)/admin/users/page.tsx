"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Crown,
  Coins,
} from "lucide-react";
import { Button, Input, Modal, Card } from "@/components/ui";
import { adminApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  coins: number;
  subscription: { status: string };
  usage: { totalThreads: number; totalHooks: number };
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ plan: "", coins: 0, role: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, planFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await adminApi.users.list(page, 20, search, planFilter);
    if (result.success && result.data) {
      const data = result.data as {
        users: User[];
        pagination: { totalPages: number };
      };
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditData({
      plan: user.plan,
      coins: user.coins,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    setIsSaving(true);

    const result = await adminApi.users.update(selectedUser._id, editData);
    if (result.success) {
      fetchUsers();
      setShowEditModal(false);
    }
    setIsSaving(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    const result = await adminApi.users.delete(id);
    if (result.success) {
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
            Users
          </h1>
          <p className="text-gray-400 mt-1">Manage user accounts</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="input-dark w-auto"
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Coins</th>
                  <th>Usage</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {user.name}
                            {user.role === "admin" && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                          </p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`chip ${
                          user.subscription?.status === "active"
                            ? "chip-success"
                            : "chip-neon"
                        }`}
                      >
                        {user.plan || "free"}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        {user.coins ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <p>{user.usage?.totalThreads ?? 0} threads</p>
                        <p className="text-gray-400">{user.usage?.totalHooks ?? 0} hooks</p>
                      </div>
                    </td>
                    <td className="text-gray-400">{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
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

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit User: ${selectedUser?.name}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plan
            </label>
            <select
              value={editData.plan}
              onChange={(e) => setEditData({ ...editData, plan: e.target.value })}
              className="input-dark w-full"
            >
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <Input
            label="Coins"
            type="number"
            value={editData.coins}
            onChange={(e) =>
              setEditData({ ...editData, coins: parseInt(e.target.value) || 0 })
            }
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Role
            </label>
            <select
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              className="input-dark w-full"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="glass"
              onClick={() => setShowEditModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveUser} isLoading={isSaving} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
