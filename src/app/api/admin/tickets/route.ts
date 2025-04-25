import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Función para validar si el usuario está autorizado (simplificada para este caso)
 * En un entorno real, aquí verificaríamos la sesión y los permisos del usuario
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function isAuthorized(req: NextRequest) {
  // Versión simplificada: siempre autorizado para desarrollo
  // En producción, aquí verificarías el token de sesión o cookie
  return true;
}

/**
 * API handler para obtener tickets de soporte (para administradores)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autorización (simplificada)
    const authorized = await isAuthorized(request);
    if (!authorized) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const estado = searchParams.get('estado') || null;
    const search = searchParams.get('search') || null;
    
    // Calcular offset para paginación
    const offset = (page - 1) * limit;
    
    // Construir consulta base
    let query = supabase
      .from('support_tickets')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    // Aplicar filtros si existen
    if (estado) {
      query = query.eq('estado', estado);
    }
    
    if (search) {
      query = query.or(
        `ticket_number.ilike.%${search}%,external_id.ilike.%${search}%,documento.ilike.%${search}%,correo.ilike.%${search}%,comentarios.ilike.%${search}%`
      );
    }
    
    // Aplicar paginación
    query = query.range(offset, offset + limit - 1);
    
    // Ejecutar consulta
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error al obtener tickets:', error);
      return NextResponse.json(
        { error: 'Error al obtener tickets' },
        { status: 500 }
      );
    }
    
    // Transformar los datos para frontend
    const tickets = data.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticket_number,
      tipoProblema: ticket.tipo_problema,
      externalId: ticket.external_id,
      documento: ticket.documento,
      correo: ticket.correo,
      estado: ticket.estado,
      comentarios: ticket.comentarios,
      comentarioAdmin: ticket.comentario_admin,
      archivos: ticket.archivos,
      fechaCreacion: ticket.created_at,
      ultimaActualizacion: ticket.updated_at
    }));
    
    return NextResponse.json({
      tickets,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    });
    
  } catch (error) {
    console.error('Error interno al obtener tickets:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * API handler para actualizar el estado de un ticket (para administradores)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Verificar autorización (simplificada)
    const authorized = await isAuthorized(request);
    if (!authorized) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Obtener datos del request
    const body = await request.json();
    const { ticketId, estado, comentarioAdmin } = body;
    
    if (!ticketId || !estado) {
      return NextResponse.json(
        { error: 'ID de ticket y estado son requeridos' },
        { status: 400 }
      );
    }
    
    // Actualizar ticket en la base de datos
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ 
        estado,
        comentario_admin: comentarioAdmin,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();
      
    if (error) {
      console.error('Error al actualizar el ticket:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el ticket' },
        { status: 500 }
      );
    }
    
    // Si hay un correo asociado, podríamos enviar notificación al usuario del cambio de estado
    // Esto se podría implementar importando el servicio de email
    
    return NextResponse.json({
      success: true,
      ticket: {
        id: data.id,
        ticketNumber: data.ticket_number,
        estado: data.estado
      }
    });
    
  } catch (error) {
    console.error('Error interno al actualizar ticket:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}