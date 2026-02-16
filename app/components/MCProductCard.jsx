import {useState} from 'react';
import {Link} from 'react-router';
import {formatMoney, getFirstAvailableVariant, getProductBadge, useInView} from '~/lib/utils';

export function MCProductCard({product, index = 0, onQuickView, onAddToCart}) {
  const [ref, isVisible] = useInView();
  const [added, setAdded] = useState(false);
  const variant = getFirstAvailableVariant(product);
  const badge = getProductBadge(product);
  const image = product.images?.nodes?.[0];
  const price = variant?.price || product.priceRange?.minVariantPrice;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (variant?.id && onAddToCart) {
      onAddToCart(variant.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product.handle);
    }
  };

  return (
    <div
      ref={ref}
      className={`mc-product-card ${isVisible ? 'mc-visible' : ''}`}
      style={{transitionDelay: `${index * 150}ms`}}
    >
      <Link to={`/products/${product.handle}`}>
        <div className="mc-product-image-wrap">
          {image && (
            <img src={image.url} alt={image.altText || product.title} loading="lazy" />
          )}
          <div className="mc-product-overlay">
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <button
                onClick={handleAdd}
                className="mc-add-btn"
                style={added ? {background: '#d4440f', color: 'white'} : {}}
              >
                {added ? '✓ ADDED TO BAG' : `ADD TO BAG — ${price ? formatMoney(price) : ''}`}
              </button>
              {onQuickView && (
                <button onClick={handleQuickView} className="mc-quickview-btn">
                  QUICK VIEW
                </button>
              )}
            </div>
          </div>
          {badge && <span className="mc-badge">{badge}</span>}

          {/* Success toast */}
          {added && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#d4440f',
              color: 'white',
              padding: '8px 16px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              animation: 'qvFadeIn 0.3s ease',
              zIndex: 10,
            }}>
              ✓ ADDED
            </div>
          )}
        </div>
        <div style={{padding: '0 4px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px'}}>
            <h3 className="mc-product-title">{product.title}</h3>
            <span className="mc-product-price">{price ? formatMoney(price) : ''}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
