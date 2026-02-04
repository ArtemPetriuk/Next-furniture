import { useSearchParams } from "next/navigation";
import { useSet } from "react-use";
import React, { useState } from "react";

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface QueryFilters extends PriceProps {
  rooms: string;
  office_zones: string;
  cafe_zones: string;
  hotel_zones: string;
}

export interface Filters {
  rooms: Set<string>;
  office_zones: Set<string>;
  cafe_zones: Set<string>;
  hotel_zones: Set<string>;
  prices: PriceProps;
}

interface ReturnProps extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  
  // Методи для перемикання (галочки)
  setRooms: (value: string) => void;
  setOfficeZones: (value: string) => void;
  setCafeZones: (value: string) => void;
  setHotelZones: (value: string) => void;

  // 🔥 НОВІ МЕТОДИ: Очищення списків
  clearRooms: () => void;
  clearOfficeZones: () => void;
  clearCafeZones: () => void;
  clearHotelZones: () => void;
}

export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;

  // --- 1. Створюємо Сети + дістаємо метод clear ---
  
  const [rooms, { toggle: toggleRooms, clear: clearRooms }] = useSet(
    new Set<string>(searchParams.get("rooms")?.split(",") || [])
  );

  const [office_zones, { toggle: toggleOfficeZones, clear: clearOfficeZones }] = useSet(
    new Set<string>(searchParams.get("office_zones")?.split(",") || [])
  );

  const [cafe_zones, { toggle: toggleCafeZones, clear: clearCafeZones }] = useSet(
    new Set<string>(searchParams.get("cafe_zones")?.split(",") || [])
  );

  const [hotel_zones, { toggle: toggleHotelZones, clear: clearHotelZones }] = useSet(
    new Set<string>(searchParams.get("hotel_zones")?.split(",") || [])
  );

  // --- 2. Ціна ---
  const [prices, setPrices] = useState<PriceProps>({
    priceFrom: Number(searchParams.get("priceFrom")) || undefined,
    priceTo: Number(searchParams.get("priceTo")) || undefined,
  });

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrices((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return React.useMemo(
    () => ({
      rooms,
      office_zones,
      cafe_zones,
      hotel_zones,
      prices,
      setPrices: updatePrice,
      
      // Toggle
      setRooms: toggleRooms,
      setOfficeZones: toggleOfficeZones,
      setCafeZones: toggleCafeZones,
      setHotelZones: toggleHotelZones,

      // 🔥 Clear (Експортуємо нові функції)
      clearRooms,
      clearOfficeZones,
      clearCafeZones,
      clearHotelZones,
    }),
    [rooms, office_zones, cafe_zones, hotel_zones, prices]
  );
};