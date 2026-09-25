import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Star, BookOpen, User, Tag } from 'lucide-react';

export default function BookDetail({ books, onToggleBorrow, onDeleteBook }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Recherche du livre par son ID
  const book = books.find((b) => b.id.toString() === id);

  if (!book) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-300">Ouvrage introuvable</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    onDeleteBook(book.id);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Bouton Retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour</span>
      </button>

      {/* Carte globale de détail */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-8">
        
        {/* Couverture */}
        <div className="space-y-4">
          <div className="h-80 md:h-96 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg">
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => onToggleBorrow(book.id)}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
                book.available
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {book.available ? 'Emprunter cet ouvrage' : 'Restituer cet ouvrage'}
            </button>

            <button
              onClick={handleDelete}
              className="w-full py-2.5 rounded-xl font-medium text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
            >
              Supprimer de la bibliothèque
            </button>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Statut & Catégorie */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                <Tag className="w-3.5 h-3.5" />
                {book.category}
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                book.available 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {book.available ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {book.available ? 'Disponible actuellement' : 'Emprunté'}
              </span>
            </div>

            {/* Titre & Auteur */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">{book.title}</h1>
              <p className="text-slate-400 font-medium text-sm mt-1 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                {book.author}
              </p>
            </div>

            {/* Note & Évaluation */}
            <div className="flex items-center gap-1.5 text-amber-400 text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400/30 text-amber-400" />
              <span className="text-slate-400 text-xs ml-2">(4.2 / 5 — 12 avis)</span>
            </div>

            {/* Synopsis / Résumé */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Résumé de l'ouvrage
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {book.description || "Aucun résumé n'est encore renseigné pour cet ouvrage dans le système. Cet ouvrage fait partie de la collection principale de la bibliothèque."}
              </p>
            </div>

          </div>

          {/* Méta-informations */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 font-medium">Référence ID</span>
              <span className="font-mono text-slate-300">#LIB-{book.id}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium">Emplacement</span>
              <span className="text-slate-300">Rayon {book.category} — Étagère B</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}