import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState({})

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const filteredAppointments = appointments.filter(appointment => {
    switch (filter) {
      case 'active':
        return !appointment.cancelled && !appointment.isCompleted
      case 'completed':
        return appointment.isCompleted
      case 'cancelled':
        return appointment.cancelled
      default:
        return true
    }
  })

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    
    setLoading(prev => ({ ...prev, [appointmentId]: true }))
    await cancelAppointment(appointmentId)
    setLoading(prev => ({ ...prev, [appointmentId]: false }))
  }

  const handleCompleteAppointment = async (appointmentId) => {
    if (!window.confirm('Mark this appointment as completed?')) return
    
    setLoading(prev => ({ ...prev, [appointmentId]: true }))
    await completeAppointment(appointmentId)
    setLoading(prev => ({ ...prev, [appointmentId]: false }))
  }

  const stats = {
    total: appointments.length,
    active: appointments.filter(a => !a.cancelled && !a.isCompleted).length,
    completed: appointments.filter(a => a.isCompleted).length,
    cancelled: appointments.filter(a => a.cancelled).length
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-8xl mx-auto'>

        {/* Header Section */}
        <div className='mb-12 text-center'>
          <h1 className='text-4xl lg:text-5xl font-black text-gray-900 mb-4'>
            Appointment <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Management</span>
          </h1>
          <p className='text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
            Manage and track all patient appointments with our comprehensive dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {[
            { 
              label: 'Total Appointments', 
              value: stats.total, 
              color: 'blue',
              icon: '📅'
            },
            { 
              label: 'Active Appointments', 
              value: stats.active, 
              color: 'green',
              icon: '👥'
            },
            { 
              label: 'Completed', 
              value: stats.completed, 
              color: 'emerald',
              icon: '✅'
            },
            { 
              label: 'Cancelled', 
              value: stats.cancelled, 
              color: 'red',
              icon: '❌'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className='bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-6 text-center transform hover:scale-105 transition-all duration-300'
            >
              <div className={`text-4xl mb-3 text-${stat.color}-500`}>
                {stat.icon}
              </div>
              <div className='text-3xl lg:text-4xl font-black text-gray-900 mb-2'>
                {stat.value}
              </div>
              <div className='text-lg font-semibold text-gray-600'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className='bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-6 mb-8'>
          <h3 className='text-2xl font-black text-gray-900 mb-4'>Filter Appointments</h3>
          <div className='flex flex-wrap gap-4'>
            {[
              { key: 'all', label: 'All Appointments', icon: '📋' },
              { key: 'active', label: 'Active', icon: '🟢' },
              { key: 'completed', label: 'Completed', icon: '✅' },
              { key: 'cancelled', label: 'Cancelled', icon: '❌' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                  filter === filterOption.key
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/50'
                }`}
              >
                <span className='text-xl'>{filterOption.icon}</span>
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Table */}
        <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden'>

          {/* Table Header */}
          <div className='bg-gradient-to-r from-primary/10 to-blue-100/50 border-b-2 border-gray-200'>
            <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr_1fr_1.5fr] gap-6 py-6 px-8'>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide'>#</p>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide'>Patient Details</p>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide'>Payment</p>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide'>Age</p>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide'>Date & Time</p>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide'>Fees</p>
              <p className='font-black text-gray-700 text-lg uppercase tracking-wide text-center'>Actions</p>
            </div>
          </div>

          {/* Table Body */}
          <div className='max-h-[70vh] overflow-y-auto'>
            {filteredAppointments.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 px-8 text-center'>
                <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg'>
                  <span className='text-6xl'>📅</span>
                </div>
                <h3 className='text-3xl font-black text-gray-700 mb-4'>No Appointments Found</h3>
                <p className='text-xl text-gray-600 max-w-md mb-8'>
                  {filter === 'all' 
                    ? "No appointments scheduled yet. New appointments will appear here automatically."
                    : `No ${filter} appointments found.`
                  }
                </p>
                {filter !== 'all' && (
                  <button
                    onClick={() => setFilter('all')}
                    className='bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all duration-300'
                  >
                    View All Appointments
                  </button>
                )}
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
                <div 
                  className={`flex flex-wrap justify-between max-sm:gap-6 max-sm:text-lg sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_1.5fr_1fr_1.5fr] gap-6 items-center py-6 px-8 border-b-2 border-gray-100 transition-all duration-300 hover:bg-blue-50/50 group ${
                    item.cancelled ? 'bg-red-50/30' : item.isCompleted ? 'bg-green-50/30' : ''
                  }`} 
                  key={item._id}
                >
                  
                  {/* Index */}
                  <p className='max-sm:hidden text-gray-500 font-black text-lg'>{index + 1}</p>
                  
                  {/* Patient Information */}
                  <div className='flex items-center gap-4 min-w-0 flex-1'>
                    <div className='relative'>
                      <img 
                        src={item.userData.image} 
                        className='w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover group-hover:scale-110 transition-transform duration-300' 
                        alt={item.userData.name} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64/3B82F6/FFFFFF?text=👤'
                        }}
                      />
                      {!item.cancelled && !item.isCompleted && (
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full animate-pulse'></div>
                      )}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='font-black text-gray-900 text-xl mb-1 truncate'>{item.userData.name}</p>
                      <p className='text-gray-600 text-lg truncate'>{item.userData.email}</p>
                      <p className='text-gray-500 text-base truncate'>{item.userData.phone || 'No phone'}</p>
                    </div>
                  </div>
                  
                  {/* Payment Status */}
                  <div>
                    <span className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-base font-black border-2 ${
                      item.payment 
                        ? 'bg-green-100 text-green-800 border-green-300' 
                        : 'bg-orange-100 text-orange-800 border-orange-300'
                    }`}>
                      {item.payment ? '💳 Online' : '💰 Cash'}
                    </span>
                  </div>
                  
                  {/* Age */}
                  <div className='max-sm:hidden'>
                    <p className='font-black text-gray-900 text-xl text-center'>{calculateAge(item.userData.dob)}</p>
                    <p className='text-gray-600 text-sm text-center'>Years</p>
                  </div>
                  
                  {/* Date & Time */}
                  <div className='min-w-0'>
                    <p className='font-black text-gray-900 text-xl mb-1'>{slotDateFormat(item.slotDate)}</p>
                    <p className='text-gray-600 text-lg'>{item.slotTime}</p>
                    <p className='text-gray-500 text-sm'>{new Date().toLocaleDateString() === slotDateFormat(item.slotDate) ? 'Today' : ''}</p>
                  </div>
                  
                  {/* Fees */}
                  <div className='text-right'>
                    <p className='font-black text-gray-900 text-2xl'>{currency}{item.amount}</p>
                    <p className='text-gray-600 text-sm'>Appointment Fee</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-center'>
                    {item.cancelled ? (
                      <span className='inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-100 text-red-800 text-base font-black border-2 border-red-300'>
                        ❌ Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className='inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-100 text-green-800 text-base font-black border-2 border-green-300'>
                        ✅ Completed
                      </span>
                    ) : (
                      <div className='flex items-center gap-3 bg-gray-100 rounded-2xl p-2 border-2 border-gray-200'>
                        <button 
                          onClick={() => handleCancelAppointment(item._id)}
                          disabled={loading[item._id]}
                          className='p-3 rounded-xl hover:bg-red-100 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed'
                          title='Cancel Appointment'
                        >
                          {loading[item._id] ? (
                            <div className='w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin'></div>
                          ) : (
                            <div className='flex items-center gap-2'>
                              <img 
                                className='w-7 h-7 group-hover:scale-110 transition-transform duration-200' 
                                src={assets.cancel_icon} 
                                alt="Cancel" 
                              />
                              <span className='text-red-600 font-bold text-sm hidden lg:block'>Cancel</span>
                            </div>
                          )}
                        </button>
                        
                        <div className='w-0.5 h-8 bg-gray-300'></div>
                        
                        <button 
                          onClick={() => handleCompleteAppointment(item._id)}
                          disabled={loading[item._id]}
                          className='p-3 rounded-xl hover:bg-green-100 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed'
                          title='Complete Appointment'
                        >
                          {loading[item._id] ? (
                            <div className='w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin'></div>
                          ) : (
                            <div className='flex items-center gap-2'>
                              <img 
                                className='w-7 h-7 group-hover:scale-110 transition-transform duration-200' 
                                src={assets.tick_icon} 
                                alt="Complete" 
                              />
                              <span className='text-green-600 font-bold text-sm hidden lg:block'>Complete</span>
                            </div>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Footer */}
          {filteredAppointments.length > 0 && (
            <div className='bg-gradient-to-r from-gray-50 to-blue-50/50 border-t-2 border-gray-200 px-8 py-6'>
              <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                <p className='text-xl font-black text-gray-700'>
                  Showing <span className='text-primary'>{filteredAppointments.length}</span> appointment{filteredAppointments.length !== 1 ? 's' : ''}
                  {filter !== 'all' && <span> ({filter})</span>}
                </p>
                
                <div className='flex flex-wrap items-center gap-6'>
                  {[
                    { label: 'Active', count: stats.active, color: 'green' },
                    { label: 'Completed', count: stats.completed, color: 'emerald' },
                    { label: 'Cancelled', count: stats.cancelled, color: 'red' }
                  ].map((stat, index) => (
                    <div key={index} className='flex items-center gap-3'>
                      <div className={`w-4 h-4 bg-${stat.color}-500 rounded-full`}></div>
                      <span className='text-lg font-semibold text-gray-700'>{stat.label}:</span>
                      <span className='text-lg font-black text-gray-900'>{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        

      </div>
    </div>
  )
}

export default DoctorAppointments