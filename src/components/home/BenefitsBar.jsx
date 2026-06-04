import { Truck, Clock, RotateCcw, CreditCard } from 'lucide-react';

const benefits = [
    { icon: Truck, title: 'Envío gratis', desc: 'A todo el país' },
    { icon: Clock, title: 'Despacho 24-48hs', desc: 'CABA y GBA' },
    { icon: RotateCcw, title: 'Devoluciones', desc: 'Hasta 30 días' },
    { icon: CreditCard, title: 'Pago seguro', desc: 'Tarjeta o transferencia' },
];

export function BenefitsBar() {
    return (
        <section className="bg-white border-b border-gray-100 py-5 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {benefits.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-[#4a5f2f] flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{title}</p>
                                <p className="text-xs text-gray-500">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
