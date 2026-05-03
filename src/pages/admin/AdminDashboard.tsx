import { useProducts } from '../../context/ProductsContext';
import { Package, ShoppingBag, DollarSign, Layers } from 'lucide-react';

export function AdminDashboard() {
  const { products } = useProducts();

  const totalStock = products.reduce((acc, p) => acc + (p.stock ?? 0), 0);
  const totalValue = products.reduce((acc, p) => acc + p.price * (p.stock ?? 0), 0);

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      label: 'Productos activos',
      value: products.length,
      icon: Package,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Stock total',
      value: totalStock,
      icon: Layers,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Valor del inventario',
      value: `$${totalValue.toLocaleString('es-AR')}`,
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      label: 'Categorías',
      value: Object.keys(byCategory).length,
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  const categoryLabels: Record<string, string> = {
    mates: 'Mates',
    bombillas: 'Bombillas',
    yerba: 'Yerba',
    accesorios: 'Accesorios',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen general del negocio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Products by category */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Productos por categoría</h2>
        <div className="space-y-3">
          {Object.entries(byCategory).map(([cat, count]) => {
            const pct = Math.round((count / products.length) * 100);
            return (
              <div key={cat}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{categoryLabels[cat] ?? cat}</span>
                  <span>{count} productos ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#a8c95f] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
