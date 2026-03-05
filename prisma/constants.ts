export const categories = [
  { name: "Sofy" },
  { name: "Stoły" },
  { name: "Szafy" },
  { name: "Łóżka" },
  { name: "Krzesła" },
  { name: "Półki" },
  { name: "Meble ogrodowe" },
];

export const _additionally = [
  // 🛋️ Sofy (categoryId: 1)
  {
    name: "Wymiana obicia (skóra ekologiczna)",
    price: 1299, // PLN
    imageUrl: "/images/milano.webp",
  },
  {
    name: "Dodatkowe poduszki (komplet 4 szt)",
    price: 349, // PLN
    imageUrl: "",
  },
  {
    name: "Mechanizm rozkładany (funkcja spania)",
    price: 899, // PLN
    imageUrl: "",
  },
  {
    name: "Podnóżek dopasowany kolorystycznie",
    price: 449, // PLN
    imageUrl: "",
  },

  // 🍽️ Stoły (categoryId: 2)
  {
    name: "Powłoka antypoślizgowa premium",
    price: 299, // PLN
    imageUrl: "",
  },
  {
    name: "Krzesło obiadowe (pojedyncze)",
    price: 399, // PLN
    imageUrl: "",
  },
  {
    name: "Nakładka ochronna ze szkła hartowanego",
    price: 499, // PLN
    imageUrl: "",
  },

  // 🚪 Szafy (categoryId: 3)
  {
    name: "System oświetlenia LED (z czujnikiem ruchu)",
    price: 799, // PLN
    imageUrl: "",
  },
  {
    name: "Komplet wieszaków premium (10 szt)",
    price: 199, // PLN
    imageUrl: "",
  },

  // 🛏️ Łóżka (categoryId: 4)
  {
    name: "Stelaż ortopedyczny z regulacją",
    price: 999, // PLN
    imageUrl: "",
  },
  {
    name: "Pokrowiec antyalergiczny",
    price: 449, // PLN
    imageUrl: "",
  },

  // 🌿 Meble ogrodowe (categoryId: 7)
  {
    name: "Pokrowiec wodoodporny (sezonowy)",
    price: 349, // PLN
    imageUrl: "",
  },
  {
    name: "Komplet poduszek ogrodowych (4 szt)",
    price: 299, // PLN
    imageUrl: "",
  },

  // 🔧 Usługi
  {
    name: "Profesjonalny montaż u klienta",
    price: 399, // PLN
    imageUrl: "",
  },
  {
    name: "Gwarancja rozszerzona 5+ lat",
    price: 599, // PLN
    imageUrl: "",
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
];

export const products = [
  // 🛋️ Дивани (категорія 1)
  {
    name: "Kanapa Milano",
    imageUrl: "/images/milano.webp",
    categoryId: 1,
    description:
      "Minimalistyczny styl skandynawski, idealna do małych salonów.",
    _filterTags: ["salon", "lobby", "gabinet", "chillout"], // Підходить для офісу і дому
    options: JSON.stringify([
      { name: "2-osobowa", price: 1899 },
      { name: "3-osobowa", price: 2499 },
      { name: "4-osobowa", price: 3199 },
    ]),
  },
  {
    name: "Kanapa Oslo",
    imageUrl: "/images/oslo.webp",
    categoryId: 1,
    _filterTags: ["salon", "pokoj", "recepcja"], // Скандинавський стиль, для дому і готелю
    options: JSON.stringify([
      { name: "2-osobowa", price: 1699 },
      { name: "3-osobowa", price: 2299 },
    ]),
  },
  {
    name: "Kanapa narożna",
    imageUrl: "/images/naruznik2.jpg",
    categoryId: 1,
    _filterTags: ["salon", "chillout", "open-space"], // Великий диван для великих кімнат
    options: JSON.stringify([
      { name: "L-lewa", price: 2799 },
      { name: "L-prawa", price: 2799 },
      { name: "U-kształt", price: 3899 },
    ]),
  },
  {
    name: "Kanapa skórzana",
    imageUrl: "/images/narozna.jpg",
    categoryId: 1,
    description: "Luksusowa skóra naturalna, klasyczny design Chesterfield.",
    _filterTags: ["gabinet", "salon", "vip", "lobby"], // Преміум сегмент
    options: JSON.stringify([
      { name: "Czarna", price: 3499 },
      { name: "Brązowa", price: 3599 },
      { name: "Beżowa", price: 3699 },
    ]),
  },

  // 🍽️ Столи (категорія 2) — 🔥 ТУТ МИ ВИПРАВЛЯЄМО ЛОГІКУ
  {
    name: "Stół jadalniany Drewno",
    imageUrl: "/images/table dining.webp",
    categoryId: 2,
    description: "Lite drewno dębowe. Wymiary: 160x90 cm.",
    _filterTags: ["kuchnia", "salon", "restauracja", "sala-glowna"], // ✅ Це для їжі
    options: JSON.stringify([
      { name: "120x80 cm", price: 899 },
      { name: "160x90 cm", price: 1299 },
      { name: "180x100 cm", price: 1599 },
    ]),
  },
  {
    name: "Stół kawowy Szklany",
    imageUrl: "/images/glass-table.webp",
    categoryId: 2,
    _filterTags: ["salon", "lobby", "chillout", "gabinet", "vip"], // Кавовий столик
    options: JSON.stringify([
      { name: "Okrągły", price: 599 },
      { name: "Kwadratowy", price: 649 },
      { name: "Prostokątny", price: 699 },
    ]),
  },
  {
    name: "Stolik nocny",
    imageUrl: "/images/night-table.webp",
    categoryId: 2,
    _filterTags: ["sypialnia", "pokoj", "dzieciecy", "hotel"], // ❌ НЕМАЄ КУХНІ! Тільки спальні.
    options: JSON.stringify([
      { name: "Z szufladą", price: 349 },
      { name: "Bez szuflady", price: 279 },
    ]),
  },
  {
    name: "Stół rozkładany",
    imageUrl: "/images/folding-table.webp",
    categoryId: 2,
    _filterTags: ["salon", "kuchnia", "konferencyjna", "biuro"], // Універсальний стіл
    options: JSON.stringify([
      { name: "Złożony 120 cm", price: 799 },
      { name: "Rozłożony 180 cm", price: 1199 },
    ]),
  },

  // 🚪 Шафи (категорія 3)
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
  },
  {
    name: "Szafa przesuwna",
    imageUrl: "/images/sliding-closet.webp",
    categoryId: 3,
    _filterTags: ["sypialnia", "przedpokoj", "pokoj", "hotel"],
    options: JSON.stringify([
      { name: "Biała", price: 1999 },
      { name: "Dębowa", price: 2199 },
      { name: "Czarna", price: 2099 },
    ]),
  },
  {
    name: "Szafa z lustrem",
    imageUrl: "/images/mirror-closet.webp",
    categoryId: 3,
    _filterTags: ["przedpokoj", "sypialnia", "garderoba"],
    options: JSON.stringify([
      { name: "Lustro 1x", price: 1699 },
      { name: "Lustro 2x", price: 1899 },
      { name: "Bez lustra", price: 1499 },
    ]),
  },

  // 🛏️ Ліжка (категорія 4)
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
  },
  {
    name: "Łóżko pojedyncze",
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
    name: "Łóżko z pojemnikом",
    imageUrl: "/images/bed-with-a-container.webp",
    categoryId: 4,
    _filterTags: ["sypialnia", "dzieciecy"],
    options: JSON.stringify([
      { name: "Z pojemnikом", price: 1599 },
      { name: "Bez pojemnika", price: 1199 },
    ]),
  },
  {
    name: "Łóżko piętrowe",
    imageUrl: "/images/bunk-bed2.jpg",
    categoryId: 4,
    _filterTags: ["dzieciecy", "hostel"],
    options: JSON.stringify([
      { name: "2-osobowe", price: 1499 },
      { name: "3-osobowe", price: 1999 },
    ]),
  },

  // 🪑 Стільці (категорія 5)
  {
    name: "Krzesło biurowe",
    imageUrl: "/images/office-chaire.webp",
    categoryId: 5,
    _filterTags: ["home-office", "gabinet", "open-space", "recepcja"],
    options: JSON.stringify([
      { name: "Z podłokietnikami", price: 399 },
      { name: "Bez podłokietników", price: 299 },
    ]),
  },
  {
    name: "Krzesło barowe",
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
    name: "Fotel obrotowy",
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
    name: "Krzesło do jadalni",
    imageUrl: "/images/dining-chair.webp",
    categoryId: 5,
    _filterTags: ["kuchnia", "salon", "restauracja", "sala-glowna"],
    options: JSON.stringify([
      { name: "Tapicerowane", price: 349 },
      { name: "Drewniane", price: 249 },
      { name: "Metalowe", price: 199 },
    ]),
  },

  // 📚 Полиці (категорія 6)
  {
    name: "Regał książkowy",
    imageUrl: "/images/tableBook.webp",
    categoryId: 6,
    _filterTags: ["salon", "gabinet", "home-office", "dzieciecy"],
    options: JSON.stringify([
      { name: "3 półki", price: 399 },
      { name: "5 półek", price: 599 },
      { name: "Z szufladą", price: 699 },
    ]),
  },
  {
    name: "Regał na wino",
    imageUrl: "/images/vine-table.webp",
    categoryId: 6,
    _filterTags: ["kuchnia", "salon", "bar", "restauracja"],
    options: JSON.stringify([
      { name: "12 butelek", price: 499 },
      { name: "24 butelki", price: 899 },
    ]),
  },
  {
    name: "Regał wiszący",
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
    name: "Regał metalowy",
    imageUrl: "/images/metalrack.webp",
    categoryId: 6,
    _filterTags: ["przedpokoj", "biuro", "magazyn"],
    options: JSON.stringify([
      { name: "Czarny", price: 349 },
      { name: "Srebrny", price: 369 },
      { name: "Z kółkami", price: 449 },
    ]),
  },

  // 🌿 Садові меблі (категорія 7)
  {
    name: "Ławka ogrodowa",
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
    name: "Krzesło ogrodowe",
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
  },
  {
    name: "Leżak ogrodowy",
    imageUrl: "/images/garden-lounger.webp",
    categoryId: 7,
    _filterTags: ["taras", "ogrodek", "strefa-chillout"],
    options: JSON.stringify([
      { name: "Z poduszką", price: 399 },
      { name: "Bez poduszki", price: 299 },
      { name: "Składany", price: 349 },
    ]),
  },
];
