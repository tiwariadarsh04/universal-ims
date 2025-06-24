// Image optimization utility
export const optimizeImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (maxHeight * width) / height;
        height = maxHeight;
      }

      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to desired format
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Image conversion failed'));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Image loading failed'));
    };
  });
};

// Lazy loading image component
export const LazyImage = ({ src, alt, className, placeholder = '/placeholder.png' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setError(true);
    };
  }, [src]);

  if (error) {
    return <img src={placeholder} alt={alt} className={className} />;
  }

  return (
    <div className={`lazy-image-container ${className}`}>
      {!isLoaded && <img src={placeholder} alt="Loading..." className="placeholder" />}
      <img
        src={src}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
};

// Image preloader
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        })
    )
  );
};

// Responsive image srcset generator
export const generateSrcSet = (src, widths = [320, 640, 960, 1280, 1920]) => {
  return widths
    .map((width) => `${src}?w=${width} ${width}w`)
    .join(', ');
}; 