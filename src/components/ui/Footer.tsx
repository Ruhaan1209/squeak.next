import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-primary text-lg mb-3">Squeak</h3>
          <p className="font-secondary text-sm text-text-secondary">Learn languages reading what you love.</p>
        </div>
        <div>
          <h4 className="font-secondary font-medium text-sm mb-3">Links</h4>
          <div className="space-y-2">
            <Link href="/" className="block font-secondary text-sm text-text-secondary hover:text-text-primary no-underline">Home</Link>
            <Link href="/educators" className="block font-secondary text-sm text-text-secondary hover:text-text-primary no-underline">For Educators</Link>
            <Link href="/auth/signup" className="block font-secondary text-sm text-text-secondary hover:text-text-primary no-underline">Sign Up</Link>
          </div>
        </div>
        <div>
          <h4 className="font-secondary font-medium text-sm mb-3">Support</h4>
          <div className="space-y-2">
            <a href="/contact-support.html" target="_blank" rel="noopener noreferrer" className="block font-secondary text-sm text-text-secondary hover:text-text-primary no-underline">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
