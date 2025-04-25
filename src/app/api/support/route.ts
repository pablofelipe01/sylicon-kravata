import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { sendTicketConfirmationEmail, sendSupportNotificationEmail } from '@/app/lib/email-service';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Generates a unique ticket number
 */
function generateTicketNumber() {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TK-${timestamp}-${random}`;
}

/**
 * API handler for creating support tickets
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const formData = await request.formData();
    
    // Extract basic ticket info
    const tipoProblema = formData.get('tipoProblema') as string;
    const externalId = formData.get('externalId') as string;
    const documento = formData.get('documento') as string;
    const correo = formData.get('correo') as string; // Ahora siempre requerido
    const comentarios = formData.get('comentarios') as string;
    
    // Validate required fields
    if (!tipoProblema || !comentarios || !correo) {
      return NextResponse.json(
        { error: 'Campos obligatorios faltantes (tipo de problema, comentarios o correo)' },
        { status: 400 }
      );
    }
    
    // Validate that we have either externalId OR documento (cuando se olvidó el external ID)
    const esOlvidoExternalId = tipoProblema === 'Olvidé mi External ID';
    
    if (!esOlvidoExternalId && !externalId) {
      return NextResponse.json(
        { error: 'External ID es obligatorio para este tipo de problema' },
        { status: 400 }
      );
    }
    
    if (esOlvidoExternalId && !documento) {
      return NextResponse.json(
        { error: 'Documento es obligatorio cuando se olvidó el External ID' },
        { status: 400 }
      );
    }

    // Generate a unique ticket number
    const ticketNumber = generateTicketNumber();
    
    // Process file uploads if any
    const files = formData.getAll('files') as File[];
    const fileUrls: { filename: string; url: string }[] = [];
    
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const filePath = `${externalId || documento}/${fileName}`;
          
          // Convert file to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          
          // Upload to Supabase storage
          const { data, error } = await supabase.storage
            .from('support-attachments')
            .upload(filePath, buffer, {
              contentType: file.type,
            });
            
          if (error) {
            console.error('Error uploading file:', error);
            continue;
          }
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('support-attachments')
            .getPublicUrl(filePath);
            
          fileUrls.push({
            filename: file.name,
            url: urlData.publicUrl,
          });
        }
      }
    }
    
    // Save ticket to database
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        ticket_number: ticketNumber,
        tipo_problema: tipoProblema,
        external_id: externalId || null,
        documento: esOlvidoExternalId ? documento : null,
        correo: correo, // Ahora siempre guardamos el correo
        comentarios,
        archivos: fileUrls.length > 0 ? fileUrls : null,
        estado: 'pendiente',
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating ticket:', error);
      return NextResponse.json(
        { error: 'Error al crear el ticket. Por favor, inténtalo de nuevo.' },
        { status: 500 }
      );
    }
    
    // Enviar correos de notificación
    try {
      // Correo para el usuario - ahora siempre tenemos el correo
      await sendTicketConfirmationEmail(
        correo,
        ticketNumber,
        tipoProblema
      );
      
      // Correo para el equipo de soporte
      await sendSupportNotificationEmail(
        ticketNumber,
        tipoProblema,
        externalId,
        documento,
        correo,
        comentarios
      );
    } catch (emailError) {
      // No hacemos fallar la solicitud si hay error en los correos,
      // solo lo registramos
      console.error('Error sending notification emails:', emailError);
    }

    // Return success with ticket info
    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      ticket: {
        ticketNumber,
        id: data.id,
      },
    });
  } catch (error) {
    console.error('Error in support API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}