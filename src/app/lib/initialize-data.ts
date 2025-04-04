import { supabase, Token, Seller, createOrUpdateSeller } from './supabase';

// Función para inicializar los datos
export const initializeMarketplaceData = async () => {
  try {
    console.log('Inicializando datos del marketplace...');
    
    // Verificar si ya existen datos
    const { count: tokenCount } = await supabase
      .from('tokens')
      .select('*', { count: 'exact', head: true });
    
    if (tokenCount && tokenCount > 0) {
      console.log('Los datos ya están inicializados.');
      return;
    }
    
    // Insertar token de ejemplo
    const tokenData: Omit<Token, 'id' | 'created_at' | 'updated_at'> = {
      token_address: '0x69aA2Ed12E241E0ea19e0061B99976d3Fb7e5d4F',
      protocol: '1155',
      name: 'Inmobiliario Sylicon',
      description: 'Token que representa una fracción de propiedad inmobiliaria tokenizada.',
      image_url: '/Token1.webp'
    };
    
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .insert(tokenData)
      .select()
      .single();
    
    if (tokenError) {
      throw tokenError;
    }
    
    console.log('Token insertado:', token);
    
    // Insertar vendedor de ejemplo (test004)
    const sellerData: Omit<Seller, 'id' | 'created_at' | 'updated_at'> = {
      external_id: 'test004',
      wallet_id: 'a33e2d11-8fa3-44d8-b6a0-a43449a881ad',
      wallet_address: '0xaa03f3e68ac41954f21bf4bdcd4d99b8f7a0d1f2'
    };
    
    // Usar la función createOrUpdateSeller en lugar de insertar directamente
    const seller = await createOrUpdateSeller(sellerData);
    
    console.log('Vendedor insertado/actualizado:', seller);
    
    // Insertar oferta de ejemplo
    const offerData = {
      seller_id: seller.id,
      token_id: token.id,
      quantity: 5,
      price_per_token: 500000,
      status: 'active' as const
    };
    
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .insert(offerData)
      .select()
      .single();
    
    if (offerError) {
      throw offerError;
    }
    
    console.log('Oferta insertada:', offer);
    console.log('Inicialización completada con éxito!');
  } catch (error) {
    console.error('Error al inicializar datos:', error);
    throw error;
  }
};

// Función para sincronizar datos del vendedor con la billetera
export const syncSellerData = async (externalId: string, walletId: string, walletAddress: string) => {
  try {
    return await createOrUpdateSeller({
      external_id: externalId,
      wallet_id: walletId,
      wallet_address: walletAddress
    });
  } catch (error) {
    console.error('Error al sincronizar datos del vendedor:', error);
    throw error;
  }
};