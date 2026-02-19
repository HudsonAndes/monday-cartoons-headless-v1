import {useState, useEffect} from 'react';
import {Link} from 'react-router';
import {formatMoney, getFirstAvailableVariant} from '~/lib/utils';

export function Hero({featuredProduct}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const image = featuredProduct?.images?.nodes?.[0];
  const variant = getFirstAvailableVariant(featuredProduct);
  const price = variant?.price;

  return (
    <section className="mc-hero">
      <div
        className={`mc-hero-copy ${loaded ? 'mc-visible' : ''}`}
      >
        <div className="mc-hero-est">EST. 2024. NEW YORK CITY</div>

        <h1 className="mc-hero-title">
          <span className="mc-hero-play">Play</span>
          <span className="mc-hero-no-matter">No Matter</span>
          <span className="mc-hero-the-day">The Day</span>
        </h1>

        <p className="mc-hero-desc">
          Art, fashion &amp; the spirit of play. Crafted with the finest
          finest fabrics and materials on earth.
        </p>

        <Link to="/collections/all" className="mc-hero-cta">
          <span>Explore the Collection</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>

      <div className={`mc-hero-image ${loaded ? 'mc-visible' : ''}`}>
        <Link to={featuredProduct ? `/products/${featuredProduct.handle}` : '/collections/all'}>
          <div className="mc-hero-image-wrap">
            {image ? (
              <img
                src={image.url}
                alt={image.altText || featuredProduct?.title || 'Monday Cartoons'}
              />
            ) : (
              <div className="mc-hero-placeholder">Monday Cartoons</div>
            )}
            {featuredProduct && (
              <div className="mc-hero-badge">
                <span>NEW DROP</span>
                {price && <span className="mc-hero-badge-price">{formatMoney(price)}</span>}
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
