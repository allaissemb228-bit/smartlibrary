import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddBookModal from './components/AddBookModal';
import BookDetail from './components/BookDetail';
import { initialBooks } from './booksData';
import { CheckCircle, Clock, Trash2, Eye, Calendar, AlertTriangle, BookOpen, BarChart2, PieChart, Layers, Info, Code2, ShieldCheck, Cpu, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();

  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('smartlibrary_books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('smartlibrary_books', JSON.stringify(books));
  }, [books]);

  const toggleBorrowStatus = (id) => {
    setBooks(prev => prev.map(book => {
      if (book.id === id) {
        if (book.available) {
          const borrowDate = new Date();
          const dueDate = new Date();
          dueDate.setDate(borrowDate.getDate() + 14);

          return {
            ...book,
            available: false,
            borrowDate: borrowDate.toLocaleDateString('fr-FR'),
            dueDate: dueDate.toLocaleDateString('fr-FR'),
            dueDateRaw: dueDate.toISOString(),
          };
        } else {
          return {
            ...book,
            available: true,
            borrowDate: null,
            dueDate: null,
            dueDateRaw: null,
          };
        }
      }
      return book;
    }));
  };

  const handleAddBook = (newBook) => {
    setBooks(prev => [newBook, ...prev]);
  };

  const handleDeleteBook = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const handleAddReview = (bookId, newReview) => {
    setBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        const updatedReviews = [newReview, ...(book.reviews || [])];
        return { ...book, reviews: updatedReviews };
      }
      return book;
    }));
  };

  const categories = ['Tous', ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isOverdue = (dueDateRaw) => {
    if (!dueDateRaw) return false;
    return new Date(dueDateRaw) < new Date();
  };

  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.available).length;
  const borrowedBooks = books.filter(b => !b.available).length;
  const borrowRate = totalBooks > 0 ? Math.round((borrowedBooks / totalBooks) * 100) : 0;

  const categoryStats = categories.filter(c => c !== 'Tous').map(cat => ({
    name: cat,
    count: books.filter(b => b.category === cat).length
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      <Navbar 
        search={search} 
        setSearch={setSearch} 
        onOpenAddModal={() => setIsAddModalOpen(true)} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Catalogue */}
          <Route path="/" element={
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredBooks.length} ouvrage(s)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Voulez-vous vraiment supprimer ce livre ?')) {
                          handleDeleteBook(book.id);
                        }
                      }}
                      title="Supprimer le livre"
                      className="absolute top-3 right-3 z-10 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div 
                      onClick={() => navigate(`/livre/${book.id}`)}
                      className="relative h-52 overflow-hidden bg-slate-800 cursor-pointer"
                    >
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 backdrop-blur text-xs font-semibold text-indigo-300 rounded-md border border-slate-700">
                        {book.category}
                      </span>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-semibold text-white">
                        <Eye className="w-4 h-4" /> Voir détails
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div 
                        onClick={() => navigate(`/livre/${book.id}`)}
                        className="cursor-pointer"
                      >
                        <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors leading-snug">{book.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">Par {book.author}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          book.available 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {book.available ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          {book.available ? 'Disponible' : 'Emprunté'}
                        </span>

                        <button
                          onClick={() => toggleBorrowStatus(book.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            book.available
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {book.available ? 'Emprunter' : 'Restituer'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          } />

          {/* Route Détail */}
          <Route path="/livre/:id" element={
            <BookDetail 
              books={books} 
              onToggleBorrow={toggleBorrowStatus} 
              onDeleteBook={handleDeleteBook}
              onAddReview={handleAddReview}
            />
          } />

          {/* Mes Emprunts */}
          <Route path="/emprunts" element={
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-100">Ouvrages actuellement empruntés</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.filter(b => !b.available).map(book => {
                  const overdue = isOverdue(book.dueDateRaw);
                  return (
                    <div key={book.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex gap-4 items-start relative overflow-hidden">
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-20 h-28 object-cover rounded-lg cursor-pointer flex-shrink-0"
                        onClick={() => navigate(`/livre/${book.id}`)}
                      />
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 
                          onClick={() => navigate(`/livre/${book.id}`)}
                          className="font-bold text-base text-slate-100 truncate cursor-pointer hover:text-indigo-400 transition-colors"
                        >
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-400">Par {book.author}</p>
                        
                        <div className="text-xs space-y-1 pt-1 border-t border-slate-800/80">
                          <p className="text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                            Emprunté le : <span className="text-slate-200 font-medium">{book.borrowDate || 'Aujourd\'hui'}</span>
                          </p>
                          <p className={`flex items-center gap-1.5 ${overdue ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
                            {overdue ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                            À rendre le : <span className={overdue ? 'text-red-400 font-bold' : 'text-slate-200 font-medium'}>{book.dueDate || 'Dans 14 jours'}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => toggleBorrowStatus(book.id)}
                          className="mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-indigo-400 font-medium rounded-md border border-slate-700 transition-colors w-full"
                        >
                          Restituer l'ouvrage
                        </button>
                      </div>
                    </div>
                  );
                })}
                {books.filter(b => !b.available).length === 0 && (
                  <p className="text-slate-400 text-sm italic col-span-full">Aucun emprunt en cours pour le moment.</p>
                )}
              </div>
            </div>
          } />

          {/* Statistiques */}
          <Route path="/statistiques" element={
            <div className="space-y-8">
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
                <BarChart2 className="w-6 h-6 text-indigo-400" />
                Tableau de Bord des Statistiques
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Ouvrages</p>
                    <p className="text-3xl font-extrabold text-slate-100 mt-2">{totalBooks}</p>
                  </div>
                  <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                    <BookOpen className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disponibles</p>
                    <p className="text-3xl font-extrabold text-emerald-400 mt-2">{availableBooks}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En Emprunt</p>
                    <p className="text-3xl font-extrabold text-amber-400 mt-2">{borrowedBooks}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taux d'Emprunt</p>
                    <p className="text-3xl font-extrabold text-indigo-400 mt-2">{borrowRate}%</p>
                  </div>
                  <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
                    <PieChart className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Répartition du catalogue par catégorie
                </h3>

                <div className="space-y-4">
                  {categoryStats.map((cat) => {
                    const percentage = totalBooks > 0 ? Math.round((cat.count / totalBooks) * 100) : 0;
                    return (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">{cat.name}</span>
                          <span className="text-slate-400">{cat.count} livre(s) ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          } />

          {/* À propos (Version complète et enrichie) */}
          <Route path="/a-propos" element={
            <div className="max-w-4xl mx-auto space-y-10 pb-12">
              
              {/* En-tête principal */}
              <div className="text-center space-y-4 bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  SmartLibrary v3.0
                </span>

                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
                  Gestionnaire de Bibliothèque Numérique
                </h1>

                <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                  Une application web professionnelle, intuitive et performante conçue pour moderniser la gestion des ouvrages, suivre le cycle de vie des emprunts et offrir une expérience utilisateur fluide.
                </p>
              </div>

              {/* Cartes des Fonctionnalités Clés */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-400" />
                  Fonctionnalités Principales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl w-fit text-indigo-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-100 text-base">Catalogue & Recherche</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Filtrage par catégories, recherche instantanée par titre ou auteur, et consultation des fiches détaillées.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl w-fit text-emerald-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-100 text-base">Suivi Automatisé des Prêts</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enregistrement automatique des dates d'emprunt et calcul intelligent des délais de restitution à 14 jours.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit text-amber-400">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-100 text-base">Statistiques en Temps Réel</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tableau de bord dynamique analysant le taux d'emprunt et la répartition des ouvrages par thématique.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technologies Utilisées */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  Stack Technique
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-1">
                    <p className="font-bold text-sm text-indigo-400">React 18</p>
                    <p className="text-[11px] text-slate-500">Composants modulaires</p>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-1">
                    <p className="font-bold text-sm text-sky-400">Vite</p>
                    <p className="text-[11px] text-slate-500">Tooling ultra-rapide</p>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-1">
                    <p className="font-bold text-sm text-cyan-400">Tailwind CSS</p>
                    <p className="text-[11px] text-slate-500">Design moderne & Dark UI</p>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-1">
                    <p className="font-bold text-sm text-emerald-400">React Router 6</p>
                    <p className="text-[11px] text-slate-500">Navigation dynamique</p>
                  </div>
                </div>
              </div>

              {/* Pied de page de la section */}
              <div className="text-center pt-4 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-center gap-1">
                <span>Développé avec</span>
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
                <span>pour le département Génie Informatique</span>
              </div>

            </div>
          } />
        </Routes>
      </main>

      {/* Modale d'ajout de livre */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
}