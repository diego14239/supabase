// Edge Function bonus (Deno) — mismo estilo que las de supabase/functions/ en VentaPlay:
// serve() + createClient con service role + CORS headers.
//
// Para desplegarla (requiere Supabase CLI instalado y logueado):
//   supabase functions deploy contar-tareas --no-verify-jwt
//
// --no-verify-jwt porque la llama el navegador sin sesión (mismo motivo que las
// funciones públicas de VentaPlay documentado en CLAUDE.md).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: tareas, error } = await supabase.from('tareas').select('completada');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const pendientes = total - completadas;

  return new Response(
    JSON.stringify({ total, completadas, pendientes }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
