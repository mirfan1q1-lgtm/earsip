export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div>
        <p className="font-bold text-lg">Portfolio</p>
        <p>Built with React, Tailwind CSS, and Supabase</p>
        <p>&copy; {currentYear} All rights reserved</p>
      </div>
    </footer>
  );
}
