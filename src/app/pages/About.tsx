import { Heart, Award, Truck } from 'lucide-react';

export function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#a8c95f] to-[#8fb84d] text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Acerca de Mates Aconcagua</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Compartiendo la tradición del mate desde 2026
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 mb-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl mb-6">Nuestra Historia</h2>
          <p className="text-lg text-gray-700 mb-4">
            Mates Aconcagua nació de la pasión por mantener viva una de las tradiciones más hermosas
            de Latinoamérica. Sabemos que el mate es más que una bebida: es un momento de encuentro,
            de conversación, de compartir.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Por eso, seleccionamos cuidadosamente cada uno de nuestros productos, trabajando con
            artesanos locales y las mejores marcas del mercado para ofrecerte calidad garantizada.
          </p>
          <p className="text-lg text-gray-700">
            Nuestro compromiso es brindarte no solo productos de excelencia, sino también una
            experiencia de compra única que honre la tradición del mate.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl text-center mb-12">Nuestros Valores</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-[#c7e47d]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#a8c95f]" />
            </div>
            <h3 className="text-xl mb-3">Pasión</h3>
            <p className="text-gray-600">
              Amamos lo que hacemos y se nota en cada producto que ofrecemos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-[#c7e47d]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[#a8c95f]" />
            </div>
            <h3 className="text-xl mb-3">Calidad</h3>
            <p className="text-gray-600">
              Solo trabajamos con productos de primera calidad, probados y seleccionados.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-[#c7e47d]/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-[#a8c95f]" />
            </div>
            <h3 className="text-xl mb-3">Servicio</h3>
            <p className="text-gray-600">
              Envío rápido y atención personalizada para que disfrutes de tu compra.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-[#a8c95f] text-white p-12 rounded-lg text-center">
          <h2 className="text-3xl mb-4">¿Tenés alguna pregunta?</h2>
          <p className="text-xl mb-6">
            Estamos para ayudarte. Contactanos y te responderemos a la brevedad.
          </p>
          <a
            href="mailto:info@mateshop.com"/*CAMBIAR REFERENCIA*/
            className="inline-block bg-white text-[#6b8e3d] px-8 py-3 rounded-lg hover:bg-[#e8f3d3] transition-colors text-lg"
          >
            infoo@mateshop.com
          </a>
        </div>
      </section>
    </div>
  );
}
