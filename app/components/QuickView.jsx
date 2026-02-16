import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import {formatMoney} from '~/lib/utils';

const QUICK_VIEW_QUERY = `#graphql
  query QuickViewProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      availableForSale
      options { name values }
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 4) { nodes { id url altText width height } }
      variants(first: 50) {
        nodes {
          id title availableForSale
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
          image { id url altText width height }
        }
      }
    }
  }
`;

async function fetchProduct(handle, env) {
  const token = env?.PUBLIC_STOREFRONT_API_TOKEN;
  const domain = env?.PUBLIC_STORE_DOMAIN;
  const version = env?.PUBLIC_STOREFRONT_API_VERSION || '2025-01';

  if (!token || !domain) {
    console.error('QuickView: Missing env vars', {token: !!token, domain: !!domain});
    return null;
  }

  const response = await fetch(
    `https://${domain}/api/${version}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({query: QUICK_VIEW_QUERY, variables: {handle}}),
    },
  );
  const {data} = await response.json();
  return data?.product;
}

export function QuickViewModal({handle, onClose, onAddToCart, env}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    setError(null);
    fetchProduct(handle, env)
      .then((p) => {
        if (!p) {
          setError('Could not load product');
          setLoading(false);
          return;
        }
        setProduct(p);
        if (p?.variants?.nodes) {
          setSelectedVariant(
            p.variants.nodes.find((v) => v.availableForSale) || p.variants.nodes[0],
          );
        }
        setSelectedImageIdx(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error('QuickView fetch error:', err);
        setError('Failed to load product');
        setLoading(false);
      });
  }, [handle, env]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleAdd = () => {
    if (selectedVariant?.id && onAddToCart) {
      onAddToCart(selectedVariant.id);
      onClose();
    }
  };

  const images = product?.images?.nodes || [];
  const variants = product?.variants?.nodes || [];

  return (
    <>
      <div onClick={onClose} className="mc-qv-overlay">
        <div onClick={(e) => e.stopPropagation()} className="mc-qv-modal">
          <button onClick={onClose} className="mc-qv-close">
            ✕
          </button>

          {loading ? (
            <div className="mc-qv-loading">
              <div className="mc-qv-spinner" />
              Loading...
            </div>
          ) : error ? (
            <div className="mc-qv-loading">{error}</div>
          ) : product ? (
            <div className="mc-qv-grid">
              <div>
                <div className="mc-qv-image">
                  {images[selectedImageIdx] && (
                    <img
                      src={images[selectedImageIdx].url}
                      alt={images[selectedImageIdx].altText || product.title}
                    />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="mc-qv-thumbs">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImageIdx(i)}
                        className={`mc-qv-thumb ${i === selectedImageIdx ? 'active' : ''}`}
                      >
                        <img src={img.url} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mc-qv-info">
                <div className="mc-qv-label">QUICK VIEW</div>
                <h2 className="mc-qv-title">{product.title}</h2>
                <div className="mc-qv-price">
                  {selectedVariant?.price
                    ? formatMoney(selectedVariant.price)
                    : formatMoney(product.priceRange.minVariantPrice)}
                </div>
                {product.description && (
                  <p className="mc-qv-desc">{product.description}</p>
                )}
                {variants.length > 1 && (
                  <div className="mc-qv-variants">
                    <label className="mc-qv-variants-label">
                      {product.options?.[0]?.name || 'Option'}
                    </label>
                    <div className="mc-qv-variants-list">
                      {variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          disabled={!v.availableForSale}
                          className={`mc-qv-variant ${selectedVariant?.id === v.id ? 'active' : ''} ${!v.availableForSale ? 'disabled' : ''}`}
                        >
                          {v.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{flex: 1, minHeight: '20px'}} />
                <button
                  onClick={handleAdd}
                  disabled={!selectedVariant?.availableForSale}
                  className="mc-qv-add"
                >
                  {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
                </button>
                <Link
                  to={`/products/${product.handle}`}
                  onClick={onClose}
                  className="mc-qv-details"
                >
                  View full details →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mc-qv-loading">Product not found</div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes qvFadeIn { from { opacity: 0; } }
        @keyframes qvSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } }
        @keyframes qvSpin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
