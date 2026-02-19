import {Image} from '@shopify/hydrogen';
import {useState} from 'react';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 *   images?: Array<{id: string; url: string; altText?: string; width?: number; height?: number}>;
 * }}
 */
export function ProductImage({image, images}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Use full images array if available, otherwise fall back to single variant image
  const allImages = images && images.length > 0 ? images : image ? [image] : [];

  if (allImages.length === 0) {
    return <div className="product-image" />;
  }

  const currentImage = allImages[selectedIndex] || allImages[0];

  return (
    <div className="product-image">
      <Image
        alt={currentImage.altText || 'Product Image'}
        aspectRatio="1/1"
        data={currentImage}
        key={currentImage.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
      {allImages.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          flexWrap: 'wrap',
        }}>
          {allImages.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setSelectedIndex(i)}
              style={{
                width: '64px',
                height: '64px',
                padding: 0,
                border: i === selectedIndex ? '2px solid #d4440f' : '1px solid #2a2823',
                background: '#161512',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <img
                src={img.url}
                alt={img.altText || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
