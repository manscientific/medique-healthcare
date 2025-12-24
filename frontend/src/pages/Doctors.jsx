import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const navigate = useNavigate()

  const { doctors, currency } = useContext(AppContext)

  const specialities = [
    'General physician', 'Gynecologist', 'Dermatologist', 
    'Pediatricians', 'Neurologist', 'Gastroenterologist',
    'Cardiologist', 'Orthopedic', 'Psychiatrist', 'Dentist'
  ]

  const applyFilter = () => {
    let filtered = doctors

    // Filter by speciality
    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.degree.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience)
        case 'fees':
          return parseInt(a.fees) - parseInt(b.fees)
        case 'rating':
          return (b.rating || 4.5) - (a.rating || 4.5)
        default:
          return 0
      }
    })

    setFilterDoc(filtered)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, searchTerm, sortBy])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-8xl mx-auto'>
        
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl lg:text-5xl font-black text-gray-900 mb-4'>
            Find Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Medical Expert</span>
          </h1>
          <p className='text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
            Browse through our team of certified healthcare professionals dedicated to your well-being
          </p>
        </div>

        {/* Search and Controls Section */}
        <div className='mb-8 space-y-6'>
          
          {/* Search Bar */}
          <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-6'>
            <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
              <div className='relative flex-1 w-full'>
                <input
                  type='text'
                  placeholder='Search doctors by name, speciality, or expertise...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pl-14'
                />
                <span className='absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500'>🔍</span>
              </div>

              {/* Sort Dropdown */}
              <div className='flex items-center gap-4'>
                <label className='text-lg font-semibold text-gray-700'>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                >
                  <option value="name">Name</option>
                  <option value="experience">Experience</option>
                  <option value="fees">Fees (Low to High)</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden'>
            
            {/* Filter Header */}
            <div className='bg-gradient-to-r from-primary/10 to-blue-100/50 border-b-2 border-gray-200 px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary p-3 rounded-xl'>
                    <div className='text-xl text-white'>⚡</div>
                  </div>
                  <h2 className='text-2xl font-black text-gray-900'>Filter by Speciality</h2>
                </div>
                
                {/* Mobile Filter Toggle */}
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className='lg:hidden bg-primary text-white px-4 py-2 rounded-2xl font-bold text-lg flex items-center gap-2'
                >
                  <span>⚙️</span>
                  {showFilter ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>

            {/* Speciality Filters */}
            <div className={`p-6 ${showFilter ? 'block' : 'hidden lg:block'}`}>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <button
                  onClick={() => navigate('/doctors')}
                  className={`p-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 ${
                    !speciality 
                      ? 'bg-primary text-white border-primary shadow-lg' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  👨‍⚕️ All Doctors
                </button>
                
                {specialities.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                    className={`p-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 border-2 ${
                      speciality === spec 
                        ? 'bg-primary text-white border-primary shadow-lg' 
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className='mb-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-xl text-gray-700'>
            Showing <span className='font-black text-primary'>{filterDoc.length}</span> doctors
            {speciality && <span> in <span className='font-black'>{speciality}</span></span>}
            {searchTerm && <span> matching "<span className='font-black'>{searchTerm}</span>"</span>}
          </p>
          
          {filterDoc.length > 0 && (
            <div className='flex items-center gap-4 text-lg'>
              <span className='text-green-600 font-bold'>
                {filterDoc.filter(doc => doc.available).length} Available
              </span>
              <span className='text-gray-400'>•</span>
              <span className='text-gray-600'>
                {filterDoc.filter(doc => !doc.available).length} Busy
              </span>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {filterDoc.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {filterDoc.map((doctor) => (
              <div 
                key={doctor._id}
                onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0) }}
                className='group bg-white rounded-3xl shadow-xl hover:shadow-2xl border-2 border-gray-100 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-500'
              >
                {/* Doctor Image */}
                <div className='relative h-64 bg-gradient-to-br from-primary/10 to-blue-50 overflow-hidden'>
                  <img 
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                    src={doctor.image} 
                    alt={`Dr. ${doctor.name}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300/3B82F6/FFFFFF?text=👨‍⚕️'
                    }}
                  />
                  
                  {/* Availability Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-2xl text-sm font-bold ${
                    doctor.available 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {doctor.available ? 'AVAILABLE' : 'BUSY'}
                  </div>

                  {/* Experience Badge */}
                  <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl text-sm font-bold text-gray-800'>
                    {doctor.experience} years
                  </div>

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6'>
                    <button className='bg-white text-primary px-6 py-3 rounded-2xl font-bold text-lg shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500'>
                      Book Appointment →
                    </button>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <div className={`w-3 h-3 rounded-full ${
                        doctor.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-lg font-semibold ${
                        doctor.available ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {doctor.available ? 'Available Today' : 'Not Available'}
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className='flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-2xl'>
                      <span className='text-yellow-500 text-lg'>⭐</span>
                      <span className='font-bold text-primary'>{doctor.rating || '4.9'}</span>
                    </div>
                  </div>
                  
                  <h3 className='text-2xl font-black text-gray-900 mb-2 leading-tight'>
                    Dr. {doctor.name}
                  </h3>
                  
                  <p className='text-xl text-primary font-bold mb-3'>
                    {doctor.speciality}
                  </p>
                  
                  <p className='text-gray-600 text-lg mb-4'>
                    {doctor.degree}
                  </p>
                  
                  {/* Additional Details */}
                  <div className='space-y-2 text-gray-600'>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold'>Consultation Fee:</span>
                      <span className='font-black text-gray-900 text-lg'>{currency} {doctor.fees}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='font-semibold'>Experience:</span>
                      <span className='font-bold text-gray-800'>{doctor.experience} years</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-16 text-center'>
            <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg'>
              <span className='text-6xl'>👨‍⚕️</span>
            </div>
            <h3 className='text-3xl font-black text-gray-700 mb-4'>No Doctors Found</h3>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
              {searchTerm 
                ? `No doctors found matching "${searchTerm}". Try a different search term or browse all doctors.`
                : speciality
                ? `No doctors available in ${speciality} at the moment. Please check back later.`
                : 'No doctors available at the moment. Please check back later.'
              }
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  navigate('/doctors')
                }}
                className='bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all duration-300'
              >
                View All Doctors
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className='border-2 border-primary text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/5 transition-all duration-300'
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

        {/* Load More Section (if needed) */}
        {filterDoc.length > 0 && filterDoc.length >= 12 && (
          <div className='text-center mt-12'>
            <button className='bg-gradient-to-r from-primary to-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3'>
              <span>📋</span>
              Load More Doctors
              <span>↓</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors