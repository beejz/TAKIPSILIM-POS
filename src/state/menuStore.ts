import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MenuItem, MenuCategory, MenuStatus } from "../types/cafe";

interface MenuState {
  items: MenuItem[];
  categories: string[]; // Dynamic list of categories
  addItem: (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => MenuItem;
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => MenuItem | undefined;
  getItemsByCategory: (category: MenuCategory) => MenuItem[];
  updateStock: (id: string, quantity: number) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  resetCategories: () => void;
  initializeSampleData: (forceReloadImages?: boolean) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set, get) => ({
      items: [],
      categories: ["Coffee", "Waffle", "Beverage", "Soda", "Snack", "Rice Meal"], // Default categories

      addItem: (item) => {
        const newItem: MenuItem = {
          ...item,
          id: `custom-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log("[MenuStore] Adding new item:", newItem.name, "ID:", newItem.id, "Category:", newItem.category);
        set((state) => {
          const updatedItems = [...state.items, newItem];
          console.log("[MenuStore] Total items after add:", updatedItems.length);
          return { items: updatedItems };
        });
        return newItem;
      },

      updateItem: (id, updates) => {
        const state = get();
        const updatedItems = state.items.map((item) =>
          item.id === id
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        );
        set({ items: updatedItems });
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      getItemById: (id) => {
        return get().items.find((item) => item.id === id);
      },

      getItemsByCategory: (category) => {
        return get().items.filter((item) => item.category === category);
      },

      updateStock: (id, quantity) => {
        const state = get();
        const updatedItems = state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                stockQuantity: quantity,
                status: (quantity > 0 ? "available" : "out_of_stock") as MenuStatus,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
        set({ items: updatedItems });
      },

      addCategory: (category: string) => {
        const state = get();
        const trimmedCategory = category.trim();
        if (trimmedCategory && !state.categories.includes(trimmedCategory)) {
          set((state) => ({
            categories: [...state.categories, trimmedCategory],
          }));
        }
      },

      deleteCategory: (category: string) => {
        const state = get();
        // Don't delete if there are items in this category
        const hasItems = state.items.some((item) => item.category === category);
        if (hasItems) {
          return; // Silently fail - we'll show an alert in the UI
        }
        set((state) => ({
          categories: state.categories.filter((cat) => cat !== category),
        }));
      },

      resetCategories: () => {
        const defaultCategories = ["Coffee", "Waffle", "Beverage", "Soda", "Snack", "Rice Meal"];
        console.log("[MenuStore] Manually resetting categories to defaults:", defaultCategories);
        set({ categories: [...defaultCategories] });
      },

      initializeSampleData: (forceReloadImages = false) => {
        // Smart merge: Add missing items but preserve existing customized items
        // If forceReloadImages is true, update imageUrls for existing items
        const state = get();
        const existingItems = state.items;

        console.log("[MenuStore] initializeSampleData called, forceReloadImages:", forceReloadImages);
        console.log("[MenuStore] Existing items count:", existingItems.length);

        const sampleItems: MenuItem[] = [
          // Coffee Items
          {
            id: "101",
            name: "Almond Macchiato",
            category: "Coffee",
            price: 120.0,
            stockQuantity: 50,
            status: "available",
            description: "Iced Coffee 22oz - Rich almond macchiato",
            imageUrl: "image-1763821879.png",
            ingredients: [
              { ingredientId: "1", quantityUsed: 0.02 }, // Coffee Beans 20g
              { ingredientId: "2", quantityUsed: 0.15 }, // Milk 150ml
              { ingredientId: "11", quantityUsed: 0.03 }, // Almond Syrup 30ml
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "102",
            name: "Vanilla Latte",
            category: "Coffee",
            price: 120.0,
            stockQuantity: 50,
            status: "available",
            description: "Iced Coffee 22oz - Smooth vanilla latte",
            imageUrl: "image-1763821891.png",
            ingredients: [
              { ingredientId: "1", quantityUsed: 0.02 }, // Coffee Beans 20g
              { ingredientId: "2", quantityUsed: 0.15 }, // Milk 150ml
              { ingredientId: "10", quantityUsed: 0.03 }, // Vanilla Syrup 30ml
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "103",
            name: "Hazelnut Coffee",
            category: "Coffee",
            price: 120.0,
            stockQuantity: 50,
            status: "available",
            description: "Iced Coffee 22oz - Aromatic hazelnut coffee",
            imageUrl: "image-1763821885.png",
            ingredients: [
              { ingredientId: "1", quantityUsed: 0.02 }, // Coffee Beans 20g
              { ingredientId: "2", quantityUsed: 0.15 }, // Milk 150ml
              { ingredientId: "12", quantityUsed: 0.03 }, // Hazelnut Syrup 30ml
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "104",
            name: "Iced Chocolate",
            category: "Coffee",
            price: 100.0,
            stockQuantity: 50,
            status: "available",
            description: "22oz - Creamy iced chocolate drink",
            imageUrl: "image-1763821883.png",
            ingredients: [
              { ingredientId: "2", quantityUsed: 0.2 }, // Milk 200ml
              { ingredientId: "13", quantityUsed: 0.04 }, // Chocolate Syrup 40ml
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Classic Waffles
          {
            id: "20",
            name: "Strawberry Waffle",
            category: "Waffle",
            price: 35.0,
            stockQuantity: 50,
            status: "available",
            description: "Classic Waffles - Fresh strawberry topping",
            imageUrl: "image-1763851344.png",
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.1 }, // Waffle Mix 100g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "23", quantityUsed: 0.05 }, // Strawberries 50g
              { ingredientId: "15", quantityUsed: 0.02 }, // Strawberry Syrup 20ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "21",
            name: "Chocolate Waffle",
            category: "Waffle",
            price: 35.0,
            stockQuantity: 50,
            status: "available",
            description: "Classic Waffles - Rich chocolate sauce",
            imageUrl: "image-1763851337.png",
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.1 }, // Waffle Mix 100g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "13", quantityUsed: 0.03 }, // Chocolate Syrup 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "22",
            name: "Caramel Waffle",
            category: "Waffle",
            price: 35.0,
            stockQuantity: 50,
            status: "available",
            description: "Classic Waffles - Sweet caramel drizzle",
            imageUrl: "image-1763851340.png",
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.1 }, // Waffle Mix 100g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "14", quantityUsed: 0.03 }, // Caramel Syrup 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Premium Waffles
          {
            id: "23",
            name: "Cookies and Cream Waffle",
            category: "Waffle",
            price: 55.0,
            stockQuantity: 40,
            status: "available",
            description: "Premium Waffles - Cookies and cream delight",
            imageUrl: "image-1763851335.png",
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.1 }, // Waffle Mix 100g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "13", quantityUsed: 0.03 }, // Chocolate Syrup 30ml
              { ingredientId: "24", quantityUsed: 0.05 }, // Whipped Cream 50g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "24",
            name: "Biscoff Waffle",
            category: "Waffle",
            price: 60.0,
            stockQuantity: 40,
            status: "available",
            description: "Premium Waffles - Biscoff Lotus spread",
            imageUrl: "image-1763851335.png",
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.1 }, // Waffle Mix 100g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "14", quantityUsed: 0.03 }, // Caramel Syrup 30ml (for biscoff flavor)
              { ingredientId: "24", quantityUsed: 0.05 }, // Whipped Cream 50g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "25",
            name: "Nutella Waffle",
            category: "Waffle",
            price: 70.0,
            stockQuantity: 40,
            status: "available",
            description: "Premium Waffles - Rich Nutella spread",
            imageUrl: "image-1763851335.png",
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.1 }, // Waffle Mix 100g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "13", quantityUsed: 0.05 }, // Chocolate Syrup 50ml (for nutella)
              { ingredientId: "24", quantityUsed: 0.05 }, // Whipped Cream 50g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Fresh Lemonade Series
          {
            id: "7",
            name: "Fresh Lemon",
            category: "Beverage",
            price: 50.0,
            stockQuantity: 50,
            status: "available",
            description: "Fresh Lemonade Series 22oz - Refreshing fresh lemon drink",
            imageUrl: "image-1763851285.png",
            ingredients: [
              { ingredientId: "34", quantityUsed: 0.1 }, // Lemons 100g
              { ingredientId: "37", quantityUsed: 0.02 }, // Sugar 20g
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "8",
            name: "Lemon Cucumber",
            category: "Beverage",
            price: 60.0,
            stockQuantity: 50,
            status: "available",
            description: "Fresh Lemonade Series 22oz - Cool lemon cucumber blend",
            imageUrl: "image-1763855293.png",
            ingredients: [
              { ingredientId: "34", quantityUsed: 0.08 }, // Lemons 80g
              { ingredientId: "35", quantityUsed: 0.05 }, // Cucumber 50g
              { ingredientId: "37", quantityUsed: 0.02 }, // Sugar 20g
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "9",
            name: "Lemon Yakult",
            category: "Beverage",
            price: 60.0,
            stockQuantity: 50,
            status: "available",
            description: "Fresh Lemonade Series 22oz - Tangy lemon yakult fusion",
            imageUrl: "image-1763855290.png",
            ingredients: [
              { ingredientId: "34", quantityUsed: 0.08 }, // Lemons 80g
              { ingredientId: "36", quantityUsed: 1 }, // Yakult 1 bottle
              { ingredientId: "37", quantityUsed: 0.01 }, // Sugar 10g
              { ingredientId: "3", quantityUsed: 0.2 }, // Ice 200g
              { ingredientId: "70", quantityUsed: 1 }, // 22oz Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Soda Fruit Series - Available in 16oz and 22oz
          {
            id: "30",
            name: "Green Apple Soda",
            category: "Soda",
            price: 28.0,
            stockQuantity: 60,
            status: "available",
            description: "Soda Fruit Series - Crisp green apple flavor",
            imageUrl: "image-1763851287.png",
            sizes: [
              { name: "16oz", price: 28.0 },
              { name: "22oz", price: 38.0 }
            ],
            ingredients: [
              { ingredientId: "30", quantityUsed: 0.3 }, // Soda Water 300ml
              { ingredientId: "31", quantityUsed: 0.02 }, // Flavor Syrup 20ml (Green Apple/Strawberry/Lychee/Blueberry/Lemon)
              { ingredientId: "3", quantityUsed: 0.15 }, // Ice 150g
              { ingredientId: "70", quantityUsed: 1 }, // Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "31",
            name: "Strawberry Soda",
            category: "Soda",
            price: 28.0,
            stockQuantity: 60,
            status: "available",
            description: "Soda Fruit Series - Sweet strawberry fizz",
            imageUrl: "image-1763851289.png",
            sizes: [
              { name: "16oz", price: 28.0 },
              { name: "22oz", price: 38.0 }
            ],
            ingredients: [
              { ingredientId: "30", quantityUsed: 0.3 }, // Soda Water 300ml
              { ingredientId: "31", quantityUsed: 0.02 }, // Flavor Syrup 20ml (Green Apple/Strawberry/Lychee/Blueberry/Lemon)
              { ingredientId: "3", quantityUsed: 0.15 }, // Ice 150g
              { ingredientId: "70", quantityUsed: 1 }, // Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "32",
            name: "Lychee Soda",
            category: "Soda",
            price: 28.0,
            stockQuantity: 60,
            status: "available",
            description: "Soda Fruit Series - Exotic lychee soda",
            imageUrl: "image-1763851296.png",
            sizes: [
              { name: "16oz", price: 28.0 },
              { name: "22oz", price: 38.0 }
            ],
            ingredients: [
              { ingredientId: "30", quantityUsed: 0.3 }, // Soda Water 300ml
              { ingredientId: "31", quantityUsed: 0.02 }, // Flavor Syrup 20ml (Green Apple/Strawberry/Lychee/Blueberry/Lemon)
              { ingredientId: "3", quantityUsed: 0.15 }, // Ice 150g
              { ingredientId: "70", quantityUsed: 1 }, // Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "33",
            name: "Blueberry Soda",
            category: "Soda",
            price: 28.0,
            stockQuantity: 60,
            status: "available",
            description: "Soda Fruit Series - Berry blueberry soda",
            imageUrl: "image-1763851293.png",
            sizes: [
              { name: "16oz", price: 28.0 },
              { name: "22oz", price: 38.0 }
            ],
            ingredients: [
              { ingredientId: "30", quantityUsed: 0.3 }, // Soda Water 300ml
              { ingredientId: "31", quantityUsed: 0.02 }, // Flavor Syrup 20ml (Green Apple/Strawberry/Lychee/Blueberry/Lemon)
              { ingredientId: "3", quantityUsed: 0.15 }, // Ice 150g
              { ingredientId: "70", quantityUsed: 1 }, // Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "34",
            name: "Lemon Soda",
            category: "Soda",
            price: 28.0,
            stockQuantity: 60,
            status: "available",
            description: "Soda Fruit Series - Zesty lemon soda",
            imageUrl: "image-1763851285.png",
            sizes: [
              { name: "16oz", price: 28.0 },
              { name: "22oz", price: 38.0 }
            ],
            ingredients: [
              { ingredientId: "30", quantityUsed: 0.3 }, // Soda Water 300ml
              { ingredientId: "31", quantityUsed: 0.02 }, // Flavor Syrup 20ml (Green Apple/Strawberry/Lychee/Blueberry/Lemon)
              { ingredientId: "3", quantityUsed: 0.15 }, // Ice 150g
              { ingredientId: "70", quantityUsed: 1 }, // Cup
              { ingredientId: "71", quantityUsed: 1 }, // Straw
              { ingredientId: "72", quantityUsed: 1 }, // Lid
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Waffle Stick
          {
            id: "26",
            name: "Waffle Stick",
            category: "Waffle",
            price: 20.0,
            stockQuantity: 50,
            status: "available",
            description: "Waffle on a stick",
            imageUrl: "image-1763851401.png",
            flavors: [
              { name: "Creamy Cheese", price: 20.0 },
              { name: "Hotdog", price: 30.0 }
            ],
            ingredients: [
              { ingredientId: "20", quantityUsed: 0.08 }, // Waffle Mix 80g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "22", quantityUsed: 0.01 }, // Butter 10g
              { ingredientId: "43", quantityUsed: 1 }, // Cheese (for cheese flavor)
              { ingredientId: "73", quantityUsed: 1 }, // Packaging
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Rice Meals - Chicken
          {
            id: "40",
            name: "Chicken Poppers",
            category: "Rice Meal",
            price: 55.0,
            stockQuantity: 40,
            status: "available",
            description: "Rice meal - Crispy chicken poppers",
            imageUrl: "image-1763858539.png",
            flavors: [
              { name: "With Gravy", price: 55.0 },
              { name: "Cheese", price: 80.0 },
              { name: "Honey Butter", price: 80.0 },
              { name: "Sweet Chili", price: 80.0 },
              { name: "Soy Garlic", price: 80.0 }
            ],
            ingredients: [
              { ingredientId: "47", quantityUsed: 0.15 }, // Chicken Poppers 150g
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "52", quantityUsed: 0.05 }, // Cooking Oil 50ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "45",
            name: "Chicken Fillet",
            category: "Rice Meal",
            price: 70.0,
            stockQuantity: 40,
            status: "available",
            description: "Rice meal - Crispy chicken fillet",
            imageUrl: "image-1763858540.png",
            flavors: [
              { name: "Unli Gravy", price: 70.0 },
              { name: "Combo Meal", price: 130.0 }
            ],
            ingredients: [
              { ingredientId: "48", quantityUsed: 0.2 }, // Chicken Fillet 200g
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "52", quantityUsed: 0.05 }, // Cooking Oil 50ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Rice Meals - Siomai & Shanghai
          {
            id: "50",
            name: "Siomai Rice",
            category: "Rice Meal",
            price: 45.0,
            stockQuantity: 50,
            status: "available",
            description: "Siomai with rice",
            imageUrl: "image-1763858544.png",
            flavors: [
              { name: "Fried", price: 45.0 },
              { name: "Steamed", price: 45.0 },
              { name: "Combo Meal with Drinks", price: 110.0 }
            ],
            ingredients: [
              { ingredientId: "49", quantityUsed: 5 }, // Siomai 5 pieces
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "51",
            name: "Siomai",
            category: "Snack",
            price: 30.0,
            stockQuantity: 50,
            status: "available",
            description: "Siomai without rice",
            imageUrl: "image-1763866055.png",
            flavors: [
              { name: "Fried", price: 30.0 },
              { name: "Steamed", price: 30.0 }
            ],
            ingredients: [
              { ingredientId: "49", quantityUsed: 5 }, // Siomai 5 pieces
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "53",
            name: "Shanghai Rice",
            category: "Rice Meal",
            price: 45.0,
            stockQuantity: 50,
            status: "available",
            description: "Crispy shanghai rolls with rice",
            imageUrl: "image-1763858542.png",
            flavors: [
              { name: "Shanghai Rice Only", price: 45.0 },
              { name: "Shanghai Combo Meal", price: 110.0 }
            ],
            ingredients: [
              { ingredientId: "50", quantityUsed: 5 }, // Shanghai Rolls 5 pieces
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "52", quantityUsed: 0.05 }, // Cooking Oil 50ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Fries & Potatoes
          {
            id: "60",
            name: "Jungle Twister Fries",
            category: "Snack",
            price: 55.0,
            stockQuantity: 50,
            status: "available",
            description: "Spiral cut seasoned fries",
            imageUrl: "image-1763859055.png",
            ingredients: [
              { ingredientId: "51", quantityUsed: 0.2 }, // Potato Fries 200g
              { ingredientId: "52", quantityUsed: 0.1 }, // Cooking Oil 100ml
              { ingredientId: "80", quantityUsed: 0.005 }, // Salt 5g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "61",
            name: "Buttered Potato Wedges",
            category: "Snack",
            price: 65.0,
            stockQuantity: 50,
            status: "available",
            description: "Crispy buttered potato wedges",
            imageUrl: "image-1763859053.png",
            ingredients: [
              { ingredientId: "51", quantityUsed: 0.2 }, // Potato Fries 200g
              { ingredientId: "52", quantityUsed: 0.1 }, // Cooking Oil 100ml
              { ingredientId: "80", quantityUsed: 0.005 }, // Salt 5g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "62",
            name: "Sea Salt Potato",
            category: "Snack",
            price: 50.0,
            stockQuantity: 50,
            status: "available",
            description: "Classic sea salt seasoned potato",
            imageUrl: "image-1763859064.png",
            ingredients: [
              { ingredientId: "51", quantityUsed: 0.2 }, // Potato Fries 200g
              { ingredientId: "52", quantityUsed: 0.1 }, // Cooking Oil 100ml
              { ingredientId: "80", quantityUsed: 0.005 }, // Salt 5g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "63",
            name: "Garden Crinkle Fries",
            category: "Snack",
            price: 50.0,
            stockQuantity: 50,
            status: "available",
            description: "Garden herb crinkle cut fries",
            imageUrl: "image-1763859057.png",
            ingredients: [
              { ingredientId: "51", quantityUsed: 0.2 }, // Potato Fries 200g
              { ingredientId: "52", quantityUsed: 0.1 }, // Cooking Oil 100ml
              { ingredientId: "80", quantityUsed: 0.005 }, // Salt 5g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "64",
            name: "Cajun Cheesy Fries",
            category: "Snack",
            price: 50.0,
            stockQuantity: 50,
            status: "available",
            description: "Spicy cajun fries with cheese",
            imageUrl: "image-1763859062.png",
            ingredients: [
              { ingredientId: "51", quantityUsed: 0.2 }, // Potato Fries 200g
              { ingredientId: "52", quantityUsed: 0.1 }, // Cooking Oil 100ml
              { ingredientId: "80", quantityUsed: 0.005 }, // Salt 5g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "65",
            name: "Baby Fries",
            category: "Snack",
            price: 35.0,
            stockQuantity: 60,
            status: "available",
            description: "Small portion crispy fries",
            imageUrl: "image-1763859066.png",
            ingredients: [
              { ingredientId: "51", quantityUsed: 0.2 }, // Potato Fries 200g
              { ingredientId: "52", quantityUsed: 0.1 }, // Cooking Oil 100ml
              { ingredientId: "80", quantityUsed: 0.005 }, // Salt 5g
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Siopao
          {
            id: "70",
            name: "Jumbo Siopao",
            category: "Snack",
            price: 50.0,
            stockQuantity: 40,
            status: "available",
            description: "Large steamed bun with special homemade sauce",
            imageUrl: "image-1763855282.png",
            ingredients: [
              { ingredientId: "40", quantityUsed: 1 }, // Siopao (Frozen)
              { ingredientId: "73", quantityUsed: 1 }, // Packaging
              { ingredientId: "74", quantityUsed: 1 }, // Napkins
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "71",
            name: "Mini Siopao (3pcs)",
            category: "Snack",
            price: 50.0,
            stockQuantity: 40,
            status: "available",
            description: "Three mini steamed buns with special sauce",
            imageUrl: "image-1763855286.png",
            ingredients: [
              { ingredientId: "40", quantityUsed: 1 }, // Siopao (Frozen)
              { ingredientId: "73", quantityUsed: 1 }, // Packaging
              { ingredientId: "74", quantityUsed: 1 }, // Napkins
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Sandwiches
          {
            id: "80",
            name: "Ultimate Hotdog Sandwich",
            category: "Snack",
            price: 65.0,
            stockQuantity: 50,
            status: "available",
            description: "Lettuce, cheese and homemade dressing",
            imageUrl: "image-1763850106.png",
            ingredients: [
              { ingredientId: "41", quantityUsed: 1 }, // Hotdog
              { ingredientId: "42", quantityUsed: 1 }, // Hotdog Bun
              { ingredientId: "45", quantityUsed: 0.01 }, // Mayonnaise 10g
              { ingredientId: "84", quantityUsed: 0.01 }, // Ketchup 10g
              { ingredientId: "73", quantityUsed: 1 }, // Packaging
              { ingredientId: "74", quantityUsed: 1 }, // Napkins
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "81",
            name: "Classic Hotdog Sandwich",
            category: "Snack",
            price: 35.0,
            stockQuantity: 50,
            status: "available",
            description: "Mayo and tomato dressing",
            imageUrl: "image-1763850102.png",
            ingredients: [
              { ingredientId: "41", quantityUsed: 1 }, // Hotdog
              { ingredientId: "42", quantityUsed: 1 }, // Hotdog Bun
              { ingredientId: "45", quantityUsed: 0.01 }, // Mayonnaise 10g
              { ingredientId: "84", quantityUsed: 0.01 }, // Ketchup 10g
              { ingredientId: "73", quantityUsed: 1 }, // Packaging
              { ingredientId: "74", quantityUsed: 1 }, // Napkins
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "82",
            name: "Monster Sandwich",
            category: "Snack",
            price: 60.0,
            stockQuantity: 45,
            status: "available",
            description: "Sweet mustard dressing, cheese and bacon",
            imageUrl: "image-1763850110.png",
            ingredients: [
              { ingredientId: "41", quantityUsed: 1 }, // Hotdog
              { ingredientId: "42", quantityUsed: 1 }, // Hotdog Bun
              { ingredientId: "45", quantityUsed: 0.01 }, // Mayonnaise 10g
              { ingredientId: "84", quantityUsed: 0.01 }, // Ketchup 10g
              { ingredientId: "73", quantityUsed: 1 }, // Packaging
              { ingredientId: "74", quantityUsed: 1 }, // Napkins
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          // Silog Meals
          {
            id: "90",
            name: "Hotsilog",
            category: "Rice Meal",
            price: 99.0,
            stockQuantity: 40,
            status: "available",
            description: "Hotdog, sinangag (fried rice) and itlog (egg)",
            imageUrl: "image-1763850500.png",
            ingredients: [
              { ingredientId: "41", quantityUsed: 2 }, // Hotdog 2pcs
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "91",
            name: "Spamsilog",
            category: "Rice Meal",
            price: 120.0,
            stockQuantity: 40,
            status: "available",
            description: "Spam, sinangag and itlog",
            imageUrl: "image-1763850506.png",
            ingredients: [
              { ingredientId: "61", quantityUsed: 0.1 }, // Spam 100g
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "92",
            name: "Sausagesilog",
            category: "Rice Meal",
            price: 120.0,
            stockQuantity: 40,
            status: "available",
            description: "Sausage, sinangag and itlog",
            imageUrl: "image-1763850502.png",
            ingredients: [
              { ingredientId: "62", quantityUsed: 2 }, // Sausage 2pcs
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "93",
            name: "Baconsilog",
            category: "Rice Meal",
            price: 99.0,
            stockQuantity: 40,
            status: "available",
            description: "Bacon, sinangag and itlog",
            imageUrl: "image-1763850504.png",
            ingredients: [
              { ingredientId: "44", quantityUsed: 0.08 }, // Bacon 80g
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "94",
            name: "Tocilog",
            category: "Rice Meal",
            price: 99.0,
            stockQuantity: 40,
            status: "available",
            description: "Tocino (sweet pork), sinangag and itlog",
            imageUrl: "image-1763850508.png",
            ingredients: [
              { ingredientId: "63", quantityUsed: 0.1 }, // Tocino 100g
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "95",
            name: "Longsilog",
            category: "Rice Meal",
            price: 99.0,
            stockQuantity: 40,
            status: "available",
            description: "Longanisa (Filipino sausage), sinangag and itlog",
            imageUrl: "image-1763850511.png",
            ingredients: [
              { ingredientId: "64", quantityUsed: 2 }, // Longanisa 2pcs
              { ingredientId: "60", quantityUsed: 0.15 }, // Rice 150g
              { ingredientId: "21", quantityUsed: 1 }, // Egg
              { ingredientId: "52", quantityUsed: 0.03 }, // Cooking Oil 30ml
              { ingredientId: "73", quantityUsed: 1 }, // Takeout Box
              { ingredientId: "75", quantityUsed: 1 }, // Fork
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        // Create a map of existing items by ID for quick lookup
        const existingItemsMap = new Map(existingItems.map(item => [item.id, item]));

        // Create a map of sample items by ID
        const sampleItemsMap = new Map(sampleItems.map(item => [item.id, item]));

        // Merge: Keep existing items (with custom prices), only add new items from template
        const mergedItems = existingItems.map(item => {
          const sampleItem = sampleItemsMap.get(item.id);

          // If item doesn't exist in template AND it's a custom item (starts with "custom-"), keep it
          if (!sampleItem) {
            if (item.id.startsWith('custom-')) {
              console.log("[MenuStore] Preserving custom item:", item.name, item.id);
              return item; // Keep custom user-added items
            }
            return null; // Remove deprecated template items
          }

          // If forceReloadImages is true and there's a sample item, update imageUrl, sizes, and flavors
          if (forceReloadImages && sampleItem) {
            return {
              ...item,
              name: sampleItem.name,
              category: sampleItem.category,
              description: sampleItem.description,
              imageUrl: sampleItem.imageUrl,
              sizes: sampleItem.sizes,
              flavors: sampleItem.flavors,
              updatedAt: new Date().toISOString()
            };
          }

          return item;
        }).filter(item => item !== null); // Remove null items (deprecated ones)

        // Add new items that don't exist yet
        sampleItems.forEach(sampleItem => {
          if (!existingItemsMap.has(sampleItem.id)) {
            // Item doesn't exist, add it
            mergedItems.push(sampleItem);
          }
        });

        console.log("[MenuStore] Final merged items count:", mergedItems.length);
        console.log("[MenuStore] Custom items preserved:", mergedItems.filter(i => i.id.startsWith('custom-')).length);

        // Use spread operator to ensure fresh array reference
        set({ items: [...mergedItems] });
      },
    }),
    {
      name: "menu-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Migration: Fix corrupted categories array
        if (state) {
          const defaultCategories = ["Coffee", "Waffle", "Beverage", "Soda", "Snack", "Rice Meal"];

          // If categories is undefined, empty, or corrupted (not an array or has wrong length)
          if (!state.categories || !Array.isArray(state.categories) || state.categories.length === 0) {
            console.log("[MenuStore Migration] Fixing corrupted categories...");
            console.log("  Before:", state.categories);

            // Reset to defaults
            state.categories = [...defaultCategories];

            console.log("  After:", state.categories);
          }

          // Additional check: if categories doesn't contain at least the default ones
          const missingDefaults = defaultCategories.filter(cat => !state.categories.includes(cat));
          if (missingDefaults.length > 0) {
            console.log("[MenuStore Migration] Adding missing default categories:", missingDefaults);
            state.categories = [...state.categories, ...missingDefaults];
          }
        }
      },
    }
  )
);
