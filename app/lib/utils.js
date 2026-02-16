import {useEffect, useRef, useState} from 'react';

export function formatMoney(money) {
  if (!money) return '';
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'USD',
  }).format(amount);
}

export function getFirstAvailableVariant(product) {
  if (!product?.variants?.nodes) return null;
  return (
    product.variants.nodes.find((v) => v.availableForSale) ||
    product.variants.nodes[0]
  );
}

export function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {threshold: 0.15, ...options},
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

export function getProductBadge(product) {
  if (!product?.tags) return null;
  const badgeTags = ['new', 'bestseller', 'just-dropped', 'limited', 'sale'];
  const found = product.tags.find((t) =>
    badgeTags.includes(t.toLowerCase().replace(/\s+/g, '-')),
  );
  return found ? found.toUpperCase() : null;
}
