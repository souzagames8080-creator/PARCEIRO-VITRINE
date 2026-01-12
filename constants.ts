
import { Business, Category } from './types';

export const INITIAL_BUSINESSES: Business[] = [
    {
        id: "1767828687857",
        name: "R10 ARCONDICIONADO & ELÉTRICA",
        description: "Gravações de comerciais em áudio e vídeo para carro de som, porta de loja, igrejas e criação de vídeos comerciais para redes sociais.",
        logo: "https://i.postimg.cc/Z54VHqgn/1.jpg",
        banner: "https://i.postimg.cc/Z54VHqgn/1.jpg",
        category: "SERVIÇOS",
        whatsapp: "5588997289909",
        address: "Avenida Joaquim Crisostomo 1897, Fortim",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/r10.areletrica?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1",
        name: "PIZZARIA LIA",
        description: "A melhor pizza artesanal da cidade com forno a lenha.",
        logo: "https://i.postimg.cc/KYwMjqhr/4.jpg",
        banner: "https://i.postimg.cc/KYwMjqhr/4.jpg",
        category: "ALIMENTAÇÃO",
        whatsapp: "5585997677346",
        address: "rua Coronel aderaldo 03 Proximo a Farma Lider , Parajuru, Ceara",
        openingHours: "18:00 - 22:00",
        isFeatured: true,
        lat: -3.7319,
        lng: -38.5267,
        website: "https://www.instagram.com/pizzaria_restaurante_lia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "2",
        name: "WR CELL",
        description: "Assistência técnica especializada e acessórios para o seu celular.",
        logo: "https://i.postimg.cc/25s7M8yz/5.jpg",
        banner: "https://i.postimg.cc/25s7M8yz/5.jpg",
        category: "SERVIÇOS",
        whatsapp: "5585996473321",
        address: "Av. MONSENHOR DOURADO AO LADO DA PIZZARIA LIA PARAJURU",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/wr.cell_/?utm_source=ig_web_button_share_sheet"
    },
    {
        id: "3",
        name: "FARMACIA ARAUJO",
        description: "Cuidado e saúde para você e sua família com os melhores preços.",
        logo: "https://i.postimg.cc/wjJvF6C7/6.jpg",
        banner: "https://i.postimg.cc/wjJvF6C7/6.jpg",
        category: "SAÚDE",
        whatsapp: "5585996646024",
        address: "Parajuru, Ceará",
        openingHours: "08:00 - 21:00",
        isFeatured: true
    },
    {
        id: "1767998061814",
        name: "CAPOTARIA FORTIM",
        description: "Serviços de capotaria em geral com qualidade e garantia.",
        logo: "https://i.postimg.cc/jCY5YmN2/7.jpg",
        banner: "https://i.postimg.cc/jCY5YmN2/7.jpg",
        category: "SERVIÇOS",
        whatsapp: "5588992814001",
        address: "Tv. Joaquim Crisóstomo proximo ao posto guerra",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/capotariafortim?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1767998995360",
        name: "JONAS DIVULGAÇÕES",
        description: "Divulgação comercial e eventos na região.",
        logo: "https://i.postimg.cc/KcP1h7Qn/10.jpg",
        banner: "https://i.postimg.cc/KcP1h7Qn/10.jpg",
        category: "SERVIÇOS",
        whatsapp: "5585992491308",
        address: "Parajuru, Ceará",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/conexaocidade_2015?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1767999163471",
        name: "VAVÁ DO GELO",
        description: "Gelo em cubo e barra para festas e eventos.",
        logo: "https://i.postimg.cc/JhzFMQb4/vava.jpg",
        banner: "https://i.postimg.cc/wxfSvZWN/9.jpg",
        category: "COMÉRCIO",
        whatsapp: "5585996526112",
        address: "Rua Vila Monteiro ao lado da Cagece em parajuru",
        openingHours: "08:00 - 18:00",
        isFeatured: true
    },
    {
        id: "1767999251534",
        name: "DP 7 AUTOMOTIVO",
        description: "Estética automotiva e cuidados especiais para o seu carro.",
        logo: "https://i.postimg.cc/wTtTThkq/13.jpg",
        banner: "https://i.postimg.cc/wTtTThkq/13.jpg",
        category: "AUTOMOTIVO",
        whatsapp: "5585981325601",
        address: "RUA JOSÉ SABINO N° 11 PROXIMO AO SMART BRISA - PARAJURU",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/dp7_detail_car_care?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1767999400277",
        name: "SAFIRA VEICULOS",
        description: "Venda e troca de veículos novos e seminovos.",
        logo: "https://i.postimg.cc/v8f0RKpJ/12.jpg",
        banner: "https://i.postimg.cc/v8f0RKpJ/12.jpg",
        category: "AUTOMOTIVO",
        whatsapp: "5585982306150",
        address: "Parajuru, Ceará",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/cinquentinhas_safira?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1767999532660",
        name: "CASINHA DA VEVE",
        description: "Variedade em utilidades e presentes para sua casa.",
        logo: "https://i.postimg.cc/SsJN2CpM/14.jpg",
        banner: "https://i.postimg.cc/SsJN2CpM/14.jpg",
        category: "COMÉRCIO",
        whatsapp: "5585985618271",
        address: "RUA VILA MONTEIRO CENTRO PARAJURU",
        openingHours: "07:00 - 22:00",
        isFeatured: true,
        website: "https://www.instagram.com/casinhadaveveloja?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1768068680273",
        name: "PURA ESSÊNCIA",
        description: "Fragrâncias e produtos de cuidado pessoal.",
        logo: "https://i.postimg.cc/nc00dxt9/2.jpg",
        banner: "https://i.postimg.cc/nc00dxt9/2.jpg",
        category: "UTILIDADES",
        whatsapp: "5588982262891",
        address: "RUA MAURO CAVALCANTE - 308 CENTRO FORTIM",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/puraessenciafortim?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
    {
        id: "1768069463346",
        name: "FELIPE SOM",
        description: "Equipamentos de som e serviços para eventos.",
        logo: "https://i.postimg.cc/qqYgRg31/3.jpg",
        banner: "https://i.postimg.cc/qqYgRg31/3.jpg",
        category: "SERVIÇOS",
        whatsapp: "5585998388550",
        address: "RUA RAIMUNDO BALA N° 80 FORTIM -CE",
        openingHours: "08:00 - 18:00",
        isFeatured: true,
        website: "https://www.instagram.com/felipesom98?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    }
];

export const INITIAL_CATEGORIES: Category[] = [
    { type: "ALIMENTAÇÃO", icon: "Utensils", color: "bg-orange-500" },
    { type: "SAÚDE", icon: "HeartPulse", color: "bg-red-500" },
    { type: "COMÉRCIO", icon: "ShoppingBag", color: "bg-blue-500" },
    { type: "SERVIÇOS", icon: "Wrench", color: "bg-green-500" },
    { type: "EDUCAÇÃO", icon: "GraduationCap", color: "bg-purple-500" },
    { type: "PETS", icon: "PawPrint", color: "bg-yellow-600" },
    { type: "CASA & OBRA", icon: "Home", color: "bg-blue-700" },
    { type: "AUTOMOTIVO", icon: "Car", color: "bg-slate-700" },
    { type: "UTILIDADES", icon: "Globe", color: "bg-teal-500" },
    { type: "MERCADOS", icon: "ShoppingCart", color: "bg-pink-500" }
];

export const RADIO_STREAM_URL = "https://stream.zeno.fm/gsstolze3mjtv";
