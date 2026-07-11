// Tal como en VentaPlay: un tipo por fila real de la tabla, y tipos separados
// para "crear" (sin id/created_at, los pone la BD) y "actualizar" (todo opcional).

export interface Tarea {
  id: string;
  titulo: string;
  completada: boolean;
  adjunto_url?: string;
  created_at: string;
}

export interface CrearTareaData {
  titulo: string;
}

export interface ActualizarTareaData {
  titulo?: string;
  completada?: boolean;
  adjunto_url?: string;
}
