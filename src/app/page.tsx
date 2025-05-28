"use client";
import { useState, useRef, useEffect } from 'react';
import { FiHeart, FiSearch, FiX, FiClock, FiShoppingCart, FiBell, FiUser, FiEdit2, FiMapPin, FiCreditCard, FiSettings, FiUserPlus, FiShield } from 'react-icons/fi';
import { AiOutlineHome } from 'react-icons/ai';

type Product = {
  id: number;
  title: string;
  price: string;
  time?: string;
  description: string;
  isFavorite: boolean;
  category: string;
  seller: string;
  image?: string;
};

type OnboardingSlide = {
  image: string;
  title: string;
  desc: string;
};

type Category = {
  key: string;
  label: string;
};

type CargoCompany = {
  key: string;
  label: string;
};

type CardInfo = {
  name: string;
  number: string;
  date: string;
  cvc: string;
};

type AddressInfo = {
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  district: string;
};

type Notification = {
  id: number;
  avatar: string;
  text: string;
  time: string;
};

type Order = {
  id: number;
  product: string;
  price: string;
  image: string;
  seller: string;
  sellerAvatar: string;
  orderNo: string;
  buyerName: string;
  buyerAddress: string;
  cargo: string;
};

type WonOffer = {
  id: number;
  product: string;
  status: string;
  time: string;
};

const allCategories: Category[] = [
  { key: "aksesuar", label: "Aksesuar" },
  { key: "antika", label: "Antika" },
  { key: "elyapimi", label: "El Yapımı" },
  { key: "karma", label: "Karma" },
  { key: "parfum", label: "Parfüm" },
  { key: "tesbih", label: "Tesbih" },
];

const sampleProducts: Product[] = [
  {
    id: 1,
    title: "85x35 profesyonel tuval üzerine yağlı boya nebula",
    price: "7.500₺",
    time: "30 Haziran 18:30",
    description: "85x35 profesyonel tuval üzerine yağlı boya nebula",
    isFavorite: false,
    category: "karma",
    seller: "Sanatçı",
    image: "/images/tuval.jpg",
  },
  {
    id: 2,
    title: "Vult - vt 4600 profesyonel tıraş makinesi",
    price: "1.550₺",
    time: "1 Haziran 00:00",
    description: "Vult - vt 4600 profesyonel tıraş makinesi",
    isFavorite: false,
    category: "aksesuar",
    seller: "Berber",
    image: "/images/tiras.jpg",
  },
  {
    id: 3,
    title: "Yeşil Tesbih",
    price: "1.000₺",
    time: "2 Haziran 15:00",
    description: "Yeşil renkli özel yapım tesbih",
    isFavorite: false,
    category: "tesbih",
    seller: "Tesbihçi",
    image: "/images/tesbih.jpg",
  },
  {
    id: 4,
    title: "El Yapımı Ahşap Kupa",
    price: "800₺",
    time: "5 Haziran 12:00",
    description: "El yapımı ahşap kupa",
    isFavorite: false,
    category: "elyapimi",
    seller: "Ahşapçı",
    image: "/images/kupa.jpg",
  },
];

const onboardingSlides: OnboardingSlide[] = [
  {
    image: "/images/slide1.svg",
    title: "İade Hakkın Cebinde",
    desc: "Sabit fiyatlı satışlardan aldığın yeni ürünleri kullanmadan 14 gün içinde iade edebilirsin 🛍️"
  },
  {
    image: "/images/slide2.svg",
    title: "Gönlün Rahat Olsun",
    desc: "3D güvenlik burada! Paranın da kalbin de güvende."
  },
  {
    image: "/images/slide3.svg",
    title: "Teklifini Ver!",
    desc: "Yakala, arttır, kap! 🏆 Şans senden yana!"
  },
  {
    image: "/images/slide4.svg",
    title: "Hazır mısın?",
    desc: "En çılgın açık artırmalara giriş yapıyoruz!"
  }
];

const cargoCompanies: CargoCompany[] = [
  { key: "aras", label: "Aras" },
  { key: "ptt", label: "PTT" },
  { key: "surat", label: "Sürat" },
  { key: "yurtici", label: "Yurtiçi" },
];

export default function Home() {
  // UI State
  const [showCatalog, setShowCatalog] = useState(false);
  const [activeTab, setActiveTab] = useState<'anasayfa' | 'favoriler' | 'sepet' | 'aktivite' | 'profil'>('profil');
  const [favoriteTab, setFavoriteTab] = useState<'mezat' | 'hemenal'>('mezat');
  const [activityTab, setActivityTab] = useState<'bildirimler' | 'siparisler' | 'kazanilan'>('bildirimler');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [followedCategories, setFollowedCategories] = useState<string[]>([]);
  const [feedPage, setFeedPage] = useState(1);
  const [homePage, setHomePage] = useState(1);
  
  // Modals State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [showCargoPrices, setShowCargoPrices] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  
  // User Data State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("Eşref");
  const [lastName, setLastName] = useState("Erbek");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCargos, setSelectedCargos] = useState<string[]>([]);
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    firstName: "Eşref",
    lastName: "Erbek",
    address: "",
    postalCode: "",
    city: "",
    district: ""
  });
  const [cardInfo, setCardInfo] = useState<CardInfo>({ 
    name: "", 
    number: "", 
    date: "", 
    cvc: "" 
  });
  const [savedCards, setSavedCards] = useState<CardInfo[]>(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("savedCards");
      return data ? JSON.parse(data) : [];
    }
    return [];
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Refs
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const feedObserverRef = useRef<HTMLDivElement>(null);
  const homeObserverRef = useRef<HTMLDivElement>(null);

  // Sample data
  const notifications: Notification[] = [
    {
      id: 1,
      avatar: "/images/avatar1.jpg",
      text: "⏳ Süre doldu... Bu kez kaçırdın ama üzülme! Yeni fırsatlar çok yakında geliyor 🚀 Takipte kal, belki bir sonraki açık artırma tam sana göredir 😉",
      time: "3 saat önce"
    },
    {
      id: 2,
      avatar: "/images/avatar1.jpg",
      text: "🔔 Son düzlüğe girdik! Ödeme için sadece 6 saatin kaldı. Ürün el değiştirmek üzere, ama hâlâ senin olabilir ⏰ Hadi, birlikte bu işi bitirelim 💪",
      time: "9 saat önce"
    },
  ];

  const orders: Order[] = [
    {
      id: 1,
      product: "Mavi Penguen Anahtarlık",
      price: "41₺",
      image: "/images/penguen.jpg",
      seller: "Annemin Ürünleri",
      sellerAvatar: "/images/avatar1.jpg",
      orderNo: "VYEHWVJIZNA1CWJ1FAXX",
      buyerName: "Eşref Yılmaz",
      buyerAddress: "İstanbul Kadıköy'e\nKadıköy/İstanbul\n34744",
      cargo: "SURAT",
    },
  ];

  const wonOffers: WonOffer[] = [
    {
      id: 1,
      product: "El Yapımı Ahşap Kupa",
      status: "Satıcı kabul etti",
      time: "1 gün önce"
    },
  ];

  // Helper functions
  const followCategory = (catKey: string) => {
    if (!followedCategories.includes(catKey)) {
      setFollowedCategories([...followedCategories, catKey]);
    }
  };

  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = search.trim().length > 0
      ? product.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const followedProducts = sampleProducts.filter(p => followedCategories.includes(p.category));
  const pageSize = 8;
  const pagedFollowedProducts = followedProducts.slice(0, feedPage * pageSize);

  const homePageSize = 8;
  const pagedHomeProducts = sampleProducts.slice(0, homePage * homePageSize);

  // Effects
  useEffect(() => {
    if (!feedObserverRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && pagedFollowedProducts.length < followedProducts.length) {
          setFeedPage(page => page + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(feedObserverRef.current);
    return () => observer.disconnect();
  }, [pagedFollowedProducts.length, followedProducts.length]);

  useEffect(() => {
    if (!homeObserverRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && pagedHomeProducts.length < sampleProducts.length) {
          setHomePage(page => page + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(homeObserverRef.current);
    return () => observer.disconnect();
  }, [pagedHomeProducts.length, sampleProducts.length]);

  // Event handlers
  const handleSaveCard = () => {
    const newCards = [...savedCards, cardInfo];
    setSavedCards(newCards);
    localStorage.setItem("savedCards", JSON.stringify(newCards));
    setShowAddCardForm(false);
    setCardInfo({ name: "", number: "", date: "", cvc: "" });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowOnboarding(true);
    setOnboardingStep(0);
  };

  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    setShowLogin(true);
  };

  const handleNextOnboarding = () => {
    if (onboardingStep < onboardingSlides.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      setShowLogin(true);
    }
  };

  const handleLogin = () => {
    if (phone.length === 10 && code === "1234") {
      setIsLoggedIn(true);
      setShowLogin(false);
    }
  };

  // Conditional renders
  if (!isLoggedIn) {
    if (showOnboarding) {
      const slide = onboardingSlides[onboardingStep];
      return (
        <div className="bg-black min-h-screen flex flex-col justify-between items-center text-white">
          <div className="flex-1 flex flex-col justify-center items-center">
            <img src={slide.image} alt="" className="w-64 h-64 mx-auto mb-6" />
            <div className="text-2xl font-bold text-center mb-2">{slide.title}</div>
            <div className="text-center text-base text-gray-300 mb-8">{slide.desc}</div>
          </div>
          <div className="flex items-center justify-between w-full px-6 pb-8">
            <button className="text-gray-400 text-lg" onClick={handleSkipOnboarding}>Geç</button>
            <div className="flex gap-2">
              {onboardingSlides.map((_, i) => (
                <span key={i} className={`w-3 h-3 rounded-full ${i === onboardingStep ? "bg-[#6c63ff]" : "bg-gray-600"}`}></span>
              ))}
            </div>
            <button
              className="bg-[#FFD600] text-black font-bold rounded-xl px-8 py-2 text-lg"
              onClick={handleNextOnboarding}
            >
              {onboardingStep === onboardingSlides.length - 1 ? "Başla" : "İleri"}
            </button>
          </div>
        </div>
      );
    }
    if (showLogin) {
      return (
        <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white px-6">
          <div className="text-2xl font-bold mb-6">Giriş Yap</div>
          <input
            type="tel"
            placeholder="Telefon Numarası (5xx xxx xx xx)"
            className="w-full bg-[#222] rounded-lg px-4 py-3 mb-4 text-white text-lg outline-none"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          />
          <input
            type="text"
            placeholder="SMS Kodu"
            className="w-full bg-[#222] rounded-lg px-4 py-3 mb-6 text-white text-lg outline-none"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <button
            className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-3 text-lg"
            onClick={handleLogin}
          >
            Giriş Yap
          </button>
        </div>
      );
    }
  }

  if (showCatalog) {
    return (
      <div className="bg-black min-h-screen text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={() => setShowCatalog(false)} className="text-2xl">{'<'}</button>
          <h2 className="text-xl font-bold flex-1 text-center">Katalog</h2>
          {selectedCategory ? (
            <button
              className="text-[#5856D6] font-semibold text-base"
              onClick={() => followCategory(selectedCategory)}
              disabled={followedCategories.includes(selectedCategory)}
            >
              {followedCategories.includes(selectedCategory) ? "Takip Ediliyor" : "Takip et"}
            </button>
          ) : <span style={{ width: 70 }}></span>}
        </div>

        {/* Search */}
        <div className="flex items-center bg-[#222] rounded-lg px-3 py-2 mx-4 mb-4">
          <FiSearch className="text-[#8E8E93] mr-2 text-lg" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Ara'
            className="bg-transparent outline-none text-white flex-1 placeholder-[#8E8E93]"
          />
        </div>

        {/* Categories */}
        <div className="mb-2 font-bold text-lg text-center">Tüm Kategoriler</div>
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {allCategories.map(cat => (
            <button
              key={cat.key}
              className={`px-5 py-2 rounded-lg font-medium text-base transition ${
                selectedCategory === cat.key ? "bg-[#5856D6] text-white" : "bg-[#222] text-white"
              }`}
              onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="mb-2 font-bold text-lg text-center">Tüm Ürünler</div>
        <div className="grid grid-cols-2 gap-4 px-4 pb-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="p-2 rounded-lg shadow flex flex-col justify-between h-full cursor-pointer relative"
              style={{ backgroundColor: '#222', color: '#fff' }}
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="rounded-lg w-full h-32 object-cover mb-2"
                  style={{ objectFit: "cover" }}
                />
              )}
              <span className="font-bold text-base" style={{ color: '#f0c000' }}>
                {product.price}
              </span>
              {product.time && (
                <div className="flex items-center mt-1 text-xs text-red-500">
                  <FiClock className="mr-1" />
                  {product.time}
                </div>
              )}
              <div className="text-xs text-white mt-1 truncate">{product.title}</div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-400 py-8 col-span-2">Ürün bulunamadı.</div>
          )}
        </div>
      </div>
    );
  }

  // Main app return
  return (
    <>
      {activeTab === 'anasayfa' && (
        <>
          <div className="pt-6 px-4">
            <button
              className="w-full bg-[#222] rounded-xl py-3 text-xl font-semibold mb-4"
              onClick={() => setShowCatalog(true)}
            >
              Katalog
            </button>
          </div>

          {/* Takip edilen kategoriler */}
          {followedCategories.length > 0 && (
            <div className="px-4 mb-2 flex flex-wrap gap-2">
              {followedCategories.map(catKey => {
                const cat = allCategories.find(c => c.key === catKey);
                return (
                  <span
                    key={catKey}
                    className="bg-[#5856D6] text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    {cat?.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Başlık ve ürünler */}
          <div className="px-4">
            <div className="text-base font-semibold mb-2">
              {followedCategories.length > 0 ? "Takip Ettiğin Ürünler" : "Ürünler"}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(followedCategories.length > 0 ? pagedFollowedProducts : pagedHomeProducts).length === 0 && (
                <div className="text-gray-400 col-span-2 py-8 text-center">
                  Ürün bulunamadı.
                </div>
              )}
              {(followedCategories.length > 0 ? pagedFollowedProducts : pagedHomeProducts).map(product => (
                <div
                  key={product.id}
                  className="p-2 rounded-lg shadow flex flex-col justify-between h-full cursor-pointer relative"
                  style={{ backgroundColor: '#222', color: '#fff' }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="rounded-lg w-full h-32 object-cover mb-2"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <span className="font-bold text-base" style={{ color: '#f0c000' }}>
                    {product.price}
                  </span>
                  {product.time && (
                    <div className="flex items-center mt-1 text-xs text-red-500">
                      <FiClock className="mr-1" />
                      {product.time}
                    </div>
                  )}
                  <div className="text-xs text-white mt-1 truncate">{product.title}</div>
                </div>
              ))}
            </div>
            {/* Sonsuz kaydırma gözlemcisi */}
            <div ref={followedCategories.length > 0 ? feedObserverRef : homeObserverRef} style={{ height: 24 }} />
            {(followedCategories.length > 0
              ? pagedFollowedProducts.length < followedProducts.length
              : pagedHomeProducts.length < sampleProducts.length) && (
              <div className="text-center text-gray-400 py-4">Yükleniyor...</div>
            )}
          </div>
        </>
      )}

      {/* Favorites tab */}
      {activeTab === 'favoriler' && (
        <div className="min-h-screen bg-black text-white pb-20">
          <div className="text-center text-2xl font-bold pt-6 pb-4">Favoriler</div>
          <div className="flex gap-3 justify-center mb-4">
            <button
              className={`px-5 py-2 rounded-lg font-semibold text-base ${favoriteTab === 'mezat' ? 'bg-[#5856D6] text-white' : 'bg-[#222] text-white'}`}
              onClick={() => setFavoriteTab('mezat')}
            >
              Mezat
            </button>
            <button
              className={`px-5 py-2 rounded-lg font-semibold text-base ${favoriteTab === 'hemenal' ? 'bg-[#5856D6] text-white' : 'bg-[#222] text-white'}`}
              onClick={() => setFavoriteTab('hemenal')}
            >
              Hemen Al
            </button>
          </div>
          {/* Content */}
          {favoriteTab === 'mezat' && (
            <div className="px-4 text-gray-300 mb-4">
              Henüz hiçbir açık artırma ürününe kalbini kaptırmamışsın ❤️ Haydi en beğendiklerini favorilere eklemeye başla!
            </div>
          )}
          {favoriteTab === 'hemenal' && (
            <div className="px-4 text-gray-300 mb-4">
              Henüz hiçbir hemen al ürününe kalbini kaptırmamışsın ❤️ Haydi en beğendiklerini favorilere eklemeye başla!
            </div>
          )}
          <div className="px-4">
            <button
              className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-4 text-lg"
              onClick={() => setActiveTab('anasayfa')}
            >
              Keşfetmeye Başla
            </button>
          </div>
        </div>
      )}

      {/* Cart tab */}
      {activeTab === 'sepet' && (
        <div className="min-h-screen bg-black text-white pb-20">
          <div className="text-center text-2xl font-bold pt-6 pb-4">Sepet</div>
          <div className="px-4 text-gray-300 mb-4 text-center">
            Sepetin bomboş... Ürünler seni bekliyor, hadi dolduralım! 🛒✨
          </div>
          <div className="px-4">
            <button
              className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-4 text-lg"
              onClick={() => setActiveTab('anasayfa')}
            >
              Ürünleri Keşfet
            </button>
          </div>
        </div>
      )}

      {/* Activity tab */}
      {activeTab === 'aktivite' && (
        <div className="min-h-screen bg-black text-white pb-20">
          <div className="text-center text-2xl font-bold pt-6 pb-4">Aktivite</div>
          <div className="flex gap-3 justify-center mb-4">
            <button
              className={`px-5 py-2 rounded-lg font-semibold text-base ${activityTab === 'bildirimler' ? 'bg-[#5856D6] text-white' : 'bg-[#222] text-white'}`}
              onClick={() => setActivityTab('bildirimler')}
            >
              Bildirimler
            </button>
            <button
              className={`px-5 py-2 rounded-lg font-semibold text-base ${activityTab === 'siparisler' ? 'bg-[#5856D6] text-white' : 'bg-[#222] text-white'}`}
              onClick={() => setActivityTab('siparisler')}
            >
              Siparişler
            </button>
            <button
              className={`px-5 py-2 rounded-lg font-semibold text-base ${activityTab === 'kazanilan' ? 'bg-[#5856D6] text-white' : 'bg-[#222] text-white'}`}
              onClick={() => setActivityTab('kazanilan')}
            >
              Kazanılan teklifler
            </button>
          </div>
          
          {/* Notifications */}
          {activityTab === 'bildirimler' && (
            <div className="flex flex-col gap-3 px-3">
              {notifications.map(n => (
                <div key={n.id} className="bg-[#222] rounded-xl p-4 flex gap-3">
                  <img src={n.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm">{n.text}</div>
                    <div className="text-xs text-gray-400 mt-2">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Orders */}
          {activityTab === 'siparisler' && (
            <div className="flex flex-col gap-3 px-3">
              {orders.length === 0 && (
                <div className="text-gray-400 text-center py-8">Henüz siparişin yok.</div>
              )}
              {orders.map(o => (
                <div
                  key={o.id}
                  className="bg-[#222] rounded-xl p-4 flex gap-3 items-center cursor-pointer"
                  onClick={() => setSelectedOrder(o)}
                >
                  <img src={o.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <div className="font-semibold text-base">1 x {o.product}</div>
                    <div className="text-base mt-1">{o.price}</div>
                  </div>
                </div>
              ))}

              {/* Order Detail Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                  <div className="bg-black rounded-xl p-6 w-[95vw] max-w-md relative text-white">
                    <button
                      className="absolute top-2 left-3 text-white text-2xl"
                      onClick={() => setSelectedOrder(null)}
                    >
                      {'<'}
                    </button>
                    <div className="text-center text-xl font-bold mb-4">Sipariş Detayı</div>
                    <div className="mb-2 text-sm">
                      <span className="text-gray-300">Sipariş Numarası: </span>
                      <span className="font-semibold tracking-wider">{selectedOrder.orderNo}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4 mb-2">
                      <img src={selectedOrder.sellerAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-semibold">{selectedOrder.seller}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-[#222] rounded-lg p-3 mb-3">
                      <img src={selectedOrder.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold">{selectedOrder.product}</div>
                        <div className="text-base">{selectedOrder.price}</div>
                      </div>
                    </div>
                    <div className="font-semibold mt-2 mb-1">Adres</div>
                    <div className="bg-[#222] rounded-lg p-3 text-sm mb-3 whitespace-pre-line">
                      {selectedOrder.buyerAddress}
                    </div>
                    <div className="mb-2">Kargo Şirketi: <span className="font-semibold">{selectedOrder.cargo}</span></div>
                    <div className="mb-2 text-sm">
                      Siparişinle ilgili her konuda buradayız! WhatsApp'tan bize hemen ulaşabilirsin. 📲
                    </div>
                    <div className="mb-1 text-sm">
                      Whatsapp ile iletişime geçebilirsiniz<br />
                      Whatsapp: <span className="font-semibold">+90 850 242 14 03</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Won offers */}
          {activityTab === 'kazanilan' && (
            <div className="flex flex-col gap-3 px-3">
              {wonOffers.length === 0 && (
                <div className="text-gray-300 text-base flex flex-col items-start gap-2 mb-4 mt-2">
                  <span>🥺 Henüz kupa senin olmadı... Ama üzülme, her şampiyon bir yerden başlar! Yeni açık artırmalara göz at! 🏆</span>
                </div>
              )}
              {wonOffers.map(w => (
                <div key={w.id} className="bg-[#222] rounded-xl p-4 flex flex-col gap-2">
                  <div className="font-semibold">{w.product}</div>
                  <div className="text-xs text-gray-400">{w.status} • {w.time}</div>
                </div>
              ))}
              <button
                className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-4 text-lg mt-2"
                onClick={() => setActiveTab('anasayfa')}
              >
                Keşfetmeye Başla
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile tab */}
      {activeTab === 'profil' && (
        <div className="min-h-screen bg-black text-white pb-20">
          <div className="text-center text-2xl font-bold pt-6 pb-4">Profil</div>
          {/* Profil Kartı */}
          <div className="bg-[#18181b] rounded-xl mx-4 mb-4 flex items-center px-4 py-3">
            <div className="w-14 h-14 rounded-full bg-[#222] flex items-center justify-center mr-4">
              <FiUser className="text-3xl text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{firstName} {lastName}</div>
              <div className="text-gray-400 text-sm">+905462306800</div>
            </div>
            <button className="p-2" title="Düzenle" onClick={() => setEditProfileOpen(true)}>
              <FiEdit2 className="text-xl text-[#5856D6]" />
            </button>
          </div>

          {/* Menü Butonları */}
          <div className="flex flex-col gap-3 mx-4">
            <button className="flex items-center bg-[#222] rounded-xl px-4 py-3 font-semibold text-base mb-1">
              <AiOutlineHome className="mr-3 text-xl text-gray-400" />
              Satıcı ol
            </button>
            <button className="flex items-center bg-[#222] rounded-xl px-4 py-3 font-semibold text-base mb-1" onClick={() => setShowAddressModal(true)}>
              <FiMapPin className="mr-3 text-xl text-gray-400" />
              Adres Bilgilerim
            </button>
            <button className="flex items-center bg-[#222] rounded-xl px-4 py-3 font-semibold text-base mb-1" onClick={() => setShowCardModal(true)}>
              <FiCreditCard className="mr-3 text-xl text-gray-400" />
              Ödeme Yöntemlerim
            </button>
            <div className="flex items-center bg-[#222] rounded-xl px-4 py-3 font-semibold text-base mb-1 justify-between">
              <span className="flex items-center">
                <FiBell className="mr-3 text-xl text-gray-400" />
                Bildirimler
              </span>
              <label className="inline-flex items-center cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(v => !v)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-checked:bg-[#5856D6] transition-all relative">
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notificationsEnabled ? "translate-x-4" : ""}`}></div>
                </div>
              </label>
            </div>
            <div className="flex items-center bg-[#222] rounded-xl px-4 py-3 font-semibold text-base mb-1 justify-between">
              <span className="flex items-center">
                <FiSettings className="mr-3 text-xl text-gray-400" />
                Tema
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">Sistem <FiSettings className="inline text-base" /></span>
            </div>
            <button className="flex items-center bg-[#222] rounded-xl px-4 py-3 font-semibold text-base mb-1">
              <FiUserPlus className="mr-3 text-xl text-gray-400" />
              Davet et & kazanç
            </button>
          </div>

          {/* Sözleşmeler */}
          <div className="mx-4 mt-6">
            <div className="font-semibold text-base mb-2">Sözleşmeler</div>
            <div className="flex flex-col gap-2">
              {[
                "Aydınlatma Metni",
                "Çerez Politikası",
                "Gizlilik Politikası",
                "Üyelik Sözleşmesi",
                "Mesafeli Satış Sözleşmesi"
              ].map((c, i) => (
                <button key={i} className="flex items-center bg-[#18181b] rounded-xl px-4 py-3 font-semibold text-base">
                  <FiShield className="mr-3 text-xl text-gray-400" />
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Whatsapp Bilgi */}
          <div className="text-center text-gray-300 text-sm mt-6 mb-2">
            Whatsapp ile iletişime geçebilirsiniz<br />
            Whatsapp: +90 850 242 14 03
          </div>

          {/* Alt Butonlar */}
          <div className="flex flex-col gap-3 mx-4 mt-2">
            <button className="w-full bg-[#FFA726] text-white font-bold rounded-xl py-3 text-lg" onClick={() => setShowContributors(true)}>
              Emeği geçenler
            </button>
            <button className="w-full bg-[#F44336] text-white font-bold rounded-xl py-3 text-lg">
              Hesap silme
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm mt-4 mb-2">
            Mezat Merkezi<br />Version 16
          </div>
        </div>
      )}

      {/* Modals */}
      {editProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl p-6 w-[95vw] max-w-md relative text-white">
            <button
              className="absolute top-2 left-3 text-white text-2xl"
              onClick={() => setEditProfileOpen(false)}
            >
              {'<'}
            </button>
            <div className="text-center text-xl font-bold mb-4">Profil</div>
            <div className="font-semibold mb-2">Profil Fotoğrafı</div>
            <div className="flex flex-col items-center mb-4">
              <img
                src="/images/avatar1.jpg"
                alt="Profil"
                className="w-24 h-24 rounded-full object-cover bg-[#444] mb-2"
              />
              <button className="text-[#5856D6] font-semibold text-base">Fotoğraf Ekle</button>
            </div>
            <div className="font-semibold mb-2">Ad Soyad</div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                placeholder="Ad"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                placeholder="Soyad"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
            <div className="font-semibold mb-2">İlgilendiklerim</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {allCategories.map(cat => (
                <button
                  key={cat.key}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    followedCategories.includes(cat.key)
                      ? "bg-[#5856D6] text-white"
                      : "bg-[#222] text-white"
                  }`}
                  onClick={() => {
                    if (followedCategories.includes(cat.key)) {
                      setFollowedCategories(followedCategories.filter(c => c !== cat.key));
                    } else {
                      setFollowedCategories([...followedCategories, cat.key]);
                    }
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-3 text-lg"
              onClick={() => setEditProfileOpen(false)}
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Address modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl p-6 w-[95vw] max-w-md relative text-white">
            <button
              className="absolute top-2 left-3 text-white text-2xl"
              onClick={() => setShowAddressModal(false)}
            >
              {'<'}
            </button>
            <div className="text-center text-xl font-bold mb-4">Adres Bilgilerim</div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">İsim</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                value={addressInfo.firstName}
                onChange={e => setAddressInfo({ ...addressInfo, firstName: e.target.value })}
              />
              <label className="block mb-1 font-semibold">Soyisim</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                value={addressInfo.lastName}
                onChange={e => setAddressInfo({ ...addressInfo, lastName: e.target.value })}
              />
              <label className="block mb-1 font-semibold">Adres</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                value={addressInfo.address}
                onChange={e => setAddressInfo({ ...addressInfo, address: e.target.value })}
              />
              <label className="block mb-1 font-semibold">Şehir</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                value={addressInfo.city}
                onChange={e => setAddressInfo({ ...addressInfo, city: e.target.value })}
              />
              <label className="block mb-1 font-semibold">İlçe</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                value={addressInfo.district}
                onChange={e => setAddressInfo({ ...addressInfo, district: e.target.value })}
              />
              <label className="block mb-1 font-semibold">Posta Kodu</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-4 text-white text-lg outline-none"
                value={addressInfo.postalCode}
                onChange={e => setAddressInfo({ ...addressInfo, postalCode: e.target.value })}
              />
            </div>
            <button
              className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-3 text-lg"
              onClick={() => setShowAddressModal(false)}
            >
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Card modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl p-6 w-[95vw] max-w-md relative text-white">
            <button
              className="absolute top-2 left-3 text-white text-2xl"
              onClick={() => setShowCardModal(false)}
            >
              {'<'}
            </button>
            <div className="text-center text-xl font-bold mb-4">Kredi Kartı Bilgilerim</div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Kart Sahibi</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                placeholder="Ad Soyad"
                value={cardInfo.name}
                onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })}
              />
              <label className="block mb-1 font-semibold">Kart Numarası</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardInfo.number}
                onChange={e => setCardInfo({ ...cardInfo, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              />
              <label className="block mb-1 font-semibold">Son Kullanım Tarihi</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="w-1/2 bg-[#222] rounded-lg px-4 py-3 text-white text-lg outline-none"
                  placeholder="AA/YY"
                  value={cardInfo.date}
                  onChange={e => setCardInfo({ ...cardInfo, date: e.target.value })}
                />
                <input
                  type="text"
                  className="w-1/2 bg-[#222] rounded-lg px-4 py-3 text-white text-lg outline-none"
                  placeholder="CVC"
                  value={cardInfo.cvc}
                  onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <button
                className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-3 text-lg"
                onClick={handleSaveCard}
              >
                Kartı Kaydet
              </button>
              <button
                className="w-full bg-[#333] text-white font-semibold rounded-xl py-3 text-lg"
                onClick={() => setShowAddCardForm(true)}
              >
                Yeni Kart Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Form (in Card modal) */}
      {showAddCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-black rounded-xl p-6 w-[95vw] max-w-md relative text-white">
            <button
              className="absolute top-2 left-3 text-white text-2xl"
              onClick={() => setShowAddCardForm(false)}
            >
              {'<'}
            </button>
            <div className="text-center text-xl font-bold mb-4">Yeni Kredi Kartı Ekle</div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Kart Sahibi</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                placeholder="Ad Soyad"
                value={cardInfo.name}
                onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })}
              />
              <label className="block mb-1 font-semibold">Kart Numarası</label>
              <input
                type="text"
                className="w-full bg-[#222] rounded-lg px-4 py-3 mb-2 text-white text-lg outline-none"
                placeholder="XXXX XXXX XXXX XXXX"
                value={cardInfo.number}
                onChange={e => setCardInfo({ ...cardInfo, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              />
              <label className="block mb-1 font-semibold">Son Kullanım Tarihi</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="w-1/2 bg-[#222] rounded-lg px-4 py-3 text-white text-lg outline-none"
                  placeholder="AA/YY"
                  value={cardInfo.date}
                  onChange={e => setCardInfo({ ...cardInfo, date: e.target.value })}
                />
                <input
                  type="text"
                  className="w-1/2 bg-[#222] rounded-lg px-4 py-3 text-white text-lg outline-none"
                  placeholder="CVC"
                  value={cardInfo.cvc}
                  onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                />
              </div>
            </div>
            <button
              className="w-full bg-[#FFD600] text-black font-bold rounded-xl py-3 text-lg"
              onClick={handleSaveCard}
            >
              Kartı Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Alt Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#222] flex justify-around py-2 z-50">
        <button
          onClick={() => setActiveTab('anasayfa')}
          className={`flex flex-col items-center ${activeTab === 'anasayfa' ? 'text-yellow-400' : 'text-white'}`}
        >
          <AiOutlineHome className="text-2xl mb-1" />
          <span className="text-xs">Anasayfa</span>
        </button>
        <button
          onClick={() => setActiveTab('favoriler')}
          className={`flex flex-col items-center ${activeTab === 'favoriler' ? 'text-yellow-400' : 'text-white'}`}
        >
          <FiHeart className="text-2xl mb-1" />
          <span className="text-xs">Favoriler</span>
        </button>
        <button
          onClick={() => setActiveTab('sepet')}
          className={`flex flex-col items-center ${activeTab === 'sepet' ? 'text-yellow-400' : 'text-white'}`}
        >
          <FiShoppingCart className="text-2xl mb-1" />
          <span className="text-xs">Sepet</span>
        </button>
        <button
          onClick={() => setActiveTab('aktivite')}
          className={`flex flex-col items-center ${activeTab === 'aktivite' ? 'text-yellow-400' : 'text-white'}`}
        >
          <FiBell className="text-2xl mb-1" />
          <span className="text-xs">Aktivite</span>
        </button>
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex flex-col items-center ${activeTab === 'profil' ? 'text-yellow-400' : 'text-white'}`}
        >
          <FiUser className="text-2xl mb-1" />
          <span className="text-xs">Profil</span>
        </button>
      </nav>
    </>
  );
}