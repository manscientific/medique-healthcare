import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30'>
      
      {/* Header/Hero Section */}
      <section className='relative overflow-hidden bg-white'>
        <Header />
      </section>

      {/* Specialities Section */}
      <section id='speciality' className='py-20 bg-gradient-to-b from-white to-gray-50/50'>
        <div className='max-w-8xl mx-auto px-6 sm:px-8 lg:px-10'>
          <div className='text-center mb-16'>
            <h2 className='text-5xl lg:text-6xl font-black text-gray-900 mb-6'>
              Our <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Medical</span> Specialities
            </h2>
            <p className='text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium'>
              Explore our comprehensive range of medical specialities. Find the right specialist 
              for your healthcare needs from our team of certified professionals.
            </p>
          </div>
          <SpecialityMenu />
        </div>
      </section>

      {/* Top Doctors Section */}
      <section className='py-20 bg-gradient-to-b from-gray-50/50 to-white'>
        <div className='max-w-8xl mx-auto px-6 sm:px-8 lg:px-10'>
          <div className='text-center mb-16'>
            <h2 className='text-5xl lg:text-6xl font-black text-gray-900 mb-6'>
              Meet Our <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Expert</span> Doctors
            </h2>
            <p className='text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium'>
              Connect with highly qualified medical professionals dedicated to providing 
              exceptional healthcare services with compassion and expertise.
            </p>
          </div>
          <TopDoctors />
        </div>
      </section>

      {/* Banner/CTA Section */}
      <section className='relative z-10 bg-white'>
        <Banner />
      </section>

      {/* Trust Badge Section */}
      <section className='py-16 bg-gradient-to-r from-green-50 to-blue-50'>
        <div className='max-w-8xl mx-auto px-6 sm:px-8 lg:px-10 text-center'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              { icon: '🏆', title: 'Award Winning', desc: 'Recognized healthcare excellence' },
              { icon: '🔒', title: '100% Secure', desc: 'Your data is protected' },
              { icon: '💯', title: 'Quality Assured', desc: 'Verified medical professionals' }
            ].map((item, index) => (
              <div key={index} className='bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300'>
                <div className='text-5xl mb-4'>{item.icon}</div>
                <h3 className='text-2xl font-black text-gray-900 mb-3'>{item.title}</h3>
                <p className='text-lg text-gray-700 font-medium'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home