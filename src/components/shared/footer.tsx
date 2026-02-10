import React from "react";
import { Container } from "./container";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const Footer: React.FC<Props> = ({ className }) => {
  return (
    <footer className={cn("mt-auto border-t bg-white", className)}>
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 1. Логотип та опис */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black uppercase">Next Furniture</h2>
            </div>
            <p className="text-sm text-gray-500">
              Twój ulubiony sklep meblowy. Tworzymy komfort i styl w Twoim domu.
              Wygodniej się nie da!
            </p>

            <div className="mt-2 flex gap-4">
              <Link
                href="#"
                className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              >
                <Facebook size={20} className="text-blue-600" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              >
                <Instagram size={20} className="text-pink-600" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              >
                <Twitter size={20} className="text-blue-400" />
              </Link>
            </div>
          </div>

          {/* 2. Категорії (Oferta) */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Oferta</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="transition hover:text-primary">
                  Sofy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition hover:text-primary">
                  Stoły
                </Link>
              </li>
              <li>
                <Link href="/" className="transition hover:text-primary">
                  Szafy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition hover:text-primary">
                  Łóżka
                </Link>
              </li>
              <li>
                <Link href="/" className="transition hover:text-primary">
                  Krzesła
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Контакти (ПЕРЕНЕСЕНО СЮДИ) */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Kontakt</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-500">
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>+48 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>kontakt@next-furniture.pl</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5" />
                <span>
                  ul. Meblowa 12
                  <br />
                  00-001 Warszawa
                </span>
              </li>
              <li className="mt-2 flex items-center gap-3">
                <CreditCard size={18} />
                <span>Visa / MasterCard / BLIK</span>
              </li>
            </ul>
          </div>

          {/* 4. Google Maps (НОВЕ) */}
          <div className="h-full min-h-[200px] w-full overflow-hidden rounded-lg border bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.435728560049!2d21.0062323!3d52.2355556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc669a869f01%3A0x72f0be2a88ead3fc!2sWarszawa%2C%20Polska!5e0!3m2!1spl!2sua!4v1700000000000!5m2!1spl!2sua"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "200px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>

      <div className="border-t bg-gray-50 py-6">
        <Container className="flex flex-col items-center justify-between text-sm text-gray-400 md:flex-row">
          <span>© 2026 Next Furniture. Wszelkie prawa zastrzeżone.</span>
          <div className="mt-2 flex gap-4 md:mt-0">
            <Link href="#" className="hover:text-gray-600">
              Polityka prywatności
            </Link>
            <Link href="#" className="hover:text-gray-600">
              Regulamin
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};
