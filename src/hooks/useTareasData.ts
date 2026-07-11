import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { Tarea } from '../types/tarea';

// Mismo patrón que viste en useProductosStockData.ts de VentaPlay:
// useQuery + queryKey + una función que llama a Supabase.
export const useTareasData = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tareas'],
    queryFn: async (): Promise<Tarea[]> => {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 1000 * 30,
  });

  return {
    tareas: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
};
