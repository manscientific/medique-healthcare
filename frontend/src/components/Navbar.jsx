import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  const navLinkStyle = ({ isActive }) => 
    `relative py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-lg ${
      isActive 
        ? 'text-white bg-primary shadow-lg' 
        : 'text-gray-800 hover:text-primary hover:bg-gray-100'
    }`

  return (
    <nav className='sticky top-0 z-50 bg-white/98 backdrop-blur-lg shadow-lg border-b-2 border-gray-200'>
      <div className='max-w-8xl mx-auto px-5 sm:px-7 lg:px-9'>
        <div className='flex items-center justify-between h-20'>
          
          {/* Logo Section */}
          <div 
            onClick={() => navigate('/')} 
            className='flex items-center cursor-pointer group transition-all duration-300'
          >
            <img 
              className='w-44 transition-transform duration-300 group-hover:scale-110' 
              src={assets.new_logo} 
              alt="MediQ Healthcare" 
            />
          </div>

          {/* Desktop Navigation */}
          <ul className='hidden lg:flex items-center space-x-3'>
            {[
              { name: 'HOME', path: '/' },
              { name: 'ALL DOCTORS', path: '/doctors' },
              { name: 'ABOUT US', path: '/about' },
              { name: 'CONTACT', path: '/contact' }
            ].map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={navLinkStyle}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Actions Section */}
          <div className='flex items-center gap-5'>
            {token && userData ? (
              <div className='flex items-center gap-4 cursor-pointer group relative'>
                <div className='flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-300'>
                  <img 
                    className='w-12 h-12 rounded-full border-3 border-primary/30 shadow-md' 
                    src={userData.image} 
                    alt={userData.name} 
                  />
                  <span className='text-gray-900 font-bold text-lg hidden xl:block max-w-32 truncate'>
                    {userData.name}
                  </span>
                  <img 
                    className='w-4 transition-transform duration-300 group-hover:rotate-180' 
                    src={assets.dropdown_icon} 
                    alt="Dropdown" 
                  />
                </div>
                
                {/* User Dropdown Menu */}
                <div className='absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50'>
                  <div className='p-3 space-y-2'>
                    <div 
                      onClick={() => navigate('/my-profile')}
                      className='flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-primary/10 text-gray-800 transition-all duration-200 text-lg font-medium'
                    >
                      <span className='text-2xl'>👤</span>
                      <span>My Profile</span>
                    </div>
                    <div 
                      onClick={() => navigate('/my-appointments')}
                      className='flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-primary/10 text-gray-800 transition-all duration-200 text-lg font-medium'
                    >
                      <span className='text-2xl'>📅</span>
                      <span>My Appointments</span>
                    </div>
                    <hr className='my-3 border-gray-200' />
                    <div 
                      onClick={logout}
                      className='flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-red-100 text-red-700 transition-all duration-200 text-lg font-medium'
                    >
                      <span className='text-2xl'>🚪</span>
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className='hidden lg:flex items-center gap-3 bg-gradient-to-r from-primary to-primary/90 text-white px-9 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-primary/20'
              >
                <span className='text-xl'>👤</span>
                <span>CREATE ACCOUNT</span>
                <span className='text-xl'>→</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMenu(true)}
              className='lg:hidden p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200'
            >
              <img className='w-8' src={assets.menu_icon} alt="Menu" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ${
        showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowMenu(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl transform transition-transform duration-500 ${
          showMenu ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className='flex items-center justify-between p-7 border-b-2 border-gray-200 bg-gradient-to-r from-primary/5 to-white'>
            <img src={assets.new_logo} className='w-36' alt="MediQ" />
            <button 
              onClick={() => setShowMenu(false)}
              className='p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 text-2xl'
            >
              ✕
            </button>
          </div>
          
          <div className='p-7'>
            <ul className='space-y-4'>
              {[
                { name: 'HOME', path: '/' },
                { name: 'ALL DOCTORS', path: '/doctors' },
                { name: 'ABOUT US', path: '/about' },
                { name: 'CONTACT', path: '/contact' }
              ].map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => setShowMenu(false)}
                    className={({ isActive }) => 
                      `block px-6 py-5 rounded-2xl font-bold text-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-gray-800 hover:bg-gray-100 hover:text-primary'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            {!token && (
              <button 
                onClick={() => {
                  setShowMenu(false)
                  navigate('/login')
                }}
                className='w-full mt-8 bg-gradient-to-r from-primary to-primary/90 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300'
              >
                <span className='text-xl mr-3'>👤</span>
                CREATE ACCOUNT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar