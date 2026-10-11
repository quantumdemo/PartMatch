"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Search, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { AdminService, AdminUserRecord } from "@/lib/services/adminService";
import { formatWAT } from "@/lib/timezone";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getUsers(roleFilter);
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) =>
    search ? u.formatted_address.toLowerCase().includes(search.toLowerCase()) || u.user_id.includes(search) : true
  );

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl font-bold text-[#121212]">User & KYC Management</h1>
        <p className="text-xs text-[#8A8A8A]">Audit Verified Drivers, Merchants & Mobile Mechanics</p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {["ALL", "buyer", "buyer_fleet", "seller", "mechanic"].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3.5 py-1.5 rounded-full border transition-colors ${
              roleFilter === role
                ? "bg-[#121212] text-white border-[#121212]"
                : "bg-white text-[#8A8A8A] border-[#EAEAEA]"
            }`}
          >
            {role.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by User ID or Location..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-[12px] text-xs text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#FF4D1A]"
        />
      </div>

      {/* Users Audit Table */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-16 bg-neutral-200 rounded-[12px] animate-pulse" />
          <div className="h-16 bg-neutral-200 rounded-[12px] animate-pulse" />
        </div>
      ) : error ? (
        <div className="p-6 bg-white border border-red-200 rounded-[16px] text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-xs font-bold text-red-700">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-[#FF4D1A] text-white text-xs font-bold rounded-[12px] inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-8 text-center bg-white border border-[#EAEAEA] rounded-[16px] text-xs text-[#8A8A8A]">
          No user accounts found matching filter.
        </div>
      ) : (
        <div className="bg-white border border-[#EAEAEA] rounded-[16px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#121212]">
              <thead className="bg-[#FFFBF5] border-b border-[#EAEAEA] font-bold text-[#8A8A8A]">
                <tr>
                  <th className="p-3.5">User ID</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Registered Address</th>
                  <th className="p-3.5">KYC Status</th>
                  <th className="p-3.5">Registered WAT Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {filteredUsers.map((u) => (
                  <tr key={u.user_id} className="hover:bg-[#FFFBF5]">
                    <td className="p-3.5 font-mono text-[11px] font-bold">{u.user_id.substring(0, 8)}...</td>
                    <td className="p-3.5">
                      <span className="font-bold uppercase text-[10px] bg-neutral-100 border px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 truncate max-w-[200px]">{u.formatted_address}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {u.kyc_status}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-[#8A8A8A]">{formatWAT(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
