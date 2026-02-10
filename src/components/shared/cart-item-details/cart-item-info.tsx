import { cn } from "@/lib/utils";

interface Props {
  name: string;
  details: string;
  variant?: string;
  className?: string;
}

export const CartItemInfo: React.FC<Props> = ({
  name,
  details,
  variant,
  className,
}) => {
  return (
    <div>
      <div className={cn("flex items-center justify-between", className)}>
        <h2 className="flex-1 text-lg font-bold leading-6">{name}</h2>
      </div>
      {variant && <p className="w-[90%] text-xs text-gray-600">{variant}</p>}
      {details && <p className="w-[90%] text-xs text-gray-400">{details}</p>}
    </div>
  );
};
