"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { deleteVariant } from "@/app/actions/delete-variant";
import { toast } from "react-hot-toast";

interface Props {
  id: number; // ID конкретного ProductItem
}

export const DeleteVariantButton: React.FC<Props> = ({ id }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const onClickDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć ten konkretny wariant?")) return;

    setIsDeleting(true);
    const result = await deleteVariant(id);

    if (result.success) {
      toast.success("Wariant został usunięty");
    } else {
      toast.error(
        "Błąd: Nie można usunąć wariantu (może jest w активному замовленні)",
      );
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={onClickDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 transition-all hover:text-red-500 disabled:opacity-50"
      title="Usuń ten wariant"
    >
      <Trash2 size={18} />
    </button>
  );
};
