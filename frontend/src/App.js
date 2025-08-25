import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { FISHES } from './data/fishes';
import FishCard from './components/FishCard';
import FishModal from './components/FishModal';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedFish, setSelectedFish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('alfabetico');

  // Get unique families
  const families = useMemo(() => {
    const uniqueFamilies = [...new Set(FISHES.map(fish => fish.famiglia))];
    return uniqueFamilies.sort((a, b) => a.localeCompare(b));
  }, []);

  // Filter and sort fishes based on search term, family, and sort option
  const filteredAndSortedFishes = useMemo(() => {
    let filtered = FISHES;

    // Apply filters
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(fish =>
        fish.nome.toLowerCase().includes(search) ||
        fish.scientifico.toLowerCase().includes(search) ||
        fish.famiglia.toLowerCase().includes(search) ||
        fish.habitat.toLowerCase().includes(search)
      );
    }

    if (selectedFamily) {
      filtered = filtered.filter(fish => fish.famiglia === selectedFamily);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'alfabetico':
          return a.nome.localeCompare(b.nome);
        case 'famiglia':
          if (a.famiglia !== b.famiglia) {
            return a.famiglia.localeCompare(b.famiglia);
          }
          return a.nome.localeCompare(b.nome);
        case 'mesi':
          // Sort by best months if available, otherwise by general months
          const monthsA = a.mesi_migliori || a.mesi_pesca || '';
          const monthsB = b.mesi_migliori || b.mesi_pesca || '';
          if (monthsA !== monthsB) {
            return monthsA.localeCompare(monthsB);
          }
          return a.nome.localeCompare(b.nome);
        case 'difficolta':
          const difficultyOrder = ['bassa', 'media', 'media-alta', 'alta', 'molto alta'];
          const indexA = difficultyOrder.indexOf(a.difficolta?.toLowerCase() || '');
          const indexB = difficultyOrder.indexOf(b.difficolta?.toLowerCase() || '');
          if (indexA !== indexB) {
            return indexA - indexB;
          }
          return a.nome.localeCompare(b.nome);
        case 'taglia':
          // Extract numeric value from taglia_media for sorting
          const sizeA = parseFloat(a.taglia_media?.match(/\d+/) || 0);
          const sizeB = parseFloat(b.taglia_media?.match(/\d+/) || 0);
          if (sizeA !== sizeB) {
            return sizeB - sizeA; // Larger fish first
          }
          return a.nome.localeCompare(b.nome);
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

    return sorted;
  }, [searchTerm, selectedFamily, sortBy]);

  const handleFishClick = (fish) => {
    setSelectedFish(fish);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFish(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-gradient-to-r from-teal-600/95 via-teal-700/95 to-teal-800/95 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <span className="text-5xl">🎣</span>
              Fish ID Italia
            </h1>
            <p className="text-teal-100 text-lg font-medium">Mediterraneo • 50+ specie</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cerca per nome, scientifico, famiglia o habitat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-white/20 bg-white/95 text-teal-900 placeholder-teal-600 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 transition-all duration-200 text-base font-medium backdrop-blur-sm"
              />
            </div>
            <div className="sm:w-64">
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-white/20 bg-white/95 text-teal-900 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 transition-all duration-200 text-base font-medium backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="">Tutte le famiglie</option>
                {families.map(family => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Results count */}
        <div className="mb-6">
          <p className="text-teal-700 text-lg font-medium">
            {filteredAndSortedFishes.length === FISHES.length 
              ? `Mostrando tutte le ${FISHES.length} specie`
              : `Trovate ${filteredAndSortedFishes.length} specie su ${FISHES.length}`
            }
            {sortBy !== 'alfabetico' && (
              <span className="text-teal-600 text-sm ml-2">
                • Ordinate per {sortBy === 'famiglia' ? 'famiglia' : sortBy === 'mesi' ? 'stagione' : sortBy === 'difficolta' ? 'difficoltà' : 'taglia'}
              </span>
            )}
          </p>
        </div>

        {/* Fish Grid */}
        {filteredAndSortedFishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedFishes.map(fish => (
              <FishCard
                key={fish.id}
                fish={fish}
                onClick={handleFishClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-teal-900 mb-2">Nessun pesce trovato</h3>
            <p className="text-teal-600">Prova a modificare i criteri di ricerca</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <FishModal
        fish={selectedFish}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-teal-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-teal-600">
            <p>Dati sintetici • Immagini da Wikipedia/Wikimedia quando disponibili</p>
            <p className="mt-2 text-xs text-teal-500">
              Creato con ♥️ per gli amanti della pesca nel Mediterraneo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;