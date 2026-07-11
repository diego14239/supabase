import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

// Bonus que pidió Felipe: Realtime. Supabase avisa por WebSocket cuando cambia
// una fila de la tabla "tareas" (sin importar quién hizo el cambio), y acá
// simplemente le decimos a TanStack Query "esto quedó viejo, vuelve a pedirlo".
export const useTareasRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('tareas-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tareas' },
        ()=> {
          queryClient.invalidateQueries({ queryKey: ['tareas'] });
        }
      )
      .subscribe();

    // Cleanup: si no te desuscribes, cada vez que el componente se re-monta
    // (ej. hot reload) se acumulan suscripciones fantasma.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
