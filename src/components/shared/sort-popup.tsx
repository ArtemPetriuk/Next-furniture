import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

interface Props {
  className?: string;
}

export const SortPopup: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "rouded-2xl inline-flex h-[52px] cursor-pointer items-center gap-1 bg-gray-50 px-5",
        className,
      )}
    >
      <ArrowUpDown size={16} />
      <b>sortowanie</b>
      <b className="text-primary"> Popularne </b>
    </div>
  );
};
