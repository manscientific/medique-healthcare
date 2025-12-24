import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()

    return (
        <section className='relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-blue-700 rounded-3xl mx-5 lg:mx-12 mt-8 shadow-2xl'>
            
            {/* Animated Background Pattern */}
            <div className='absolute inset-0 opacity-[0.03]'>
                <div className='absolute inset-0' style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            {/* Floating Medical Icons */}
            <div className='absolute top-10 left-10 text-6xl opacity-20'>🏥</div>
            <div className='absolute bottom-20 right-20 text-5xl opacity-20'>💊</div>
            <div className='absolute top-1/3 right-1/4 text-4xl opacity-20'>❤️</div>

            <div className='relative max-w-8xl mx-auto px-6 sm:px-8 lg:px-12'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[600px] lg:min-h-[700px]'>

                    {/* Content Section */}
                    <div className='py-10 lg:py-16 text-center lg:text-left'>
                        <div className='max-w-2xl mx-auto lg:mx-0'>
                            
                            {/* Trust Badge */}
                            <div className='inline-flex items-center gap-3 bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-lg font-semibold mb-8 border-2 border-white/30'>
                                <span className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></span>
                                TRUSTED BY 50,000+ PATIENTS WORLDWIDE
                            </div>

                            {/* Main Heading */}
                            <h1 className='text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight mb-8'>
                                Find & Book 
                                <span className='block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300 mt-4'>
                                    Top Doctors
                                </span>
                                Near You
                            </h1>

                            {/* Description */}
                            <p className='text-xl lg:text-2xl text-white/95 mb-10 leading-relaxed font-medium'>
                                Connect instantly with certified healthcare professionals. Book appointments, 
                                get medical advice, and receive world-class care from the comfort of your home. 
                                Your health journey starts here.
                            </p>

                            {/* Statistics */}
                            <div className='flex items-center justify-center lg:justify-start gap-8 mb-10'>
                                <div className='text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl min-w-28'>
                                    <div className='text-3xl font-black text-white'>100+</div>
                                    <div className='text-white/90 text-lg font-medium'>Expert Doctors</div>
                                </div>
                                <div className='text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl min-w-28'>
                                    <div className='text-3xl font-black text-white'>24/7</div>
                                    <div className='text-white/90 text-lg font-medium'>Available</div>
                                </div>
                                <div className='text-center bg-white/10 backdrop-blur-sm p-4 rounded-2xl min-w-28'>
                                    <div className='text-3xl font-black text-white'>98%</div>
                                    <div className='text-white/90 text-lg font-medium'>Satisfaction</div>
                                </div>
                            </div>

                            {/* Call-to-Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-5 justify-center lg:justify-start'>
                                <button 
                                    onClick={() => navigate('/doctors')}
                                    className='group bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4 border-2 border-white'
                                >
                                    <span className='text-2xl'>👨‍⚕️</span>
                                    <span>BOOK APPOINTMENT NOW</span>
                                    <span className='text-2xl group-hover:translate-x-2 transition-transform duration-200'>→</span>
                                </button>
                                
                                <button 
                                    onClick={() => navigate('/about')}
                                    className='group border-3 border-white text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-4'
                                >
                                    <span>📖</span>
                                    <span>LEARN MORE</span>
                                    <span className='group-hover:translate-x-2 transition-transform duration-200'>→</span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className='flex items-center justify-center lg:justify-start gap-5 mt-12'>
                                <img 
                                    className='w-36 opacity-95' 
                                    src={assets.group_profiles} 
                                    alt="Trusted users" 
                                />
                                <div className='text-white/95 text-lg font-semibold'>
                                    <p>Join <span className='font-black text-white'>50,000+</span> satisfied patients</p>
                                    <p>Rated <span className='font-black text-yellow-300'>4.9/5</span> by our community</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className='relative lg:py-20 flex justify-center lg:justify-end'>
                        <div className='relative max-w-lg lg:max-w-2xl'>
                            
                            {/* Main Hero Image */}
                            <img 
                                className='w-full rounded-3xl shadow-2xl transform hover:scale-102 transition-transform duration-700 border-4 border-white/20' 
                                src={assets.header_img} 
                                alt="Healthcare Professionals Team" 
                            />
                            
                            {/* Floating Doctor Card */}
                            <div className='absolute -top-5 -right-5 bg-white rounded-3xl p-5 shadow-2xl animate-float border-2 border-primary/20'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl'>
                                        👨‍⚕️
                                    </div>
                                    <div>
                                        <p className='font-black text-gray-900 text-lg'>Dr. Smith</p>
                                        <p className='text-gray-600 font-semibold'>Cardiologist</p>
                                        <p className='text-yellow-500 font-bold'>⭐ 4.9/5</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Rating Card */}
                            <div className='absolute -bottom-5 -left-5 bg-white rounded-3xl p-5 shadow-2xl animate-float border-2 border-primary/20' style={{animationDelay: '2s'}}>
                                <div className='text-center'>
                                    <div className='text-4xl text-primary mb-2'>⭐⭐⭐⭐⭐</div>
                                    <p className='font-black text-gray-900 text-xl'>4.9/5</p>
                                    <p className='text-gray-600 font-semibold'>Patient Rating</p>
                                </div>
                            </div>

                            {/* Emergency Badge */}
                            <div className='absolute bottom-1/5 -right-10 bg-red-500 text-white px-4 py-3 rounded-2xl shadow-2xl  font-black text-lg'>
                                🚨 24/7 EMERGENCY
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Wave Decoration */}
            <div className='absolute bottom-0 left-0 right-0'>
                <svg className='w-full h-20 text-white' viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                </svg>
            </div>
        </section>
    )
}

export default Header