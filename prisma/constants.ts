export const categories = [
  { name: "Sofy" },
  { name: "Stoły" },
  { name: "Szafy" },
  { name: "Łóżka" },
  { name: "Krzesła" },
  { name: "Półki" },
  { name: "Meble ogrodowe" },
  { name: "Meble łazienkowe" },
];

export const _additionally = [
  // 🛋️ Sofy (categoryId: 1)
  {
    name: "Wymiana obicia (skóra ekologiczna)",
    price: 1299, // PLN
    imageUrl: "/images/szkora.png",
  },
  {
    name: "Dodatkowe poduszki (komplet 4 szt)",
    price: 349, // PLN
    imageUrl: "/images/poduszki.png",
  },
  {
    name: "Mechanizm rozkładany (funkcja spania)",
    price: 899, // PLN
    imageUrl: "/images/Mec.png",
  },
  {
    name: "Podnóżek dopasowany kolorystycznie",
    price: 449, // PLN
    imageUrl: "/images/podn.png",
  },

  // 🍽️ Stoły (categoryId: 2)
  {
    name: "Powłoka antypoślizgowa premium",
    price: 299, // PLN
    imageUrl: "/images/pow.png",
  },
  {
    name: "Krzesło obiadowe (pojedyncze)",
    price: 399, // PLN
    imageUrl: "/images/krzes.png",
  },
  {
    name: "Nakładka ochronna ze szkła hartowanego",
    price: 499, // PLN
    imageUrl: "/images/nakladka.png",
  },

  // 🚪 Szafy (categoryId: 3)
  {
    name: "System oświetlenia LED (z czujnikiem ruchu)",
    price: 799, // PLN
    imageUrl: "/images/led.png",
  },
  {
    name: "Komplet wieszaków premium (10 szt)",
    price: 199, // PLN
    imageUrl: "/images/wieszak.png",
  },

  // 🛏️ Łóżka (categoryId: 4)
  {
    name: "Stelaż ortopedyczny z regulacją",
    price: 999, // PLN
    imageUrl: "/images/lozko.png",
  },
  {
    name: "Pokrowiec antyalergiczny",
    price: 449, // PLN
    imageUrl: "/images/anty.png",
  },

  // 🌿 Meble ogrodowe (categoryId: 7)
  {
    name: "Pokrowiec wodoodporny (sezonowy)",
    price: 349, // PLN
    imageUrl: "/images/woda.png",
  },
  {
    name: "Komplet poduszek ogrodowych (4 szt)",
    price: 299, // PLN
    imageUrl: "/images/ogorod.png",
  },

  // 🔧 Usługi
  {
    name: "Profesjonalny montaż u klienta",
    price: 399, // PLN
    imageUrl: "/images/klucz.png",
  },
  {
    name: "Gwarancja rozszerzona 5+ lat",
    price: 599, // PLN
    imageUrl: "/images/garantija.png",
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const filterOptions = [
  // --- УНІВЕРСАЛЬНІ (Підходять багатьом) ---
  { name: "Salon / Lobby", value: "salon", group: ["dom", "hotel", "biuro"] },
  {
    name: "Taras / Ogród",
    value: "taras",
    group: ["dom", "kawiarnia", "hotel"],
  },
  { name: "Recepcja", value: "recepcja", group: ["biuro", "hotel"] },
  { name: "Gabinet", value: "gabinet", group: ["dom", "biuro"] },
  { name: "Strefa Chillout", value: "chillout", group: ["biuro", "hotel"] },
  { name: "Bar", value: "bar", group: ["kawiarnia", "hotel"] },

  // --- ТІЛЬКИ ДІМ ---
  { name: "Sypialnia", value: "sypialnia", group: ["dom", "hotel"] }, // У готелі теж є спальні місця
  { name: "Kuchnia", value: "kuchnia", group: ["dom"] },
  { name: "Łazienka", value: "lazienka", group: ["dom", "hotel"] },
  { name: "Przedpokój", value: "przedpokoj", group: ["dom"] },
  { name: "Pokój dziecięcy", value: "dzieciecy", group: ["dom"] },

  // --- ТІЛЬКИ ОФІС ---
  { name: "Open Space", value: "open-space", group: ["biuro"] },
  {
    name: "Sala konferencyjna",
    value: "konferencyjna",
    group: ["biuro", "hotel"],
  },

  // --- ТІЛЬКИ КАВ'ЯРНЯ ---
  {
    name: "Sala główna",
    value: "sala-glowna",
    group: ["kawiarnia", "restauracja"],
  },
  { name: "Strefa VIP", value: "vip", group: ["kawiarnia", "hotel", "biuro"] },

  // --- ТІЛЬКИ ГОТЕЛЬ ---
  { name: "Pokój hotelowy", value: "pokoj", group: ["hotel"] },
  { name: "Restauracja hotelowa", value: "restauracja", group: ["hotel"] },
  { name: "Lobby hotelowe", value: "lobby", group: ["hotel"] },
];

export const products = [
  // 🛋️ Дивани та крісла (Категорія 1)
  {
    name: "Kanapa Milano",
    imageUrl: "/images/milano.webp",
    categoryId: 1,
    description:
      "Minimalistyczny styl skandynawski, idealna do małych salonów.",
    _filterTags: ["salon", "lobby", "gabinet", "chillout"],
    options: JSON.stringify([
      { name: "2-osobowa", price: 1899 },
      { name: "3-osobowa", price: 2499 },
      { name: "4-osobowa", price: 3199 },
    ]),
    colors: [
      { name: "Szary welur", hex: "#9ca3af" },
      { name: "Butelkowa zieleń", hex: "#166534" },
      { name: "Pudrowy róż", hex: "#fbcfe8" },
    ],
  },
  {
    name: "Kanapa Oslo",
    imageUrl: "/images/osloTes.webp",
    categoryId: 1,
    _filterTags: ["salon", "pokoj", "recepcja"],
    options: JSON.stringify([
      { name: "2-osobowa", price: 1699 },
      { name: "3-osobowa", price: 2299 },
    ]),
    colors: [
      { name: "Jasny szary", hex: "#e5e7eb" },
      { name: "Grafitowy", hex: "#374151" },
      { name: "Morski", hex: "#0f766e" },
    ],
  },
  {
    name: "Kanapa narożna",
    imageUrl: "/images/naruznik2.jpg",
    categoryId: 1,
    _filterTags: ["salon", "chillout", "open-space"],
    options: JSON.stringify([
      { name: "L-lewa", price: 2799 },
      { name: "L-prawa", price: 2799 },
      { name: "U-kształt", price: 3899 },
    ]),
    colors: [
      { name: "Szary", hex: "#9ca3af" },
      { name: "Beżowy", hex: "#d6cebe" },
      { name: "Czarny", hex: "#1f2937" },
    ],
  },
  {
    name: "Kanapa skórzana",
    imageUrl: "/images/narozna.jpg",
    categoryId: 1,
    description: "Luksusowa skóra naturalna, klasyczny design Chesterfield.",
    _filterTags: ["gabinet", "salon", "vip", "lobby"],
    options: JSON.stringify([
      { name: "Klasyczna", price: 3499 },
      { name: "Z funkcją spania", price: 4199 },
    ]),
    colors: [
      { name: "Czarna skóra", hex: "#111827" },
      { name: "Ciemny brąz", hex: "#451a03" },
      { name: "Koniakowy", hex: "#9a3412" },
    ],
  },
  {
    name: "Sofa modułowa",
    imageUrl: "/images/sofa-modulowa.webp",
    categoryId: 1,
    description: "Stwórz własny układ dzięki niezależnym modułom.",
    _filterTags: ["salon", "open-space", "chillout"],
    options: JSON.stringify([
      { name: "3 moduły", price: 2999 },
      { name: "5 modułów", price: 4499 },
    ]),
    colors: [
      { name: "Musztardowy", hex: "#ca8a04" },
      { name: "Antracyt", hex: "#374151" },
    ],
  },
  {
    name: "Pufa tapicerowana ze schowkiem",
    imageUrl: "/images/pufa.webp",
    categoryId: 1,
    description: "Wygodne siedzisko z ukrytym pojemnikiem na drobiazgi.",
    _filterTags: ["salon", "sypialnia", "przedpokoj"],
    options: JSON.stringify([
      { name: "Mała (40cm)", price: 299 },
      { name: "Duża (80cm)", price: 499 },
    ]),
    colors: [
      { name: "Szary welur", hex: "#9ca3af" },
      { name: "Butelkowa zieleń", hex: "#166534" },
    ],
  },

  // 🍽️ Столи (Категорія 2)
  {
    name: "Stół jadalniany Drewno",
    imageUrl: "/images/table dining.webp",
    categoryId: 2,
    description: "Lite drewno dębowe. Wymiary: 160x90 cm.",
    _filterTags: ["kuchnia", "salon", "restauracja", "sala-glowna"],
    options: JSON.stringify([
      { name: "120x80 cm", price: 899 },
      { name: "160x90 cm", price: 1299 },
      { name: "180x100 cm", price: 1599 },
    ]),
    colors: [
      { name: "Dąb naturalny", hex: "#c4a484" },
      { name: "Ciemny orzech", hex: "#5c4033" },
      { name: "Bielone drewno", hex: "#e5e5e5" },
    ],
  },
  {
    name: "Stół kawowy Szklany",
    imageUrl: "/images/glass-table.webp",
    categoryId: 2,
    _filterTags: ["salon", "lobby", "chillout", "gabinet", "vip"],
    options: JSON.stringify([
      { name: "Okrągły", price: 599 },
      { name: "Kwadratowy", price: 649 },
      { name: "Prostokątny", price: 699 },
    ]),
    colors: [
      { name: "Czarne nogi", hex: "#000000" },
      { name: "Złote nogi", hex: "#fbbf24" },
      { name: "Srebrne nogi", hex: "#e5e7eb" },
    ],
  },
  {
    name: "Stolik nocny",
    imageUrl: "/images/night-table.webp",
    categoryId: 2,
    _filterTags: ["sypialnia", "pokoj", "dzieciecy", "hotel"],
    options: JSON.stringify([
      { name: "Z szufladą", price: 349 },
      { name: "Bez szuflady", price: 279 },
    ]),
    colors: [
      { name: "Biały mat", hex: "#ffffff" },
      { name: "Dąb Sonoma", hex: "#d1c4b2" },
      { name: "Czarny połysk", hex: "#111827" },
    ],
  },
  {
    name: "Stół rozkładany",
    imageUrl: "/images/folding-table.webp",
    categoryId: 2,
    _filterTags: ["salon", "kuchnia", "konferencyjna", "biuro"],
    options: JSON.stringify([
      { name: "Złożony 120 cm", price: 799 },
      { name: "Rozłożony 180 cm", price: 1199 },
    ]),
    colors: [
      { name: "Biały", hex: "#ffffff" },
      { name: "Dąb Craft", hex: "#b58b5e" },
    ],
  },
  {
    name: "Biurko komputerowe",
    imageUrl: "/images/desk.webp",
    categoryId: 2,
    description: "Ergonomiczne biurko do pracy zdalnej i gamingu.",
    _filterTags: ["gabinet", "dzieciecy", "home-office", "open-space"],
    options: JSON.stringify([
      { name: "120 cm", price: 499 },
      { name: "160 cm", price: 699 },
      { name: "Z regulacją wys.", price: 1299 },
    ]),
    colors: [
      { name: "Czarny Karbon", hex: "#1f2937" },
      { name: "Biały", hex: "#f9fafb" },
    ],
  },
  {
    name: "Toaletka kosmetyczna z lustrem",
    imageUrl: "/images/toaletka.webp",
    categoryId: 2,
    description: "Elegancka toaletka with podświetlanym lustrem LED.",
    _filterTags: ["sypialnia", "garderoba", "pokoj"],
    options: JSON.stringify([
      { name: "Standard (bez pufy)", price: 899 },
      { name: "Zestaw with pufą", price: 1099 },
    ]),
    colors: [
      { name: "Biały mat", hex: "#ffffff" },
      { name: "Różowy", hex: "#fbcfe8" },
    ],
  },

  // 🚪 Шафи та Комоди (Категорія 3)
  {
    name: "Szafa 3-drzwiowa",
    imageUrl: "/images/3-door-closet.jpg",
    categoryId: 3,
    _filterTags: ["sypialnia", "przedpokoj", "pokoj"],
    options: JSON.stringify([
      { name: "Z półkami", price: 1499 },
      { name: "Z drążkiem", price: 1599 },
      { name: "Z lustrem", price: 1799 },
    ]),
    colors: [
      { name: "Biały mat", hex: "#ffffff" },
      { name: "Dąb Artisan", hex: "#c29d6d" },
      { name: "Grafit", hex: "#4b5563" },
    ],
  },
  {
    name: "Szafa narożna",
    imageUrl: "/images/outszafa.webp",
    categoryId: 3,
    _filterTags: ["sypialnia", "dzieciecy", "przedpokoj"],
    options: JSON.stringify([
      { name: "Lewa", price: 1299 },
      { name: "Prawa", price: 1299 },
    ]),
    colors: [
      { name: "Biała", hex: "#ffffff" },
      { name: "Czarna", hex: "#000000" },
    ],
  },
  {
    name: "Szafa przesuwna",
    imageUrl: "/images/sliding-closet.webp",
    categoryId: 3,
    _filterTags: ["sypialnia", "przedpokoj", "pokoj", "hotel"],
    options: JSON.stringify([
      { name: "Szerokość 150cm", price: 1999 },
      { name: "Szerokość 200cm", price: 2499 },
    ]),
    colors: [
      { name: "Biały połysk", hex: "#f8fafc" },
      { name: "Dąb Sonoma", hex: "#c8b39a" },
      { name: "Czarny mat", hex: "#111827" },
    ],
  },
  {
    name: "Szafa z lustrem", // З першої бази
    imageUrl: "/images/mirror-closet.webp",
    categoryId: 3,
    _filterTags: ["przedpokoj", "sypialnia", "garderoba"],
    options: JSON.stringify([
      { name: "Lustro 1x", price: 1699 },
      { name: "Lustro 2x", price: 1899 },
      { name: "Bez lustra", price: 1499 },
    ]),
  },
  {
    name: "Komoda z szufladami",
    imageUrl: "/images/komoda.webp",
    categoryId: 3,
    description: "Praktyczna komoda with 4 głębokimi szufladami.",
    _filterTags: ["sypialnia", "salon", "dzieciecy", "przedpokoj"],
    options: JSON.stringify([
      { name: "4 szuflady", price: 799 },
      { name: "6 szuflad", price: 1099 },
    ]),
    colors: [
      { name: "Biały", hex: "#ffffff" },
      { name: "Dąb", hex: "#c4a484" },
      { name: "Czarny", hex: "#111827" },
    ],
  },
  {
    name: "Szafka na buty z siedziskiem",
    imageUrl: "/images/buty.webp",
    categoryId: 3,
    description: "Idealna do przedpokoju. Mieści do 8 par butów.",
    _filterTags: ["przedpokoj", "recepcja"],
    options: JSON.stringify([
      { name: "60 cm szerokości", price: 349 },
      { name: "90 cm szerokości", price: 449 },
    ]),
    colors: [
      { name: "Biały + Szary welur", hex: "#f3f4f6" },
      { name: "Dąb + Czarna ekoskóra", hex: "#c4a484" },
    ],
  },

  // 🛏️ Ліжка (Категорія 4)
  {
    name: "Łóżko małżeńskie",
    imageUrl: "/images/bed-maried2.jpg",
    categoryId: 4,
    _filterTags: ["sypialnia", "pokoj", "vip"],
    options: JSON.stringify([
      { name: "140x200", price: 1299 },
      { name: "160x200", price: 1499 },
      { name: "180x200", price: 1799 },
    ]),
    colors: [
      { name: "Jasny szary", hex: "#d1d5db" },
      { name: "Ciemny szary", hex: "#4b5563" },
      { name: "Beżowy", hex: "#e5e5f7" },
    ],
  },
  {
    name: "Łóżko pojedyncze", // З першої бази
    imageUrl: "/images/single-bed.webp",
    categoryId: 4,
    _filterTags: ["dzieciecy", "pokoj", "hotel"],
    options: JSON.stringify([
      { name: "80x200", price: 699 },
      { name: "90x200", price: 799 },
      { name: "100x200", price: 899 },
    ]),
  },
  {
    name: "Łóżko z pojemnikом", // З першої бази
    imageUrl: "/images/bed-with-a-container.webp",
    categoryId: 4,
    _filterTags: ["sypialnia", "dzieciecy"],
    options: JSON.stringify([
      { name: "Z pojemnikом", price: 1599 },
      { name: "Bez pojemnika", price: 1199 },
    ]),
  },
  {
    name: "Łóżko kontynentalne premium",
    imageUrl: "/images/bed-kontynentalne.webp",
    categoryId: 4,
    description:
      "Luksusowe łóżko with wbudowanym materacem sprężynowym i topperem.",
    _filterTags: ["sypialnia", "hotel", "vip"],
    options: JSON.stringify([
      { name: "160x200", price: 3299 },
      { name: "180x200", price: 3799 },
    ]),
    colors: [
      { name: "Butelkowa zieleń (Welur)", hex: "#166534" },
      { name: "Pudrowy róż (Welur)", hex: "#fbcfe8" },
      { name: "Czarny welur", hex: "#111827" },
    ],
  },
  {
    name: "Łóżko piętrowe",
    imageUrl: "/images/bunk-bed2.jpg",
    categoryId: 4,
    _filterTags: ["dzieciecy", "hostel"],
    options: JSON.stringify([
      { name: "2-osobowe", price: 1499 },
      { name: "3-osobowe (wysuwane)", price: 1999 },
    ]),
    colors: [
      { name: "Biały mat", hex: "#ffffff" },
      { name: "Sosna", hex: "#e5d3b3" },
    ],
  },

  // 🪑 Стільці та Крісла (Категорія 5)
  {
    name: "Krzesło biurowe",
    imageUrl: "/images/office-chaire.webp",
    categoryId: 5,
    _filterTags: ["home-office", "gabinet", "open-space", "recepcja"],
    options: JSON.stringify([
      { name: "Z podłokietnikami", price: 399 },
      { name: "Bez podłokietników", price: 299 },
    ]),
    colors: [
      { name: "Czarna siatka", hex: "#111827" },
      { name: "Szara siatka", hex: "#6b7280" },
    ],
  },
  {
    name: "Krzesło barowe", // З першої бази
    imageUrl: "/images/bar-chair.webp",
    categoryId: 5,
    _filterTags: ["kuchnia", "bar", "restauracja"],
    options: JSON.stringify([
      { name: "Wysokie", price: 249 },
      { name: "Niskie", price: 229 },
      { name: "Obrotowe", price: 349 },
    ]),
  },
  {
    name: "Fotel obrotowy", // З першої бази
    imageUrl: "/images/fotel-obert.webp",
    categoryId: 5,
    _filterTags: ["gabinet", "home-office", "konferencyjna"],
    options: JSON.stringify([
      { name: "Skórzany", price: 799 },
      { name: "Tkanina", price: 599 },
      { name: "Siatkowy", price: 499 },
    ]),
  },
  {
    name: "Krzesło do jadalni", // З першої бази
    imageUrl: "/images/dining-chair.webp",
    categoryId: 5,
    _filterTags: ["kuchnia", "salon", "restauracja", "sala-glowna"],
    options: JSON.stringify([
      { name: "Tapicerowane", price: 349 },
      { name: "Drewniane", price: 249 },
      { name: "Metalowe", price: 199 },
    ]),
  },
  {
    name: "Fotel uszak",
    imageUrl: "/images/fotel-uszak.webp",
    categoryId: 5,
    description: "Klasyczny fotel do czytania i wypoczynku.",
    _filterTags: ["salon", "sypialnia", "chillout", "vip"],
    options: JSON.stringify([
      { name: "Fotel", price: 899 },
      { name: "Fotel + Podnóżek", price: 1199 },
    ]),
    colors: [
      { name: "Żółty", hex: "#eab308" },
      { name: "Szary", hex: "#6b7280" },
      { name: "Granatowy", hex: "#1e3a8a" },
    ],
  },
  {
    name: "Fotel Gamingowy PRO",
    imageUrl: "/images/gaming-chair.webp",
    categoryId: 5,
    description: "Ergonomiczny fotel dla graczy with poduszką lędźwiową.",
    _filterTags: ["dzieciecy", "home-office", "gabinet"],
    options: JSON.stringify([
      { name: "Standard", price: 799 },
      { name: "Z podświetleniem RGB", price: 999 },
    ]),
    colors: [
      { name: "Czarno-Czerwony", hex: "#7f1d1d" },
      { name: "Czarno-Niebieski", hex: "#1e3a8a" },
      { name: "Cały Czarny", hex: "#000000" },
    ],
  },

  // 📚 Полиці (Категорія 6)
  {
    name: "Regał książkowy",
    imageUrl: "/images/tableBook.webp",
    categoryId: 6,
    _filterTags: ["salon", "gabinet", "home-office", "dzieciecy"],
    options: JSON.stringify([
      { name: "3 półki", price: 399 },
      { name: "5 półek", price: 599 },
    ]),
    colors: [
      { name: "Biały", hex: "#ffffff" },
      { name: "Dąb Sonoma", hex: "#c8b39a" },
    ],
  },
  {
    name: "Regał na wino", // З першої бази
    imageUrl: "/images/vine-table.webp",
    categoryId: 6,
    _filterTags: ["kuchnia", "salon", "bar", "restauracja"],
    options: JSON.stringify([
      { name: "12 butelek", price: 499 },
      { name: "24 butelki", price: 899 },
    ]),
  },
  {
    name: "Regał wiszący", // З першої бази
    imageUrl: "/images/hanging-bookcase.webp",
    categoryId: 6,
    _filterTags: ["salon", "dzieciecy", "sypialnia", "home-office"],
    options: JSON.stringify([
      { name: "Mały", price: 199 },
      { name: "Średni", price: 299 },
      { name: "Duży", price: 399 },
    ]),
  },
  {
    name: "Regał metalowy", // З першої бази
    imageUrl: "/images/metalrack.webp",
    categoryId: 6,
    _filterTags: ["przedpokoj", "biuro", "magazyn"],
    options: JSON.stringify([
      { name: "Czarny", price: 349 },
      { name: "Srebrny", price: 369 },
      { name: "Z kółkami", price: 449 },
    ]),
  },
  {
    name: "Półka ścienna Hexagon",
    imageUrl: "/images/polka-hexagon.webp",
    categoryId: 6,
    description: "Nowoczesna półka w kształcie plastra miodu.",
    _filterTags: ["salon", "sypialnia", "dzieciecy", "recepcja"],
    options: JSON.stringify([
      { name: "Pojedyncza", price: 89 },
      { name: "Zestaw 3 szt.", price: 229 },
    ]),
    colors: [
      { name: "Biały", hex: "#ffffff" },
      { name: "Czarny", hex: "#111827" },
      { name: "Dąb", hex: "#c4a484" },
    ],
  },

  // 🌿 Садові меблі (Категорія 7)
  {
    name: "Ławka ogrodowa", // З першої бази
    imageUrl: "/images/garden-table.webp",
    categoryId: 7,
    _filterTags: ["taras", "ogrodek"],
    options: JSON.stringify([
      { name: "2-osobowa", price: 499 },
      { name: "3-osobowa", price: 699 },
      { name: "Z oparciем", price: 799 },
    ]),
  },
  {
    name: "Krzesło ogrodowe", // З першої бази
    imageUrl: "/images/garden-chair.webp",
    categoryId: 7,
    _filterTags: ["taras", "ogrodek", "bar"],
    options: JSON.stringify([
      { name: "Plastikowe", price: 99 },
      { name: "Drewniane", price: 199 },
      { name: "Składane", price: 149 },
    ]),
  },
  {
    name: "Zestaw ogrodowy",
    imageUrl: "/images/garden-set.webp",
    categoryId: 7,
    _filterTags: ["taras", "ogrodek"],
    options: JSON.stringify([
      { name: "2 krzesła + stół", price: 1299 },
      { name: "4 krzesła + stół", price: 1899 },
    ]),
    colors: [
      { name: "Czarny technorattan", hex: "#111827" },
      { name: "Brązowy technorattan", hex: "#5c4033" },
    ],
  },
  {
    name: "Leżak ogrodowy", // З першої бази
    imageUrl: "/images/garden-lounger.webp",
    categoryId: 7,
    _filterTags: ["taras", "ogrodek", "strefa-chillout"],
    options: JSON.stringify([
      { name: "Z poduszką", price: 399 },
      { name: "Bez poduszki", price: 299 },
      { name: "Składany", price: 349 },
    ]),
  },
  {
    name: "Skrzynia ogrodowa na poduszki",
    imageUrl: "/images/skrzynia.webp",
    categoryId: 7,
    description:
      "Wodoszczelna skrzynia do przechowywania akcesoriów na zewnątrz.",
    _filterTags: ["taras", "ogrodek", "balkon"],
    options: JSON.stringify([
      { name: "Pojemność 300L", price: 249 },
      { name: "Pojemność 500L", price: 399 },
    ]),
    colors: [
      { name: "Antracyt", hex: "#374151" },
      { name: "Brązowy", hex: "#5c4033" },
    ],
  },

  // 🛁 МЕБЛІ ДЛЯ ВАННОЇ (Категорія 8)
  {
    name: "Szafka pod umywalkę",
    imageUrl: "/images/szafka-umywalka.webp",
    categoryId: 8,
    description:
      "Wisząca szafka łazienkowa with dwiema szufladami (system cichego domyku).",
    _filterTags: ["lazienka", "hotel"],
    options: JSON.stringify([
      { name: "Szerokość 60cm", price: 599 },
      { name: "Szerokość 80cm", price: 749 },
      { name: "Szerokość 100cm", price: 899 },
    ]),
    colors: [
      { name: "Biały połysk", hex: "#f8fafc" },
      { name: "Dąb naturalny", hex: "#c4a484" },
      { name: "Czarny mat", hex: "#111827" },
    ],
  },
  {
    name: "Słupek łazienkowy",
    imageUrl: "/images/slupek-lazienka.webp",
    categoryId: 8,
    description: "Wysoki regał do łazienki na kosmetyki i ręczniki.",
    _filterTags: ["lazienka", "hotel"],
    options: JSON.stringify([
      { name: "Wysokość 140cm", price: 449 },
      { name: "Wysokość 170cm (z koszem cargo)", price: 699 },
    ]),
    colors: [
      { name: "Biały połysk", hex: "#f8fafc" },
      { name: "Czarny mat", hex: "#111827" },
    ],
  },
  {
    name: "Szafka lustrzana LED",
    imageUrl: "/images/szafka-lustro.webp",
    categoryId: 8,
    description:
      "Wisząca szafka with lustrzanymi frontami i zintegrowanym oświetleniem LED.",
    _filterTags: ["lazienka", "hotel", "recepcja"],
    options: JSON.stringify([
      { name: "2-drzwiowa (60cm)", price: 699 },
      { name: "3-drzwiowa (90cm)", price: 949 },
    ]),
    colors: [
      { name: "Srebrne aluminium", hex: "#cbd5e1" },
      { name: "Czarna rama", hex: "#000000" },
    ],
  },
  {
    name: "Bambusowy regał do łazienki",
    imageUrl: "/images/regal-bambus.webp",
    categoryId: 8,
    description: "Ekologiczny regał odporny na wilgoć, idealny na ręczniki.",
    _filterTags: ["lazienka", "przedpokoj", "sypialnia"],
    options: JSON.stringify([
      { name: "3 półki", price: 149 },
      { name: "5 półek", price: 229 },
    ]),
    colors: [{ name: "Naturalny bambus", hex: "#dcb98a" }],
  },
];

// test
