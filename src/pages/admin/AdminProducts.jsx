import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '../../context/ProductsContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

const CATEGORIES = [
    { value: 'mates',       label: 'Mates' },
    { value: 'bombillas',   label: 'Bombillas' },
    { value: 'yerba',       label: 'Yerba' },
    { value: 'accesorios',  label: 'Accesorios' },
];

const EMPTY_FORM = {
    name:            '',
    description:     '',
    fullDescription: '',
    price:           0,
    image:           '',
    category:        'mates',
    stock:           0,
    variantsInput:   '',
};

function toFormData(p) {
    return {
        ...p,
        variantsInput: (p.variants ?? [])
            .map(v => (typeof v === 'string' ? v : v.name))
            .join(', '),
    };
}

function fromFormData(f) {
    const { variantsInput, variants: _v, images: _i, ...rest } = f;
    const variants = variantsInput
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
        .map(name => ({ name }));
    const images = rest.image ? [{ url: rest.image, position: 0 }] : [];
    return { ...rest, variants, images };
}

export function AdminProducts() {
    const { products, refreshProducts } = useProducts();
    const { accessToken } = useAuth();
    const [search,      setSearch]      = useState('');
    const [modalOpen,   setModalOpen]   = useState(false);
    const [editingId,   setEditingId]   = useState(null);
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [saving,      setSaving]      = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [error,       setError]       = useState('');

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    function openCreate() {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
        setModalOpen(true);
    }

    function openEdit(product) {
        setEditingId(product.id);
        setForm(toFormData(product));
        setError('');
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditingId(null);
        setError('');
    }

    function handleFieldChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSave() {
        setError('');
        if (!form.name.trim())        return setError('El nombre es obligatorio.');
        if (form.price <= 0)          return setError('El precio debe ser mayor a 0.');
        if (!form.image.trim())       return setError('La imagen es obligatoria.');

        setSaving(true);
        try {
            const productData = fromFormData(form);
            if (editingId !== null) {
                await apiRequest(`/api/products/${editingId}`, {
                    method: 'PUT',
                    body: JSON.stringify(productData),
                }, accessToken);
                toast.success('Producto actualizado.');
            } else {
                await apiRequest('/api/products', {
                    method: 'POST',
                    body: JSON.stringify(productData),
                }, accessToken);
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
        try {
            await apiRequest(`/api/products/${id}`, { method: 'DELETE' }, accessToken);
            await refreshProducts();
            toast.success('Producto eliminado.');
        } catch (err) {
            toast.error(err.message || 'Error al eliminar.');
        } finally {
            setSaving(false);
            setDeleteTarget(null);
        }
    }

    const categoryLabel = cat => CATEGORIES.find(c => c.value === cat)?.label ?? cat;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Productos</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} productos en total</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-[#a8c95f] hover:bg-[#97b84f] text-[#4a5f2f] font-semibold px-4 py-2.5 rounded-lg transition-colors">
                    <Plus className="w-5 h-5"/>
                    Nuevo producto
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nombre o categoría..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"/>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Producto</th>
                            <th className="text-left px-6 py-3 text-gray-500 font-medium">Categoría</th>
                            <th className="text-right px-6 py-3 text-gray-500 font-medium">Precio</th>
                            <th className="text-right px-6 py-3 text-gray-500 font-medium">Stock</th>
                            <th className="px-6 py-3"/>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={product.image} alt={product.name}
                                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                            onError={e => { e.target.src = 'https://placehold.co/40'; }}/>
                                        <span className="font-medium text-gray-800">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        {categoryLabel(product.category)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-700">
                                    ${product.price.toLocaleString('es-AR')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`font-medium ${(product.stock ?? 0) <= 5 ? 'text-red-600' : 'text-gray-700'}`}>
                                        {product.stock ?? 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(product)}
                                            className="p-1.5 text-gray-400 hover:text-[#4a5f2f] hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                                            <Pencil className="w-4 h-4"/>
                                        </button>
                                        <button onClick={() => setDeleteTarget(product.id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete confirm */}
            {deleteTarget !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">¿Eliminar producto?</h3>
                        <p className="text-gray-500 text-sm mb-6">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button onClick={() => handleDelete(deleteTarget)} disabled={saving}
                                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50">
                                {saving ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingId !== null ? 'Editar producto' : 'Nuevo producto'}
                            </h2>
                            <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input type="text" value={form.name}
                                        onChange={e => handleFieldChange('name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
                                        placeholder="Ej: Mate Calabaza Tradicional"/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select value={form.category} onChange={e => handleFieldChange('category', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f] bg-white">
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio (ARS) <span className="text-red-500">*</span>
                                    </label>
                                    <input type="number" value={form.price || ''}
                                        onChange={e => handleFieldChange('price', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
                                        placeholder="2500" min={0}/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input type="number" value={form.stock ?? ''}
                                        onChange={e => handleFieldChange('stock', Number(e.target.value))}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
                                        placeholder="10" min={0}/>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Variantes <span className="text-gray-400 font-normal">(separadas por coma)</span>
                                    </label>
                                    <input type="text" value={form.variantsInput}
                                        onChange={e => handleFieldChange('variantsInput', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
                                        placeholder="Natural, Con virola, Premium"/>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
                                <input type="text" value={form.description}
                                    onChange={e => handleFieldChange('description', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
                                    placeholder="Breve descripción del producto"/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción completa</label>
                                <textarea value={form.fullDescription ?? ''}
                                    onChange={e => handleFieldChange('fullDescription', e.target.value)}
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f] resize-none"
                                    placeholder="Descripción detallada que aparece en la página del producto..."/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL de imagen <span className="text-red-500">*</span>
                                </label>
                                <input type="url" value={form.image}
                                    onChange={e => handleFieldChange('image', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f]"
                                    placeholder="https://ejemplo.com/imagen.jpg"/>
                                {form.image && (
                                    <img src={form.image} alt="Preview"
                                        className="mt-3 w-24 h-24 object-cover rounded-lg border border-gray-200"
                                        onError={e => { e.target.style.display = 'none'; }}/>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
                            <button onClick={closeModal}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="px-5 py-2 text-sm text-[#4a5f2f] bg-[#a8c95f] hover:bg-[#97b84f] font-semibold rounded-lg transition-colors disabled:opacity-50">
                                {saving ? 'Guardando...' : editingId !== null ? 'Guardar cambios' : 'Crear producto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
