import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

interface EstadisticasTareas {
  total: number;
  completadas: number;
  pendientes: number;
}

// Distinto a useTareasData: acá NO le hablamos a una tabla directamente,
// le hablamos a una Edge Function (supabase.functions.invoke), que es la
// que internamente consulta la tabla y devuelve el cálculo ya hecho.
export const useEstadisticasTareas = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['estadisticas-tareas'],
    queryFn: async (): Promise<EstadisticasTareas> => {
      const { data, error } = await supabase.functions.invoke('contar-tareas');
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 1000 * 10,
  });

  return {
    estadisticas: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
};
