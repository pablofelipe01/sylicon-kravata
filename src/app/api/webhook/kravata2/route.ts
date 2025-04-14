// src/app/api/webhook/kravata2/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/app/lib/supabase';

// Verificación de seguridad básica - Puede mejorarse en producción
const verifyKravataSignature = (_req: NextRequest) => {
  // Aquí podrías implementar una verificación de seguridad más robusta
  // Por ejemplo, verificar una cabecera con una firma usando un secreto compartido
  return true;
};

// URL del webhook en producción
const WEBHOOK_URL = "https://sylicon-kravata.vercel.app/api/webhook/kravata2";

// Handler para procesar notificaciones de transacciones
export async function POST(request: NextRequest) {
  try {
    // Verificación de seguridad
    if (!verifyKravataSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    // Obtener el cuerpo de la solicitud
    const webhookData = await request.json();
    
    // Log para depuración
    console.log("Webhook de transacción recibido:", JSON.stringify(webhookData, null, 2));
    
    // Crear cliente Supabase
    const supabase = createClient();
    
    // Procesar según el tipo de evento
    if (webhookData.eventType === "transaction.completed") {
      // Extraer datos relevantes
      const { 
        transactionId,    // ID de la transacción en Kravata
        token,            // Símbolo del token
        amount,           // Cantidad de tokens en la transacción
        externalId,       // ID externo del usuario
        offerId           // ID de la oferta relacionada (debe estar en el payload)
      } = webhookData.data;
      
      // Validación básica
      if (!transactionId || !offerId || !amount) {
        console.error("Datos incompletos en el webhook:", webhookData.data);
        return NextResponse.json({ 
          success: false, 
          error: "Datos incompletos en la notificación" 
        }, { status: 400 });
      }
      
      console.log(`Procesando transacción completada para oferta ${offerId}, cantidad: ${amount}`);
      
      // 1. Buscar la orden asociada a esta transacción
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('id, status')
        .eq('transaction_id', transactionId)
        .single();
      
      // Si no se encuentra la orden por transactionId, podemos buscarla por offer_id
      if (orderError && orderError.code === 'PGRST116') {
        console.log("No se encontró orden por transaction_id, buscando por offer_id y status");
        const { data: pendingOrders, error: pendingError } = await supabase
          .from('orders')
          .select('id, status')
          .eq('offer_id', offerId)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1);
        
        // Si encontramos una orden pendiente, la actualizamos
        if (!pendingError && pendingOrders && pendingOrders.length > 0) {
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: 'completed',
              transaction_id: transactionId
            })
            .eq('id', pendingOrders[0].id);
          
          if (updateError) {
            console.error("Error al actualizar la orden:", updateError);
            return NextResponse.json({ 
              success: false, 
              error: "Error al actualizar orden" 
            }, { status: 500 });
          }
          
          console.log(`Orden ${pendingOrders[0].id} actualizada con transactionId ${transactionId}`);
        } else {
          console.log("No se encontró ninguna orden pendiente para esta oferta");
        }
      } else if (orderError) {
        console.error("Error al buscar la orden:", orderError);
      } else if (orderData && orderData.status !== 'completed') {
        // Si encontramos la orden y no está completada, la actualizamos
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'completed' })
          .eq('id', orderData.id);
        
        if (updateError) {
          console.error("Error al actualizar la orden:", updateError);
        } else {
          console.log(`Orden ${orderData.id} marcada como completada`);
        }
      }
      
      // 2. Actualizar la oferta (independientemente de si encontramos la orden)
      // Primero obtenemos la oferta actual
      const { data: offerData, error: offerError } = await supabase
        .from('offers')
        .select('quantity, status')
        .eq('id', offerId)
        .single();
      
      if (offerError) {
        console.error("Error al obtener la oferta:", offerError);
        return NextResponse.json({ 
          success: false, 
          error: "Error al obtener oferta" 
        }, { status: 500 });
      }
      
      // Calcular cantidad restante
      const remainingQuantity = Math.max(0, offerData.quantity - amount);
      
      // Actualizar la oferta según la cantidad restante
      if (remainingQuantity <= 0) {
        // Si no quedan tokens, marcar como vendida
        const { error: updateError } = await supabase
          .from('offers')
          .update({ 
            status: 'sold',
            quantity: 0 // Establecer en 0 para evitar valores negativos
          })
          .eq('id', offerId);
        
        if (updateError) {
          console.error("Error al actualizar la oferta:", updateError);
          return NextResponse.json({ 
            success: false, 
            error: "Error al actualizar oferta" 
          }, { status: 500 });
        }
        
        console.log(`Oferta ${offerId} marcada como vendida`);
      } else {
        // Si quedan tokens, actualizar la cantidad
        const { error: updateError } = await supabase
          .from('offers')
          .update({ quantity: remainingQuantity })
          .eq('id', offerId);
        
        if (updateError) {
          console.error("Error al actualizar la oferta:", updateError);
          return NextResponse.json({ 
            success: false, 
            error: "Error al actualizar oferta" 
          }, { status: 500 });
        }
        
        console.log(`Oferta ${offerId} actualizada con cantidad ${remainingQuantity}`);
      }
    } else {
      console.log(`Evento desconocido o no manejado: ${webhookData.eventType}`);
    }
    
    // Responder con éxito
    return NextResponse.json({ 
      success: true, 
      message: "Webhook procesado correctamente" 
    });
  } catch (error) {
    console.error("Error procesando webhook de transacción:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error procesando webhook", 
        details: error instanceof Error ? error.message : "Error desconocido" 
      }, 
      { status: 500 }
    );
  }
}