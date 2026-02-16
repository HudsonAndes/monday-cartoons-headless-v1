import {useLoaderData} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {useFetcher} from 'react-router';
import {Hero} from '~/components/Hero';
import {MCProductCard} from '~/components/MCProductCard';
import {StorySection, EmailCapture} from '~/components/Sections';

const PRODUCTS_QUERY = `#graphql
  query AllProducts($first: Int, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        availableForSale
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
        variants(first: 1) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader({context}) {
  
  const data = await context.storefront.query(PRODUCTS_QUERY, {
    variables: {first: 12},
  });

  const products = data?.products?.nodes || [];

  return {
    products,
    featuredProduct: products[0] || null,
    env: {
      PUBLIC_STOREFRONT_API_TOKEN: context.env.PUBLIC_STOREFRONT_API_TOKEN,
      PUBLIC_STORE_DOMAIN: context.env.PUBLIC_STORE_DOMAIN,
      PUBLIC_STOREFRONT_API_VERSION: context.env.PUBLIC_STOREFRONT_API_VERSION || '2025-01',
    },
  };
}

export default function Homepage() {
  const {products, featuredProduct, env} = useLoaderData();
  const fetcher = useFetcher();

  const handleAddToCart = (variantId) => {
    const formData = new FormData();
    formData.append(
      CartForm.INPUT_NAME,
      JSON.stringify({
        action: CartForm.ACTIONS.LinesAdd,
        inputs: {
          lines: [{merchandiseId: variantId, quantity: 1}],
        },
      }),
    );
    fetcher.submit(formData, {method: 'POST', action: '/cart'});
  };

  return (
    <div className="mc-page">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__ENV = ${JSON.stringify(env)};`,
        }}
      />

      <Hero featuredProduct={featuredProduct} />

      <section id="shop" className="mc-collection-section">
        <div className="mc-section-header">
          <span className="mc-section-num">01</span>
          <h2 className="mc-section-title">The Collection</h2>
          <p className="mc-section-desc">The finest sustainable cotton. Designs that move with you.</p>
        </div>

        {products.length > 0 ? (
          <div className="mc-product-grid">
            {products.map((product, i) => (
              <MCProductCard
                key={product.id}
                product={product}
                index={i}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <p style={{color: '#8a8578', textAlign: 'center', padding: '80px 0'}}>
            No products loaded.
          </p>
        )}
      </section>

      <StorySection />
      <EmailCapture />

    </div>
  );
}
