// useCacheHandler.ts
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {useState} from "react";

export const useCacheHandler = <T>(cacheKey: string, initialData: T | null = null) => {
    const [trigger, setTrigger] = useState(0); // Brug en trigger for at spore ændringer

    const queryClient = useQueryClient();

    const saveToLocalStorage = (data: T) => {
        localStorage.setItem(cacheKey, JSON.stringify(data));
    };

    const loadFromLocalStorage = (): T | null => {
        const storedData = localStorage.getItem(cacheKey);
        return storedData ? (JSON.parse(storedData) as T) : null;
    };

    const { data: cachedData } = useQuery<T | null>({
        queryKey: [cacheKey],
        queryFn: () => loadFromLocalStorage(),
        initialData: initialData,
    });

    const { mutate: saveToCache } = useMutation({
        mutationFn: async (data: T) => {
            console.log('Saving to cache:', data);
            saveToLocalStorage(data);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([cacheKey], data);
            setTrigger(prev => prev + 1); // Opdater trigger
        },
    });

    const clearCache = () => {
        queryClient.removeQueries({ queryKey: [cacheKey], exact: true });
        queryClient.setQueryData([cacheKey], null);
        localStorage.removeItem(cacheKey);
        setTrigger(prev => prev + 1);
    };

    return { cachedData, saveToCache, clearCache, trigger };
};
