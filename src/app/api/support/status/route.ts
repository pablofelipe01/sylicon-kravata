import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * API handler para consultar el estado de un ticket
 */
export async function GET(request: NextRequest) {
  // Obtener el número de ticket de la URL
  const searchParams = request.nextUrl.searchParams;
  const ticketNumber = searchParams.get('ticket');
  
  // Validar que se proporcionó un número de ticket
  if (!ticketNumber) {
    return NextResponse.json(
      { error: 'Se requiere el número de ticket' },
      { status: 400 }
    );
  }
  
  try {
    // Buscar el ticket en la base de datos
    const { data, error } = await supabase
      .from('support_tickets')
      .select('ticket_number, tipo_problema, estado, created_at, updated_at')
      .eq('ticket_number', ticketNumber)
      .single();
      
    if (error) {
      console.error('Error al consultar el ticket:', error);
      
      if (error.code === 'PGRST116') {
        // Error cuando no se encuentra el registro
        return NextResponse.json(
          { error: 'Ticket no encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error al consultar el ticket' },
        { status: 500 }
      );
    }
    
    // Formatear fechas y preparar respuesta
    const ticketInfo = {
      ticketNumber: data.ticket_number,
      tipoProblema: data.tipo_problema,
      estado: mapEstadoToDisplayText(data.estado),
      fechaCreacion: new Date(data.created_at).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ultimaActualizacion: new Date(data.updated_at).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    return NextResponse.json({ ticket: ticketInfo });
    
  } catch (error) {
    console.error('Error interno al consultar el ticket:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * Mapea los estados internos a textos amigables para el usuario
 */
function mapEstadoToDisplayText(estado: string): string {
  const estadosMap: { [key: string]: string } = {
    'pendiente': 'Pendiente de revisión',
    'en_revision': 'En revisión',
    'esperando_informacion': 'Esperando información adicional',
    'en_proceso': 'En proceso de solución',
    'resuelto': 'Resuelto',
    'cerrado': 'Cerrado'
  };
  
  return estadosMap[estado] || estado;
}