import { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
export function Modal({ open, onClose, title, children, className }) {
    useEffect(() => {
        if (!open)
            return;
        const handler = (e) => { if (e.key === 'Escape')
            onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} aria-hidden="true"/>
      <div className={clsx('relative bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-scale', className)}>
        {(title || true) && (<div className="flex items-center justify-between p-5 border-b border-gray-100">
            {title && (<h2 id="modal-title" className="text-lg font-semibold text-gray-800">
                {title}
              </h2>)}
            <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cerrar">
              <X className="w-5 h-5"/>
            </button>
          </div>)}
        <div className="p-5">{children}</div>
      </div>
    </div>);
}
