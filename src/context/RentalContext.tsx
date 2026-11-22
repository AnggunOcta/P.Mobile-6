import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { RentalItem } from "../constants/types";

export type RentalOrder = {
  id: string;
  itemId: string;
  name: string;
  imageSeed: string;
  imageUrl?: string;
  categoryName: string;
  pricePerDay: number;
  durationDays: number;
  totalPrice: number;
  confirmedAt: string;
};

type NewRentalOrder = Omit<RentalOrder, "id" | "confirmedAt">;

type RentalContextValue = {
  orders: RentalOrder[];
  addOrder: (order: NewRentalOrder) => void;
};

const RentalContext = createContext<RentalContextValue | null>(null);

export function RentalProvider({ children }: React.PropsWithChildren) {
  const [orders, setOrders] = useState<RentalOrder[]>([]);

  const addOrder = useCallback((order: NewRentalOrder) => {
    setOrders((currentOrders) => [
      {
        ...order,
        id: `${Date.now()}-${currentOrders.length}`,
        confirmedAt: new Date().toISOString(),
      },
      ...currentOrders,
    ]);
  }, []);

  const value = useMemo(() => ({ orders, addOrder }), [orders, addOrder]);

  return <RentalContext.Provider value={value}>{children}</RentalContext.Provider>;
}

export function useRentals(): RentalContextValue {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error("useRentals harus digunakan di dalam RentalProvider.");
  }
  return context;
}

export function createRentalOrder(
  item: RentalItem,
  categoryName: string,
  durationDays: number
): NewRentalOrder {
  return {
    itemId: item.id,
    name: item.name,
    imageSeed: item.imageSeed,
    imageUrl: item.imageUrl,
    categoryName,
    pricePerDay: item.pricePerDay,
    durationDays,
    totalPrice: item.pricePerDay * durationDays,
  };
}
