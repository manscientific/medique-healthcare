import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [loading, setLoading] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

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

  if (!dashData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-3xl font-black text-gray-700 mb-3">Loading Dashboard...</h2>
          <p className="text-xl text-gray-600">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-8xl mx-auto'>

        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl lg:text-5xl font-black text-gray-900 mb-4'>
            Doctor <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Dashboard</span>
          </h1>
          <p className='text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
            Welcome back! Here's your comprehensive practice overview and management panel
          </p>
        </div>

        {/* Statistics Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
          {/* Total Earnings Card */}
          <div className='bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <p className='text-blue-100 text-lg font-semibold mb-3'>Total Earnings</p>
                <p className='text-4xl lg:text-5xl font-black mb-2'>{currency} {dashData.earnings}</p>
                <p className='text-blue-200 text-base'>Lifetime revenue from appointments</p>
              </div>
              <div className='bg-white/20 p-5 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500'>
                <div className='text-3xl'>💰</div>
              </div>
            </div>
            <div className='mt-6 pt-4 border-t border-blue-400/30'>
              <div className='flex items-center gap-2 text-blue-200'>
                <span className='text-lg'>📈</span>
                <span className='font-semibold'>Steady growth</span>
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className='bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <p className='text-green-100 text-lg font-semibold mb-3'>Total Appointments</p>
                <p className='text-4xl lg:text-5xl font-black mb-2'>{dashData.appointments}</p>
                <p className='text-green-200 text-base'>Successful patient bookings</p>
              </div>
              <div className='bg-white/20 p-5 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500'>
                <div className='text-3xl'>📅</div>
              </div>
            </div>
            <div className='mt-6 pt-4 border-t border-green-400/30'>
              <div className='flex items-center gap-2 text-green-200'>
                <span className='text-lg'>👥</span>
                <span className='font-semibold'>{dashData.patients} unique patients</span>
              </div>
            </div>
          </div>

         
        </div>

        {/* Quick Actions Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          
          {/* Verification Panel Card */}
          <div 
            onClick={() => navigate('/verify')}
            className='bg-white p-8 rounded-3xl shadow-2xl border-2 border-gray-100 cursor-pointer hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group hover:border-blue-300'
          >
            <div className='flex items-center gap-6'>
              <div className='bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500'>
                <div className='text-3xl text-white'>🔐</div>
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl lg:text-3xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3'>
                  Verification Panel
                </h3>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  Advanced face recognition technology for secure patient verification and queue management
                </p>
                <div className='flex items-center gap-2 mt-4 text-blue-600 font-semibold'>
                  <span>Access Secure Panel</span>
                  <span className='group-hover:translate-x-2 transition-transform duration-300'>→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments Management Card */}
          <div 
            onClick={() => navigate('/doctor-appointments')}
            className='bg-white p-8 rounded-3xl shadow-2xl border-2 border-gray-100 cursor-pointer hover:shadow-3xl transition-all duration-500 transform hover:scale-105 group hover:border-green-300'
          >
            <div className='flex items-center gap-6'>
              <div className='bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500'>
                <div className='text-3xl text-white'>👨‍⚕️</div>
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl lg:text-3xl font-black text-gray-900 group-hover:text-green-600 transition-colors duration-300 mb-3'>
                  Manage Appointments
                </h3>
                <p className='text-lg text-gray-700 leading-relaxed'>
                  Comprehensive appointment management system with real-time updates and patient communication
                </p>
                <div className='flex items-center gap-2 mt-4 text-green-600 font-semibold'>
                  <span>View All Appointments</span>
                  <span className='group-hover:translate-x-2 transition-transform duration-300'>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments Section */}
        <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden'>
          
          {/* Section Header */}
          <div className='bg-gradient-to-r from-primary/10 to-blue-100/50 border-b-2 border-gray-200 px-8 py-6'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='bg-primary p-4 rounded-2xl'>
                  <div className='text-2xl text-white'>📋</div>
                </div>
                <div>
                  <h2 className='text-3xl font-black text-gray-900'>Recent Appointments</h2>
                  <p className='text-xl text-gray-700 mt-2'>Latest patient bookings and their current status</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-black text-primary'>{dashData.latestAppointments.length}</p>
                <p className='text-lg text-gray-600'>Total Recent</p>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className='divide-y-2 divide-gray-100'>
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div 
                className='flex items-center px-8 py-6 gap-6 hover:bg-blue-50/50 transition-all duration-300 group' 
                key={item._id}
              >
                
                {/* Patient Avatar with Status */}
                <div className='relative'>
                  <img 
                    className='w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover group-hover:scale-110 transition-transform duration-300' 
                    src={item.userData.image} 
                    alt={item.userData.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64/3B82F6/FFFFFF?text=👤'
                    }}
                  />
                  {!item.cancelled && !item.isCompleted && (
                    <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full animate-pulse'></div>
                  )}
                </div>

                {/* Patient Information */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <p className='text-2xl font-black text-gray-900 truncate'>{item.userData.name}</p>
                    {item.payment && (
                      <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold border border-green-300'>
                        💳 Paid
                      </span>
                    )}
                  </div>
                  <p className='text-lg text-gray-700 mb-1'>
                    {slotDateFormat(item.slotDate)} • {item.slotTime}
                  </p>
                  <p className='text-gray-600 text-base'>
                    {item.userData.email} • {item.userData.phone || 'No phone'}
                  </p>
                </div>

                {/* Status & Actions */}
                <div className='flex items-center gap-4'>
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
                        className='p-3 rounded-xl hover:bg-red-100 transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Cancel Appointment'
                      >
                        {loading[item._id] ? (
                          <div className='w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <div className='text-2xl group-hover/btn:scale-110 transition-transform duration-200'>❌</div>
                            <span className='text-red-600 font-bold text-sm hidden lg:block'>Cancel</span>
                          </div>
                        )}
                      </button>
                      
                      <div className='w-0.5 h-8 bg-gray-300'></div>
                      
                      <button 
                        onClick={() => handleCompleteAppointment(item._id)}
                        disabled={loading[item._id]}
                        className='p-3 rounded-xl hover:bg-green-100 transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Complete Appointment'
                      >
                        {loading[item._id] ? (
                          <div className='w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                          <div className='flex items-center gap-2'>
                            <div className='text-2xl group-hover/btn:scale-110 transition-transform duration-200'>✅</div>
                            <span className='text-green-600 font-bold text-sm hidden lg:block'>Complete</span>
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {dashData.latestAppointments.length === 0 && (
              <div className='flex flex-col items-center justify-center py-20 px-8 text-center'>
                <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg'>
                  <span className='text-6xl'>📅</span>
                </div>
                <h3 className='text-3xl font-black text-gray-700 mb-4'>No Recent Appointments</h3>
                <p className='text-xl text-gray-600 max-w-md mb-8'>
                  You don't have any appointments scheduled yet. New appointments will appear here automatically.
                </p>
                <button 
                  onClick={() => navigate('/doctor-appointments')}
                  className='bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all duration-300'
                >
                  Check All Appointments
                </button>
              </div>
            )}
          </div>

          {/* View All Footer */}
          {dashData.latestAppointments.length > 0 && (
            <div className='bg-gradient-to-r from-gray-50 to-blue-50/50 border-t-2 border-gray-200 px-8 py-6'>
              <div className='flex items-center justify-between'>
                <button 
                  onClick={() => navigate('/doctor-appointments')}
                  className='text-primary hover:text-blue-700 font-black text-lg flex items-center gap-3 group'
                >
                  <span>View All {dashData.latestAppointments.length}+ Appointments</span>
                  <span className='text-2xl group-hover:translate-x-2 transition-transform duration-300'>→</span>
                </button>
                <div className='text-right'>
                  <p className='text-lg font-semibold text-gray-700'>
                    <span className='text-green-600 font-black'>{dashData.latestAppointments.filter(a => !a.cancelled && !a.isCompleted).length}</span> Active
                  </p>
                  <p className='text-sm text-gray-600'>Appointments pending</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics Section */}
        <div className='mt-12 bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8'>
          <h2 className='text-3xl font-black text-gray-900 mb-8 text-center'>
            Practice <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Performance</span>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-200'>
              <div className='text-4xl text-blue-500 mb-3'>🎯</div>
              <div className='text-2xl font-black text-gray-900 mb-2'>98%</div>
              <div className='text-lg text-gray-700 font-semibold'>Success Rate</div>
            </div>
            
            <div className='text-center p-6 bg-green-50 rounded-2xl border-2 border-green-200'>
              <div className='text-4xl text-green-500 mb-3'>⏱️</div>
              <div className='text-2xl font-black text-gray-900 mb-2'>15 min</div>
              <div className='text-lg text-gray-700 font-semibold'>Avg. Response</div>
            </div>
            
            <div className='text-center p-6 bg-purple-50 rounded-2xl border-2 border-purple-200'>
              <div className='text-4xl text-purple-500 mb-3'>⭐</div>
              <div className='text-2xl font-black text-gray-900 mb-2'>4.9/5</div>
              <div className='text-lg text-gray-700 font-semibold'>Rating</div>
            </div>
            
            <div className='text-center p-6 bg-orange-50 rounded-2xl border-2 border-orange-200'>
              <div className='text-4xl text-orange-500 mb-3'>🔄</div>
              <div className='text-2xl font-black text-gray-900 mb-2'>85%</div>
              <div className='text-lg text-gray-700 font-semibold'>Retention</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DoctorDashboard