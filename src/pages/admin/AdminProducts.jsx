import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, Check, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../context/ProductsContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

const serif = "'DM Serif Display', Georgia, serif";

const CATEGORIES = [
    { value: 'mates',      label: 'Mates' },
    { value: 'bombillas',  label: 'Bombillas' },
    { value: 'yerba',      label: 'Yerba' },
    { value: 'accesorios', label: 'Accesorios' },
];

const CAT_STYLE = {
    mates:      { bg: '#e6efe0', color: '#465824' },
    bombillas:  { bg: '#e4ecf4', color: '#3f6f96' },
    yerba:      { bg: '#f7eed6', color: '#a5781f' },
    accesorios: { bg: '#efe6f1', color: '#7a5288' },
};

// imagesInput: [{ url: string, variantName: string }]
const EMPTY_FORM = {
    name: '', description: '', fullDescription: '',
    price: 0, category: 'mates', stock: 0,
    imagesInput: [{ url: '', variantName: '' }],
};

function toFormData(p) {
    const imgs = p.images?.length
        ? p.images.map(img => ({ url: typeof img === 'string' ? img : img.url, variantName: img.variantName ?? '' }))
        : [{ url: p.image ?? '', variantName: '' }];
    return { ...p, imagesInput: imgs };
}

function fromFormData(f) {
    const { imagesInput, variants: _v, images: _i, image: _img, variantsInput: _vi, ...rest } = f;
    const validImgs = (imagesInput ?? []).filter(i => i.url.trim());
    const images = validImgs.map((i, idx) => ({ url: i.url.trim(), position: idx, variantName: i.variantName.trim() || null }));
    const variants = validImgs.filter(i => i.variantName.trim()).map(i => ({ name: i.variantName.trim() }));
    const image = validImgs[0]?.url ?? '';
    return { ...rest, image, images, variants };
}

function StockPill({ stock }) {
    const n = stock ?? 0;
    if (n <= 10) return <span style={{ background: '#fbe7e0', color: '#b1492a', fontSize: 12.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999 }}>{n}</span>;
    if (n <= 20) return <span style={{ background: '#f7eed6', color: '#a5781f', fontSize: 12.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999 }}>{n}</span>;
    return <span style={{ background: '#e6efe0', color: '#566a2f', fontSize: 12.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999 }}>{n}</span>;
}

const inputCls = {
    width: '100%', border: '1.5px solid rgba(34,38,29,.12)', background: '#fff',
    borderRadius: 11, padding: '12px 14px', fontFamily: "'Karla', sans-serif",
    fontSize: 14.5, color: '#22261d', outline: 'none',
};

const focusStyle = { borderColor: '#566a2f', boxShadow: '0 0 0 4px rgba(86,106,47,.12)' };

function Field({ label, required, optional, children }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#22261d' }}>
                {label}
                {required && <span style={{ color: '#c06a34', marginLeft: 3 }}>*</span>}
                {optional && <span style={{ fontWeight: 500, color: '#7a7d70', fontSize: 12, marginLeft: 6 }}>(opcional)</span>}
            </label>
            {children}
        </div>
    );
}

export function AdminProducts() {
    const { products, refreshProducts } = useProducts();
    const { accessToken } = useAuth();
    const [search,        setSearch]        = useState('');
    const [modalOpen,     setModalOpen]     = useState(false);
    const [editingId,     setEditingId]     = useState(null);
    const [form,          setForm]          = useState(EMPTY_FORM);
    const [saving,        setSaving]        = useState(false);
    const [deleteTarget,  setDeleteTarget]  = useState(null);
    const [deleteError,   setDeleteError]   = useState('');
    const [error,         setError]         = useState('');
    const [focusedField,  setFocusedField]  = useState('');

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() { setEditingId(null); setForm(EMPTY_FORM); setError(''); setModalOpen(true); }
    function openEdit(p)  { setEditingId(p.id); setForm(toFormData(p)); setError(''); setModalOpen(true); }
    function closeModal() { setModalOpen(false); setEditingId(null); setError(''); }
    function set(field, value) { setForm(prev => ({ ...prev, [field]: value })); }

    function setImg(idx, key, value) {
        setForm(prev => {
            const imgs = [...(prev.imagesInput ?? [])];
            imgs[idx] = { ...imgs[idx], [key]: value };
            return { ...prev, imagesInput: imgs };
        });
    }
    function addImg()    { setForm(prev => ({ ...prev, imagesInput: [...(prev.imagesInput ?? []), { url: '', variantName: '' }] })); }
    function removeImg(idx) { setForm(prev => ({ ...prev, imagesInput: (prev.imagesInput ?? []).filter((_, i) => i !== idx) })); }

    async function handleSave() {
        setError('');
        if (!form.name.trim()) return setError('El nombre es obligatorio.');
        if (form.price <= 0)   return setError('El precio debe ser mayor a 0.');
        if (!(form.imagesInput ?? []).some(i => i.url.trim())) return setError('Agregá al menos una imagen.');
        setSaving(true);
        try {
            const data = fromFormData(form);
            if (editingId !== null) {
                await apiRequest(`/api/products/${editingId}`, { method: 'PUT', body: JSON.stringify(data) }, accessToken);
                toast.success('Producto actualizado.');
            } else {
                await apiRequest('/api/products', { method: 'POST', body: JSON.stringify(data) }, accessToken);
                toast.success('Producto creado.');
            }
            await refreshProducts();
            closeModal();
        } catch (err) {
            setError(err.message || 'Error al guardar.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        setSaving(true);
        setDeleteError('');
        try {
            await apiRequest(`/api/products/${id}`, { method: 'DELETE' }, accessToken);
            await refreshProducts();
            toast.success('Producto eliminado.');
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err.message || 'Error al eliminar.');
        } finally {
            setSaving(false);
        }
    }

    const getInputStyle = (field) => ({ ...inputCls, ...(focusedField === field ? focusStyle : {}) });

    return (
        <div className="px-4 py-6 md:px-11 md:py-[38px]" style={{ paddingBottom: 60 }}>

            {/* Header */}
            <div className="flex items-end justify-between flex-wrap gap-5" style={{ marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: serif, fontSize: 36, letterSpacing: '-.3px', lineHeight: 1.05, color: '#22261d' }}>Productos</h1>
                    <p style={{ fontSize: 15, color: '#7a7d70', marginTop: 5 }}>{products.length} productos en total</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 active:translate-y-px"
                    style={{ background: '#c06a34', color: '#fff', height: 46, padding: '0 20px', borderRadius: 11, fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(192,106,52,.26)', transition: 'background .2s, transform .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ab5b2a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#c06a34'}
                >
                    <Plus className="w-[18px] h-[18px]" />
                    Nuevo producto
                </button>
            </div>

            {/* Search */}
            <div className="relative" style={{ marginBottom: 18 }}>
                <Search className="absolute w-[18px] h-[18px]" style={{ left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9a9d90', pointerEvents: 'none' }} />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nombre o categoría…"
                    style={{ width: '100%', height: 46, border: '1px solid rgba(34,38,29,.12)', background: '#fff', borderRadius: 12, paddingLeft: 44, paddingRight: 16, fontFamily: "'Karla', sans-serif", fontSize: 14.5, color: '#22261d', outline: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#566a2f'; e.target.style.boxShadow = '0 0 0 4px rgba(86,106,47,.10)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(34,38,29,.12)'; e.target.style.boxShadow = 'none'; }}
                />
            </div>

            {/* ── MOBILE: cards ── */}
            <div className="md:hidden flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#9a9d90', fontSize: 14, padding: '40px 0' }}>No se encontraron productos.</p>
                ) : filtered.map(product => {
                    const cs = CAT_STYLE[product.category] ?? { bg: '#f0efe8', color: '#6c7062' };
                    return (
                        <div key={product.id} style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 16, padding: 14, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)' }}>
                            {/* Fila 1: imagen + nombre + acciones */}
                            <div className="flex items-center gap-3" style={{ marginBottom: 10 }}>
                                <div style={{ width: 46, height: 46, borderRadius: 10, overflow: 'hidden', background: '#eceadf', flexShrink: 0, border: '1px solid rgba(34,38,29,.10)' }}>
                                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14.5, color: '#22261d', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {product.name}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => openEdit(product)}
                                        style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#7a7d70', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => setDeleteTarget(product.id)}
                                        style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#7a7d70', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                            {/* Fila 2: categoría + precio + stock */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span style={{ ...cs, fontSize: 12.5, fontWeight: 700, padding: '4px 12px', borderRadius: 999, textTransform: 'capitalize' }}>
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span style={{ fontWeight: 700, fontSize: 14.5, color: '#22261d' }}>
                                        ${product.price.toLocaleString('es-AR')}
                                    </span>
                                    <StockPill stock={product.stock} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── DESKTOP: tabla ── */}
            <div className="hidden md:block" style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 18, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#faf9f3', borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                            {['Producto', 'Categoría', 'Precio', 'Stock', ''].map((h, i) => (
                                <th key={i} style={{ textAlign: i >= 2 && i < 4 ? 'right' : i === 4 ? 'right' : 'left', fontSize: 12, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: '#7a7d70', padding: '16px 20px' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(product => {
                            const cs = CAT_STYLE[product.category] ?? { bg: '#f0efe8', color: '#6c7062' };
                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid rgba(34,38,29,.08)', transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#faf9f3'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: 46, height: 46, borderRadius: 10, overflow: 'hidden', background: '#eceadf', flexShrink: 0, border: '1px solid rgba(34,38,29,.10)' }}>
                                                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                            </div>
                                            <div className="truncate max-w-[280px]" style={{ fontWeight: 700, fontSize: 14.5, color: '#22261d' }}>{product.name}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                                        <span style={{ ...cs, fontSize: 12.5, fontWeight: 700, padding: '4px 12px', borderRadius: 999, display: 'inline-flex', textTransform: 'capitalize' }}>{product.category}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, fontSize: 14.5, color: '#22261d', verticalAlign: 'middle' }}>
                                        ${product.price.toLocaleString('es-AR')}
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', verticalAlign: 'middle' }}>
                                        <StockPill stock={product.stock} />
                                    </td>
                                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(product)} title="Editar"
                                                style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#7a7d70', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all .18s' }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; e.currentTarget.style.background = '#f4f6ec'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'; e.currentTarget.style.color = '#7a7d70'; e.currentTarget.style.background = '#fff'; }}>
                                                <Pencil size={15} />
                                            </button>
                                            <button onClick={() => setDeleteTarget(product.id)} title="Eliminar"
                                                style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#7a7d70', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all .18s' }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; e.currentTarget.style.background = '#fbeae6'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'; e.currentTarget.style.color = '#7a7d70'; e.currentTarget.style.background = '#fff'; }}>
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#9a9d90', fontSize: 14 }}>
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete modal */}
            {deleteTarget !== null && (
                <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ background: 'rgba(34,38,29,.5)', backdropFilter: 'blur(3px)', padding: '46px 20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 24px 60px rgba(34,38,29,.26)', width: '100%', maxWidth: 420, overflow: 'hidden', animation: 'pop .26s cubic-bezier(.2,.9,.3,1.2)' }}>
                        <div style={{ padding: '28px 26px 8px' }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fbe7e0', color: '#c0392b', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                                <Trash2 size={22} />
                            </div>
                            <h3 style={{ fontFamily: serif, fontSize: 23, color: '#22261d', marginBottom: 8 }}>¿Eliminar producto?</h3>
                            <p style={{ fontSize: 14.5, color: '#7a7d70' }}>Esta acción no se puede deshacer.</p>
                            {deleteError && <div style={{ marginTop: 14, background: '#fbe7e0', border: '1px solid #f5c6bb', color: '#b1492a', padding: '10px 14px', borderRadius: 10, fontSize: 13.5 }}>{deleteError}</div>}
                        </div>
                        <div className="flex items-center justify-end gap-3" style={{ padding: '18px 26px', borderTop: '1px solid rgba(34,38,29,.10)', background: '#faf9f3' }}>
                            <button onClick={() => { setDeleteTarget(null); setDeleteError(''); }}
                                style={{ height: 46, padding: '0 18px', borderRadius: 11, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#22261d', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', transition: 'border-color .2s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#566a2f'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'}>
                                Cancelar
                            </button>
                            <button onClick={() => handleDelete(deleteTarget)} disabled={saving}
                                className="inline-flex items-center gap-2 active:translate-y-px"
                                style={{ height: 46, padding: '0 20px', borderRadius: 11, border: 'none', background: '#c0392b', color: '#fff', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', transition: 'background .2s', opacity: saving ? .6 : 1 }}
                                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#a52f23'; }}
                                onMouseLeave={e => e.currentTarget.style.background = '#c0392b'}>
                                <Trash2 size={16} />
                                {saving ? 'Eliminando…' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center" style={{ background: 'rgba(34,38,29,.5)', backdropFilter: 'blur(3px)', padding: '46px 20px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: 22, boxShadow: '0 24px 60px rgba(34,38,29,.26)', width: '100%', maxWidth: 780, overflow: 'hidden', animation: 'pop .26s cubic-bezier(.2,.9,.3,1.2)' }}>
                        {/* Modal header */}
                        <div className="flex items-center justify-between" style={{ padding: '22px 26px', borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                            <h3 style={{ fontFamily: serif, fontSize: 23, color: '#22261d' }}>
                                {editingId !== null ? 'Editar producto' : 'Nuevo producto'}
                            </h3>
                            <button onClick={closeModal}
                                style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#7a7d70', display: 'grid', placeItems: 'center', cursor: 'pointer', transition: 'all .18s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#22261d'; e.currentTarget.style.color = '#22261d'; e.currentTarget.style.background = '#f4f3ec'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'; e.currentTarget.style.color = '#7a7d70'; e.currentTarget.style.background = '#fff'; }}>
                                <X size={17} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {error && (
                                <div style={{ background: '#fbe7e0', border: '1px solid #f5c6bb', color: '#b1492a', padding: '10px 14px', borderRadius: 10, fontSize: 13.5 }}>{error}</div>
                            )}

                            <Field label="Nombre" required>
                                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                                    placeholder="Ej: Mate Calabaza Tradicional"
                                    style={getInputStyle('name')}
                                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field label="Categoría">
                                    <select value={form.category} onChange={e => set('category', e.target.value)}
                                        style={{ ...getInputStyle('cat'), cursor: 'pointer' }}
                                        onFocus={() => setFocusedField('cat')} onBlur={() => setFocusedField('')}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </Field>
                                <Field label="Precio (ARS)" required>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#7a7d70', fontWeight: 700, pointerEvents: 'none' }}>$</span>
                                        <input type="number" value={form.price || ''} onChange={e => set('price', Number(e.target.value))}
                                            placeholder="0" min={0}
                                            style={{ ...getInputStyle('price'), paddingLeft: 28 }}
                                            onFocus={() => setFocusedField('price')} onBlur={() => setFocusedField('')} />
                                    </div>
                                </Field>
                                <Field label="Stock">
                                    <input type="number" value={form.stock ?? ''} onChange={e => set('stock', Number(e.target.value))}
                                        placeholder="0" min={0}
                                        style={getInputStyle('stock')}
                                        onFocus={() => setFocusedField('stock')} onBlur={() => setFocusedField('')} />
                                </Field>
                            </div>

                            <Field label="Descripción corta">
                                <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
                                    placeholder="Breve descripción del producto"
                                    style={getInputStyle('desc')}
                                    onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')} />
                            </Field>

                            <Field label="Descripción completa">
                                <textarea value={form.fullDescription ?? ''} onChange={e => set('fullDescription', e.target.value)}
                                    rows={4} placeholder="Descripción detallada que aparece en la página del producto…"
                                    style={{ ...getInputStyle('fdesc'), resize: 'vertical', minHeight: 84, lineHeight: 1.5 }}
                                    onFocus={() => setFocusedField('fdesc')} onBlur={() => setFocusedField('')} />
                            </Field>

                            {/* ── Imágenes y variantes ── */}
                            <div>
                                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: '#22261d' }}>
                                        Imágenes <span style={{ color: '#c06a34' }}>*</span>
                                        <span style={{ fontWeight: 500, color: '#7a7d70', fontSize: 12, marginLeft: 6 }}>
                                            (la "Variante" vincula la imagen al botón de variante)
                                        </span>
                                    </label>
                                    <button type="button" onClick={addImg}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 8, border: '1.5px solid #566a2f', background: '#eef0e3', color: '#465824', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                                        <Plus size={14} /> Agregar imagen
                                    </button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {(form.imagesInput ?? []).map((img, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                            {/* Preview */}
                                            <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: '#eceadf', border: '1px solid rgba(34,38,29,.10)', flexShrink: 0 }}>
                                                {img.url ? (
                                                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: '#c4bfb0' }}><Image size={20} /></div>
                                                )}
                                            </div>
                                            {/* URL */}
                                            <div style={{ flex: 2, minWidth: 0 }}>
                                                <input type="url" value={img.url} onChange={e => setImg(idx, 'url', e.target.value)}
                                                    placeholder="URL de imagen (https://…)"
                                                    style={{ ...inputCls, fontSize: 13.5 }}
                                                    onFocus={e => { e.target.style.borderColor = '#566a2f'; e.target.style.boxShadow = '0 0 0 4px rgba(86,106,47,.12)'; }}
                                                    onBlur={e => { e.target.style.borderColor = 'rgba(34,38,29,.12)'; e.target.style.boxShadow = 'none'; }} />
                                            </div>
                                            {/* Variant name */}
                                            <div style={{ flex: 1, minWidth: 90 }}>
                                                <input type="text" value={img.variantName} onChange={e => setImg(idx, 'variantName', e.target.value)}
                                                    placeholder="Variante (ej: Negro)"
                                                    style={{ ...inputCls, fontSize: 13.5 }}
                                                    onFocus={e => { e.target.style.borderColor = '#566a2f'; e.target.style.boxShadow = '0 0 0 4px rgba(86,106,47,.12)'; }}
                                                    onBlur={e => { e.target.style.borderColor = 'rgba(34,38,29,.12)'; e.target.style.boxShadow = 'none'; }} />
                                            </div>
                                            {/* Remove */}
                                            {(form.imagesInput ?? []).length > 1 && (
                                                <button type="button" onClick={() => removeImg(idx)}
                                                    style={{ width: 38, height: 46, borderRadius: 10, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#9a9d90', cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'; e.currentTarget.style.color = '#9a9d90'; }}>
                                                    <X size={15} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="flex items-center justify-end gap-3" style={{ padding: '18px 26px', borderTop: '1px solid rgba(34,38,29,.10)', background: '#faf9f3' }}>
                            <button onClick={closeModal}
                                style={{ height: 46, padding: '0 18px', borderRadius: 11, border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#22261d', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', transition: 'border-color .2s' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = '#566a2f'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'}>
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="inline-flex items-center gap-2 active:translate-y-px"
                                style={{ height: 46, padding: '0 20px', borderRadius: 11, border: 'none', background: '#566a2f', color: '#f3efe0', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', transition: 'background .2s', opacity: saving ? .6 : 1 }}
                                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#465824'; }}
                                onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}>
                                <Check size={16} />
                                {saving ? 'Guardando…' : editingId !== null ? 'Guardar cambios' : 'Crear producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes pop{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}`}</style>
        </div>
    );
}
