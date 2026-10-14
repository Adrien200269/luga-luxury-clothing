"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  CartItem,
  Collection,
  LookbookItem,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  SiteMediaSlot,
  SiteSettings,
  AdminUser,
} from "@/types";
import {
  INITIAL_COLLECTIONS,
  INITIAL_LOOKBOOK_ITEMS,
  INITIAL_MEDIA_SLOTS,
  INITIAL_PRODUCTS,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_SITE_SETTINGS,
} from "@/lib/initial-data";

interface StoreContextType {
  // Admin Authentication
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  // Site Media Slots
  mediaSlots: Record<string, SiteMediaSlot>;
  getMediaSlot: (slotKey: string) => SiteMediaSlot | undefined;
  updateMediaSlot: (slotKey: string, updates: Partial<SiteMediaSlot>) => void;
  resetMediaSlot: (slotKey: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;

  // Collections
  collections: Collection[];
  addCollection: (col: Omit<Collection, "id" | "createdAt">) => Collection;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  // Lookbook
  lookbookItems: LookbookItem[];
  addLookbookItem: (item: Omit<LookbookItem, "id" | "createdAt">) => LookbookItem;
  updateLookbookItem: (id: string, updates: Partial<LookbookItem>) => void;
  deleteLookbookItem: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => void;

  // Settings
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Search Drawer
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Persistence status
  isLoaded: boolean;
  resetAllToDefault: () => void;
  refreshFromDatabase: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SLOTS: "luga_media_slots_v1",
  PRODUCTS: "luga_products_v1",
  COLLECTIONS: "luga_collections_v1",
  LOOKBOOK: "luga_lookbook_v1",
  ORDERS: "luga_orders_v1",
  SETTINGS: "luga_settings_v1",
  CART: "luga_cart_v1",
  ADMIN_SESSION: "luga_admin_session_v1",
  SYNC_TIMESTAMP: "luga_sync_timestamp",
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [mediaSlots, setMediaSlots] = useState<Record<string, SiteMediaSlot>>(INITIAL_MEDIA_SLOTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>(INITIAL_LOOKBOOK_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Cross-tab broadcast helper
  const notifyOtherTabs = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYNC_TIMESTAMP, Date.now().toString());
    } catch {}
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("luga_local_update"));
    }
  }, []);

  // Fetch all latest data from backend Supabase PostgreSQL
  const refreshFromDatabase = useCallback(async () => {
    try {
      const [slotsRes, prodsRes, colsRes, looksRes, setsRes, ordsRes] = await Promise.allSettled([
        fetch("/api/slots").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/collections").then((r) => r.json()),
        fetch("/api/lookbook").then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/orders").then((r) => r.json()),
      ]);

      if (slotsRes.status === "fulfilled" && slotsRes.value?.success && slotsRes.value?.data) {
        setMediaSlots((prev) => ({ ...prev, ...slotsRes.value.data }));
        try {
          localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify({ ...INITIAL_MEDIA_SLOTS, ...slotsRes.value.data }));
        } catch {}
      }

      if (prodsRes.status === "fulfilled" && prodsRes.value?.success && Array.isArray(prodsRes.value?.data) && prodsRes.value.data.length > 0) {
        setProducts(prodsRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prodsRes.value.data));
        } catch {}
      }

      if (colsRes.status === "fulfilled" && colsRes.value?.success && Array.isArray(colsRes.value?.data) && colsRes.value.data.length > 0) {
        setCollections(colsRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(colsRes.value.data));
        } catch {}
      }

      if (looksRes.status === "fulfilled" && looksRes.value?.success && Array.isArray(looksRes.value?.data) && looksRes.value.data.length > 0) {
        setLookbookItems(looksRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(looksRes.value.data));
        } catch {}
      }

      if (setsRes.status === "fulfilled" && setsRes.value?.success && setsRes.value?.data) {
        setSettings((prev) => ({ ...prev, ...setsRes.value.data }));
        try {
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...INITIAL_SITE_SETTINGS, ...setsRes.value.data }));
        } catch {}
      }

      if (ordsRes.status === "fulfilled" && ordsRes.value?.success && Array.isArray(ordsRes.value?.data) && ordsRes.value.data.length > 0) {
        setOrders(ordsRes.value.data);
        try {
          localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(ordsRes.value.data));
        } catch {}
      }
    } catch (err) {
      console.warn("Database sync notice (offline or connecting):", err);
    }
  }, []);

  // 1. Load from localStorage immediately on mount for zero-flash UI
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
      if (savedAdmin) setAdminUser(JSON.parse(savedAdmin));

      const savedSlots = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (savedSlots) setMediaSlots({ ...INITIAL_MEDIA_SLOTS, ...JSON.parse(savedSlots) });

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCollections = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (savedCollections) setCollections(JSON.parse(savedCollections));

      const savedLookbook = localStorage.getItem(STORAGE_KEYS.LOOKBOOK);
      if (savedLookbook) setLookbookItems(JSON.parse(savedLookbook));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings({ ...INITIAL_SITE_SETTINGS, ...JSON.parse(savedSettings) });

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (err) {
      console.error("LUGA Store local hydration error:", err);
    } finally {
      setIsLoaded(true);
    }

    // Then pull live database content
    refreshFromDatabase();
  }, [refreshFromDatabase]);

  // 2. Listen to storage changes from other tabs so changes reflect live
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEYS.SYNC_TIMESTAMP) {
        try {
          const slots = localStorage.getItem(STORAGE_KEYS.SLOTS);
          if (slots) setMediaSlots({ ...INITIAL_MEDIA_SLOTS, ...JSON.parse(slots) });

          const prods = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
          if (prods) setProducts(JSON.parse(prods));

          const cols = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
          if (cols) setCollections(JSON.parse(cols));

          const looks = localStorage.getItem(STORAGE_KEYS.LOOKBOOK);
          if (looks) setLookbookItems(JSON.parse(looks));

          const sets = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          if (sets) setSettings({ ...INITIAL_SITE_SETTINGS, ...JSON.parse(sets) });

          const ords = localStorage.getItem(STORAGE_KEYS.ORDERS);
          if (ords) setOrders(JSON.parse(ords));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save cart changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart, isLoaded]);

  // Media slot methods
  const getMediaSlot = (slotKey: string) => {
    return mediaSlots[slotKey];
  };

  const updateMediaSlot = (slotKey: string, updates: Partial<SiteMediaSlot>) => {
    setMediaSlots((prev) => {
      const existing = prev[slotKey] || {
        id: `slot-${slotKey.toLowerCase()}`,
        slotKey,
        label: slotKey,
        pageSection: "HOMEPAGE",
        imageUrl: null,
        altText: null,
        aspectRatio: "4:5",
        resolution: "1200x1500px",
        updatedAt: new Date().toISOString(),
      };
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const newSlots = { ...prev, [slotKey]: updated };
      try {
        localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(newSlots));
      } catch (e) {
        console.warn("Storage quota limit reached for local cache:", e);
      }
      return newSlots;
    });

    notifyOtherTabs();

    // Persist to Supabase database via API
    fetch("/api/slots", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotKey, ...updates }),
    }).catch((err) => console.error("Database save slot error:", err));
  };

  const resetMediaSlot = (slotKey: string) => {
    const original = INITIAL_MEDIA_SLOTS[slotKey];
    if (original) {
      updateMediaSlot(slotKey, {
        imageUrl: null,
        heading: original.heading,
        subHeading: original.subHeading,
        ctaText: original.ctaText,
        ctaLink: original.ctaLink,
        altText: original.altText,
      });
    }
  };

  // Product methods
  const addProduct = (prodData: Omit<Product, "id" | "createdAt">): Product => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => {
      const updated = [newProd, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    // Persist to backend database
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.id) {
          setProducts((prev) => prev.map((p) => (p.id === newProd.id ? res.data : p)));
        }
      })
      .catch((err) => console.error("Database save product error:", err));

    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    }).catch((err) => console.error("Database update product error:", err));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch(`/api/products?id=${id}`, {
      method: "DELETE",
    }).catch((err) => console.error("Database delete product error:", err));
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  // Collection methods
  const addCollection = (colData: Omit<Collection, "id" | "createdAt">): Collection => {
    const newCol: Collection = {
      ...colData,
      id: `col-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setCollections((prev) => {
      const updated = [...prev, newCol];
      try {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCol),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.id) {
          setCollections((prev) => prev.map((c) => (c.id === newCol.id ? res.data : c)));
        }
      })
      .catch((err) => console.error("Database save collection error:", err));

    return newCol;
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      try {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/collections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    }).catch((err) => console.error("Database update collection error:", err));
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch(`/api/collections?id=${id}`, {
      method: "DELETE",
    }).catch((err) => console.error("Database delete collection error:", err));
  };

  // Lookbook methods
  const addLookbookItem = (
    itemData: Omit<LookbookItem, "id" | "createdAt">
  ): LookbookItem => {
    const newItem: LookbookItem = {
      ...itemData,
      id: `look-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setLookbookItems((prev) => {
      const updated = [...prev, newItem];
      try {
        localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/lookbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.id) {
          setLookbookItems((prev) => prev.map((item) => (item.id === newItem.id ? res.data : item)));
        }
      })
      .catch((err) => console.error("Database save lookbook error:", err));

    return newItem;
  };

  const updateLookbookItem = (id: string, updates: Partial<LookbookItem>) => {
    setLookbookItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/lookbook", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    }).catch((err) => console.error("Database update lookbook error:", err));
  };

  const deleteLookbookItem = (id: string) => {
    setLookbookItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch(`/api/lookbook?id=${id}`, {
      method: "DELETE",
    }).catch((err) => console.error("Database delete lookbook error:", err));
  };

  // Order methods
  const createOrder = (
    orderData: Omit<Order, "id" | "orderNumber" | "createdAt">
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `LUG-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.error("Database create order error:", err));

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: status,
              ...(paymentStatus ? { paymentStatus } : {}),
            }
          : o
      );
      try {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, orderStatus: status, paymentStatus }),
    }).catch((err) => console.error("Database update order status error:", err));
  };

  // Settings methods
  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    notifyOtherTabs();

    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch((err) => console.error("Database update settings error:", err));
  };

  // Cart methods
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.priceNpr * curr.quantity, 0);
  }, [cart]);

  const resetAllToDefault = () => {
    setMediaSlots(INITIAL_MEDIA_SLOTS);
    setProducts(INITIAL_PRODUCTS);
    setCollections(INITIAL_COLLECTIONS);
    setLookbookItems(INITIAL_LOOKBOOK_ITEMS);
    setOrders(INITIAL_SAMPLE_ORDERS);
    setSettings(INITIAL_SITE_SETTINGS);
    setCart([]);
    localStorage.clear();
    notifyOtherTabs();
  };

  const adminLogin = async (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (
      (trimmedEmail === "admin@luga.studio" ||
        trimmedEmail === "adrien@luga.studio" ||
        trimmedEmail === "admin") &&
      (trimmedPass === "luga2026" || trimmedPass === "luga" || trimmedPass === "admin")
    ) {
      const user: AdminUser = {
        id: "usr-admin-kathmandu",
        email: trimmedEmail.includes("@") ? trimmedEmail : "admin@luga.studio",
        name: "Sabja Shrestha // Atelier Director",
        role: "ADMIN",
        lastLogin: new Date().toISOString(),
      };
      setAdminUser(user);
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(user));
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid atelier credentials. Access denied.",
    };
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  };

  const isAdminAuthenticated = Boolean(adminUser);

  return (
    <StoreContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        mediaSlots,
        getMediaSlot,
        updateMediaSlot,
        resetMediaSlot,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        collections,
        addCollection,
        updateCollection,
        deleteCollection,
        lookbookItems,
        addLookbookItem,
        updateLookbookItem,
        deleteLookbookItem,
        orders,
        createOrder,
        updateOrderStatus,
        settings,
        updateSettings,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isLoaded,
        resetAllToDefault,
        refreshFromDatabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
