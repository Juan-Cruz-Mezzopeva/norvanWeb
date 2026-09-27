import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "norvan-cart";
const CartContext = createContext(null);

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage no disponible */
    }
  }, [items]);

  const showToast = useCallback((message) => {
    setToast({ message, visible: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2200
    );
  }, []);

  const addItem = useCallback(
    (product, size) => {
      const sizeKey = String(size);
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.id === product.id && String(i.size) === sizeKey
        );
        if (existing) {
          return prev.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price ?? null,
            image: product.image,
            size,
            qty: 1,
          },
        ];
      });
      showToast("Agregado al carrito");
    },
    [showToast]
  );

  const removeItem = useCallback((id, size) => {
    const sizeKey = String(size);
    setItems((prev) => prev.filter((i) => !(i.id === id && String(i.size) === sizeKey)));
  }, []);

  const value = {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    addItem,
    removeItem,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toast,
    showToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
