import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import { Button } from "../ui";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("border border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/*left */}
        <Link href="/">
          <div
            className="flex items-center space-x-0"
            style={{ margin: 0, padding: 0 }}
          >
            <Image
              src="/images/logo1.png"
              alt="Logo"
              width={65}
              height={65}
              priority
              className="inline-block"
              style={{ margin: 0, padding: 0, display: "inline-block" }}
            />
            <div className="inline-block" style={{ margin: 0, padding: 0 }}>
              <h1 className="text-lg uppercase font-black">Next Furniture</h1>
              <p className="text-sm text-gray-400 leading-3">
                wygodniej się nie da
              </p>
            </div>
          </div>
        </Link>

        <div className="mx-10 flex-1">
          <SearchInput />
        </div>

        {/*right */}
        <div className="flex items-center gap-3">
          <Button variant={"outline"} className="flex items-center gap-1">
            <User size={16} />
            Logowanie
          </Button>

          <CartButton />
        </div>
      </Container>
    </header>
  );
};
