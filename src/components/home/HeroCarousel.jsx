import { Link } from 'react-router';
import { Truck, Clock, ShieldCheck } from 'lucide-react';

export function HeroCarousel() {
    return (
        <section
            className="relative w-full min-h-[88vh] bg-cover bg-center flex items-center"
            style={{
                backgroundImage: "url('/hero-home.png')",
                backgroundColor: '#1e2a10',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

            <div className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-20">
                <div className="max-w-xl">
                    <span className="inline-block text-[#c07040] text-xs font-semibold tracking-[0.25em] uppercase mb-5">
                        — Artesanal · Desde la Cordillera
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-1">
                        El ritual del mate,
                    </h1>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold italic text-[#c07040] leading-[1.1] mb-6">
                        hecho a mano
                    </h1>
                    <p className="text-base md:text-lg text-white/80 mb-8 max-w-md leading-relaxed">
                        Mates de calabaza, algarrobo y acero seleccionados pieza por pieza. Calidad que se hereda, con envío gratis a todo el país.
                    </p>
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Link
                            to="/tienda"
                            className="bg-[#c07040] text-white px-7 py-3 rounded-lg font-semibold text-sm hover:bg-[#a85e30] transition-colors"
                        >
                            Ver catálogo →
                        </Link>
                        <Link
                            to="/acerca"
                            className="border border-white/60 text-white px-7 py-3 rounded-lg font-semibold text-sm hover:bg-white/10 transition-colors"
                        >
                            Conocé la marca
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-6 text-white/65 text-xs">
                        <span className="flex items-center gap-1.5">
                            <Truck className="w-4 h-4" /> Envío gratis
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> Despacho 24-48hs
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" /> Compra segura
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
