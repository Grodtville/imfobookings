export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Imfo Bookings</h3>
          <p className="text-purple-200 text-sm">
            45 Ntrub Avenue, Adenta, Accra.
            <br />
            (+233) 20 928 8098
            <br />
            support@imfobookings.com
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Built For You</h4>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li>Explore Photographers</li>
            <li>Get Inspired</li>
            <li>How We Work</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Imfo Bookings</h4>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li>About Imfo Bookings</li>
            <li>Contact Us</li>
            <li>Blog</li>
            <li>Help Center</li>
            <li>Join Imfo Bookings</li>
            <li>Log In</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Socials</h4>
          <div>
            <h4 className="font-semibold mb-4">Socials</h4>
            <div className="flex space-x-6">
              {/* Instagram */}
              <a href="#" className="hover:text-purple-300 transition">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Instagram"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.948-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a href="#" className="hover:text-purple-300 transition">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="X"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l12.068 15.644z" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="#" className="hover:text-purple-300 transition">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Facebook"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="#" className="hover:text-purple-300 transition">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="LinkedIn"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.174 0-2.126-.952-2.126-2.126 0-1.174.952-2.126 2.126-2.126 1.174 0 2.126.952 2.126 2.126 0 1.174-.952 2.126-2.126 2.126zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c1.079 0 1.771-.773 1.771-1.729V1.729C24 .774 23.228 0 22.225 0z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a href="#" className="hover:text-purple-300 transition">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Pinterest"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 3.632 1.805 6.843 4.596 8.807-.06-.536-.114-1.358.024-1.942.124-.525.802-3.33.802-3.33s-.205-.41-.205-.992c0-1.357.788-2.368 1.767-2.368.833 0 1.237.626 1.237 1.377 0 .838-.534 2.088-.81 3.248-.23.97.486 1.76 1.44 1.76 1.73 0 3.058-1.824 3.058-4.458 0-2.331-1.674-3.96-4.066-3.96-2.768 0-4.393 2.074-4.393 4.215 0 .834.321 1.728.722 2.214.08.097.09.182.068.283-.07.32-.224.998-.254 1.137-.04.184-.132.223-.306.134-1.138-.585-1.852-2.423-1.852-3.9 0-3.172 2.305-6.078 6.646-6.078 3.486 0 6.192 2.482 6.192 5.804 0 3.469-2.188 6.254-5.227 6.254-1.021 0-1.98-.531-2.309-1.157 0 0-.505 1.924-.629 2.397-.23.88-.852 1.98-1.267 2.645.952.294 1.955.452 2.994.452 6.621 0 11.988-5.367 11.988-11.987C24.005 5.367 18.638 0 12.017 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-8 border-t border-purple-700 text-sm text-purple-300 text-center">
        © 2025 Imfo Bookings Ltd. All Rights Reserved. • Cookie preferences •
        Community guidelines
      </div>
    </footer>
  );
}
