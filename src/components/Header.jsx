import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold shadow">
            GT
          </div>
          <div>
            <div className="text-slate-900 font-semibold leading-5">GameTopup</div>
            <div className="text-xs text-slate-500 leading-4">Fast & Secure</div>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
          <Link to="/test" className="hover:text-slate-900">Status</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
