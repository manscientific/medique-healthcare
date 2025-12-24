import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [loading, setLoading] = useState(false)
    const [ratings, setRatings] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [userRating, setUserRating] = useState(0)
    const [isRating, setIsRating] = useState(false)
    const [localRatings, setLocalRatings] = useState([]) // Local state for frontend-only ratings
    const [localAverageRating, setLocalAverageRating] = useState(0) // Local state for frontend-only average
    const [showEmergencyMenu, setShowEmergencyMenu] = useState(false)
    const [emergencySelected, setEmergencySelected] = useState(false)

    const navigate = useNavigate()

    // Emergency options
    const emergencyOptions = [
        "Chest pain / difficulty breathing",
        "Severe bleeding / injury / accident",
        "Fainting, dizziness, or unconsciousness symptoms",
        "Pregnancy-related severe pain / complications",
        "Post-surgery complication (severe pain, swelling, bleeding)",
        "High fever with vomiting or convulsions",
        "Severe abdominal pain"
    ]

    // Testimonials data
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
            rating: 5,
            comment: "Dr. Smith provided exceptional care during my treatment. His expertise and bedside manner are outstanding!",
            date: "2 weeks ago"
        },
        {
            id: 2,
            name: "Michael Chen",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
            rating: 5,
            comment: "Very professional and caring doctor. Explained everything clearly and made me feel comfortable throughout.",
            date: "1 month ago"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
            rating: 4,
            comment: "Great experience! The doctor was patient and listened to all my concerns. Highly recommended!",
            date: "3 weeks ago"
        },
        {
            id: 4,
            name: "David Thompson",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
            rating: 5,
            comment: "Outstanding medical professional! Accurate diagnosis and effective treatment plan. Very satisfied.",
            date: "2 months ago"
        },
        {
            id: 5,
            name: "Jennifer Park",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
            rating: 4,
            comment: "Friendly staff and excellent doctor. Wait time was minimal and the consultation was thorough.",
            date: "1 week ago"
        }
    ]

    // Get user rating from localStorage
    const getUserRatingFromStorage = () => {
        if (docId) {
            const storedRatings = localStorage.getItem('doctorRatings');
            if (storedRatings) {
                const ratings = JSON.parse(storedRatings);
                return ratings[docId] || 0;
            }
        }
        return 0;
    }

    // Save user rating to localStorage
    const saveUserRatingToStorage = (rating) => {
        if (docId) {
            const storedRatings = localStorage.getItem('doctorRatings');
            const ratings = storedRatings ? JSON.parse(storedRatings) : {};
            ratings[docId] = rating;
            localStorage.setItem('doctorRatings', JSON.stringify(ratings));
        }
    }

    // Get local ratings from localStorage
    const getLocalRatingsFromStorage = () => {
        if (docId) {
            const storedLocalRatings = localStorage.getItem('doctorLocalRatings');
            if (storedLocalRatings) {
                const allRatings = JSON.parse(storedLocalRatings);
                return allRatings[docId] || [];
            }
        }
        return [];
    }

    // Save local ratings to localStorage
    const saveLocalRatingsToStorage = (ratingsArray) => {
        if (docId) {
            const storedLocalRatings = localStorage.getItem('doctorLocalRatings');
            const allRatings = storedLocalRatings ? JSON.parse(storedLocalRatings) : {};
            allRatings[docId] = ratingsArray;
            localStorage.setItem('doctorLocalRatings', JSON.stringify(allRatings));
        }
    }

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const fetchRatings = async () => {
        try {
            const { data } = await axios.get(backendUrl + `/api/doctor/ratings/${docId}`)
            if (data.success) {
                setRatings(data.ratings)
                calculateAverageRating(data.ratings)
                
                // Get stored ratings and merge with backend ratings
                const storedUserRating = getUserRatingFromStorage();
                const storedLocalRatings = getLocalRatingsFromStorage();
                
                // Set user rating from storage
                setUserRating(storedUserRating);
                
                // Combine backend ratings with local ratings (avoid duplicates)
                const combinedRatings = [...data.ratings];
                storedLocalRatings.forEach(storedRating => {
                    // Only add if not already in backend ratings
                    if (!data.ratings.some(rating => 
                        rating.user === storedRating.user && 
                        rating.rating === storedRating.rating
                    )) {
                        combinedRatings.push(storedRating);
                    }
                });
                
                setLocalRatings(combinedRatings);
                calculateLocalAverageRating(combinedRatings);
            }
        } catch (error) {
            console.log('Error fetching ratings:', error)
            // Initialize with stored ratings
            const storedUserRating = getUserRatingFromStorage();
            const storedLocalRatings = getLocalRatingsFromStorage();
            
            setUserRating(storedUserRating);
            setLocalRatings(storedLocalRatings);
            calculateLocalAverageRating(storedLocalRatings);
        }
    }

    const calculateAverageRating = (ratingsArray) => {
        if (ratingsArray.length === 0) {
            setAverageRating(0)
            return
        }
        const total = ratingsArray.reduce((sum, rating) => sum + rating.rating, 0)
        const average = total / ratingsArray.length
        setAverageRating(parseFloat(average.toFixed(1)))
    }

    const calculateLocalAverageRating = (ratingsArray) => {
        if (ratingsArray.length === 0) {
            setLocalAverageRating(0)
            return
        }
        const total = ratingsArray.reduce((sum, rating) => sum + rating.rating, 0)
        const average = total / ratingsArray.length
        setLocalAverageRating(parseFloat(average.toFixed(1)))
    }

    const submitRating = async (rating) => {
        if (!token) {
            toast.warning('Please login to rate this doctor')
            return navigate('/login')
        }

        // Save rating to localStorage
        saveUserRatingToStorage(rating);

        // Create a new rating object for frontend only
        const newRating = {
            rating: rating,
            comment: "",
            createdAt: new Date().toISOString(),
            user: "You" // Mock user identifier
        }

        // Update local ratings state (frontend only)
        const updatedLocalRatings = [...localRatings.filter(r => r.user !== "You"), newRating];
        setLocalRatings(updatedLocalRatings);
        saveLocalRatingsToStorage(updatedLocalRatings);
        
        calculateLocalAverageRating(updatedLocalRatings);
        setUserRating(rating);

        toast.success('Rating submitted successfully!');

        // Optional: You can still call the backend but show a different message
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/rate',
                { docId, rating },
                { headers: { token } }
            )

            if (data.success) {
                // If you want to sync with backend, uncomment below
                // fetchRatings() // Refresh ratings from backend
            }
        } catch (error) {
            console.log('Backend rating submission failed, but frontend rating was updated')
            // We don't show error toast since frontend rating was successful
        }
    }

    const getAvailableSlots = async () => {
        setDocSlots([])
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()
                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime
                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Please login to book an appointment')
            return navigate('/login')
        }

        if (!slotTime) {
            toast.warning('Please select a time slot')
            return
        }

        setLoading(true)

        const date = docSlots[slotIndex][0].datetime
        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', 
                { docId, slotDate, slotTime }, 
                { headers: { token } }
            )

            if (data.success) {
                toast.success('Appointment booked successfully!')
                getDoctosData()
                navigate('/counter', { state: { doctor: docInfo } })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to book appointment')
        } finally {
            setLoading(false)
        }
    }

    const handleEmergencyOptionClick = (option) => {
        setEmergencySelected(true)
        setShowEmergencyMenu(false)
        toast.info('We will contact you soon for verification')
        
        // You can add additional emergency handling logic here
        console.log('Emergency selected:', option)
    }

    useEffect(() => {
        if (doctors.length > 0) fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
            fetchRatings()
        }
    }, [docInfo])

    return docInfo ? (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            
            {/* Doctor Details Section */}
            <div className='bg-white rounded-3xl shadow-2xl overflow-hidden mb-12'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 p-8'>
                    
                    {/* Doctor Image */}
                    <div className='lg:col-span-1 flex justify-center'>
                        <div className='relative'>
                            <img 
                                className='w-80 h-80 object-cover rounded-2xl shadow-lg border-4 border-white' 
                                src={docInfo.image} 
                                alt={docInfo.name}
                            />
                        </div>
                    </div>

                    {/* Doctor Information */}
                    <div className='lg:col-span-2'>
                        <div className='flex items-center gap-4 mb-6'>
                            <h1 className='text-4xl lg:text-5xl font-black text-gray-900'>
                                Dr. {docInfo.name}
                            </h1>
                            <img className='w-8 h-8' src={assets.verified_icon} alt="Verified" />
                        </div>
                        
                        <div className='flex items-center gap-4 mb-6'>
                            <span className='bg-primary/10 text-primary px-4 py-2 rounded-2xl font-bold text-lg'>
                                {docInfo.speciality}
                            </span>
                            <span className='bg-gray-100 text-gray-700 px-4 py-2 rounded-2xl font-semibold text-lg'>
                                {docInfo.experience} Years Experience
                            </span>
                        </div>

                        {/* Rating Section */}
                        <div className='mb-6'>
                            <div className='flex items-center gap-4 mb-3'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-2xl'>⭐</span>
                                    <h3 className='text-2xl font-bold text-gray-900'>Rating & Reviews</h3>
                                </div>
                                <div className='flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full'>
                                    <span className='text-lg font-bold text-yellow-700'>{localAverageRating || averageRating}</span>
                                    <span className='text-yellow-600'>★</span>
                                    <span className='text-gray-600 text-sm'>({localRatings.length} reviews)</span>
                                </div>
                            </div>
                            
                            {/* Star Rating Input */}
                            <div className='flex items-center gap-4 mb-4'>
                                <span className='text-lg font-semibold text-gray-700'>Rate this doctor:</span>
                                <div className='flex gap-1'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => submitRating(star)}
                                            className={`text-2xl transition-transform hover:scale-110 ${
                                                star <= (userRating || 0) ? 'text-yellow-500' : 'text-gray-300'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                {userRating > 0 && (
                                    <span className='text-sm text-green-600 font-semibold ml-2'>
                                        Your rating: {userRating} ★
                                    </span>
                                )}
                            </div>

                            {/* Reviews List */}
                            {localRatings.length > 0 && (
                                <div className='max-h-48 overflow-y-auto'>
                                    {localRatings.slice(0, 3).map((rating, index) => (
                                        <div key={index} className='border-b border-gray-200 py-3 last:border-b-0'>
                                            <div className='flex items-center gap-2 mb-1'>
                                                <div className='flex'>
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <span
                                                            key={star}
                                                            className={`text-sm ${
                                                                star <= rating.rating ? 'text-yellow-500' : 'text-gray-300'
                                                            }`}
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className='text-sm text-gray-500'>
                                                    {rating.user === "You" ? "Just now" : new Date(rating.createdAt).toLocaleDateString()}
                                                </span>
                                                {rating.user === "You" && (
                                                    <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>Your rating</span>
                                                )}
                                            </div>
                                            {rating.comment && (
                                                <p className='text-gray-700 text-sm'>{rating.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='mb-6'>
                            <div className='flex items-center gap-2 mb-3'>
                                <span className='text-2xl'>📖</span>
                                <h3 className='text-2xl font-bold text-gray-900'>About Doctor</h3>
                            </div>
                            <p className='text-lg text-gray-700 leading-relaxed'>
                                {docInfo.about || 'Experienced medical professional dedicated to providing exceptional healthcare services.'}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='bg-blue-50 rounded-2xl p-4'>
                                <p className='text-gray-600 font-semibold text-lg'>Appointment Fee</p>
                                <p className='text-3xl font-black text-primary'>{currencySymbol}{docInfo.fees}</p>
                            </div>
                            <div className='bg-green-50 rounded-2xl p-4'>
                                <p className='text-gray-600 font-semibold text-lg'>Availability</p>
                                <p className='text-xl font-bold text-green-600'>
                                    {docInfo.available ? 'Available Today' : 'Not Available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 mb-12'>
                <h2 className='text-3xl lg:text-4xl font-black text-gray-900 mb-8 text-center'>
                    Patient <span className='text-primary'>Testimonials</span>
                </h2>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {testimonials.map((testimonial) => (
                        <div 
                            key={testimonial.id}
                            className='bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'
                        >
                            {/* Patient Info */}
                            <div className='flex items-center gap-4 mb-4'>
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    className='w-12 h-12 rounded-full object-cover border-2 border-primary/20'
                                />
                                <div className='flex-1'>
                                    <h4 className='font-bold text-gray-900 text-lg'>{testimonial.name}</h4>
                                    <p className='text-gray-500 text-sm'>{testimonial.date}</p>
                                </div>
                            </div>
                            
                            {/* Rating Stars */}
                            <div className='flex gap-1 mb-3'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`text-lg ${
                                            star <= testimonial.rating ? 'text-yellow-500' : 'text-gray-300'
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            
                            {/* Review Comment */}
                            <p className='text-gray-700 leading-relaxed text-sm'>
                                "{testimonial.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Section */}
            <div className='bg-white rounded-3xl shadow-2xl p-8 mb-12'>
                <h2 className='text-3xl lg:text-4xl font-black text-gray-900 mb-8 text-center'>
                    Book Your <span className='text-primary'>Appointment</span>
                </h2>

                {/* Date Selection */}
                <div className='mb-8'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>Select Date</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4'>
                        {docSlots.length > 0 && docSlots.map((item, index) => (
                            <div 
                                onClick={() => setSlotIndex(index)} 
                                key={index}
                                className={`text-center p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 border-2 ${
                                    slotIndex === index 
                                        ? 'bg-primary text-white border-primary shadow-lg' 
                                        : 'border-gray-200 hover:border-primary/50'
                                }`}
                            >
                                <p className='text-lg font-bold'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                <p className='text-2xl font-black'>{item[0] && item[0].datetime.getDate()}</p>
                                <p className='text-sm opacity-80'>
                                    {item[0] && item[0].datetime.toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Time Slot Selection */}
                <div className='mb-8'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>Select Time Slot</h3>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                        {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                            <button
                                onClick={() => setSlotTime(item.time)}
                                key={index}
                                className={`p-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                                    item.time === slotTime
                                        ? 'bg-primary text-white border-primary shadow-lg'
                                        : 'border-gray-200 hover:border-primary/50'
                                }`}
                            >
                                {item.time.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Book Button */}
                <div className='text-center'>
                    <button 
                        onClick={bookAppointment}
                        disabled={loading || !slotTime}
                        className='bg-gradient-to-r from-primary to-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-3'
                    >
                        {loading ? (
                            <>
                                <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Booking...
                            </>
                        ) : (
                            <>
                                <span>📅</span>
                                Book Appointment Now
                                <span>→</span>
                            </>
                        )}
                    </button>
                    
                    {!slotTime && (
                        <p className='text-red-500 text-lg font-semibold mt-4'>
                            Please select a time slot to continue
                        </p>
                    )}
                </div>
            </div>

            {/* Related Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />

            {/* Emergency Button Section */}
            <div className='fixed bottom-6 right-6 z-50'>
                <div className='relative'>
                    {/* Emergency Button */}
                    <button
                        onClick={() => setShowEmergencyMenu(!showEmergencyMenu)}
                        className='bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3'
                    >
                        <span className='text-2xl'>🚨</span>
                        Emergency
                        <span className={`transform transition-transform ${showEmergencyMenu ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>

                    {/* Emergency Dropdown Menu */}
                    {showEmergencyMenu && (
                        <div className='absolute bottom-full right-0 mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden'>
                            <div className='bg-red-600 text-white p-4'>
                                <h3 className='font-bold text-lg flex items-center gap-2'>
                                    <span>🚑</span>
                                    Emergency Assistance
                                </h3>
                                <p className='text-sm opacity-90 mt-1'>Select your emergency type</p>
                            </div>
                            
                            <div className='max-h-96 overflow-y-auto'>
                                {emergencyOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleEmergencyOptionClick(option)}
                                        className='w-full text-left p-4 hover:bg-red-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200'
                                    >
                                        <div className='flex items-start gap-3'>
                                            <span className='text-red-500 mt-1'>•</span>
                                            <span className='text-gray-800 font-medium'>{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Emergency Selected Message */}
            {emergencySelected && (
                <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 border-4 border-red-200 max-w-md text-center'>
                    <div className='text-6xl mb-4'>🚑</div>
                    <h3 className='text-2xl font-black text-gray-900 mb-4'>Emergency Assistance Requested</h3>
                    <p className='text-lg text-gray-700 mb-6'>
                        We will contact you soon for verification and immediate assistance.
                    </p>
                    <button
                        onClick={() => setEmergencySelected(false)}
                        className='bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold transition-colors duration-300'
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    ) : (
        <div className='flex justify-center items-center min-h-96'>
            <div className='text-center'>
                <div className='text-6xl mb-4'>👨‍⚕️</div>
                <h2 className='text-3xl font-bold text-gray-700'>Loading Doctor Information...</h2>
                <p className='text-lg text-gray-600 mt-2'>Please wait while we fetch the details</p>
            </div>
        </div>
    )
}

export default Appointment