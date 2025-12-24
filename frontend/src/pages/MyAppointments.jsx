import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {
    const { backendUrl, token, currency } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [loading, setLoading] = useState({})
    const [filter, setFilter] = useState('all')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to fetch appointments')
        }
    }

    const cancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return
        
        setLoading(prev => ({ ...prev, [appointmentId]: true }))
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success('Appointment cancelled successfully')
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to cancel appointment')
        } finally {
            setLoading(prev => ({ ...prev, [appointmentId]: false }))
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'MediQ Appointment Payment',
            description: "Secure payment for your medical appointment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        toast.success('Payment completed successfully!')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error('Payment verification failed')
                }
            },
            theme: {
                color: '#3B82F6'
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {
        setLoading(prev => ({ ...prev, [appointmentId]: true }))
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Payment failed')
        } finally {
            setLoading(prev => ({ ...prev, [appointmentId]: false }))
        }
    }

    const appointmentStripe = async (appointmentId) => {
        setLoading(prev => ({ ...prev, [appointmentId]: true }))
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Payment failed')
        } finally {
            setLoading(prev => ({ ...prev, [appointmentId]: false }))
        }
    }

    const filteredAppointments = appointments.filter(appointment => {
        switch (filter) {
            case 'upcoming':
                return !appointment.cancelled && !appointment.isCompleted && !appointment.payment
            case 'paid':
                return !appointment.cancelled && !appointment.isCompleted && appointment.payment
            case 'completed':
                return appointment.isCompleted
            case 'cancelled':
                return appointment.cancelled
            default:
                return true
        }
    })

    const stats = {
        total: appointments.length,
        upcoming: appointments.filter(a => !a.cancelled && !a.isCompleted && !a.payment).length,
        paid: appointments.filter(a => !a.cancelled && !a.isCompleted && a.payment).length,
        completed: appointments.filter(a => a.isCompleted).length,
        cancelled: appointments.filter(a => a.cancelled).length
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl lg:text-5xl font-black text-gray-900 mb-4'>
                        My <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Appointments</span>
                    </h1>
                    <p className='text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
                        Manage and track all your medical appointments in one place
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className='grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
                    {[
                        { label: 'Total', value: stats.total, color: 'blue', icon: '📅' },
                        { label: 'Upcoming', value: stats.upcoming, color: 'orange', icon: '⏳' },
                        { label: 'Paid', value: stats.paid, color: 'green', icon: '💳' },
                        { label: 'Completed', value: stats.completed, color: 'emerald', icon: '✅' },
                        { label: 'Cancelled', value: stats.cancelled, color: 'red', icon: '❌' }
                    ].map((stat, index) => (
                        <div key={index} className='bg-white rounded-2xl p-4 text-center shadow-lg border-2 border-gray-100'>
                            <div className={`text-2xl text-${stat.color}-500 mb-2`}>{stat.icon}</div>
                            <div className='text-2xl font-black text-gray-900'>{stat.value}</div>
                            <div className='text-sm text-gray-600 font-semibold'>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Buttons */}
                <div className='bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8'>
                    <h3 className='text-2xl font-black text-gray-900 mb-4'>Filter Appointments</h3>
                    <div className='flex flex-wrap gap-3'>
                        {[
                            { key: 'all', label: 'All Appointments', icon: '📋' },
                            { key: 'upcoming', label: 'Upcoming', icon: '⏳' },
                            { key: 'paid', label: 'Paid', icon: '💳' },
                            { key: 'completed', label: 'Completed', icon: '✅' },
                            { key: 'cancelled', label: 'Cancelled', icon: '❌' }
                        ].map((filterOption) => (
                            <button
                                key={filterOption.key}
                                onClick={() => setFilter(filterOption.key)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                                    filter === filterOption.key
                                        ? 'bg-primary text-white border-primary shadow-lg'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary/50'
                                }`}
                            >
                                <span>{filterOption.icon}</span>
                                {filterOption.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments List */}
                <div className='space-y-6'>
                    {filteredAppointments.length === 0 ? (
                        <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-16 text-center'>
                            <div className='w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg'>
                                <span className='text-6xl'>📅</span>
                            </div>
                            <h3 className='text-3xl font-black text-gray-700 mb-4'>No Appointments Found</h3>
                            <p className='text-xl text-gray-600 max-w-md mx-auto mb-8'>
                                {filter === 'all' 
                                    ? "You don't have any appointments yet. Book your first appointment to get started."
                                    : `No ${filter} appointments found.`
                                }
                            </p>
                            <button 
                                onClick={() => navigate('/doctors')}
                                className='bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all duration-300'
                            >
                                Book New Appointment
                            </button>
                        </div>
                    ) : (
                        filteredAppointments.map((item, index) => (
                            <div key={item._id} className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500'>
                                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 p-8'>
                                    
                                    {/* Doctor Information */}
                                    <div className='lg:col-span-3'>
                                        <div className='flex items-start gap-6'>
                                            <div className='relative'>
                                                <img 
                                                    className='w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover' 
                                                    src={item.docData.image} 
                                                    alt={item.docData.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/96/3B82F6/FFFFFF?text=👨‍⚕️'
                                                    }}
                                                />
                                                {!item.cancelled && !item.isCompleted && (
                                                    <div className='absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full animate-pulse'></div>
                                                )}
                                            </div>
                                            
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-3 mb-3'>
                                                    <h3 className='text-2xl font-black text-gray-900'>{item.docData.name}</h3>
                                                    <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold'>
                                                        {item.docData.speciality}
                                                    </span>
                                                </div>
                                                
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-lg'>
                                                    <div>
                                                        <p className='text-gray-700 font-semibold mb-1'>Appointment Time</p>
                                                        <p className='text-gray-900 font-bold'>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className='text-gray-700 font-semibold mb-1'>Practice Address</p>
                                                        <p className='text-gray-600'>{item.docData.address.line1}</p>
                                                        <p className='text-gray-600'>{item.docData.address.line2}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className='flex items-center gap-4 mt-4'>
                                                    <span className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-200'>
                                                        💼 {item.docData.experience} years experience
                                                    </span>
                                                    <span className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200'>
                                                        ⭐ 4.9/5 Rating
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Panel */}
                                    <div className='lg:col-span-1'>
                                        <div className='space-y-3'>
                                            {/* Waiting Count Button */}
                                            <button
                                                onClick={() => navigate(`/waiting-count/${encodeURIComponent(item.docData.name)}`)}
                                                className='w-full bg-blue-500 text-white px-4 py-3 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2'
                                            >
                                                <span>👥</span>
                                                Waiting Count
                                                <span>→</span>
                                            </button>

                                            {/* Payment & Status Actions */}
                                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                                <button
                                                    onClick={() => setPayment(item._id)}
                                                    className='w-full bg-orange-500 text-white px-4 py-3 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300'
                                                >
                                                    💳 Pay Online 
                                                </button>
                                            )}
                                            
                                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                                <div className='space-y-2'>
                                                    <button
                                                        onClick={() => appointmentStripe(item._id)}
                                                        disabled={loading[item._id]}
                                                        className='w-full bg-gray-800 text-white px-4 py-3 rounded-2xl font-bold text-lg hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2'
                                                    >
                                                        {loading[item._id] ? (
                                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                        ) : (
                                                            <>
                                                                 <img className='w-20 h-5 object-contain' src={assets.stripe_logo} alt="Stripe" /> 
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => appointmentRazorpay(item._id)}
                                                        disabled={loading[item._id]}
                                                        className='w-full bg-blue-600 text-white px-4 py-3 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2'
                                                    >
                                                        {loading[item._id] ? (
                                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                        ) : (
                                                            <>
                                                                <img className='w-20 h-5 object-contain' src={assets.razorpay_logo} alt="Razorpay" />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {!item.cancelled && item.payment && !item.isCompleted && (
                                                <button className='w-full bg-green-500 text-white px-4 py-3 rounded-2xl font-bold text-lg cursor-default'>
                                                    ✅ Payment Completed
                                                </button>
                                            )}
                                            
                                            {item.isCompleted && (
                                                <button className='w-full bg-emerald-500 text-white px-4 py-3 rounded-2xl font-bold text-lg cursor-default'>
                                                    🎉 Appointment Completed
                                                </button>
                                            )}
                                            
                                            {!item.cancelled && !item.isCompleted && (
                                                <button
                                                    onClick={() => cancelAppointment(item._id)}
                                                    disabled={loading[item._id]}
                                                    className='w-full bg-red-500 text-white px-4 py-3 rounded-2xl font-bold text-lg hover:bg-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2'
                                                >
                                                    {loading[item._id] ? (
                                                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                    ) : (
                                                        <>
                                                            <span>❌</span>
                                                            Cancel Appointment
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                            
                                            {item.cancelled && !item.isCompleted && (
                                                <button className='w-full bg-red-100 text-red-700 px-4 py-3 rounded-2xl font-bold text-lg border-2 border-red-300 cursor-default'>
                                                    ❌ Appointment Cancelled
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Bar */}
                                <div className={`px-8 py-4 border-t-2 ${
                                    item.cancelled ? 'bg-red-50 border-red-200' :
                                    item.isCompleted ? 'bg-green-50 border-green-200' :
                                    item.payment ? 'bg-blue-50 border-blue-200' :
                                    'bg-orange-50 border-orange-200'
                                }`}>
                                    <div className='flex items-center justify-between text-lg font-semibold'>
                                        <span className={
                                            item.cancelled ? 'text-red-700' :
                                            item.isCompleted ? 'text-green-700' :
                                            item.payment ? 'text-blue-700' : 'text-orange-700'
                                        }>
                                            {item.cancelled ? 'Cancelled' :
                                             item.isCompleted ? 'Completed' :
                                             item.payment ? 'Payment Confirmed' : 'Payment Pending'}
                                        </span>
                                        <span className='text-gray-700'>
                                            Fee: <span className='font-black'>{currency} {item.amount}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyAppointments