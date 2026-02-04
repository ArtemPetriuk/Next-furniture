"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FilterCheckboxProps, FilterCheckbox } from "./filter-checkbox";
import { Input, Skeleton } from "../ui";

type Item = FilterCheckboxProps;

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
        <p className="mb-3 font-bold">{title}</p>

        {...Array(limit)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="mb-4 h-6 rounded-[8px]" />
          ))}

        <Skeleton className="mb-4 h-6 w-28 rounded-[8px]" />
      </div>
    );
  }

  const filteredItems = items.filter((item) =>
    item.text.toLowerCase().includes(searchValue.toLowerCase()),
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
            className="border-none bg-gray-50"
          />
        </div>
      )}

      <div className="space-y-5">
        <div>
          <p className="mb-3 font-bold">{title}</p>
          <div className="scrollbar flex max-h-96 flex-col gap-3 overflow-auto pr-2">
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
