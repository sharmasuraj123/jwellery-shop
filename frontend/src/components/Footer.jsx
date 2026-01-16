import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#300708] text-white section-spacing" data-testid="footer">
      <div className="container-custom">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Janki Jewellery
          </h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">
            Crafting timeless elegance since inception. Each piece is a masterpiece designed to celebrate life's precious moments.
          </p>
          <div className="border-t border-stone-700 pt-8">
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} Janki Jewellery. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
