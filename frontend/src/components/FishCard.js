import React, { useState } from 'react';
import useWikipediaImage from '../hooks/useWikipediaImage';

const FishCard = ({ fish, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use Wikipedia image hook
  const { imageUrl, loading: imageLoading } = useWikipediaImage(
    fish.scientifico, 
    fish.nome, 
    fish.immagine
  );

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
    <button
      className="group relative bg-white rounded-2xl border border-teal-100 overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-3 hover:scale-[1.03] transition-all duration-400 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200 w-full text-left"
      onClick={() => onClick(fish)}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center overflow-hidden relative">
        {(!imageLoaded || imageLoading) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        )}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={fish.nome}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-teal-600 p-4">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <span className="text-sm text-center">
              {imageLoading ? 'Caricamento...' : 'Nessuna immagine'}
            </span>
          </div>
        )}
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge difficoltà nell'angolo */}
        {fish.difficolta && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(fish.difficolta)}`}>
              {fish.difficolta}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-xl text-teal-900 mb-1 group-hover:text-teal-700 transition-colors leading-tight">
            {fish.nome}
          </h3>
          <p className="text-teal-700 italic text-sm mb-2">
            {fish.scientifico}
          </p>
          
          {/* Taglia media */}
          {fish.taglia_media && (
            <p className="text-gray-600 text-xs">
              📏 {fish.taglia_media}
            </p>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {/* Famiglia */}
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
            {fish.famiglia}
          </div>

          {/* Mesi migliori */}
          {fish.mesi_migliori && (
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-medium ml-1">
              <span>📅</span>
              {fish.mesi_migliori}
            </div>
          )}
        </div>

        {/* Valore gastronomico */}
        <div className="flex justify-between items-center">
          {fish.valore_gastronomico && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getValueColor(fish.valore_gastronomico)}`}>
              ⭐ {fish.valore_gastronomico}
            </span>
          )}
          
          {/* Profondità */}
          {fish.profondita && (
            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              🌊 {fish.profondita}
            </span>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </button>
  );
};

export default FishCard;