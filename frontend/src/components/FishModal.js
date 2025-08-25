import React, { useState, useEffect } from 'react';

const FishModal = ({ fish, isOpen, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Chiudi"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="aspect-[16/9] bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center overflow-hidden rounded-t-3xl relative">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600 mb-4"></div>
                  <p className="text-teal-700">Caricamento foto...</p>
                </div>
              </div>
            )}
            {fish.immagine && !imageError ? (
              <img
                src={fish.immagine}
                alt={fish.nome}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-teal-600 p-8">
                <svg className="w-20 h-20 mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                <span className="text-lg">Nessuna immagine disponibile</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-teal-900 mb-2">{fish.nome}</h2>
              <p className="text-xl text-teal-700 italic">{fish.scientifico}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                    Famiglia
                  </label>
                  <p className="text-gray-800 bg-teal-50 px-4 py-2 rounded-lg border border-teal-100">
                    {fish.famiglia}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                    Habitat
                  </label>
                  <p className="text-gray-800 bg-teal-50 px-4 py-2 rounded-lg border border-teal-100">
                    {fish.habitat}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                    Mesi migliori
                  </label>
                  <p className="text-gray-800 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                    {fish.mesi_pesca}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                    Esche consigliate
                  </label>
                  <p className="text-gray-800 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                    {fish.esche}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                  Caratteristiche
                </label>
                <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-lg border border-teal-100">
                  <p className="text-gray-800 leading-relaxed">
                    {fish.caratteristiche}
                  </p>
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