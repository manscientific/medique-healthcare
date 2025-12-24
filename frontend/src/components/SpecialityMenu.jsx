import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <section id='speciality' className='relative py-20 bg-gradient-to-br from-white to-blue-50/30'>
            <div className='max-w-8xl mx-auto px-6 sm:px-8 lg:px-10'>
                
                {/* Section Header */}
                <div className='text-center mb-16'>
                    <h2 className='text-4xl lg:text-5xl font-black text-gray-900 mb-6'>
                        Find by <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Medical Speciality</span>
                    </h2>
                    <p className='text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium'>
                        Browse through our comprehensive range of medical specialities. Find the perfect specialist 
                        for your healthcare needs from our team of certified medical professionals.
                    </p>
                </div>

                {/* Speciality Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 lg:gap-8'>
                    {specialityData.map((item, index) => (
                        <Link 
                            to={`/doctors/${item.speciality}`} 
                            onClick={() => scrollTo(0, 0)} 
                            className='group relative flex flex-col items-center text-center cursor-pointer transform hover:scale-110 transition-all duration-500 ease-out'
                            key={index}
                        >
                            {/* Speciality Card */}
                            <div className='relative w-full aspect-square bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-gray-100 p-4 mb-4 overflow-hidden transition-all duration-300 group-hover:border-primary/30'>
                                
                                {/* Background Effect */}
                                <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                
                                {/* Icon Container */}
                                <div className='relative w-full h-full flex items-center justify-center'>
                                    <img 
                                        className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3' 
                                        src={item.image} 
                                        alt={item.speciality}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100/3B82F6/FFFFFF?text=🏥'
                                        }}
                                    />
                                    
                                    {/* Hover Effect */}
                                    <div className='absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-2xl transition-all duration-300'></div>
                                </div>

                                {/* Pulse Animation Dot */}
                                <div className='absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300'></div>
                            </div>

                            {/* Speciality Name */}
                            <div className='text-center px-2'>
                           <h3 className='text-lg lg:text-xl font-black text-gray-900 mb-4 leading-tight hidden group-hover:block transition-colors duration-300'>
    {item.speciality}
</h3>
                                <div className='flex items-center justify-center gap-1 text-sm text-gray-600 font-medium'>
                                    <span>👨‍⚕️</span>
                                    <span>50+ Doctors</span>
                                </div>
                            </div>

                            {/* Hover Arrow Indicator */}
                            <div className='absolute -bottom-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                                <div className='bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg'>
                                    View →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Call to Action */}
                <div className='text-center mt-16'>
                    <div className='bg-gradient-to-r from-primary/10 to-blue-100/50 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto border-2 border-primary/20'>
                        <h3 className='text-3xl lg:text-4xl font-black text-gray-900 mb-4'>
                            Can't Find Your Speciality?
                        </h3>
                        <p className='text-xl text-gray-700 mb-6 font-medium'>
                            We're constantly expanding our network of medical specialists. 
                            Contact us to request a specific speciality or get personalized recommendations.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <Link 
                                to='/contact'
                                className='bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3'
                            >
                                <span>📞</span>
                                <span>Contact Support</span>
                            </Link>
                            <Link 
                                to='/doctors'
                                className='border-2 border-primary text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/5 transition-all duration-300 inline-flex items-center gap-3'
                            >
                                <span>👨‍⚕️</span>
                                <span>Browse All Doctors</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-16'>
                    {[
                        { icon: '🏥', number: '50+', label: 'Medical Specialities' },
                        { icon: '👨‍⚕️', number: '500+', label: 'Expert Doctors' },
                        { icon: '⭐', number: '4.9/5', label: 'Patient Rating' },
                        { icon: '🌍', number: '24/7', label: 'Available Worldwide' }
                    ].map((stat, index) => (
                        <div key={index} className='text-center bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300'>
                            <div className='text-4xl mb-3'>{stat.icon}</div>
                            <div className='text-3xl font-black text-primary mb-2'>{stat.number}</div>
                            <div className='text-lg font-semibold text-gray-700'>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Decorations */}
            <div className='absolute top-10 left-5 text-6xl opacity-5'>❤️</div>
            <div className='absolute bottom-10 right-5 text-6xl opacity-5'>💊</div>
            
            {/* Wave Divider */}
            <div className='absolute bottom-0 left-0 right-0'>
                <svg className='w-full h-12 text-white' viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                </svg>
            </div>
        </section>
    )
}

export default SpecialityMenu