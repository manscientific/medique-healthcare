import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <section className='relative overflow-hidden my-24 mx-5 lg:mx-12'>
            <div className='relative bg-gradient-to-r from-primary via-primary/95 to-blue-700 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/20'>
                
                {/* Animated Background */}
                <div className='absolute inset-0 opacity-10'>
                    <div className='absolute inset-0' style={{
                        backgroundImage: `radial-gradient(circle at 3px 3px, white 3px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                {/* Floating Medical Elements */}
                <div className='absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2'></div>
                <div className='absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2'></div>
                <div className='absolute top-1/4 left-1/4 text-6xl opacity-10'>❤️</div>
                <div className='absolute bottom-1/3 right-1/3 text-5xl opacity-10'>🏥</div>

                <div className='relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-10 lg:p-14'>
                    
                    {/* Content Section */}
                    <div className='text-center lg:text-left z-10'>
                        <div className='max-w-2xl mx-auto lg:mx-0'>
                            
                            {/* Promotional Badge */}
                            <div className='inline-flex items-center gap-3 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-lg font-black mb-8 border-2 border-white/30'>
                                <span className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></span>
                                LIMITED TIME OFFER - GET 20% OFF FIRST APPOINTMENT
                            </div>

                            {/* Main Heading */}
                            <h2 className='text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-6'>
                                Ready to Book Your 
                                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300 mt-4'>
                                    First Appointment?
                                </span>
                            </h2>

                            {/* Description */}
                            <p className='text-xl lg:text-2xl text-white/95 mb-10 leading-relaxed font-semibold'>
                                Join thousands of patients who trust MediQ for their healthcare needs. 
                                Get started today and experience seamless doctor appointments with 
                                our certified medical professionals.
                            </p>

                            {/* Features Grid */}
                            <div className='grid grid-cols-2 gap-5 mb-10'>
                                {[
                                    { icon: '✅', text: '100+ Verified Doctors', color: 'text-green-300' },
                                    { icon: '⚡', text: 'Instant Booking', color: 'text-yellow-300' },
                                    { icon: '🛡️', text: 'Secure & Private', color: 'text-blue-300' },
                                    { icon: '⭐', text: '4.9/5 Rating', color: 'text-yellow-300' }
                                ].map((feature, index) => (
                                    <div key={index} className='flex items-center gap-3 text-white/95 bg-white/10 p-4 rounded-2xl backdrop-blur-sm'>
                                        <span className={`text-2xl ${feature.color}`}>{feature.icon}</span>
                                        <span className='font-semibold text-lg'>{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Call-to-Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-5 justify-center lg:justify-start'>
                                <button 
                                    onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                                    className='group bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 border-2 border-white min-w-64'
                                >
                                    <span className='text-2xl'>👤</span>
                                    <span>CREATE FREE ACCOUNT</span>
                                    <span className='text-2xl group-hover:translate-x-2 transition-transform duration-200'>→</span>
                                </button>
                                
                                <button 
                                    onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                                    className='group border-3 border-white text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-4 min-w-64'
                                >
                                    <span className='text-2xl'>👨‍⚕️</span>
                                    <span>BROWSE DOCTORS</span>
                                    <span className='group-hover:translate-x-2 transition-transform duration-200'>→</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className='relative z-10 flex justify-center'>
                        <div className='relative max-w-md lg:max-w-lg'>
                            
                            {/* Main Appointment Image */}
                            <img 
                                className='w-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-4 border-white/20' 
                                src={assets.appointment_img} 
                                alt="Healthcare Appointment Booking" 
                            />
                            
                            {/* Floating Statistics Card */}
                            <div className='absolute -top-5 -right-5 bg-white rounded-3xl p-1 shadow-2xl animate-bounce-slow border-2 border-primary/20'>
                                <div className='text-center'>
                                    <div className='text-4xl text-primary mb-2'>👥</div>
                                    <p className='font-black text-gray-900 text-2xl'>10K+</p>
                                    <p className='text-gray-600 font-semibold text-lg'>Happy Patients</p>
                                </div>
                            </div>

                            {/* Floating Review Card */}
                            <div className='absolute -bottom-5 -left-5 bg-white rounded-3xl p-5 shadow-2xl animate-float border-2 border-primary/20'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <div className='flex text-2xl text-yellow-400'>
                                        ⭐⭐⭐⭐⭐
                                    </div>
                                    <p className='font-black text-gray-900 text-xl'>4.9/5</p>
                                </div>
                                <p className='text-gray-600 font-semibold text-lg'>Trusted Reviews</p>
                            </div>

                            {/* Success Rate Badge */}
                            <div className='absolute top-1/2 -left-10 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-2xl  font-black text-lg whitespace-nowrap'>
                                🎯 99% SUCCESS RATE
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Wave Effect */}
                <div className='absolute bottom-0 left-0 right-0'>
                    <svg className='w-full h-12 text-white/50' viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        </section>
    )
}

export default Banner