export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#fff7e6] via-[#fdf6f0] to-[#f8e8d0] section-spacing " data-testid="hero-section">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto slide-up">
          <span className="uppercase tracking-widest text-xs text-stone-500 font-medium mb-4 block">
            Timeless Elegance
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-6 text-stone-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Discover Your Perfect Piece
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto mb-12">
            Exquisite craftsmanship meets timeless design. Each piece tells a story of elegance, 
            luxury, and unparalleled beauty.
          </p>
          <button 
            className="btn-primary bg-[#832728] rounded-lg"
            onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
            data-testid="hero-explore-btn"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
}
