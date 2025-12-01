import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { useSet } from "react-use";

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}
interface QueryFilters extends PriceProps {
  opcija: string;
  selected: string;
}

export interface Filters {
  opcija: Set<string>;
  selected: Set<string>;
  prices: PriceProps;
}

interface ReturnProps extends Filters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setOpcija: (value: string) => void;
  setSelectedAdditionally: (value: string) => void;
}

export const useFilters = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as Map<
    keyof QueryFilters,
    string
  >;

  const [selected, { toggle: toggleSelected }] = useSet(
    new Set<string>(searchParams.get("selected")?.split(","))
  );

  const [opcija, { toggle: toggleOpcija }] = useSet(
    new Set<string>(
      searchParams.has("opcija") ? searchParams.get("opcija")?.split(",") : []
    )
  );
  const [prices, setPrices] = React.useState<PriceProps>({
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
      opcija,
      selected,
      prices,
      setPrices: updatePrice,
      setOpcija: toggleOpcija,
      setSelectedAdditionally: toggleSelected,
    }),
    [opcija, selected, prices]
  );
};
