"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import OrderSearchBar from "@/components/client/OrderSearchBar";
import ReviewModal from "@/components/client/ReviewModal";
import SupportModal from "@/components/client/SupportModal";
import { MOCK_ORDERS } from "@/utils/data";
import { Order, OrderItem, OrderSchema, ProductReview } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Headphones,
  MapPin,
  Package,
  ShoppingCart,
  Star,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

// Simulated API helper resolving through Axios matching Next.js api routes structure
const fetchOrderDetails = async (orderId: string): Promise<Order> => {
  // Simulating an Axios request to a backend API (e.g., /api/orders/[id])
  const response = await new Promise<{ data: any }>((resolve, reject) => {
    setTimeout(() => {
      const match = MOCK_ORDERS.find(
        (o) => o.id.toLowerCase() === orderId.toLowerCase(),
      );
      if (match) {
        resolve({ data: match });
      } else {
        reject(new Error(`Order ID "${orderId}" not found in system`));
      }
    }, 450); // simulate network request latency
  });

  // Strict runtime contract verification with Zod
  const result = OrderSchema.safeParse(response.data);
  if (!result.success) {
    console.error("Zod schema validation failure:", result.error.format());
    throw new Error("Malformed order data layout");
  }
  return result.data;
};

export default function OrderDetailsPage() {
  // Local storage review mapping (productId -> Review details)
  const [reviews, setReviews] = useState<Record<string, ProductReview>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("siang_grocery_reviews");
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    } catch {
      // ignore parsing error
    }
    setIsHydrated(true);
  }, []);

  // Keep reviews in sync with local storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("siang_grocery_reviews", JSON.stringify(reviews));
    }
  }, [reviews, isHydrated]);

  // States
  const [currentOrderId, setCurrentOrderId] =
    useState<string>("Or123456789der");
  const [isSupportActive, setIsSupportActive] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [itemBeingReviewed, setItemBeingReviewed] = useState<OrderItem | null>(
    null,
  );
  const [userNotification, setUserNotification] = useState<string | null>(null);

  // Retrieve current active order via React Query
  const {
    data: activeOrder,
    isLoading,
    error,
  } = useQuery<Order>({
    queryKey: ["order", currentOrderId],
    queryFn: () => fetchOrderDetails(currentOrderId),
    placeholderData: (previousData) => previousData,
  });

  // Helper notice banner dismissal timer
  useEffect(() => {
    if (userNotification) {
      const timer = setTimeout(() => {
        setUserNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [userNotification]);

  // Computations
  const getSubtotal = () => {
    if (!activeOrder) return 0;
    return activeOrder.items.reduce(
      (acc, item) => acc + item.salePrice * item.quantity,
      0,
    );
  };

  const getGrandTotal = () => {
    if (!activeOrder) return 0;
    return getSubtotal() + activeOrder.shippingFee - activeOrder.discount;
  };

  // Handlers
  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!itemBeingReviewed) return;
    setReviews((prev) => ({
      ...prev,
      [itemBeingReviewed.id]: {
        productId: itemBeingReviewed.id,
        rating,
        comment,
        date: new Date().toLocaleDateString("en-GB"),
      },
    }));
    setUserNotification(
      `Thank you! Review for "${itemBeingReviewed.name}" submitted successfully.`,
    );
  };

  const triggerSearchFocus = () => {
    const inputEl = document.getElementById("order-search-input");
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      inputEl.focus();
    }
  };

  const handleNavClick = (linkName: string) => {
    if (linkName === "Order Tracking") {
      triggerSearchFocus();
    } else {
      setUserNotification(
        `Demo Alert: Catalog of "${linkName}" is simulated. This page is dedicated to order checkout status & tracking.`,
      );
    }
  };

  const getOrderStatusBannerClass = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-amber-600 text-white";
      case "shipped":
        return "bg-blue-600 text-white";
      case "delivered":
      default:
        return "bg-indigo-600 text-white";
    }
  };

  // Rendering fallback screens
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/70 font-sans antialiased text-gray-800 flex flex-col justify-center items-center py-12 px-4 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold font-display">
            Order Search Failed
          </h2>
          <p className="text-sm text-gray-500">
            {(error as Error).message ||
              "An unexpected issue occurred while fetching status."}
          </p>
          <button
            onClick={() => {
              setCurrentOrderId("Or123456789der");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Reset to Valid Demo Order
          </button>
        </div>
      </div>
    );
  }

  // Loading first fetch skeleton design
  if (isLoading && !activeOrder) {
    return (
      <div className="min-h-screen bg-gray-50/70 font-sans antialiased text-gray-800 flex flex-col justify-between">
        <header className="bg-white border-b border-gray-150 h-16 flex items-center justify-between px-6">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="flex gap-4">
              <div className="h-5 w-16 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-5 w-16 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
          {/* Skeleton Search */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-3">
            <div className="h-4 w-40 bg-gray-150 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse" />
          </div>
          {/* Skeleton Banner */}
          <div className="bg-indigo-50/50 rounded-2xl p-6 h-28 animate-pulse border border-indigo-100" />
          {/* Skeleton Recipient */}
          <div className="bg-white rounded-2xl p-6 h-20 border border-gray-150 animate-pulse" />
          {/* Skeleton Products */}
          <div className="bg-white rounded-2xl h-64 border border-gray-150 animate-pulse" />
        </main>
      </div>
    );
  }

  if (!activeOrder) return null;

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans antialiased text-gray-800 flex flex-col justify-between">
      {/* Dynamic Pop-up Inline Notifications */}
      <AnimatePresence>
        {userNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="bg-gray-900 text-white p-3.5 rounded-xl shadow-lg border border-gray-800 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <span>{userNotification}</span>
              </div>
              <button
                onClick={() => setUserNotification(null)}
                className="text-gray-400 hover:text-white font-semibold flex-shrink-0"
                id="btn-close-notification"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER SECTION */}
      <header className="bg-white border-b border-gray-150 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick("CatalogueHome")}
            className="text-lg text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-2 font-display font-semibold focus:outline-none cursor-pointer"
            id="header-brand-logo"
          >
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            <span className="tracking-tight text-gray-900">Siang Grocery</span>
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {[
              "All Products",
              "New Arrival",
              "Recent Popular",
              "Order Tracking",
            ].map((navItem) => (
              <button
                key={navItem}
                onClick={() => handleNavClick(navItem)}
                className="hover:text-indigo-600 transition-colors cursor-pointer"
                id={`nav-${navItem.replaceAll(" ", "-").toLowerCase()}`}
              >
                {navItem}
              </button>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3.5 text-gray-650">
            <button
              onClick={() => handleNavClick("Cart")}
              className="hover:text-indigo-650 hover:scale-105 transition-all p-1.5 rounded-lg hover:bg-gray-50 relative shrink-0 cursor-pointer"
              aria-label="View Cart"
              id="header-btn-cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
            <button
              onClick={() => handleNavClick("Account Profile")}
              className="hover:text-indigo-650 hover:scale-105 transition-all p-1.5 rounded-lg hover:bg-gray-50 shrink-0 cursor-pointer"
              aria-label="Profile Details"
              id="header-btn-user"
            >
              <User className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER CONTENT */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1">
        {/* INTERACTIVE TRACKING SEARCHBAR SECTION */}
        <section className="animate-entrance" style={{ animationDelay: "0s" }}>
          <OrderSearchBar
            onSearch={(id) => {
              setCurrentOrderId(id);
              setUserNotification(`Switched tracking view to Order ${id}`);
            }}
            mockOrders={MOCK_ORDERS}
            currentOrderId={activeOrder.id}
          />
        </section>

        {/* ORDER LOGISTIC STATUS BANNER */}
        <section
          className={`rounded-2xl p-6 shadow-xs relative overflow-hidden transition-all duration-300 animate-entrance ${getOrderStatusBannerClass(
            activeOrder.status,
          )}`}
          style={{ animationDelay: "0.1s" }}
        >
          {/* Ambient background accent shapes */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2 mb-1.5 capitalize">
                {activeOrder.status}
                {activeOrder.status === "delivered" && (
                  <Truck className="w-5 h-5 text-emerald-300" />
                )}
                {activeOrder.status === "shipped" && (
                  <Truck className="w-5 h-5 text-blue-200 animate-pulse" />
                )}
                {activeOrder.status === "processing" && (
                  <Package className="w-5 h-5 text-amber-200 animate-bounce" />
                )}
              </h2>
              <p className="text-indigo-100 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                {activeOrder.statusText}
              </p>
            </div>

            <button
              onClick={() => setIsSupportActive(true)}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 border border-white/60 hover:border-white hover:bg-white/10 rounded-xl font-medium text-xs text-white transition-all transform hover:scale-102 active:scale-98 self-start sm:self-auto cursor-pointer"
              id="btn-get-support"
            >
              Get Support
              <Headphones className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* RECIPIENT AND MATERIAL DETAILS */}
        <section
          className="bg-white rounded-2xl p-6 shadow-xs border border-gray-150 grid grid-cols-1 md:grid-cols-2 gap-6 animate-entrance"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
            <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              Recipient Information
            </h3>
            <p className="text-gray-800 text-sm font-semibold">
              {activeOrder.recipient}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              Delivery Shipping Location
            </h3>
            <p className="text-gray-750 text-xs sm:text-sm font-medium leading-relaxed">
              {activeOrder.deliveryAddress}
            </p>
          </div>
        </section>

        {/* COMPONENT PRODUCT CARD EXPANSE */}
        <section
          className="bg-white rounded-2xl shadow-xs border border-gray-150 overflow-hidden animate-entrance"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Items Ordered ({activeOrder.items.length})
            </span>
            <span className="text-xs font-mono text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-md">
              Parcel Item List
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {activeOrder.items.map((item) => {
              const itemReview = reviews[item.id];
              return (
                <div
                  key={item.id}
                  className="p-6 flex flex-col sm:flex-row gap-5"
                  id={`product-${item.id}`}
                >
                  {/* Left Column: Image Card */}
                  <div className="w-28 h-36 flex-shrink-0 border border-gray-150 rounded-xl p-2 flex flex-col justify-between items-center relative bg-white self-center">
                    <img
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 object-contain rounded-lg transition-transform duration-500 hover:scale-108"
                      src={item.imageUrl}
                    />
                    <div className="text-center w-full mt-1">
                      <p className="text-[10px] text-gray-400 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </p>
                      <p className="text-xs font-bold text-red-600">
                        ${item.salePrice.toFixed(2)} / Unit
                      </p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-tight">
                        From {item.origin}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Descriptions & Actions */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-xs font-semibold text-red-600 mt-1">
                          ${item.salePrice.toFixed(2)} / Unit
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg shrink-0">
                        Qty: x{item.quantity}
                      </span>
                    </div>

                    {/* Left review state */}
                    {itemReview ? (
                      <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs space-y-1.5 animate-slide">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-800 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Your Feedback Saved
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {itemReview.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 py-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= itemReview.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-650 italic leading-relaxed">
                          &quot;
                          {itemReview.comment ||
                            "No written feedback provided."}
                          &quot;
                        </p>
                        <button
                          onClick={() => {
                            setItemBeingReviewed(item);
                            setIsReviewOpen(true);
                          }}
                          className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 underline block cursor-pointer"
                        >
                          Edit your review
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end pt-2">
                        {activeOrder.status === "delivered" ? (
                          <button
                            onClick={() => {
                              setItemBeingReviewed(item);
                              setIsReviewOpen(true);
                            }}
                            className="px-5 py-2 bg-gray-50 hover:bg-indigo-50 border border-gray-150 text-gray-700 hover:text-indigo-700 text-xs font-semibold rounded-xl transition-all transform hover:scale-102 hover:shadow-xs active:scale-98 cursor-pointer"
                            id={`btn-review-${item.id}`}
                          >
                            Review Product
                          </button>
                        ) : (
                          <p className="text-[11px] text-gray-400 italic flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Reviews unlock once package is delivered
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ORDER DETAILS SUMMARY PRICING */}
        <section
          className="pt-2 animate-entrance"
          style={{ animationDelay: "0.25s" }}
        >
          <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Financial Invoice Receipt
          </h3>

          <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-xs space-y-4">
            {/* Price lines */}
            <div className="space-y-3 text-sm text-gray-700 border-b border-gray-100 pb-4">
              {activeOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-xs sm:text-sm"
                >
                  <span className="text-gray-500 truncate max-w-[240px] sm:max-w-[400px]">
                    {item.name}{" "}
                    <span className="font-mono text-[11px] text-gray-400">
                      ({item.quantity} Unit)
                    </span>
                  </span>
                  <span className="font-mono text-gray-800 font-medium">
                    ${(item.salePrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Shipping Delivery Fee</span>
                <span className="font-mono text-gray-800 font-medium">
                  ${activeOrder.shippingFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Discounts Deducted</span>
                <span className="font-mono text-emerald-600 font-medium font-semibold">
                  -${activeOrder.discount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="text-sm font-bold text-gray-900">
                  Total Charged Amount
                </span>
                <p className="text-[10px] text-gray-450 mt-0.5">
                  (Includes local sales taxes & duty)
                </p>
              </div>
              <span className="text-xl font-bold text-indigo-600 font-display">
                ${getGrandTotal().toFixed(2)}
              </span>
            </div>

            {/* Logistics descriptors List */}
            <div className="pt-4 border-t border-gray-50 text-xs text-gray-600 space-y-2.5">
              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                  Order ID:
                </span>
                <span className="font-mono font-semibold text-gray-800">
                  {activeOrder.id}
                </span>
              </div>

              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                  Payment Method:
                </span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  {activeOrder.paymentMethod}
                </span>
              </div>

              <div className="grid grid-cols-[140px_1fr]">
                <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                  Created At:
                </span>
                <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {activeOrder.createdAt}
                </span>
              </div>

              {activeOrder.shippedAt && (
                <div className="grid grid-cols-[140px_1fr]">
                  <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                    Shipped At:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {activeOrder.shippedAt}
                  </span>
                </div>
              )}

              {activeOrder.completedAt && (
                <div className="grid grid-cols-[140px_1fr]">
                  <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                    Completed At:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {activeOrder.completedAt}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-[140px_1fr] pt-1">
                <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                  Inbound Remark:
                </span>
                <span className="text-gray-800 bg-gray-50 p-2 rounded-xl border border-gray-100 mt-1 italic block sm:inline-block">
                  &quot;{activeOrder.remark}&quot;
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SYSTEM MAIN FOOTER */}
      {/* <footer className="bg-white border-t border-gray-200 mt-16 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-xl font-bold font-display tracking-tight text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                Siang Grocery
              </h2>
              <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed">
                Connecting fresh pasture-reared meats & local dairy straight to
                Malaysian families. Fast, temperature-controlled, and secure.
              </p>
            </div>

         
            <div>
              <h4 className="font-semibold text-xs text-gray-900 uppercase tracking-widest mb-3">
                Business
              </h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li>
                  <button
                    onClick={() => handleNavClick("About Us")}
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("Terms of Service")}
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

           
            <div>
              <h4 className="font-semibold text-xs text-gray-900 uppercase tracking-widest mb-3">
                Support
              </h4>
              <ul className="space-y-2 text-xs text-gray-500 font-medium">
                <li>
                  <button
                    onClick={() => setIsSupportActive(true)}
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    Contact Helpdesk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick("Privacy Policy")}
                    className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-gray-400">
              © 2026 Siang Grocery Inc. All rights reserved. Registered
              logistics supplier.
            </span>

        
            <div className="flex space-x-3">
              {["instagram", "facebook", "whatsapp"].map((p) => (
                <button
                  key={p}
                  onClick={() => handleNavClick(`Social Channel: ${p}`)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:text-indigo-600 hover:bg-indigo-50 transition-colors capitalize text-xs font-semibold cursor-pointer"
                  id={`footer-social-${p}`}
                >
                  {p[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer> */}

      {/* FLOATING DIALOGS AND MODALS */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setItemBeingReviewed(null);
        }}
        productName={itemBeingReviewed?.name || ""}
        onSubmit={handleReviewSubmit}
      />

      <SupportModal
        isOpen={isSupportActive}
        onClose={() => setIsSupportActive(false)}
        currentOrder={activeOrder}
      />
    </div>
  );
}
