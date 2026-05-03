import { ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const carouselImages = [
  'https://acdn-us.mitiendanube.com/stores/007/009/693/themes/rio/2-slide-1767966765442-5481418450-443a8c58dcedd3f0d95ccb529efbd2c21767966768-1920-1920.webp?189805211350344595',
  'https://acdn-us.mitiendanube.com/stores/002/027/172/themes/new_linkedman/2-slide-1765303427875-7520504997-4dbcccbe58c186427f6c688d13dc1d701765303429-1920-1920.webp?1900152006387381557',
  'https://acdn-us.mitiendanube.com/stores/002/027/172/themes/new_linkedman/2-slide-1765303427875-3455558586-2def44c5c6dc5f06bc327b37fb55436e1765303430-1920-1920.webp?1900152006387381557',
  'https://acdn-us.mitiendanube.com/stores/002/027/172/themes/new_linkedman/2-slide-1725907542775-7740745015-34bf43e2884e9a18a3d1513f99bfdf6e1725907557-1920-1920.webp?1900152006387381557',
];

function NextArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#6b8e3d] p-3 rounded-full shadow-lg transition-all hover:scale-110"
      aria-label="Siguiente"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
}

function PrevArrow({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#6b8e3d] p-3 rounded-full shadow-lg transition-all hover:scale-110"
      aria-label="Anterior"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  fade: true,
  cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  dotsClass: 'slick-dots !bottom-6',
  appendDots: (dots: React.ReactNode[]) => (
    <ul className="flex justify-center gap-2">
      {(dots as any[]).map((dot: any, index: number) => (
        <li key={index} className={dot.props.className}>
          {dot.props.children}
        </li>
      ))}
    </ul>
  ),
  customPaging: () => (
    <button className="w-3 h-3 rounded-full bg-white/60 hover:bg-white transition-all" />
  ),
};

export function HeroCarousel() {
  return (
    <section className="relative w-full">
      <style>{`
        .slick-slider { width: 100%; }
        .slick-list, .slick-track { width: 100%; }
        .slick-slide > div { width: 100%; }
        .slick-dots li button:before { display: none; }
        .slick-dots li.slick-active button { background-color: white; transform: scale(1.3); }
      `}</style>
      <Slider {...sliderSettings}>
        {carouselImages.map((image, index) => (
          <div key={index} className="relative">
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100">
              <img
                src={image}
                alt={`Slide ${index + 1} - Mates Aconcagua`}
                className="w-full h-full object-contain"
                style={{ objectPosition: 'center' }}
              />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
