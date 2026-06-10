import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ProductCard } from '../components/product/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { Skeleton } from '../components/ui/skeleton';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

const serif = "'DM Serif Display', Georgia, serif";

function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(34,38,29,.09)' }}>
            <Skeleton className="aspect-square w-full" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-10 w-28 rounded-full" />
                </div>
            </div>
        </div>
    );
}

const ITEMS_PER_PAGE = 8;
const SORT_OPTIONS = [
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
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('relevance');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const searchTerm = searchParams.get('search') || '';
    const maxProductPrice = Math.max(...products.map((p) => p.price), 0);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTerm, sortBy, minPrice, maxPrice]);

    const handleCategoryChange = (categoryId) => {
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
                  (p.description ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            case 'name_asc': return a.name.localeCompare(b.name, 'es');
            case 'name_desc': return b.name.localeCompare(a.name, 'es');
            default: return 0;
        }
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const getPageNumbers = () => {
        const pages = [];
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
        <div style={{ background: '#f6f4ec', minHeight: '100vh' }}>

            {/* ── Page header ──────────────────────────────────── */}
            <div style={{ borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                <div className="max-w-[1200px] mx-auto px-6 md:px-7 py-10 md:py-14 text-center">
                    <p
                        className="text-[12px] font-bold tracking-[2.5px] uppercase mb-3"
                        style={{ color: '#c06a34' }}
                    >
                        — Tienda —
                    </p>
                    <h1
                        className="text-[32px] md:text-[42px] lg:text-[48px] leading-[1.1] tracking-[-0.3px] mb-2"
                        style={{ fontFamily: serif, color: '#22261d' }}
                    >
                        Nuestro Catálogo
                    </h1>
                    <p className="text-[15px]" style={{ color: '#6c7062' }}>
                        Productos artesanales seleccionados con pasión
                    </p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 md:px-7 py-8 md:py-10">

                {/* ── Search result notice ─────────────────────── */}
                {searchTerm && (
                    <div
                        className="mb-6 px-5 py-4 rounded-2xl flex flex-wrap items-center justify-between gap-3"
                        style={{ background: '#eef0e3', border: '1px solid rgba(86,106,47,.2)' }}
                    >
                        <p className="text-[15px]" style={{ color: '#3f443a' }}>
                            Resultados para:{' '}
                            <span className="font-bold" style={{ color: '#465824' }}>"{searchTerm}"</span>
                        </p>
                        <button
                            onClick={() => { setSearchParams({}); setSelectedCategory('all'); }}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors active:translate-y-px"
                            style={{ color: '#566a2f' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#465824'}
                            onMouseLeave={e => e.currentTarget.style.color = '#566a2f'}
                        >
                            <X className="w-4 h-4" />
                            Limpiar búsqueda
                        </button>
                    </div>
                )}

                {/* ── Toolbar ─────────────────────────────────── */}
                <div className="mb-6">

                    {/* MOBILE: categorías scrollable + controles separados */}
                    {!searchTerm && (
                        <div className="md:hidden flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat.id;
                                const count = cat.id === 'all' ? products.length : products.filter(p => p.category === cat.id).length;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                                        style={{
                                            height: '38px', padding: '0 16px', borderRadius: '20px',
                                            border: `1.5px solid ${isActive ? '#566a2f' : 'rgba(34,38,29,.18)'}`,
                                            background: isActive ? '#566a2f' : '#fff',
                                            color: isActive ? '#fff' : '#3f443a',
                                        }}
                                    >
                                        {cat.name}
                                        {count > 0 && <span className="text-[11px] font-bold" style={{ opacity: isActive ? .85 : .55 }}>{count}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* DESKTOP: categorías + controles en la misma fila */}
                    <div className="hidden md:flex items-center gap-4 mb-0">
                        {!searchTerm && (
                            <div className="flex flex-wrap gap-2 flex-1">
                                {CATEGORIES.map((cat) => {
                                    const isActive = selectedCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryChange(cat.id)}
                                            className="text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                                            style={{
                                                height: '40px', padding: '0 18px', borderRadius: '20px',
                                                border: `1.5px solid ${isActive ? '#566a2f' : 'rgba(34,38,29,.18)'}`,
                                                background: isActive ? '#eef0e3' : '#fff',
                                                color: isActive ? '#465824' : '#3f443a',
                                            }}
                                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; } }}
                                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#3f443a'; } }}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                className="text-[13.5px] font-medium focus:outline-none transition-colors"
                                style={{ height: '40px', padding: '0 14px', borderRadius: '20px', border: '1.5px solid rgba(34,38,29,.18)', background: '#fff', color: '#3f443a', cursor: 'pointer' }}>
                                {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <button onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center gap-2 text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                                style={{ height: '40px', padding: '0 16px', borderRadius: '20px', border: `1.5px solid ${showFilters || minPrice || maxPrice ? '#566a2f' : 'rgba(34,38,29,.18)'}`, background: showFilters || minPrice || maxPrice ? '#eef0e3' : '#fff', color: showFilters || minPrice || maxPrice ? '#465824' : '#3f443a' }}>
                                <SlidersHorizontal className="w-4 h-4" />
                                Filtros
                                {(minPrice || maxPrice) && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#c06a34' }}>!</span>}
                            </button>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearAllFilters}
                                    className="inline-flex items-center justify-center transition-colors active:translate-y-px flex-shrink-0"
                                    style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(34,38,29,.18)', background: '#fff', color: '#6c7062', cursor: 'pointer' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#6c7062'; }}
                                    title="Limpiar filtros"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* MOBILE: controles */}
                    <div className="md:hidden flex items-center gap-2 ml-auto">
                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-[13.5px] font-medium focus:outline-none transition-colors"
                            style={{
                                height: '40px',
                                padding: '0 14px',
                                borderRadius: '20px',
                                border: '1.5px solid rgba(34,38,29,.18)',
                                background: '#fff',
                                color: '#3f443a',
                                cursor: 'pointer',
                            }}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                            style={{
                                height: '40px',
                                padding: '0 16px',
                                borderRadius: '20px',
                                border: `1.5px solid ${showFilters || minPrice || maxPrice ? '#566a2f' : 'rgba(34,38,29,.18)'}`,
                                background: showFilters || minPrice || maxPrice ? '#eef0e3' : '#fff',
                                color: showFilters || minPrice || maxPrice ? '#465824' : '#3f443a',
                            }}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filtros
                            {(minPrice || maxPrice) && (
                                <span
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{ background: '#c06a34' }}
                                >
                                    !
                                </span>
                            )}
                        </button>

                        {/* Clear all */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="inline-flex items-center justify-center transition-colors active:translate-y-px flex-shrink-0"
                                style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid rgba(34,38,29,.18)', background: '#fff', color: '#6c7062', cursor: 'pointer' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#6c7062'; }}
                                title="Limpiar filtros"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Price filter panel ──────────────────────── */}
                {showFilters && (
                    <div
                        className="rounded-2xl p-5 mb-6 flex flex-wrap gap-6 items-end"
                        style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)' }}
                    >
                        <div>
                            <label
                                className="block text-[11.5px] font-bold tracking-[1px] uppercase mb-2"
                                style={{ color: '#6c7062' }}
                            >
                                Precio mínimo (ARS)
                            </label>
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="0"
                                min={0}
                                max={maxProductPrice}
                                className="text-[14px] focus:outline-none transition-colors"
                                style={{
                                    width: '160px',
                                    height: '40px',
                                    padding: '0 14px',
                                    borderRadius: '20px',
                                    border: '1.5px solid rgba(34,38,29,.18)',
                                    background: '#f6f4ec',
                                    color: '#22261d',
                                }}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-[11.5px] font-bold tracking-[1px] uppercase mb-2"
                                style={{ color: '#6c7062' }}
                            >
                                Precio máximo (ARS)
                            </label>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder={maxProductPrice.toLocaleString('es-AR')}
                                min={0}
                                className="text-[14px] focus:outline-none transition-colors"
                                style={{
                                    width: '160px',
                                    height: '40px',
                                    padding: '0 14px',
                                    borderRadius: '20px',
                                    border: '1.5px solid rgba(34,38,29,.18)',
                                    background: '#f6f4ec',
                                    color: '#22261d',
                                }}
                            />
                        </div>
                        {(minPrice || maxPrice) && (
                            <button
                                onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                                className="inline-flex items-center justify-center transition-colors active:translate-y-px flex-shrink-0"
                                style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid rgba(34,38,29,.18)', background: '#fff', color: '#6c7062', cursor: 'pointer', alignSelf: 'flex-end' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#6c7062'; }}
                                title="Borrar rango de precio"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}

                {/* ── Results count ────────────────────────────── */}
                <p className="mb-6 text-[13.5px]" style={{ color: '#6c7062' }}>
                    {filtered.length === 0
                        ? 'No se encontraron productos'
                        : `Mostrando ${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} de ${filtered.length} productos`}
                </p>

                {/* ── Products grid ────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        : paginatedProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                          ))}
                </div>

                {/* ── Empty state ──────────────────────────────── */}
                {filtered.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <span
                            className="w-16 h-16 rounded-[18px] grid place-items-center mx-auto mb-5"
                            style={{ background: '#eef0e3', color: '#566a2f' }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                            </svg>
                        </span>
                        <p
                            className="text-[18px] mb-2"
                            style={{ fontFamily: serif, color: '#22261d' }}
                        >
                            No se encontraron productos
                        </p>
                        <p className="text-[14.5px] mb-6" style={{ color: '#6c7062' }}>
                            Probá con otros filtros o términos de búsqueda.
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className="inline-flex items-center gap-2 text-[14px] font-bold rounded-full transition-all duration-200 active:translate-y-px"
                            style={{
                                height: '44px',
                                padding: '0 24px',
                                background: '#566a2f',
                                color: '#f3efe0',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#465824'}
                            onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}
                        >
                            Limpiar todos los filtros
                        </button>
                    </div>
                )}

                {/* ── Pagination ───────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4 pb-4">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                            style={{
                                height: '40px',
                                padding: '0 16px',
                                borderRadius: '20px',
                                border: '1.5px solid rgba(34,38,29,.18)',
                                background: currentPage === 1 ? '#f0ede5' : '#fff',
                                color: currentPage === 1 ? '#b0b5a5' : '#3f443a',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </button>

                        <div className="flex gap-1.5">
                            {getPageNumbers().map((page, idx) =>
                                page === '...' ? (
                                    <span
                                        key={`e-${idx}`}
                                        className="flex items-center justify-center w-10 text-[14px]"
                                        style={{ color: '#6c7062' }}
                                    >
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className="text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '20px',
                                            border: `1.5px solid ${currentPage === page ? '#566a2f' : 'rgba(34,38,29,.18)'}`,
                                            background: currentPage === page ? '#eef0e3' : '#fff',
                                            color: currentPage === page ? '#465824' : '#3f443a',
                                        }}
                                    >
                                        {page}
                                    </button>
                                )
                            )}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-all duration-200 active:translate-y-px"
                            style={{
                                height: '40px',
                                padding: '0 16px',
                                borderRadius: '20px',
                                border: '1.5px solid rgba(34,38,29,.18)',
                                background: currentPage === totalPages ? '#f0ede5' : '#fff',
                                color: currentPage === totalPages ? '#b0b5a5' : '#3f443a',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
