import React, { useState } from 'react';

const FishCard = ({ fish, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <button
      className="group relative bg-white rounded-2xl border border-teal-100 overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-200"
      onClick={() => onClick(fish)}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center overflow-hidden relative">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        )}
        {fish.immagine && !imageError ? (
          <img
            src={fish.immagine}
            alt={fish.nome}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110 transition-transform duration-500`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-teal-600 p-4">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <span className="text-sm text-center">Nessuna immagine</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-teal-900 mb-1 text-left group-hover:text-teal-700 transition-colors">
          {fish.nome}
        </h3>
        <p className="text-teal-700 italic text-sm mb-3 text-left">
          {fish.scientifico}
        </p>
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-xs font-medium">
          <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
          {fish.famiglia}
        </div>
      </div>
    </button>
  );
};

export default FishCard;