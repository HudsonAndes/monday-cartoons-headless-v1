import {useState} from 'react';
import {Link} from 'react-router';
import {useInView} from '~/lib/utils';

export function StorySection() {
  const [ref, isVisible] = useInView({threshold: 0.2});
  const values = ['Sustainable Materials', 'NYC Designed', 'Premium Craft'];

  return (
    <section id="story" ref={ref} className="mc-story">
      <div className="mc-story-grid">
        <div>
          <span className="mc-section-num">02</span>
          <h2 className={`mc-story-heading ${isVisible ? 'mc-visible' : ''}`}>
            Born in<br />New York City
          </h2>
        </div>
        <div>
          <p className={`mc-story-text ${isVisible ? 'mc-visible' : ''}`} style={{transitionDelay: '300ms'}}>
            Monday Cartoons is a lifestyle brand combining art, fashion, and a
            balance of playful creativity with determined craftsmanship.
          </p>
          <div className="mc-story-values">
            {values.map((v, i) => (
              <span
                key={v}
                className={`mc-story-pill ${isVisible ? 'mc-visible' : ''}`}
                style={{transitionDelay: `${i * 100 + 500}ms`}}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.includes('@')) setSubmitted(true);
  };

  return (
    <section className="mc-email">
      <div className="mc-email-inner">
        <h2 className="mc-email-title">Join the Club</h2>
        <p className="mc-email-desc">Get 15% off for a year when you sign up. Limited availability.</p>
        {submitted ? (
          <div className="mc-email-success">✦ You're in. Check your inbox.</div>
        ) : (
          <div className="mc-email-form">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="mc-email-input"
            />
            <button onClick={handleSubmit} className="mc-email-btn">SUBSCRIBE</button>
          </div>
        )}
      </div>
    </section>
  );
}

export function MCFooter() {
  return (
    <footer className="mc-footer">
      <div className="mc-footer-top">
        <div>
          <span className="mc-footer-logo">MONDAY<br />CARTOONS</span>
          <p className="mc-footer-tagline">Play no matter the day.</p>
        </div>
        <div className="mc-footer-links">
          <div className="mc-footer-col">
            <h4>Shop</h4>
            <Link to="/collections/all">All Products</Link>
          </div>
          <div className="mc-footer-col">
            <h4>Info</h4>
            <Link to="/pages/our-story">Our Story</Link>
            <Link to="/policies/refund-policy">Returns</Link>
          </div>
          <div className="mc-footer-col">
            <h4>Connect</h4>
            <a href="https://instagram.com/mondaycartoons" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://lightbyangel.com" target="_blank" rel="noopener noreferrer">Services</a>
          </div>
        </div>
      </div>
      <div className="mc-footer-bottom">
        <span>© {new Date().getFullYear()} Monday Cartoons</span>
        <span>Built with Hydrogen</span>
      </div>
    </footer>
  );
}
