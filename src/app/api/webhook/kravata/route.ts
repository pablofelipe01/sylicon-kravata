
import { NextRequest, NextResponse } from "next/server";

// Opcional: Verificación de seguridad para asegurar que las solicitudes provengan de Kravata
const verifyKravataSignature = (_req: NextRequest) => {
  // Aquí implementarías la lógica para verificar la firma/autenticidad de la solicitud
  // Por ejemplo, usando un header de seguridad proporcionado por Kravata
  
  // const signature = _req.headers.get('x-kravata-signature');
  // const secret = process.env.WEBHOOK_SECRET;
  
  // Retorna true si la verificación es exitosa
  return true;
};

// Handler para procesar notificaciones del webhook
export async function POST(request: NextRequest) {
  try {
    // Opcional: Verificación de seguridad
    if (!verifyKravataSignature(request)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    
    // Obtener el cuerpo de la solicitud
    const webhookData = await request.json();
    
    // Log para depuración (se pueden eliminar en producción)
    console.log("Webhook recibido de Kravata:", webhookData);
    
    // Procesar según el tipo de evento
    if (webhookData.eventType === "kyc.approved") {
      // Usuario aprobado
      // Aquí podrías:
      // 1. Actualizar tu base de datos
      // 2. Enviar un email al usuario
      // 3. Activar alguna funcionalidad en tu aplicación
      await handleApprovedUser(webhookData);
    } else if (webhookData.eventType === "kyc.rejected") {
      // Usuario rechazado
      await handleRejectedUser(webhookData);
    } else if (webhookData.eventType === "kyc.pending") {
      // Usuario pendiente de revisión adicional
      await handlePendingUser(webhookData);
    }
    
    // Responder a Kravata para confirmar recepción exitosa
    return NextResponse.json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing Kravata webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

// Tipos para los diferentes eventos
interface KycApprovedEvent {
  eventType: "kyc.approved";
  externalId: string;
  userId: string;
  timestamp: string;
  [key: string]: unknown;
}

interface KycRejectedEvent {
  eventType: "kyc.rejected";
  externalId: string;
  rejectionReason: string;
  [key: string]: unknown;
}

interface KycPendingEvent {
  eventType: "kyc.pending";
  externalId: string;
  [key: string]: unknown;
}

type KycEvent = KycApprovedEvent | KycRejectedEvent | KycPendingEvent;

// Funciones para manejar diferentes estados de usuarios
async function handleApprovedUser(data: KycApprovedEvent) {
  const { externalId, userId } = data;
  // Nota: timestamp no se usa actualmente, pero lo mantenemos en la desestructuración
  // para documentación y uso futuro
  
  console.log(`Usuario aprobado: ${externalId} con ID de Kravata: ${userId}`);
  
  // Ejemplo: Actualizar en base de datos (usando tu lógica de persistencia)
  // await db.users.update({
  //   where: { externalId },
  //   data: { 
  //     kycStatus: 'APPROVED',
  //     kycApprovedAt: new Date(data.timestamp),
  //     kravataUserId: userId
  //   }
  // });
  
  // Ejemplo: Enviar notificación al usuario
  // await sendNotification(externalId, "¡Felicidades! Tu verificación KYC ha sido aprobada.");
}

async function handleRejectedUser(data: KycRejectedEvent) {
  const { externalId, rejectionReason } = data;
  
  console.log(`Usuario rechazado: ${externalId}. Razón: ${rejectionReason}`);
  
  // Actualizar estado en base de datos
  // await db.users.update({
  //   where: { externalId },
  //   data: { 
  //     kycStatus: 'REJECTED',
  //     kycRejectedReason: rejectionReason
  //   }
  // });
  
  // Notificar al usuario sobre el rechazo y pasos a seguir
  // await sendNotification(externalId, `Tu verificación KYC ha sido rechazada: ${rejectionReason}`);
}

async function handlePendingUser(data: KycPendingEvent) {
  const { externalId } = data;
  
  console.log(`Usuario pendiente de revisión adicional: ${externalId}`);
  
  // Actualizar estado en base de datos
  // await db.users.update({
  //   where: { externalId },
  //   data: { kycStatus: 'PENDING_REVIEW' }
  // });
  
  // Notificar al usuario
  // await sendNotification(externalId, "Tu verificación está en revisión adicional.");
}