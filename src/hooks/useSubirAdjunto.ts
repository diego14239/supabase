import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const BUCKET = 'adjuntos-tareas';

// Bonus "buckets" que pidió Felipe: subir un archivo a Supabase Storage
// y devolver la URL pública para guardarla en la fila de la tarea.
export const useSubirAdjunto = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subir = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    const nombreArchivo = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(nombreArchivo, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombreArchivo);

    setUploading(false);
    return data.publicUrl;
  };

  return { subir, uploading, error };
};
