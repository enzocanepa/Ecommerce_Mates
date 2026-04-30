import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { Skeleton } from '../components/ui/skeleton';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 8;

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre: A → Z' },
  { value: 'name_desc', label: 'Nombre: Z → A' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'mates', name: 'Mates' },
  { id: 'bombillas', name: 'Bombillas' },
  { id: 'yerba', name: 'Yerba' },
  { id: 'accesorios', name: 'Accesorios' },
];

export function Shop() {
  usePageSEO({
    title: 'Catálogo',
    description: 'Explorá nuestro catálogo completo de mates, bombillas, yerba y accesorios. Filtros por categoría y precio.',
  });
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const searchTerm = searchParams.get('search') || '';

  const maxProductPrice = Math.max(...products.map((p) => p.price), 0);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy, minPrice, maxPrice]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchTerm) setSearchParams({});
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSortBy('relevance');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    sortBy !== 'relevance' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    searchTerm !== '';

  // 1 — Category / search filter
  let filtered = searchTerm
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedCategory === 'all'
    ? [...products]
    : products.filter((p) => p.category === selectedCategory);

  // 2 — Price range filter
  const min = minPrice !== '' ? Number(minPrice) : 0;
  const max = maxPrice !== '' ? Number(maxPrice) : Infinity;
  filtered = filtered.filter((p) => p.price >= min && p.price <= max);

  // 3 — Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'name_asc':
        return a.name.localeCompare(b.name, 'es');
      case 'name_desc':
        return b.name.localeCompare(a.name, 'es');
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-8">Nuestro Catálogo</h1>

        {searchTerm && (
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700">
              Resultados para:{' '}
              <span className="font-semibold">"{searchTerm}"</span>
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSelectedCategory('all');
              }}
              className="text-[#6b8e3d] hover:text-[#a8c95f] text-sm mt-2"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* ── Toolbar ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Category pills */}
          {!searchTerm && (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#c7e47d] text-[#4a5f2f] font-semibold'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 text-sm border rounded-lg px-3 py-2 transition-colors ${
                showFilters || minPrice || maxPrice
                  ? 'bg-[#c7e47d] border-[#b8d66e] text-[#4a5f2f]'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {(minPrice || maxPrice) && (
                <span className="bg-[#4a5f2f] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            {/* Clear all */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* ── Price filter panel ──────────────────────────── */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex flex-wrap gap-6 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Precio mínimo (ARS)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                min={0}
                max={maxProductPrice}
                className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Precio máximo (ARS)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={maxProductPrice.toLocaleString('es-AR')}
                min={0}
                className="w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
              />
            </div>
            {(minPrice || maxPrice) && (
              <button
                onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                className="text-sm text-[#6b8e3d] hover:text-[#4a5f2f] transition-colors"
              >
                Borrar rango
              </button>
            )}
          </div>
        )}

        {/* ── Results count ───────────────────────────────── */}
        <div className="mb-6 text-sm text-gray-500">
          {filtered.length === 0
            ? 'No se encontraron productos'
            : `Mostrando ${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} de ${filtered.length} productos`}
        </div>

        {/* ── Products grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No se encontraron productos con esos filtros.</p>
            <button
              onClick={clearAllFilters}
              className="text-[#6b8e3d] hover:text-[#4a5f2f] transition-colors underline"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex gap-2">
              {getPageNumbers().map((page, idx) =>
                page === '...' ? (
                  <span key={`e-${idx}`} className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[#c7e47d] text-[#4a5f2f] font-semibold'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
