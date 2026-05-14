import { useParams, useNavigate, Link, useLocation } from 'react-router';
import { useProducts } from '../context/ProductsContext';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ShoppingCart, Check, ArrowLeft, ChevronLeft, ChevronRight, Package, Shield, Truck, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    const { products } = useProducts();
    const { addToCart, cart } = useCart();
    const { user } = useAuth();
    const [isAdded, setIsAdded] = useState(false);
    const [showQty, setShowQty] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState('');
    const [quantity, setQuantity] = useState(1);
    const product = products.find(p => p.id === Number(id));
    usePageSEO({
        title: product?.name ?? 'Producto',
        description: product?.description,
    });
    if (!product) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl mb-4">Producto no encontrado</h2>
          <Link to="/tienda" className="text-[#6b8e3d] hover:text-[#a8c95f]">
            Volver al catálogo
          </Link>
        </div>
      </div>);
    }
    const isInCart = cart.some(item => item.id === product.id);
    const productImages = (product.images?.length ? product.images : [product.image])
        .map(img => typeof img === 'string' ? img : img.url)
        .filter(Boolean);
    const maxStock = product.stock ?? 99;
    const handleAddClick = () => {
        if (product.stock === 0) return;
        setShowQty(true);
    };

    const handleConfirm = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        const label = quantity > 1 ? `${quantity} unidades agregadas` : '¡Agregado al carrito!';
        toast.success(label, { description: product.name, duration: 2500 });
        setTimeout(() => { setIsAdded(false); setShowQty(false); setQuantity(1); }, 2000);
    };
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };
    return (<div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#6b8e3d] hover:text-[#a8c95f] mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5"/>
          Volver
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img src={productImages[currentImageIndex]} alt={`${product.name} - imagen ${currentImageIndex + 1}`} className="w-full h-full object-cover"/>

                {productImages.length > 1 && (<>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors" aria-label="Imagen anterior">
                      <ChevronLeft className="w-5 h-5"/>
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors" aria-label="Siguiente imagen">
                      <ChevronRight className="w-5 h-5"/>
                    </button>
                  </>)}
              </div>

              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (<div className="flex gap-2 overflow-x-auto">
                  {productImages.map((img, index) => (<button key={index} onClick={() => setCurrentImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${currentImageIndex === index
                    ? 'border-[#c7e47d]'
                    : 'border-gray-200 hover:border-gray-300'}`}>
                      <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover"/>
                    </button>))}
                </div>)}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block bg-[#c7e47d]/20 text-[#6b8e3d] text-sm px-3 py-1 rounded-full mb-3">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </span>
                <h1 className="text-3xl md:text-4xl mb-4">{product.name}</h1>
                <p className="text-4xl text-[#6b8e3d] mb-6">
                  ${product.price.toLocaleString('es-AR')}
                </p>
              </div>

              {/* Stock */}
              {product.stock !== undefined && (<div className="mb-6">
                  <p className={`text-sm ${product.stock > 0 ? 'text-[#6b8e3d]' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                  </p>
                </div>)}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (<div className="mb-6">
                  <h3 className="text-lg mb-3">Variantes disponibles:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                        const label = typeof variant === 'string' ? variant : variant.name;
                        return (
                          <button key={label} onClick={() => setSelectedVariant(label)} className={`px-4 py-2 rounded-lg border transition-colors ${selectedVariant === label
                          ? 'bg-[#c7e47d] text-[#4a5f2f] border-[#c7e47d]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#c7e47d]'}`}>
                            {label}
                          </button>
                        );
                      })}
                  </div>
                </div>)}

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg mb-3">Descripción:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>

              {/* Add to Cart — toggles into quantity selector */}
              {isAdded ? (
                <button disabled className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg bg-[#8fb84d] text-white text-lg mb-4">
                  <Check className="w-6 h-6"/>
                  Agregado al carrito
                </button>
              ) : showQty ? (
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-5 h-5"/>
                  </button>
                  <span className="w-10 text-center text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(maxStock, q + 1))}
                    disabled={quantity >= maxStock}
                    className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-5 h-5"/>
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] text-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5"/>
                    Agregar al carrito
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddClick}
                  disabled={product.stock === 0}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition-all text-lg mb-4 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f]'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6"/>
                  Agregar al carrito
                </button>
              )}

              {isInCart && !isAdded && (<p className="text-sm text-[#6b8e3d] text-center mb-4">
                  Este producto ya está en tu carrito
                </p>)}

              {/* Features */}
              <div className="border-t pt-6 space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-[#6b8e3d] flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-semibold text-gray-800">Envío a todo el país</p>
                    <p>Recibí tu pedido en 3-7 días hábiles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-[#6b8e3d] flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-semibold text-gray-800">Compra protegida</p>
                    <p>Garantía de calidad en todos nuestros productos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Package className="w-5 h-5 text-[#6b8e3d] flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-semibold text-gray-800">Embalaje seguro</p>
                    <p>Tu pedido llega perfectamente protegido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <ReviewsSection productId={product.id}/>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map(relatedProduct => (<Link key={relatedProduct.id} to={`/producto/${relatedProduct.id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <p className="text-[#6b8e3d] text-xl">
                      ${relatedProduct.price.toLocaleString('es-AR')}
                    </p>
                  </div>
                </Link>))}
          </div>
        </div>
      </div>
    </div>);
}
