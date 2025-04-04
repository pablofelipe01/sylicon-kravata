import { createClient } from '@supabase/supabase-js';

// Asegúrate de que estas variables estén definidas en tu archivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para nuestras tablas
export type Token = {
  id: string;
  token_address: string;
  protocol: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type Seller = {
  id: string;
  external_id: string;
  wallet_id: string;
  wallet_address: string;
  created_at?: string;
  updated_at?: string;
};

export type Offer = {
  id: string;
  seller_id: string;
  token_id: string;
  quantity: number;
  price_per_token: number;
  status: 'active' | 'sold' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  
  // Campos de relaciones (se agregarán con joins)
  token?: Token;
  seller?: Seller;
};

export type Order = {
  id: string;
  buyer_external_id: string;
  buyer_wallet_id: string;
  offer_id: string;
  quantity: number;
  total_price: number;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at?: string;
  updated_at?: string;
  
  // Campos de relaciones (se agregarán con joins)
  offer?: Offer;
};

// Funciones de utilidad para interactuar con Supabase

// Tokens
export const getTokens = async (): Promise<Token[]> => {
  const { data, error } = await supabase
    .from('tokens')
    .select('*');
  
  if (error) throw error;
  return data || [];
};

export const getTokenByAddress = async (address: string): Promise<Token | null> => {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('token_address', address)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No se encontró el token
    throw error;
  }
  
  return data;
};

// Sellers
export const getSellerByExternalId = async (externalId: string): Promise<Seller | null> => {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('external_id', externalId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No se encontró el vendedor
    throw error;
  }
  
  return data;
};

export const createOrUpdateSeller = async (seller: Omit<Seller, 'id' | 'created_at' | 'updated_at'>): Promise<Seller> => {
  // Primero verificamos si el vendedor ya existe
  const existingSeller = await getSellerByExternalId(seller.external_id);
  
  if (existingSeller) {
    // Actualizar vendedor existente
    const { data, error } = await supabase
      .from('sellers')
      .update({
        wallet_id: seller.wallet_id,
        wallet_address: seller.wallet_address,
        updated_at: new Date().toISOString()
      })
      .eq('external_id', seller.external_id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Crear nuevo vendedor
    const { data, error } = await supabase
      .from('sellers')
      .insert(seller)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Función para sincronizar datos del vendedor (añadida aquí para corregir el error de exportación)
export const syncSellerData = async (externalId: string, walletId: string, walletAddress: string) => {
  try {
    const { data: existingSeller, error: fetchError } = await supabase
      .from('sellers')
      .select('*')
      .eq('external_id', externalId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (existingSeller) {
      // Actualizar si es necesario
      if (existingSeller.wallet_id !== walletId || existingSeller.wallet_address !== walletAddress) {
        const { data: updatedSeller, error: updateError } = await supabase
          .from('sellers')
          .update({
            wallet_id: walletId,
            wallet_address: walletAddress,
            updated_at: new Date().toISOString()
          })
          .eq('external_id', externalId)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return updatedSeller;
      }
      
      return existingSeller;
    } else {
      // Crear nuevo vendedor
      const { data: newSeller, error: insertError } = await supabase
        .from('sellers')
        .insert({
          external_id: externalId,
          wallet_id: walletId,
          wallet_address: walletAddress
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      return newSeller;
    }
  } catch (error) {
    console.error('Error al sincronizar datos del vendedor:', error);
    throw error;
  }
};

// Offers
export const getActiveOffers = async (): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      token:token_id(*),
      seller:seller_id(*)
    `)
    .eq('status', 'active');
  
  if (error) throw error;
  return data || [];
};

export const getOffersByToken = async (tokenId: string): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      token:token_id(*),
      seller:seller_id(*)
    `)
    .eq('token_id', tokenId)
    .eq('status', 'active');
  
  if (error) throw error;
  return data || [];
};

export const getOffersBySeller = async (sellerId: string): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      token:token_id(*)
    `)
    .eq('seller_id', sellerId);
  
  if (error) throw error;
  return data || [];
};

export const createOffer = async (offer: Omit<Offer, 'id' | 'created_at' | 'updated_at' | 'token' | 'seller'>): Promise<Offer> => {
  const { data, error } = await supabase
    .from('offers')
    .insert(offer)
    .select(`
      *,
      token:token_id(*),
      seller:seller_id(*)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateOfferStatus = async (offerId: string, status: Offer['status']): Promise<Offer> => {
  const { data, error } = await supabase
    .from('offers')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', offerId)
    .select(`
      *,
      token:token_id(*),
      seller:seller_id(*)
    `)
    .single();
  
  if (error) throw error;
  return data;
};

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'offer'>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select(`
      *,
      offer:offer_id(
        *,
        token:token_id(*),
        seller:seller_id(*)
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], transactionId?: string): Promise<Order> => {
  const updateData: unknown = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (transactionId) {
    updateData.transaction_id = transactionId;
  }
  
  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select(`
      *,
      offer:offer_id(
        *,
        token:token_id(*),
        seller:seller_id(*)
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

export const getOrdersByBuyer = async (buyerExternalId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      offer:offer_id(
        *,
        token:token_id(*),
        seller:seller_id(*)
      )
    `)
    .eq('buyer_external_id', buyerExternalId);
  
  if (error) throw error;
  return data || [];
};