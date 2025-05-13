// /app/api/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOfferById, updateOfferQuantity } from "@/app/lib/supabase";
import { getPseUrl } from "@/app/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { offerId, quantity, buyerExternalId, buyerWalletId, buyerWalletAddress } = body;

    if (!offerId || !quantity || !buyerExternalId || !buyerWalletId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // 1. Obtener la oferta para verificar disponibilidad
    const offer = await getOfferById(offerId);
    
    if (!offer) {
      return NextResponse.json(
        { error: "Oferta no encontrada" },
        { status: 404 }
      );
    }
    
    if (offer.status !== 'active') {
      return NextResponse.json(
        { error: "Esta oferta ya no está activa" },
        { status: 400 }
      );
    }
    
    if (offer.quantity < quantity) {
      return NextResponse.json(
        { error: "No hay suficientes tokens disponibles" },
        { status: 400 }
      );
    }

    // 2. Crear la orden
    const totalPrice = quantity * offer.price_per_token;
    
    const order = await createOrder({
      buyer_external_id: buyerExternalId,
      buyer_wallet_id: buyerWalletId,
      offer_id: offerId,
      quantity: quantity,
      total_price: totalPrice,
      status: 'pending'
    });

    // 3. Actualizar la cantidad de la oferta
    const remainingQuantity = offer.quantity - quantity;
    
    if (remainingQuantity > 0) {
      // Si quedaron tokens, actualizar la cantidad
      await updateOfferQuantity(offerId, remainingQuantity);
    } else {
      // Si se vendieron todos, marcar como vendida
      await updateOfferQuantity(offerId, 0); // Esto marcará la oferta como 'sold'
    }

    // 4. Obtener URL de PSE
    const pseData = await getPseUrl(order.id);

    return NextResponse.json({
      success: true,
      transactionId: order.id,
      pseURL: pseData.pseURL,
      remainingQuantity
    });
  } catch (error) {
    console.error("Error al procesar la compra:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al procesar la compra" },
      { status: 500 }
    );
  }
}