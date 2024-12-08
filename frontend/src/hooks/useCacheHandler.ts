import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export const useCacheHandler = <T>(cacheKey: string, initialData: T | null = null) => {
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
        initialData: null,
    });

    const { mutate: saveToCache } = useMutation({
        mutationFn: async (data: T) => {
            queryClient.setQueryData([cacheKey], data); // Gem i React Query
            saveToLocalStorage(data); // Gem i localStorage
            return data;
        },
    });

    const clearCache = () => {
        queryClient.removeQueries({ queryKey: [cacheKey], exact: true });
        queryClient.setQueryData([cacheKey], null); // Sæt React Query cache til null
        localStorage.removeItem(cacheKey); // Fjern fra localStorage
    };

    return { cachedData, saveToCache, clearCache };
};
