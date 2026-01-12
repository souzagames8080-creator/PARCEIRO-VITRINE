
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    Search, Navigation, Radio, Play, Pause, MessageCircle, Utensils, HeartPulse, 
    ShoppingBag, Wrench, GraduationCap, PawPrint, Home, Car, Globe, ShoppingCart, 
    Plus, Settings, X, Download, Upload, Code, LocateFixed, ChevronRight, 
    ChevronLeft, Layers, Pencil, RotateCcw, ShieldCheck, Volume2, ExternalLink,
    Instagram
} from 'lucide-react';
import { INITIAL_BUSINESSES, INITIAL_CATEGORIES, RADIO_STREAM_URL } from './constants';
import { getDistance } from './utils';
import { Business, Category, PartnerSeal } from './types';

const IconMap: Record<string, React.ElementType> = {
    Utensils, HeartPulse, ShoppingBag, Wrench, GraduationCap,
    PawPrint, Home, Car, Globe, ShoppingCart, Layers
};

const checkIsProduction = () => window.ACHE_AQUI_PROD === true;

const App = () => {
    const [isProduction] = useState(checkIsProduction());
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    const [businessesList, setBusinessesList] = useState<Business[]>(() => {
        const injectedData = window.ACHE_AQUI_DATA;
        if (injectedData) return injectedData;
        const saved = localStorage.getItem('ache_aqui_db');
        return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
    });

    const [categoriesList, setCategoriesList] = useState<Category[]>(() => {
        const injectedCats = window.ACHE_AQUI_CATS;
        if (injectedCats) return injectedCats;
        const saved = localStorage.getItem('ache_aqui_categories');
        return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    });

    const [partnerSeal, setPartnerSeal] = useState<PartnerSeal>(() => {
        const injectedSeal = window.ACHE_AQUI_SEAL;
        if (injectedSeal) return injectedSeal;
        const saved = localStorage.getItem('ache_aqui_seal');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse partner seal from localStorage", e);
            }
        }
        return {
            partnerLogo: 'https://i.postimg.cc/8c0WQv6n/CONEXAO-CIDADE.jpg',
            cityName: 'Parajuru',
            adWhatsapp: '5585992908713',
            adLink: 'https://wa.me/5585992908713'
        };
    });

    const [radioStreamUrl, setRadioStreamUrl] = useState<string>(() => {
        const injectedRadio = window.ACHE_AQUI_RADIO;
        if (injectedRadio) return injectedRadio;
        const saved = localStorage.getItem('ache_aqui_radio');
        return saved ? saved : RADIO_STREAM_URL;
    });

    const [radioName, setRadioName] = useState<string>(() => {
        const saved = localStorage.getItem('ache_aqui_radio_name');
        return saved ? saved : 'Rádio Minha Divulgação';
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [userCoords, setUserCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const audioRef = useRef<HTMLAudioElement>(null);

    const featuredBusinesses = useMemo(() => businessesList.filter(b => b.isFeatured), [businessesList]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const [newBiz, setNewBiz] = useState<Partial<Business>>({
        name: '', description: '', logo: '', banner: '', category: '',
        whatsapp: '', website: '', address: '', openingHours: '', isFeatured: false, lat: 0, lng: 0
    });

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (carouselRef.current && !isHovered && !searchQuery && !activeCategory) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                const maxScroll = scrollWidth - clientWidth;
                if (scrollLeft >= maxScroll - 10) {
                    carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    carouselRef.current.scrollBy({ left: clientWidth > 400 ? 350 : 300, behavior: 'smooth' });
                }
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [isHovered, searchQuery, activeCategory]);

    useEffect(() => {
        if (!newBiz.category && categoriesList.length > 0 && !editingId) {
            setNewBiz(prev => ({ ...prev, category: categoriesList[0].type }));
        }
    }, [categoriesList, editingId]);

    useEffect(() => {
        if (!checkIsProduction()) {
            localStorage.setItem('ache_aqui_db', JSON.stringify(businessesList));
            localStorage.setItem('ache_aqui_categories', JSON.stringify(categoriesList));
            localStorage.setItem('ache_aqui_seal', JSON.stringify(partnerSeal));
            localStorage.setItem('ache_aqui_radio', radioStreamUrl);
            localStorage.setItem('ache_aqui_radio_name', radioName);
        }
    }, [businessesList, categoriesList, partnerSeal, radioStreamUrl, radioName]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (featuredBusinesses.length > 0) {
                setCurrentSlide(prev => (prev + 1) % featuredBusinesses.length);
            }
        }, 6000);
        return () => clearInterval(timer);
    }, [featuredBusinesses.length]);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const handleRequestGeo = () => {
        if (isLocating) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition((pos) => {
            setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setIsLocating(false);
        }, () => {
            setIsLocating(false);
            alert("Não conseguimos acessar sua localização.");
        });
    };

    const toggleRadio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(() => { });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const exportForGoogleSites = () => {
        const dataString = JSON.stringify(businessesList);
        const catString = JSON.stringify(categoriesList);
        const sealString = JSON.stringify(partnerSeal);
        const radioString = JSON.stringify(radioStreamUrl);
        const radioNameString = JSON.stringify(radioName);
        const dataScript = `<script>window.ACHE_AQUI_PROD = true; window.ACHE_AQUI_DATA = ${dataString}; window.ACHE_AQUI_CATS = ${catString}; window.ACHE_AQUI_SEAL = ${sealString}; window.ACHE_AQUI_RADIO = ${radioString}; window.ACHE_AQUI_RADIO_NAME = ${radioNameString};</script>`;
        const currentHtml = document.documentElement.outerHTML;
        let finalHtml = currentHtml.includes('</head>') ? 
            currentHtml.replace('</head>', `${dataScript}</head>`) : 
            currentHtml.replace('</body>', `${dataScript}</body>`);
        
        navigator.clipboard.writeText(`<!DOCTYPE html>\n${finalHtml}`).then(() => alert("CÓDIGO COPIADO PARA O SITE! ✅"));
    };

    const handleEditClick = (biz: Business) => {
        setEditingId(biz.id);
        setNewBiz({ ...biz });
        const modalContent = document.querySelector('.max-h-\\[90vh\\]');
        if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setNewBiz({ name: '', description: '', logo: '', banner: '', category: categoriesList[0]?.type || '', whatsapp: '', website: '', address: '', openingHours: '', isFeatured: false, lat: 0, lng: 0 });
    };

    const handleSubmitBiz = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setBusinessesList(businessesList.map(b => b.id === editingId ? { ...newBiz as Business, id: editingId } : b));
            alert('Parceiro atualizado! ✅');
        } else {
            setBusinessesList([...businessesList, { ...newBiz as Business, id: Date.now().toString() }]);
            alert('Parceiro cadastrado! ✅');
        }
        handleCancelEdit();
    };

    const handleExportBackup = () => {
        const data = { businesses: businessesList, categories: categoriesList, seal: partnerSeal, radio: radioStreamUrl, radioName: radioName };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guia_backup_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.businesses) setBusinessesList(json.businesses);
                if (json.categories) setCategoriesList(json.categories);
                if (json.seal) setPartnerSeal(json.seal);
                if (json.radio) setRadioStreamUrl(json.radio);
                if (json.radioName) setRadioName(json.radioName);
                alert("Dados carregados com sucesso! ✅");
            } catch (err) {
                alert("Erro ao ler o arquivo de backup.");
            }
        };
        reader.readAsText(file);
    };

    const filteredBusinessesList = useMemo(() => {
        let list = [...businessesList];
        const query = searchQuery.toLowerCase();
        if (!searchQuery && !activeCategory) {
            list = list.filter(b => b.isFeatured);
        } else {
            list = list.filter(b => {
                const matchesSearch = b.name.toLowerCase().includes(query) || b.category.toLowerCase().includes(query);
                const matchesCategory = !activeCategory || b.category === activeCategory;
                return matchesSearch && matchesCategory;
            });
        }
        if (userCoords) {
            list = list.map(b => ({ ...b, distance: (b.lat && b.lng) ? getDistance(userCoords.lat, userCoords.lng, b.lat, b.lng) : 9999 }))
                .sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }
        return list;
    }, [searchQuery, activeCategory, userCoords, businessesList]);

    const adWhatsappLink = useMemo(() => {
        const num = (partnerSeal.adWhatsapp || '5585992908713').replace(/\D/g, '');
        return `https://wa.me/${num}`;
    }, [partnerSeal.adWhatsapp]);

    return (
        <div className="min-h-screen pb-20 bg-slate-50">
            {/* Nav */}
            <nav className="bg-blue-600 sticky top-0 z-50 p-4 shadow-lg flex items-center gap-3">
                <div className="bg-white px-2 py-1 rounded-lg font-black text-blue-600 text-xl shadow-sm">M</div>
                <div className="relative flex-1 flex items-center bg-white rounded-xl shadow-inner px-3">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="O que você busca hoje?" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent px-2 py-2 text-sm outline-none border-none"
                    />
                    <button onClick={handleRequestGeo} className={`p-1.5 rounded-lg ${userCoords ? 'text-blue-600' : 'text-slate-300'}`}>
                        <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                {!isProduction && (
                    <button onClick={() => setIsAdminOpen(true)} className="text-white p-2">
                        <Settings className="w-6 h-6" />
                    </button>
                )}
            </nav>

            <main className="max-w-4xl mx-auto px-4">
                {/* Banner Carousel */}
                {featuredBusinesses.length > 0 && (
                    <div className="mt-4 mb-4 relative overflow-hidden rounded-[2.5rem] aspect-video sm:aspect-[21/9] bg-slate-900 shadow-2xl border-4 border-white">
                        {featuredBusinesses.map((b, idx) => (
                            <div 
                                key={b.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                <img src={b.banner || b.logo} className="w-full h-full object-cover opacity-60" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent flex flex-col justify-end p-8">
                                    <h2 className="text-white font-black uppercase text-2xl tracking-tighter leading-none">{b.name}</h2>
                                    <p className="text-blue-400 text-[10px] font-bold uppercase mt-1 tracking-widest">Destaque da Semana</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Radio Player */}
                <div className="my-6 bg-slate-950 rounded-[1.8rem] p-4 flex items-center justify-between shadow-2xl border border-white/5 gap-3">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className={`w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white ${isPlaying ? 'animate-pulse' : ''}`}>
                            <Radio className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                <span className="text-red-500 text-[10px] font-black uppercase">Ao Vivo</span>
                            </div>
                            <span className="text-slate-300 text-[11px] font-bold uppercase truncate max-w-[150px] sm:max-w-none">{radioName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 flex-1 justify-end">
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                            <Volume2 className="w-4 h-4 text-slate-400" />
                            <input 
                                type="range" min="0" max="1" step="0.01" 
                                value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-point accent-blue-500" 
                            />
                        </div>
                        <button 
                            onClick={toggleRadio}
                            className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                    </div>
                    <audio ref={audioRef} src={radioStreamUrl} crossOrigin="anonymous" />
                </div>

                {/* Categories */}
                <div className="flex gap-4 py-4 mb-4 overflow-x-auto no-scrollbar scroll-smooth">
                    {categoriesList.map((cat) => (
                        <button 
                            key={cat.type}
                            onClick={() => setActiveCategory(activeCategory === cat.type ? null : cat.type)}
                            className="flex flex-col items-center gap-2 shrink-0"
                        >
                            <div className={`${cat.color} ${activeCategory === cat.type ? 'ring-4 ring-blue-400 scale-110' : 'opacity-90'} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all`}>
                                {React.createElement(IconMap[cat.icon] || Layers, { className: "w-5 h-5" })}
                            </div>
                            <span className={`text-[8px] font-black uppercase ${activeCategory === cat.type ? 'text-blue-600' : 'text-slate-400'}`}>
                                {cat.type.slice(0, 8)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Section Title */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
                        {!searchQuery && !activeCategory ? 'Parceiros Premium' : 'Resultado da Busca'}
                    </h2>
                    {!searchQuery && !activeCategory && featuredBusinesses.length > 1 && (
                        <div className="flex gap-2">
                            <button onClick={() => scrollCarousel('left')} className="p-1 bg-white rounded-full shadow border text-slate-400">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => scrollCarousel('right')} className="p-1 bg-white rounded-full shadow border text-slate-400">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Partners List / Carousel */}
                <div 
                    ref={carouselRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onTouchStart={() => setIsHovered(true)}
                    onTouchEnd={() => setIsHovered(false)}
                    className={`relative group mb-8 ${!searchQuery && !activeCategory ? 'flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 pb-4 snap-x snap-mandatory scroll-smooth' : 'space-y-4'}`}
                >
                    {filteredBusinessesList.map((biz) => (
                        <div 
                            key={biz.id}
                            onClick={() => setSelectedBusiness(biz)}
                            className={`${!searchQuery && !activeCategory ? 'min-w-[300px] sm:min-w-[350px] flex flex-col snap-center' : 'flex flex-row items-center'} bg-white p-5 rounded-[2.5rem] gap-4 shadow-md border border-slate-100 transition-all hover:shadow-xl cursor-pointer relative overflow-hidden`}
                        >
                            <div className="flex items-center gap-4">
                                <img 
                                    src={biz.logo} 
                                    className={`${!searchQuery && !activeCategory ? 'w-20 h-20' : 'w-16 h-16'} rounded-2xl object-cover shadow-inner`} 
                                    alt="" 
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-sm uppercase truncate text-slate-800">{biz.name}</h3>
                                    <span className="inline-block bg-slate-100 px-2 py-0.5 rounded-lg text-[8px] font-bold text-slate-400 uppercase tracking-widest">{biz.category}</span>
                                    {biz.distance && biz.distance < 9999 && (
                                        <span className="text-[8px] font-black text-blue-600 flex items-center gap-0.5 ml-2">
                                            <Navigation className="w-2 h-2" /> {biz.distance.toFixed(1)} km
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {!searchQuery && !activeCategory && (
                                <>
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black text-slate-400 uppercase">Atendimento</span>
                                            <p className="text-[10px] font-bold text-slate-700">{biz.openingHours}</p>
                                        </div>
                                        {/* INSTAGRAM BUTTON INSIDE PREMIUM CARD */}
                                        {biz.website && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(biz.website, '_blank');
                                                }}
                                                className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-2.5 rounded-full text-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                                            >
                                                <Instagram className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-[10px] font-black text-blue-600 uppercase flex items-center justify-between">
                                        <span>Ver Informações</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </>
                            )}
                            
                            {(searchQuery || activeCategory) && (
                                <div className="flex items-center gap-3">
                                    {biz.website && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(biz.website, '_blank');
                                            }}
                                            className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-2 rounded-full text-white shadow-md hover:scale-110 transition-transform"
                                        >
                                            <Instagram className="w-4 h-4" />
                                        </button>
                                    )}
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Banner Ads CTA */}
                <div className="mt-4 mb-12 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[3rem] p-10 text-center text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <h2 className="text-3xl font-black uppercase mb-3 tracking-tighter relative z-10">Sua Marca Aqui!</h2>
                    <p className="text-sm font-medium mb-8 text-blue-100 max-w-md mx-auto relative z-10">Destaque seu negócio no maior guia da região e alcance milhares de clientes.</p>
                    <a 
                        href={adWhatsappLink} target="_blank" 
                        className="bg-white text-blue-700 px-10 py-5 rounded-[1.5rem] font-black uppercase text-sm shadow-2xl flex items-center justify-center gap-4 mx-auto max-w-xs relative z-10 hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <MessageCircle className="w-6 h-6 fill-current" /> Quero Anunciar
                    </a>
                </div>
            </main>

            {/* Business Details Modal */}
            {selectedBusiness && (
                <div className="fixed inset-0 z-[120] bg-white sm:bg-slate-900/70 sm:backdrop-blur-md flex items-start justify-center overflow-y-auto">
                    <button 
                        onClick={() => setSelectedBusiness(null)}
                        className="fixed top-4 right-4 z-[130] bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-all shadow-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="bg-white w-full sm:max-w-2xl sm:my-8 sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col min-h-screen sm:min-h-0">
                        <div className="relative h-56 sm:h-72 shrink-0">
                            <img src={selectedBusiness.banner || selectedBusiness.logo} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10"></div>
                        </div>
                        
                        <div className="px-6 sm:px-12 pb-12 -mt-16 relative z-10">
                            <div className="bg-white p-1.5 rounded-[2rem] shadow-2xl inline-block mb-6 border-4 border-white">
                                <img src={selectedBusiness.logo} className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-[1.8rem]" alt="" />
                            </div>
                            
                            <h2 className="text-2xl sm:text-4xl font-black uppercase text-slate-800 mb-2 leading-none tracking-tight">
                                {selectedBusiness.name}
                            </h2>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <span className="bg-blue-600 text-white text-[10px] sm:text-xs font-black px-5 py-2 rounded-full uppercase shadow-lg shadow-blue-100">
                                    {selectedBusiness.category}
                                </span>
                                <span className="text-slate-400 text-[10px] sm:text-xs font-bold flex items-center gap-1.5 uppercase bg-slate-100 px-4 py-2 rounded-full">
                                    <RotateCcw className="w-3.5 h-3.5" /> {selectedBusiness.openingHours}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-blue-50/50 p-6 sm:p-8 rounded-[2rem] border border-blue-100/50">
                                    <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-[2px]">Localização</p>
                                    <div className="flex items-start gap-3">
                                        <Navigation className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-blue-900 text-xs sm:text-sm font-bold leading-snug">{selectedBusiness.address}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                    <a 
                                        href={`https://wa.me/${selectedBusiness.whatsapp.replace(/\D/g, '')}`} target="_blank"
                                        className="bg-green-500 text-white p-6 rounded-[2rem] font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-4 shadow-xl shadow-green-100 hover:bg-green-600 active:scale-95 transition-all"
                                    >
                                        <MessageCircle className="w-6 h-6 fill-current" /> Falar no WhatsApp
                                    </a>

                                    {/* INSTAGRAM BUTTON IN MODAL */}
                                    {selectedBusiness.website && (
                                        <a 
                                            href={selectedBusiness.website} target="_blank"
                                            className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white p-6 rounded-[2rem] font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-4 shadow-xl shadow-pink-100 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Instagram className="w-6 h-6" /> Instagram
                                        </a>
                                    )}

                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBusiness.address)}`} target="_blank"
                                        className="bg-blue-600 text-white p-6 rounded-[2rem] font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-4 shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
                                    >
                                        <Navigation className="w-6 h-6" /> Abrir no Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Management Modal */}
            {!isProduction && isAdminOpen && (
                <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b">
                            <h2 className="text-2xl font-black uppercase text-slate-800 tracking-tighter">Gestão do Guia</h2>
                            <button onClick={() => setIsAdminOpen(false)} className="bg-slate-100 p-3 rounded-full hover:bg-red-50 hover:text-red-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* CONFIGURAÇÃO DA RÁDIO */}
                        <div className="mb-10 bg-slate-950 p-6 rounded-[2rem] border border-white/5 text-white">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Radio className="w-4 h-4" /> Configuração da Rádio
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-500 ml-2">Nome da Rádio (No Player)</span>
                                    <input 
                                        type="text" value={radioName}
                                        onChange={e => setRadioName(e.target.value)}
                                        placeholder="Minha Rádio Online"
                                        className="bg-white/5 p-4 rounded-xl text-sm border border-white/10 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-blue-100"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-500 ml-2">Link do Player (Streaming URL)</span>
                                    <input 
                                        type="text" value={radioStreamUrl}
                                        onChange={e => setRadioStreamUrl(e.target.value)}
                                        placeholder="https://stream.zeno.fm/..."
                                        className="bg-white/5 p-4 rounded-xl text-sm border border-white/10 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-blue-100"
                                    />
                                </div>
                            </div>
                            <p className="text-[8px] text-slate-500 ml-2 mt-3">Alterações aqui são salvas automaticamente no navegador.</p>
                        </div>

                        {/* Partner Seal Config */}
                        <div className="mb-10 bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-blue-500" /> Configuração da Parceria & Contatos
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Logo do Parceiro (URL)</span>
                                    <input 
                                        type="text" value={partnerSeal.partnerLogo}
                                        onChange={e => setPartnerSeal({...partnerSeal, partnerLogo: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Nome da Cidade</span>
                                    <input 
                                        type="text" value={partnerSeal.cityName}
                                        onChange={e => setPartnerSeal({...partnerSeal, cityName: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1.5">
                                        <MessageCircle className="w-3 h-3" /> WhatsApp de Anúncios
                                    </span>
                                    <input 
                                        type="text" placeholder="558599290..." value={partnerSeal.adWhatsapp || ''}
                                        onChange={e => setPartnerSeal({...partnerSeal, adWhatsapp: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2 flex items-center gap-1.5">
                                        <ExternalLink className="w-3 h-3" /> Link do Rodapé (Opcional)
                                    </span>
                                    <input 
                                        type="text" placeholder="https://..." value={partnerSeal.adLink || ''}
                                        onChange={e => setPartnerSeal({...partnerSeal, adLink: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Export/Import Buttons */}
                        <div className="space-y-3 mb-10 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Exportação e Segurança</p>
                            <button 
                                onClick={exportForGoogleSites}
                                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white p-5 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-blue-700 transition-all"
                            >
                                <Code className="w-5 h-5" /> GERAR CÓDIGO GOOGLE SITES
                            </button>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button onClick={handleExportBackup} className="bg-slate-800 text-white p-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all">
                                    <Download className="w-4 h-4" /> SALVAR DADOS (BACKUP)
                                </button>
                                <label className="bg-white text-slate-600 p-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-3 cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all">
                                    <Upload className="w-4 h-4" /> CARREGAR DADOS
                                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Add/Edit Form */}
                        <form onSubmit={handleSubmitBiz} className="space-y-4 mb-12">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                {editingId ? 'Editando Parceiro' : 'Adicionar Novo Parceiro'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[2rem]">
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Nome Comercial</span>
                                    <input 
                                        type="text" required value={newBiz.name}
                                        onChange={e => setNewBiz({...newBiz, name: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Categoria</span>
                                    <select 
                                        value={newBiz.category}
                                        onChange={e => setNewBiz({...newBiz, category: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    >
                                        {categoriesList.map(c => <option key={c.type} value={c.type}>{c.type}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">WhatsApp</span>
                                    <input 
                                        type="text" required placeholder="55889..." value={newBiz.whatsapp}
                                        onChange={e => setNewBiz({...newBiz, whatsapp: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Instagram/Site (URL)</span>
                                    <input 
                                        type="text" value={newBiz.website || ''}
                                        onChange={e => setNewBiz({...newBiz, website: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-full">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Logo (URL)</span>
                                    <input 
                                        type="text" value={newBiz.logo}
                                        onChange={e => setNewBiz({...newBiz, logo: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-full">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Banner Destaque (URL)</span>
                                    <input 
                                        type="text" value={newBiz.banner || ''}
                                        onChange={e => setNewBiz({...newBiz, banner: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-full">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Funcionamento</span>
                                    <input 
                                        type="text" value={newBiz.openingHours}
                                        onChange={e => setNewBiz({...newBiz, openingHours: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 col-span-full">
                                    <span className="text-[9px] font-black uppercase text-slate-400 ml-2">Endereço</span>
                                    <input 
                                        type="text" value={newBiz.address}
                                        onChange={e => setNewBiz({...newBiz, address: e.target.value})}
                                        className="bg-white p-4 rounded-xl text-sm border-none shadow-sm"
                                    />
                                </div>
                                <label className="flex items-center gap-3 p-4 bg-white rounded-xl col-span-full cursor-pointer shadow-sm">
                                    <input 
                                        type="checkbox" checked={newBiz.isFeatured}
                                        onChange={e => setNewBiz({...newBiz, isFeatured: e.target.checked})}
                                        className="w-5 h-5 rounded border-none bg-slate-100 text-blue-600"
                                    />
                                    <span className="text-xs font-black uppercase text-slate-500">Destaque Premium (Aparece na Home)</span>
                                </label>
                                <div className="col-span-full flex gap-3">
                                    <button 
                                        type="submit" 
                                        className={`flex-1 ${editingId ? 'bg-orange-500' : 'bg-blue-600'} text-white p-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 shadow-lg transition-all`}
                                    >
                                        {editingId ? <RotateCcw className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        {editingId ? 'Salvar Alterações' : 'Cadastrar Parceiro'}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-600 p-5 rounded-2xl font-black uppercase text-sm">Cancelar</button>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* List of Registered Businesses */}
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Empresas Cadastradas ({businessesList.length})
                            </p>
                            <div className="space-y-2">
                                {businessesList.map(b => (
                                    <div key={b.id} className={`flex items-center justify-between p-3 bg-white border rounded-xl ${editingId === b.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-100'}`}>
                                        <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                                            <img src={b.logo} className="w-10 h-10 rounded shadow-sm object-cover" />
                                            <div className="flex flex-col">
                                                <span>{b.name}</span>
                                                <span className="text-[8px] text-slate-400 uppercase">{b.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => handleEditClick(b)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all" title="Editar">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => { if(confirm(`Remover "${b.name}" permanentemente?`)) setBusinessesList(prev => prev.filter(x => x.id !== b.id)); }}
                                                className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-all" title="Remover"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="py-12 bg-white border-t text-center flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-center">
                        <div className="bg-blue-600 px-6 py-2 rounded-full text-white font-black text-[11px] shadow-xl uppercase tracking-[2px]">Guia Minha Divulgação</div>
                    </div>
                    <p className="text-slate-900 font-black uppercase text-[12px] tracking-[4px]">Desenvolvido por Bossa Infor</p>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[5px]">Crescendo junto com o comércio local</p>
                </div>
                
                {/* Official Partnership Seal */}
                <div className="flex flex-col items-center justify-center gap-4 pt-8 border-t border-slate-50 max-w-md mx-auto px-4 w-full">
                    <div className="flex flex-col items-center gap-4 bg-white px-8 py-8 rounded-[3rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all w-full">
                        <div className="relative group">
                            <img 
                                src={partnerSeal.partnerLogo} 
                                className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-3xl shadow-lg border-4 border-slate-50 transition-transform group-hover:scale-105" 
                                alt="Logo Parceiro Principal" 
                            />
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[3px] leading-none mb-2">Parceria Oficial</p>
                            <p className="text-sm font-bold text-slate-800 leading-tight">
                                Projeto Minha Divulgação – sua referência em <span className="text-blue-700 font-black underline decoration-blue-200 decoration-4 underline-offset-4">{partnerSeal.cityName}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <a href={partnerSeal.adLink || adWhatsappLink} target="_blank" className="text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline cursor-pointer flex items-center justify-center gap-2 mt-4">
                    ✨ QUER ANUNCIAR SUA MARCA? CLIQUE AQUI ✨
                </a>
            </footer>
        </div>
    );
};

export default App;
