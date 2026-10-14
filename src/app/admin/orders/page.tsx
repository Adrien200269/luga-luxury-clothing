"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useStore } from "@/lib/store-context";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { formatNpr } from "@/lib/utils";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  XCircle,
  Eye,
  X,
  Phone,
  MapPin,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30";
      case "DISPATCHED":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30";
      case "PROCESSING":
      case "CONFIRMED":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30";
      case "CANCELLED":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30";
      case "PENDING":
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-luga-border dark:border-luga-darkBorder pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] sm:text-xs tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
              CLIENT SERVICES & LOGISTICS
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
              CUSTOMER ORDERS ({orders.length})
            </h1>
            <p className="font-mono text-xs text-luga-muted dark:text-luga-darkMuted mt-1">
              Process customer dispatches, verify Nepal digital payments (Fonepay/eSewa), and track domestic couriers.
            </p>
          </div>
        </div>

        {/* Toolbar: Search & Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-luga-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH BY ORDER #, CLIENT, PHONE, CITY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-luga-border dark:border-luga-darkBorder pl-9 pr-4 py-2 text-luga-ink dark:text-luga-darkInk focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Orders" },
              { id: "PENDING", label: "Pending" },
              { id: "CONFIRMED", label: "Confirmed" },
              { id: "PROCESSING", label: "Processing" },
              { id: "DISPATCHED", label: "Dispatched" },
              { id: "DELIVERED", label: "Delivered" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 uppercase border transition-colors ${
                  statusFilter === tab.id
                    ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black dark:border-luga-darkInk font-bold"
                    : "border-luga-border dark:border-luga-darkBorder hover:border-luga-ink text-luga-ink dark:text-luga-darkInk"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border border-luga-border dark:border-luga-darkBorder bg-luga-bg dark:bg-[#0F0F0F]">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-luga-surface/50 dark:bg-luga-darkSurface/50 border-b border-luga-border dark:border-luga-darkBorder text-[10px] uppercase tracking-wider text-luga-muted">
                <th className="p-4">ORDER NUMBER</th>
                <th className="p-4">CUSTOMER & PHONE</th>
                <th className="p-4">DESTINATION</th>
                <th className="p-4">PAYMENT</th>
                <th className="p-4">AMOUNT (NPR)</th>
                <th className="p-4">ORDER STATUS</th>
                <th className="p-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luga-border/50 dark:divide-luga-darkBorder/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-luga-muted font-editorial text-xl">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-luga-surface/30 dark:hover:bg-luga-darkSurface/30 transition-colors">
                    <td className="p-4 font-bold text-luga-ink dark:text-luga-darkInk">
                      {order.orderNumber}
                      <div className="text-[10px] text-luga-muted font-normal">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-luga-ink dark:text-luga-darkInk">{order.customerName}</div>
                      <div className="text-[10px] text-luga-muted">{order.phone}</div>
                    </td>

                    <td className="p-4 text-luga-muted">
                      <div>{order.city}</div>
                      <div className="text-[9px] truncate max-w-xs">{order.toleAddress}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold">{order.paymentMethod}</div>
                      <div className="text-[9px] text-luga-muted">{order.paymentStatus}</div>
                    </td>

                    <td className="p-4 font-bold text-luga-crimson dark:text-luga-gold">
                      {formatNpr(order.totalNpr)}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 border border-luga-border hover:border-luga-ink text-luga-ink dark:text-luga-darkInk text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3 h-3" />
                        <span>DETAILS</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="bg-luga-bg dark:bg-[#121212] border border-luga-border dark:border-luga-darkBorder max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 font-mono text-xs">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-5 right-5 text-luga-muted hover:text-luga-ink"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-luga-border dark:border-luga-darkBorder pb-4 mb-6">
                <span className="text-[10px] tracking-mega uppercase text-luga-crimson dark:text-luga-gold">
                  ORDER SPECIFICATION
                </span>
                <h2 className="font-editorial text-3xl uppercase tracking-tight text-luga-ink dark:text-luga-darkInk mt-1">
                  {selectedOrder.orderNumber}
                </h2>
                <div className="text-[10px] text-luga-muted mt-1">
                  PLACED ON: {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="p-4 bg-luga-surface/40 dark:bg-luga-darkSurface/40 border border-luga-border dark:border-luga-darkBorder mb-6 space-y-3">
                <div className="text-[10px] uppercase font-bold text-luga-ink dark:text-luga-darkInk">
                  UPDATE ORDER FULFILLMENT STATUS
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["PENDING", "CONFIRMED", "PROCESSING", "DISPATCHED", "DELIVERED", "CANCELLED"] as OrderStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateOrderStatus(selectedOrder.id, st);
                          setSelectedOrder({ ...selectedOrder, orderStatus: st });
                        }}
                        className={`px-3 py-1.5 uppercase text-[10px] border transition-colors ${
                          selectedOrder.orderStatus === st
                            ? "bg-luga-ink text-white border-luga-ink dark:bg-luga-darkInk dark:text-black font-bold"
                            : "border-luga-border hover:border-luga-ink text-luga-muted"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="pt-2 flex items-center gap-4 border-t border-luga-border/50 text-[10px]">
                  <span>PAYMENT:</span>
                  {(["PENDING", "PAID", "FAILED"] as PaymentStatus[]).map((ps) => (
                    <button
                      key={ps}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, selectedOrder.orderStatus, ps);
                        setSelectedOrder({ ...selectedOrder, paymentStatus: ps });
                      }}
                      className={`px-2 py-0.5 border ${
                        selectedOrder.paymentStatus === ps
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : "border-luga-border text-luga-muted"
                      }`}
                    >
                      {ps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-luga-border dark:border-luga-darkBorder">
                <div className="space-y-2">
                  <div className="text-[10px] text-luga-muted uppercase font-bold">CLIENT INFORMATION</div>
                  <div className="text-sm font-bold text-luga-ink dark:text-luga-darkInk">{selectedOrder.customerName}</div>
                  <div className="flex items-center gap-1.5 text-luga-muted">
                    <Phone className="w-3.5 h-3.5" />
                    <a href={`tel:${selectedOrder.phone}`} className="hover:underline">{selectedOrder.phone}</a>
                  </div>
                  <div className="text-luga-muted">{selectedOrder.email}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-luga-muted uppercase font-bold">DISPATCH ADDRESS</div>
                  <div className="flex items-start gap-1.5 text-luga-ink dark:text-luga-darkInk">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-luga-crimson dark:text-luga-gold" />
                    <div>
                      <div>{selectedOrder.toleAddress}</div>
                      <div>{selectedOrder.city} • {selectedOrder.deliveryZone.replace(/_/g, " ")}</div>
                      {selectedOrder.landmark && (
                        <div className="text-[10px] text-luga-muted italic">Landmark: {selectedOrder.landmark}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="py-6 space-y-4">
                <div className="text-[10px] text-luga-muted uppercase font-bold">GARMENTS IN THIS ORDER</div>
                <div className="space-y-2 divide-y divide-luga-border/50">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-luga-ink dark:text-luga-darkInk">{item.productTitle}</div>
                        <div className="text-[10px] text-luga-muted">
                          SIZE: {item.size} • QTY: {item.quantity} • {formatNpr(item.priceNpr)} each
                        </div>
                      </div>
                      <div className="font-bold text-luga-ink dark:text-luga-darkInk">
                        {formatNpr(item.priceNpr * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-luga-border dark:border-luga-darkBorder space-y-1.5 text-right">
                <div className="flex justify-between text-luga-muted">
                  <span>Subtotal:</span>
                  <span>{formatNpr(selectedOrder.subtotalNpr)}</span>
                </div>
                <div className="flex justify-between text-luga-muted">
                  <span>Nepal Delivery:</span>
                  <span>{formatNpr(selectedOrder.shippingNpr)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-luga-ink dark:text-luga-darkInk pt-2 border-t border-luga-border/50">
                  <span>TOTAL (NPR):</span>
                  <span className="text-luga-crimson dark:text-luga-gold text-base">{formatNpr(selectedOrder.totalNpr)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-4 p-3 bg-luga-surface text-[10px] text-luga-muted">
                  <strong>Client Delivery Note:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
