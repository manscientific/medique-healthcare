import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Doctors', path: '/doctors' },
    { name: 'Services', path: '/services' },
    { name: 'Privacy Policy', path: '/privacy' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: '📘', color: 'hover:bg-blue-100' },
    { name: 'Twitter', icon: '🐦', color: 'hover:bg-blue-50' },
    { name: 'Instagram', icon: '📷', color: 'hover:bg-pink-100' },
    { name: 'LinkedIn', icon: '💼', color: 'hover:bg-blue-100' }
  ]

  return (
    <footer className='bg-gradient-to-br from-gray-50 to-white border-t-4 border-primary/20 mt-24'>
      <div className='max-w-8xl mx-auto px-6 sm:px-8 lg:px-10 py-16'>
        
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14'>
          
          {/* Company Information */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex items-center gap-4'>
              <img className='w-40' src={assets.new_logo} alt="MediQ" />
              <span className='text-3xl font-bold text-primary bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
                MediQ
              </span>
            </div>
            
            <p className='text-gray-700 text-lg leading-8 max-w-2xl font-medium'>
              Connecting patients with trusted healthcare professionals worldwide. Our platform makes it easy to find, 
              book appointments with qualified doctors, and receive the best medical care from the comfort of your home. 
              Your health is our priority.
            </p>
            
            {/* Social Media Links */}
            <div className='flex gap-4 pt-4'>
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  className={`w-14 h-14 bg-white rounded-2xl shadow-lg border-2 border-gray-200 flex items-center justify-center cursor-pointer text-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl ${social.color}`}
                  title={social.name}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
              <span className='text-3xl'>🏢</span>
              QUICK LINKS
            </h3>
            <ul className='space-y-4'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => navigate(link.path)}
                    className='text-gray-700 hover:text-primary transition-all duration-300 flex items-center gap-3 group text-lg font-medium'
                  >
                    <span className='w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform duration-300'></span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className='space-y-6'>
            <h3 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
              <span className='text-3xl'>📞</span>
              CONTACT US
            </h3>
            <ul className='space-y-5'>
              <li className='flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-all duration-300'>
                <div className='w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                  <span className='text-2xl text-primary'>📱</span>
                </div>
                <div>
                  <p className='font-bold text-gray-900 text-lg'>+91-7070794530</p>
                  <p className='text-gray-600 text-base'>24/7 Helpline</p>
                </div>
              </li>
              
              <li className='flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-all duration-300'>
                <div className='w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                  <span className='text-2xl text-primary'>📧</span>
                </div>
                <div>
                  <p className='font-bold text-gray-900 text-lg'>support@mediq.com</p>
                  <p className='text-gray-600 text-base'>Email Support</p>
                </div>
              </li>
              
              <li className='flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-all duration-300'>
                <div className='w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                  <span className='text-2xl text-primary'>🌐</span>
                </div>
                <div>
                  <p className='font-bold text-gray-900 text-lg'>Code4Care.com</p>
                  <p className='text-gray-600 text-base'>Developer Portal</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className='border-t-2 border-gray-200 my-12' />

        {/* Bottom Section */}
        <div className='flex flex-col lg:flex-row justify-between items-center gap-6'>
          <p className='text-gray-700 text-lg font-medium text-center lg:text-left'>
            © {currentYear} <span className='font-bold text-primary'>MediQ Healthcare</span> - All rights reserved. 
            <span className='text-red-500 mx-2'>❤️</span> 
            Made with passion for better healthcare worldwide.
          </p>
          
          <div className='flex gap-6 text-lg font-medium'>
            <button className='text-gray-600 hover:text-primary transition-colors duration-300'>
              Terms
            </button>
            <button className='text-gray-600 hover:text-primary transition-colors duration-300'>
              Privacy
            </button>
            <button className='text-gray-600 hover:text-primary transition-colors duration-300'>
              Cookies
            </button>
          </div>
        </div>

        {/* Trust Badge */}
        <div className='text-center mt-10 pt-6 border-t-2 border-dashed border-gray-200'>
          <div className='inline-flex items-center gap-3 bg-green-50 px-6 py-3 rounded-2xl border-2 border-green-200'>
            <span className='text-2xl'>✅</span>
            <span className='text-green-800 font-bold text-lg'>Verified & Secure Healthcare Platform</span>
            <span className='text-2xl'>🛡️</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer