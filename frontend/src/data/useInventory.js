import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api";
import { getStatus } from "../lib/status";

export function useInventory() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ category: "All", status: "All", sort: "expiry-asc" });

  
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/items");
  
      setItems(response.data.list_of_items || []);
    } catch (err) {
      setError("Failed to load fridge contents.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchItems();
  }, []);

  
  const add = async (newItem) => {
    try {
  
      const formattedItem = {
        ...newItem,
        category: newItem.category.toLowerCase()
      };
      
  
      await api.post("/items", formattedItem);
      
  
      
      await fetchItems();
      
    } catch (err) {
      console.error("Failed to add item", err);
      alert("Couldn't add item to the fridge. Please try again.");
    }
  };

  const remove = async (id) => {
    try {

      await api.delete(`/items/${id}`);
      

      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to remove item", err);
      alert("Couldn't throw that item away. Try again.");
    }
  };


  const visible = useMemo(() => {
    return items
      .filter((item) => {

        if (filters.category !== "All" && item.category !== filters.category.toLowerCase()) return false;
        


        const currentStatus = getStatus(item.expiryDate);
        if (filters.status !== "All" && currentStatus !== filters.status) return false;
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.expiryDate).getTime();
        const dateB = new Date(b.expiryDate).getTime();
        if (filters.sort === "expiry-asc") return dateA - dateB;
        if (filters.sort === "expiry-desc") return dateB - dateA;
        return a.name.localeCompare(b.name);
      });
  }, [items, filters]);

  const counts = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const status = getStatus(item.expiryDate);
        if (status === "fresh") acc.fresh++;
        if (status === "expiring" || status === "expiring-soon") acc.expiring++;
        if (status === "expired") acc.expired++;
        return acc;
      },
      { fresh: 0, expiring: 0, expired: 0 }
    );
  }, [items]);

  return { items, visible, counts, filters, setFilters, add, remove, isLoading, error };
}