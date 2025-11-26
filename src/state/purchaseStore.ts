import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Purchase } from "../types/cafe";
import { useInventoryStore } from "./inventoryStore";

interface PurchaseState {
  purchases: Purchase[];
  createPurchase: (
    supplierName: string,
    items: Purchase["items"],
    notes: string | undefined,
    createdBy: string,
    createdByName: string
  ) => Purchase;
  deletePurchase: (id: string) => void;
  getPurchaseById: (id: string) => Purchase | undefined;
  getPurchasesByDateRange: (startDate: string, endDate: string) => Purchase[];
  getPurchasesBySupplier: (supplierName: string) => Purchase[];
  initializeSampleData: () => void;
}

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      purchases: [],

      createPurchase: (supplierName, items, notes, createdBy, createdByName) => {
        const totalCost = items.reduce((sum, item) => sum + item.total, 0);
        const purchaseNumber = `PUR-${Date.now()}`;

        const newPurchase: Purchase = {
          id: Date.now().toString(),
          purchaseNumber,
          supplierName,
          items,
          totalCost,
          purchaseDate: new Date().toISOString(),
          notes,
          createdBy,
          createdByName,
        };

        // Update inventory quantities
        const inventoryStore = useInventoryStore.getState();
        items.forEach((item) => {
          const inventoryItem = inventoryStore.getItemById(item.inventoryItemId);
          if (inventoryItem) {
            inventoryStore.updateQuantity(
              item.inventoryItemId,
              inventoryItem.quantity + item.quantity
            );
          }
        });

        set((state) => ({ purchases: [...state.purchases, newPurchase] }));
        return newPurchase;
      },

      deletePurchase: (id) => {
        set((state) => ({
          purchases: state.purchases.filter((purchase) => purchase.id !== id),
        }));
      },

      getPurchaseById: (id) => {
        return get().purchases.find((purchase) => purchase.id === id);
      },

      getPurchasesByDateRange: (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return get().purchases.filter((purchase) => {
          const purchaseDate = new Date(purchase.purchaseDate).getTime();
          return purchaseDate >= start && purchaseDate <= end;
        });
      },

      getPurchasesBySupplier: (supplierName) => {
        return get().purchases.filter(
          (purchase) =>
            purchase.supplierName.toLowerCase() === supplierName.toLowerCase()
        );
      },

      initializeSampleData: () => {
        set({ purchases: [] });
      },
    }),
    {
      name: "purchase-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
