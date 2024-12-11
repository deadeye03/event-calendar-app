"use client"
import { navLinks } from "@/constants";
import { useState } from "react"



const NavItems = ({ onClick = () => {} }) => (
  <ul className="nav-ul">
    {navLinks.map((item) => (
      <li key={item.id} className="nav-li">
        <a href={item.href} className="nav-li_a" onClick={onClick}>
          {item.name}
        </a>
      </li>
    ))}
  </ul>
);

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleMenu = () => setIsOpen(!isOpen)
    return (
        <header className='fixed left-0 top-0 right-0 z-50 bg-slate-400 px-10' >
            <div className='max-w-7xl mx-auto'>
                <div className='flex justify-between items-center py-5 mx-auto c-space'>
                    <a href="/" className='text-black/80 font-bold text-xl hover:text-black transition-colors'>
                        Dacoide
                    </a>

                    <button
                        onClick={toggleMenu}
                        className="text-neutral-400 hover:text-white transition-colors 
                focus:outline-none sm:hidden flex"
                        aria-label="Toggle Menu"
                    >
                        <img src={isOpen ? '/close.svg' : '/menu.svg'} alt="hamburger" className="h-6 w-6" />
                    </button>
                    <nav className="sm:flex gap-8 hidden" >
                        <NavItems/>
                     </nav>
                </div>
                <div className={`nav-sidebar ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                  <nav>
                    <NavItems onClick={toggleMenu} />
                  </nav>
                </div>

            </div>
        </header>
    )
}

export default Navbar
