import React, { useState, useEffect } from "react";

const LazyImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setLoaded(true);
    };
    img.onerror = () => {
      setImageSrc("https://via.placeholder.com/150?text=No+Image");
      setLoaded(true);
    };
  }, [src]);

  if (!loaded) {
    // ⏳ Show loading skeleton while image loads
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800/60 rounded-lg border border-gray-700/50 animate-pulse">
        <p className="text-gray-400 text-sm">Loading image...</p>
      </div>
    );
  }

  // ✅ Once loaded
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} w-full h-full object-cover rounded-lg border border-gray-700/50`}
    />
  );
};

export default LazyImage;
