
export interface Business {
    id: string;
    name: string;
    description: string;
    logo: string;
    banner?: string;
    category: string;
    whatsapp: string;
    website?: string;
    address: string;
    openingHours: string;
    isFeatured: boolean;
    lat?: number;
    lng?: number;
    distance?: number;
}

export interface Category {
    type: string;
    icon: string;
    color: string;
}

export interface PartnerSeal {
    partnerLogo: string;
    cityName: string;
    adWhatsapp: string;
    adLink: string;
}

declare global {
    interface Window {
        ACHE_AQUI_PROD?: boolean;
        ACHE_AQUI_DATA?: Business[];
        ACHE_AQUI_CATS?: Category[];
        ACHE_AQUI_SEAL?: PartnerSeal;
        ACHE_AQUI_RADIO?: string;
    }
}
