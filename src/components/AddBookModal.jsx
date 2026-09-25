import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function AddBookModal({ isOpen, onClose, onAddBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Roman',
    cover: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    // Utilisation d'une image par défaut si aucune URL n'est fournie
    const defaultCover = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600';
    
    const newBook = {
      id: Date.now(),
      title: formData.title,
      author: formData.author,
      category: formData.category,
      cover: formData.cover.trim() !== '' ? formData.cover : defaultCover,
      available: true,
    };

    onAddBook(newBook);
    setFormData({ title: '', author: '', category: 'Roman', cover: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <PlusCircle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-100">Ajouter un nouveau livre</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Titre de l'ouvrage *</label>
            <input
              type="text"
              required
              placeholder="ex: Le Petit Prince"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-sm border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Auteur *</label>
            <input
              type="text"
              required
              placeholder="ex: Antoine de Saint-Exupéry"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-sm border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-sm border border-slate-700 focus:outline-none focus:border-indigo-500"
            >
              <option value="Roman">Roman</option>
              <option value="Science-Fiction">Science-Fiction</option>
              <option value="Philosophie">Philosophie</option>
              <option value="Informatique">Informatique</option>
              <option value="Histoire">Histoire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL de la couverture (Optionnel)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.cover}
              onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-sm border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              Ajouter au catalogue
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}