import { Link } from 'react-router';

export function HeroCarousel() {
    return (
        <section
            className="relative w-full min-h-[85vh] bg-cover bg-center flex items-center"
            style={{
                backgroundImage: "url('/hero-banner.jpg')",
                backgroundColor: '#2d3b1a',
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

            <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
                <div className="max-w-xl">
                    <span className="inline-block text-[#c7e47d] text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                        Artesanal · Premium · Argentino
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.1]">
                        Mates<br />Aconcagua
                    </h1>
                    <p className="text-lg md:text-xl text-white/85 mb-10 max-w-md leading-relaxed">
                        La mejor selección de mates artesanales y accesorios premium para vivir la tradición del campo.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to="/tienda"
                            className="bg-[#c7e47d] text-[#3a4f20] px-8 py-3.5 rounded-lg font-bold text-base hover:bg-[#b8d66e] transition-colors shadow-md"
                        >
                            Ver Productos
                        </Link>
                        <Link
                            to="/acerca"
                            className="border-2 border-white/80 text-white px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-white/10 transition-colors"
                        >
                            Conocenos
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
