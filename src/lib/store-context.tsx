"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
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
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [mediaSlots, setMediaSlots] = useState<Record<string, SiteMediaSlot>>(INITIAL_MEDIA_SLOTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [collections, setCollections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>(INITIAL_LOOKBOOK_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_SAMPLE_ORDERS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedSlots = localStorage.getItem(STORAGE_KEYS.SLOTS);
      if (savedSlots) {
        const parsed = JSON.parse(savedSlots);
        // Merge with initial so newly added slots aren't lost
        setMediaSlots({ ...INITIAL_MEDIA_SLOTS, ...parsed });
      }

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

      const savedCollections = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }

      const savedLookbook = localStorage.getItem(STORAGE_KEYS.LOOKBOOK);
      if (savedLookbook) {
        setLookbookItems(JSON.parse(savedLookbook));
      }

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings({ ...INITIAL_SITE_SETTINGS, ...JSON.parse(savedSettings) });
      }

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("LUGA Store hydration error:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever state updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(mediaSlots));
    } catch (e) {
      console.warn("Storage quota or error saving slots:", e);
    }
  }, [mediaSlots, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn("Storage error saving products:", e);
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    } catch (e) {
      console.warn("Storage error saving collections:", e);
    }
  }, [collections, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.LOOKBOOK, JSON.stringify(lookbookItems));
    } catch (e) {
      console.warn("Storage error saving lookbook:", e);
    }
  }, [lookbookItems, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn("Storage error saving orders:", e);
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("Storage error saving settings:", e);
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage error saving cart:", e);
    }
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
      return {
        ...prev,
        [slotKey]: {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  const resetMediaSlot = (slotKey: string) => {
    const original = INITIAL_MEDIA_SLOTS[slotKey];
    if (original) {
      setMediaSlots((prev) => ({
        ...prev,
        [slotKey]: original,
      }));
    } else {
      setMediaSlots((prev) => {
        const copy = { ...prev };
        delete copy[slotKey];
        return copy;
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
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
    setCollections((prev) => [...prev, newCol]);
    return newCol;
  };

  const updateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
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
    setLookbookItems((prev) => [...prev, newItem]);
    return newItem;
  };

  const updateLookbookItem = (id: string, updates: Partial<LookbookItem>) => {
    setLookbookItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteLookbookItem = (id: string) => {
    setLookbookItems((prev) => prev.filter((item) => item.id !== id));
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
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: status,
              ...(paymentStatus ? { paymentStatus } : {}),
            }
          : o
      )
    );
  };

  // Settings methods
  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
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
  };

  return (
    <StoreContext.Provider
      value={{
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
