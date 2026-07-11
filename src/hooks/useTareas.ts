import { useTareasData } from './useTareasData';
import { useTareasActions } from './useTareasActions';
import { useTareasRealtime } from './useTareasRealtime';

// Hook integrado: exactamente el mismo patrón que useProductosStockIntegrated.ts
// de VentaPlay. No hace trabajo propio, solo compone 3 hooks especializados.
export const useTareas = () => {
  useTareasRealtime();

  const { tareas, loading, error, refetch } = useTareasData();
  const { crear, actualizar, eliminar, isCreating, isUpdating, isDeleting } =
    useTareasActions();

  return {
    tareas,
    loading,
    error,
    refetch,
    crear,
    actualizar,
    eliminar,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
