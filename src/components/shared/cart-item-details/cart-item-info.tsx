import { cn } from "@/lib/utils";

interface Props {
  name: string;
  details: string;
  variant?: string;
  className?: string;
}

export const CartItemInfo: React.FC<Props> = ({ name, details, variant, className }) => {
  return (
    <div>
      <div className={cn("flex items-center justify-between", className)}>
        <h2 className="text-lg font-bold flex-1 leading-6">{name}</h2>
      </div>
      {variant && <p className="text-xs text-gray-600 w-[90%]">{variant}</p>}
      {details && <p className="text-xs text-gray-400 w-[90%]">{details}</p>}
    </div>
  );
};
