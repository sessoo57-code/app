import { useState, useEffect } from 'react';

const useWikipediaImage = (scientificName, commonName, existingImage) => {
  const [imageUrl, setImageUrl] = useState(existingImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If we already have an image, use it
    if (existingImage) {
      setImageUrl(existingImage);
      return;
    }

    const fetchWikipediaImage = async () => {
      setLoading(true);
      setError(false);

      try {
        // First try with scientific name
        let imageUrl = await searchWikipediaImage(scientificName);
        
        // If not found, try with common name
        if (!imageUrl && commonName) {
          imageUrl = await searchWikipediaImage(commonName);
        }
        
        // If still not found, try with scientific name + "fish"
        if (!imageUrl) {
          imageUrl = await searchWikipediaImage(`${scientificName} fish`);
        }

        if (imageUrl) {
          setImageUrl(imageUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.warn(`Failed to fetch image for ${scientificName}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWikipediaImage();
  }, [scientificName, commonName, existingImage]);

  return { imageUrl, loading, error };
};

const searchWikipediaImage = async (searchTerm) => {
  try {
    // First, search for the page
    const searchResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
    );

    if (!searchResponse.ok) {
      // Try Italian Wikipedia
      const itSearchResponse = await fetch(
        `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`
      );
      
      if (itSearchResponse.ok) {
        const itData = await itSearchResponse.json();
        if (itData.thumbnail && itData.thumbnail.source) {
          return itData.thumbnail.source;
        }
      }
      return null;
    }

    const data = await searchResponse.json();
    
    if (data.thumbnail && data.thumbnail.source) {
      return data.thumbnail.source;
    }

    // If no thumbnail in summary, try to get page images
    if (data.title) {
      const imagesResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(data.title)}`
      );
      
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        const imageItems = imagesData.items || [];
        
        // Look for main image (usually the first non-icon image)
        for (const item of imageItems) {
          if (item.type === 'image' && 
              item.srcset && 
              !item.title.toLowerCase().includes('commons-logo') &&
              !item.title.toLowerCase().includes('edit-icon')) {
            
            // Get a medium-sized version
            const srcsetEntries = item.srcset.split(',');
            const mediumImage = srcsetEntries.find(entry => 
              entry.includes('320w') || entry.includes('480w') || entry.includes('640w')
            ) || srcsetEntries[0];
            
            if (mediumImage) {
              return mediumImage.split(' ')[0];
            }
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.warn(`Error searching Wikipedia for ${searchTerm}:`, error);
    return null;
  }
};

export default useWikipediaImage;