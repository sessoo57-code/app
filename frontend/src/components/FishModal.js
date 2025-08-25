import React, { useState, useEffect } from 'react';
import useWikipediaImage from '../hooks/useWikipediaImage';

const FishModal = ({ fish, isOpen, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use Wikipedia image hook
  const { imageUrl, loading: imageLoading } = useWikipediaImage(
    fish?.scientifico, 
    fish?.nome, 
    fish?.immagine
  );

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [fish, isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fish) return null;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'bassa': return 'bg-green-100 text-green-700 border-green-200';
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'media-alta': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'molto alta': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getValueColor = (value) => {
    switch(value?.toLowerCase()) {
      case 'eccellente': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ottimo': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'buono': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Chiudi"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="aspect-[21/9] bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center overflow-hidden rounded-t-3xl relative">
            {(!imageLoaded || imageLoading) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mb-4"></div>
                  <p className="text-teal-700 text-lg">
                    {imageLoading ? 'Caricamento da Wikipedia...' : 'Caricamento foto...'}
                  </p>
                </div>
              </div>
            )}
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt={fish.nome}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-teal-600 p-8">
                <svg className="w-24 h-24 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                <span className="text-xl">
                  {imageLoading ? 'Ricerca su Wikipedia...' : 'Nessuna immagine disponibile'}
                </span>
              </div>
            )}
            
            {/* Info overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="flex flex-wrap items-center gap-3">
                  {fish.difficolta && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(fish.difficolta)}`}>
                      🎯 {fish.difficolta}
                    </span>
                  )}
                  {fish.valore_gastronomico && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getValueColor(fish.valore_gastronomico)}`}>
                      ⭐ {fish.valore_gastronomico}
                    </span>
                  )}
                  {fish.taglia_massima && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                      📏 Max: {fish.taglia_massima}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-teal-900 mb-3">{fish.nome}</h2>
              <p className="text-2xl text-teal-700 italic mb-4">{fish.scientifico}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium border border-teal-200">
                  📚 {fish.famiglia}
                </span>
                {fish.profondita && (
                  <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                    🌊 {fish.profondita}
                  </span>
                )}
              </div>
            </div>

            {/* Sezione caratteristiche principali */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-teal-900 mb-4 flex items-center gap-2">
                <span>🐟</span> Caratteristiche
              </h3>
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
                <p className="text-gray-800 leading-relaxed text-lg">
                  {fish.caratteristiche}
                </p>
                {fish.curiosita && (
                  <div className="mt-4 p-4 bg-white/70 rounded-xl border border-teal-200">
                    <h4 className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
                      <span>💡</span> Lo sapevi che...
                    </h4>
                    <p className="text-gray-700 italic">{fish.curiosita}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Griglia informazioni dettagliate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Colonna sinistra - Informazioni biologiche */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🏠</span> Habitat e Distribuzione
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{fish.habitat}</p>
                  
                  {fish.periodo_riproduzione && (
                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                      <h4 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                        <span>🥚</span> Riproduzione
                      </h4>
                      <p className="text-pink-700">{fish.periodo_riproduzione}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📐</span> Dimensioni
                  </h3>
                  <div className="space-y-3">
                    {fish.taglia_media && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Taglia media:</span>
                        <span className="font-semibold text-gray-800">{fish.taglia_media}</span>
                      </div>
                    )}
                    {fish.taglia_massima && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600">Taglia massima:</span>
                        <span className="font-semibold text-gray-800">{fish.taglia_massima}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Colonna destra - Informazioni per la pesca */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📅</span> Periodi di Pesca
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">Periodo generale</h4>
                      <p className="text-orange-700">{fish.mesi_pesca}</p>
                    </div>
                    {fish.mesi_migliori && (
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">⭐ Mesi migliori</h4>
                        <p className="text-green-700 font-medium">{fish.mesi_migliori}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🎣</span> Esche e Tecniche
                  </h3>
                  <div className="space-y-4">
                    {fish.esche_migliori && (
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">🏆 Esche consigliate</h4>
                        <p className="text-blue-700">{fish.esche_migliori}</p>
                      </div>
                    )}
                    {fish.tecniche && (
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">🎯 Tecniche</h4>
                        <p className="text-purple-700">{fish.tecniche}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con informazioni aggiuntive */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {fish.difficolta && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-sm text-gray-600 mb-1">Difficoltà</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(fish.difficolta).replace('border', 'border-2')}`}>
                      {fish.difficolta}
                    </div>
                  </div>
                )}
                {fish.valore_gastronomico && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">👨‍🍳</div>
                    <div className="text-sm text-gray-600 mb-1">Valore culinario</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getValueColor(fish.valore_gastronomico).replace('border', 'border-2')}`}>
                      {fish.valore_gastronomico}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl mb-1">🌊</div>
                  <div className="text-sm text-gray-600 mb-1">Ambiente marino</div>
                  <div className="text-sm font-medium text-teal-700 bg-teal-100 border-2 border-teal-200 px-3 py-1 rounded-full inline-block">
                    Mediterraneo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FishModal;