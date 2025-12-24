import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)

    const updateProfile = async () => {
        if (!profileData.about || !profileData.fees || !profileData.address.line1) {
            toast.error('Please fill all required fields')
            return
        }

        setLoading(true)

        try {
            const formData = new FormData()
            formData.append('address', JSON.stringify(profileData.address))
            formData.append('fees', profileData.fees)
            formData.append('about', profileData.about)
            formData.append('available', profileData.available)

            if (image) {
                formData.append('image', image)
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', formData, { 
                headers: { 
                    dToken,
                    'Content-Type': 'multipart/form-data'
                } 
            })

            if (data.success) {
                toast.success('Profile updated successfully!')
                setIsEdit(false)
                setImage(null)
                getProfileData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Update error:', error)
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const cancelEdit = () => {
        setIsEdit(false)
        setImage(null)
        getProfileData() // Reset to original data
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData ? (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-6xl mx-auto'>

                {/* Header Section */}
                <div className='text-center mb-12'>
                    <h1 className='text-4xl lg:text-5xl font-black text-gray-900 mb-4'>
                        Doctor <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600'>Profile</span>
                    </h1>
                    <p className='text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
                        Manage your professional profile and practice information
                    </p>
                </div>

                {/* Profile Card */}
                <div className='bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden'>
                    
                    {/* Profile Header */}
                    <div className='bg-gradient-to-r from-primary/10 to-blue-100/50 border-b-2 border-gray-200 px-8 py-6'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-primary p-4 rounded-2xl'>
                                    <div className='text-2xl text-white'>👨‍⚕️</div>
                                </div>
                                <div>
                                    <h2 className='text-3xl font-black text-gray-900'>Profile Settings</h2>
                                    <p className='text-xl text-gray-700 mt-2'>Update your professional information and availability</p>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-2xl font-bold text-lg border-2 ${
                                profileData.available 
                                    ? 'bg-green-100 text-green-800 border-green-300' 
                                    : 'bg-red-100 text-red-800 border-red-300'
                            }`}>
                                {profileData.available ? '🟢 Available' : '🔴 Not Available'}
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 p-8'>
                        
                        {/* Profile Image Section */}
                        <div className='lg:col-span-1'>
                            <div className='sticky top-8'>
                                <div className='text-center'>
                                    {isEdit ? (
                                        <label htmlFor='profile-image' className='cursor-pointer group'>
                                            <div className='relative inline-block'>
                                                <img 
                                                    className='w-64 h-64 rounded-2xl border-4 border-white shadow-2xl object-cover group-hover:opacity-80 transition-all duration-300' 
                                                    src={image ? URL.createObjectURL(image) : profileData.image} 
                                                    alt={profileData.name}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/256/3B82F6/FFFFFF?text=👨‍⚕️'
                                                    }}
                                                />
                                                <div className='absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center'>
                                                    <div className='text-white text-center'>
                                                        <div className='text-3xl mb-2'>📷</div>
                                                        <div className='font-bold'>Change Photo</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <input 
                                                type="file" 
                                                id="profile-image" 
                                                className='hidden' 
                                                accept="image/*"
                                                onChange={(e) => setImage(e.target.files[0])}
                                            />
                                        </label>
                                    ) : (
                                        <div className='relative'>
                                            <img 
                                                className='w-64 h-64 rounded-2xl border-4 border-white shadow-2xl object-cover' 
                                                src={profileData.image} 
                                                alt={profileData.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/256/3B82F6/FFFFFF?text=👨‍⚕️'
                                                }}
                                            />
                                            <div className='absolute -bottom-2 -right-2 bg-primary text-white px-4 py-2 rounded-2xl font-bold text-lg shadow-lg'>
                                                ⭐ 4.9
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className='mt-6 text-center'>
                                        <h3 className='text-3xl font-black text-gray-900 mb-2'>{profileData.name}</h3>
                                        <div className='flex items-center justify-center gap-3 mb-4'>
                                            <span className='bg-primary/10 text-primary px-4 py-2 rounded-2xl font-bold text-lg'>
                                                {profileData.speciality}
                                            </span>
                                            <span className='bg-gray-100 text-gray-700 px-4 py-2 rounded-2xl font-semibold text-lg'>
                                                {profileData.experience} Years
                                            </span>
                                        </div>
                                        <p className='text-lg text-gray-600'>{profileData.degree}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Information Section */}
                        <div className='lg:col-span-2 space-y-8'>
                            
                            {/* About Section */}
                            <div className='bg-gray-50 rounded-2xl p-6 border-2 border-gray-200'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='bg-primary p-3 rounded-xl'>
                                        <div className='text-xl text-white'>📖</div>
                                    </div>
                                    <h3 className='text-2xl font-black text-gray-900'>Professional Bio</h3>
                                </div>
                                {isEdit ? (
                                    <textarea 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                        value={profileData.about}
                                        rows={6}
                                        className='w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none'
                                        placeholder='Describe your professional background, expertise, and approach to patient care...'
                                    />
                                ) : (
                                    <p className='text-lg text-gray-700 leading-relaxed whitespace-pre-wrap'>
                                        {profileData.about || 'No professional bio provided yet.'}
                                    </p>
                                )}
                            </div>

                            {/* Practice Information */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                
                                {/* Appointment Fees */}
                                <div className='bg-blue-50 rounded-2xl p-6 border-2 border-blue-200'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='bg-blue-500 p-3 rounded-xl'>
                                            <div className='text-xl text-white'>💰</div>
                                        </div>
                                        <h3 className='text-2xl font-black text-gray-900'>Appointment Fee</h3>
                                    </div>
                                    {isEdit ? (
                                        <div className='relative'>
                                            <span className='absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500'>{currency}</span>
                                            <input 
                                                type='number'
                                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                                value={profileData.fees}
                                                className='w-full pl-12 pr-4 py-4 text-2xl font-black border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    ) : (
                                        <p className='text-3xl font-black text-blue-600'>{currency} {profileData.fees}</p>
                                    )}
                                    <p className='text-gray-600 text-lg mt-2'>Per consultation session</p>
                                </div>

                                {/* Availability */}
                                <div className='bg-green-50 rounded-2xl p-6 border-2 border-green-200'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='bg-green-500 p-3 rounded-xl'>
                                            <div className='text-xl text-white'>🕒</div>
                                        </div>
                                        <h3 className='text-2xl font-black text-gray-900'>Availability</h3>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        {isEdit ? (
                                            <label className='flex items-center gap-3 cursor-pointer'>
                                                <div className='relative'>
                                                    <input 
                                                        type="checkbox" 
                                                        onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                                                        checked={profileData.available}
                                                        className='sr-only'
                                                    />
                                                    <div className={`w-16 h-8 rounded-full transition-all duration-300 ${
                                                        profileData.available ? 'bg-green-500' : 'bg-gray-300'
                                                    }`}>
                                                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                                                            profileData.available ? 'transform translate-x-8' : ''
                                                        }`}></div>
                                                    </div>
                                                </div>
                                                <span className='text-xl font-semibold text-gray-700'>
                                                    {profileData.available ? 'Available' : 'Not Available'}
                                                </span>
                                            </label>
                                        ) : (
                                            <div className='flex items-center gap-3'>
                                                <div className={`w-4 h-4 rounded-full ${profileData.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                <span className='text-xl font-semibold text-gray-700'>
                                                    {profileData.available ? 'Currently Available' : 'Currently Not Available'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className='text-gray-600 text-lg mt-2'>
                                        {profileData.available 
                                            ? 'Patients can book appointments with you' 
                                            : 'Appointment bookings are temporarily paused'
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className='bg-purple-50 rounded-2xl p-6 border-2 border-purple-200'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='bg-purple-500 p-3 rounded-xl'>
                                        <div className='text-xl text-white'>🏥</div>
                                    </div>
                                    <h3 className='text-2xl font-black text-gray-900'>Practice Address</h3>
                                </div>
                                {isEdit ? (
                                    <div className='space-y-4'>
                                        <input 
                                            type="text"
                                            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                            value={profileData.address.line1}
                                            className='w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            placeholder='Street address, building name'
                                        />
                                        <input 
                                            type="text"
                                            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                            value={profileData.address.line2}
                                            className='w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            placeholder='City, State, ZIP code'
                                        />
                                    </div>
                                ) : (
                                    <div className='text-lg text-gray-700 space-y-2'>
                                        <p className='font-semibold'>{profileData.address.line1}</p>
                                        <p>{profileData.address.line2}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                                {isEdit ? (
                                    <>
                                        <button 
                                            onClick={updateProfile}
                                            disabled={loading}
                                            className='flex-1 bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3'
                                        >
                                            {loading ? (
                                                <>
                                                    <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <span>💾</span>
                                                    Save Changes
                                                    <span>→</span>
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            onClick={cancelEdit}
                                            disabled={loading}
                                            className='flex-1 bg-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setIsEdit(true)}
                                        className='flex-1 bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3'
                                    >
                                        <span>✏️</span>
                                        Edit Profile
                                        <span>→</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Statistics */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
                    <div className='bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 text-center'>
                        <div className='text-3xl text-blue-500 mb-3'>⭐</div>
                        <div className='text-2xl font-black text-gray-900 mb-2'>4.9/5</div>
                        <div className='text-lg text-gray-600 font-semibold'>Patient Rating</div>
                    </div>
                    
                    <div className='bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 text-center'>
                        <div className='text-3xl text-green-500 mb-3'>👥</div>
                        <div className='text-2xl font-black text-gray-900 mb-2'>500+</div>
                        <div className='text-lg text-gray-600 font-semibold'>Patients Served</div>
                    </div>
                    
                    <div className='bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 text-center'>
                        <div className='text-3xl text-purple-500 mb-3'>🎯</div>
                        <div className='text-2xl font-black text-gray-900 mb-2'>98%</div>
                        <div className='text-lg text-gray-600 font-semibold'>Success Rate</div>
                    </div>
                </div>

            </div>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="text-3xl font-black text-gray-700 mb-3">Loading Profile...</h2>
                <p className="text-xl text-gray-600">Please wait while we fetch your data</p>
            </div>
        </div>
    )
}

export default DoctorProfile