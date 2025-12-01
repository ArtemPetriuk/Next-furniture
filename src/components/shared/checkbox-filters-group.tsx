"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FilterChecboxProps, FilterCheckbox } from "./filter-checkbox";
import { Input, Skeleton } from "../ui";

type Item = FilterChecboxProps;

interface Props {
  title: string;
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  loading?: boolean;
  searchInputPlaceholder?: string;
  onClickCheckbox?: (id: string) => void;
  defaultValue?: string[];
  selected?: Set<string>;
  className?: string;
  name?: string;
  expandedContent?: React.ReactNode;
  showSearch?: boolean;
  searchValue?: string;
}

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = "Wyszukiwanie...",
  className,
  loading,
  onClickCheckbox,
  selected,
  name,
  expandedContent,
  searchValue = "",
  showSearch = false,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue1, setSearchValue] = React.useState("");

  const onChangeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  if (loading) {
    return (
      <div className={className}>
        <p className="font-bold mb-3">{title}</p>

        {...Array(limit)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-6 mb-4 rounded-[8px]" />
          ))}

        <Skeleton className="w-28 h-6 mb-4 rounded-[8px]" />
      </div>
    );
  }

  const filteredItems = items.filter((item) =>
    item.text.toLowerCase().includes(searchValue.toLowerCase())
  );

  const list = showAll
    ? filteredItems
    : (filteredItems || items).slice(0, limit);

  return (
    <div className={className}>
      {showSearch && (
        <div className="mb-5">
          <Input
            onChange={onChangeSearchInput}
            value={searchValue1}
            placeholder={searchInputPlaceholder}
            className="bg-gray-50 border-none"
          />
        </div>
      )}

      <div className="space-y-5">
        <div>
          <p className="font-bold mb-3">{title}</p>
          <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
            {list.map((item, index) => (
              <FilterCheckbox
                key={`${name}-${index}`}
                text={item.text}
                value={item.value}
                endAdornment={item.endAdornment}
                checked={selected?.has(item.value)}
                onCheckedChange={() => onClickCheckbox?.(item.value)}
                name={name}
              />
            ))}
          </div>
        </div>

        {showAll && expandedContent}
      </div>

      {(items.length > limit || expandedContent) && (
        <div className="mt-4">
          <button onClick={() => setShowAll(!showAll)} className="text-primary">
            {showAll ? "Ukryj" : "+ Pokaż wszystko"}
          </button>
        </div>
      )}
    </div>
  );
};
