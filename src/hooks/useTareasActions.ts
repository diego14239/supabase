import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ActualizarTareaData, CrearTareaData } from '../types/tarea';

// Mismo patrón que useProductosStockActions.ts: cada acción es una useMutation,
// y al tener éxito invalida la query 'tareas' para que la lista se refresque sola.
export const useTareasActions = () => {
  const queryClient = useQueryClient();

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ['tareas'] });

  const crear = useMutation({
    mutationFn: async (data: CrearTareaData) => {
      const { error } = await supabase
        .from('tareas')
        .insert({ titulo: data.titulo, completada: false });
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidar,
  });

  const actualizar = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ActualizarTareaData }) => {
      const { error } = await supabase.from('tareas').update(data).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidar,
  });

  const eliminar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tareas').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: invalidar,
  });

  return {
    crear: crear.mutate,
    actualizar: actualizar.mutate,
    eliminar: eliminar.mutate,
    isCreating: crear.isPending,
    isUpdating: actualizar.isPending,
    isDeleting: eliminar.isPending,
  };
};
