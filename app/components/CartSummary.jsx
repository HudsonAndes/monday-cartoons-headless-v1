import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4>Totals</h4>
      <dl className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div style={{marginTop: '16px'}}>
      <a
        href={checkoutUrl}
        target="_self"
        style={{
          display: 'block',
          width: '100%',
          background: '#d4440f',
          color: 'white',
          textAlign: 'center',
          padding: '16px 24px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontFamily: "'DM Sans', sans-serif",
          boxSizing: 'border-box',
          transition: 'filter 0.3s',
        }}
      >
        Continue to Checkout →
      </a>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div style={{display: 'flex', gap: '8px', alignItems: 'stretch', marginBottom: '8px'}}>
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
            style={{
              flex: 1,
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            aria-label="Apply discount code"
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: '#222',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div style={{display: 'flex', gap: '8px', alignItems: 'stretch', marginBottom: '8px'}}>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            style={{
              flex: 1,
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            style={{
              padding: '10px 16px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              background: '#222',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   children: React.ReactNode;
 * }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
