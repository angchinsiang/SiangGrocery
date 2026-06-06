"use client";
import React, { useState } from "react";
import { Search, Info, Package, Truck, CheckCircle2 } from "lucide-react";
import { Order } from "@/utils/types";

interface OrderSearchBarProps {
  onSearch: (orderId: string) => void;
  mockOrders: Order[];
  currentOrderId: string;
}

export default function OrderSearchBar({
  onSearch,
  mockOrders,
  currentOrderId,
}: OrderSearchBarProps) {
  const [searchVal, setSearchVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;

    const trimmed = searchVal.trim();
    const found = mockOrders.find(
      (o) => o.id.toLowerCase() === trimmed.toLowerCase(),
    );

    if (found) {
      onSearch(found.id);
      setErrorMsg("");
    } else {
      setErrorMsg(
        `No simulated order found matching "${trimmed}". Please choose from the options below.`,
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="w-3.5 h-3.5 text-amber-500" />;
      case "shipped":
        return <Truck className="w-3.5 h-3.5 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
        <h3 className="font-display font-semibold text-sm text-gray-900 flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" />
          Track Customer Order Status
        </h3>
        <span className="text-[11px] font-mono text-gray-400">
          Siang-Logistic Core v1.0
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="Type Order ID (e.g., Or123456789der)..."
            className="w-full text-sm p-2.5 pl-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-gray-400 font-mono transition-shadow"
            id="order-search-input"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors shrink-0"
          id="btn-search-order"
        >
          Track Address
        </button>
      </form>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-start gap-2 border border-red-100">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Suggested Fast Tracks */}
      <div className="space-y-2">
        <span className="text-[11px] font-medium text-gray-400 block tracking-wider uppercase">
          Quick Demo Presets
        </span>
        <div className="flex flex-wrap gap-2">
          {mockOrders.map((order) => {
            const isSelected = order.id === currentOrderId;
            return (
              <button
                key={order.id}
                onClick={() => {
                  onSearch(order.id);
                  setSearchVal(order.id);
                  setErrorMsg("");
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all text-left border ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-200 text-indigo-800 ring-2 ring-indigo-500/10 shadow-xs"
                    : "bg-gray-50/50 hover:bg-gray-50 border-gray-100 text-gray-600 hover:text-gray-900 hover:border-gray-200"
                }`}
                id={`preset-btn-${order.id}`}
              >
                {getStatusIcon(order.status)}
                <span className="font-mono">{order.id}</span>
                <span className="text-[10px] text-gray-400 capitalize hidden sm:inline">
                  ({order.status})
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
