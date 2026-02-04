import React from 'react';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';

export interface FilterCheckboxProps {
  text: string;
  value: string;
  endAdornment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  name?: string;
}

export const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  text,
  value,
  endAdornment,
  onCheckedChange,
  checked,
  name,
}) => {
  return (
    <label
      className={cn(
        "group flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border",
        checked 
          ? "bg-violet-50 border-violet-500 shadow-sm" 
          : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
      )}
      htmlFor={`checkbox-${String(name)}-${String(value)}`}
    >
      <Checkbox
        onCheckedChange={onCheckedChange}
        checked={checked}
        value={value}
        className="rounded-[6px] w-5 h-5 flex-shrink-0"
        id={`checkbox-${String(name)}-${String(value)}`}
      />
      <span className={cn(
        "text-sm leading-tight flex-1", 
        checked ? "font-semibold text-violet-800" : "text-gray-600 group-hover:text-gray-900"
      )}>
        {text}
      </span>
      
      {endAdornment}
    </label>
  );
};