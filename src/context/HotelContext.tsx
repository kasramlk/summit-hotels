import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Hotel {
  id: string;
  name: string;
  location: string;
  description?: string;
  role?: string;
}

interface HotelContextType {
  selectedHotel: Hotel | null;
  hotels: Hotel[];
  loading: boolean;
  setSelectedHotel: (hotel: Hotel) => void;
  refreshHotels: () => Promise<void>;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserHotels = async () => {
    if (!user) {
      setHotels([]);
      setSelectedHotel(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_hotels')
        .select(`
          role,
          hotels (
            id,
            name,
            location,
            description
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const userHotels = data?.map(item => ({
        ...item.hotels,
        role: item.role
      })) || [];

      setHotels(userHotels);
      
      if (userHotels.length > 0 && !selectedHotel) {
        setSelectedHotel(userHotels[0]);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshHotels = async () => {
    setLoading(true);
    await fetchUserHotels();
  };

  useEffect(() => {
    fetchUserHotels();
  }, [user]);

  const value = {
    selectedHotel,
    hotels,
    loading,
    setSelectedHotel,
    refreshHotels,
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};