const features = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>
            </svg>
        ),
        title: 'Envío gratis',
        desc: 'A todo el país',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </svg>
        ),
        title: 'Despacho 24–48hs',
        desc: 'Gran Mendoza',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>
            </svg>
        ),
        title: 'Devoluciones',
        desc: 'Hasta 30 días',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/>
            </svg>
        ),
        title: 'Pago seguro',
        desc: 'Tarjeta o transferencia',
    },
];

export function BenefitsBar() {
    return (
        <div className="bg-white border-b" style={{ borderColor: 'rgba(34,38,29,.10)' }}>
            <div className="max-w-[1200px] mx-auto px-7 grid grid-cols-2 md:grid-cols-4 gap-5 py-[26px]">
                {features.map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-center gap-3.5">
                        <span
                            className="w-11 h-11 rounded-xl grid place-items-center flex-shrink-0 text-[#566a2f]"
                            style={{ background: '#eef0e3' }}
                        >
                            {icon}
                        </span>
                        <div>
                            <p className="text-[14.5px] font-bold leading-[1.2] text-[#22261d]">{title}</p>
                            <p className="text-[12.5px] text-[#6c7062] leading-[1.3]">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
