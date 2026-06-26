import { useState, useEffect, useMemo } from "react";
import { api } from "../lib/api";
import { getStatus } from "../lib/status";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useInventory() {
  const [filters, setFilters] = useState({ category: "All", status: "All", sort: "expiry-asc" });

  const queryClient = useQueryClient();

  const {data : items = [], isLoading, error } = useQuery({
    queryKey : ["fridge-items"],
    queryFn : async () => {
      const response = await api.get("/items");
      return response.data.list_of_items || [];
    }
  });

  const addMutation = useMutation({
    mutationFn : async (newItem) => {
        const formattedItem = {...newItem, category : newItem.category.toLowerCase()}
        return await api.post("/items", formattedItem);
    },
    onSuccess : () => {
      queryClient.invalidateQueries({
        queryKey : ["fridge-items"]
      });
    },
    onError : (err) => {
      console.error("Failed to add item : ", err);
      alert("Couldn't add item to the fridge. Please try again.");
    }
  });

  const add = (newItem) => addMutation.mutate(newItem);

  
  const remove = (id) => {
    queryClient.setQueryData(["fridge-items"], (oldItems) => 
      oldItems ? oldItems.filter((item) => item._id !== id) : []
    );
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