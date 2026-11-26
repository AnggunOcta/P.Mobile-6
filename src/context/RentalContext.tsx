import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { RentalItem } from "../constants/types";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

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
  isLoading: boolean;
  addOrder: (order: NewRentalOrder) => Promise<void>;
  refreshOrders: () => Promise<void>;
};

const RentalContext = createContext<RentalContextValue | null>(null);

export function RentalProvider({ children }: React.PropsWithChildren) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data rental milik user dari Supabase (RLS melindungi data antar user)
  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Gagal memuat rentals dari Supabase:", error.message);
      } else if (data) {
        const mapped: RentalOrder[] = data.map((row: any) => ({
          id: row.id,
          itemId: row.item_id || "",
          name: row.name,
          imageSeed: row.image_seed || "item",
          imageUrl: row.image_url || undefined,
          categoryName: row.category_name || "Umum",
          pricePerDay: row.price_per_day || 0,
          durationDays: row.duration_days || 1,
          totalPrice: row.total_price || 0,
          confirmedAt: row.created_at,
        }));
        setOrders(mapped);
      }
    } catch (err: any) {
      console.warn("Kesalahan fetch rentals:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Tambah pesanan sewa ke Supabase dengan Optimistic UI
  const addOrder = useCallback(
    async (order: NewRentalOrder) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticOrder: RentalOrder = {
        ...order,
        id: tempId,
        confirmedAt: new Date().toISOString(),
      };

      // Optimistic update
      setOrders((prev) => [optimisticOrder, ...prev]);

      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("rentals")
          .insert([
            {
              user_id: user.id,
              item_id: order.itemId,
              name: order.name,
              image_seed: order.imageSeed,
              image_url: order.imageUrl,
              category_name: order.categoryName,
              price_per_day: order.pricePerDay,
              duration_days: order.durationDays,
              total_price: order.totalPrice,
            },
          ])
          .select()
          .single();

        if (error) {
          console.warn("Gagal menyimpan rental ke Supabase:", error.message);
        } else if (data) {
          // Ganti tempId dengan id dari database
          setOrders((prev) =>
            prev.map((o) =>
              o.id === tempId
                ? {
                    ...o,
                    id: data.id,
                    confirmedAt: data.created_at,
                  }
                : o
            )
          );
        }
      } catch (err: any) {
        console.warn("Kesalahan insert rental:", err.message);
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({ orders, isLoading, addOrder, refreshOrders: fetchOrders }),
    [orders, isLoading, addOrder, fetchOrders]
  );

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
