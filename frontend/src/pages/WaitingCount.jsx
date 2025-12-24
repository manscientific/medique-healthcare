import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE = import.meta.env.VITE_API_BASE;


const WaitingCount = () => {
  const { doctorName } = useParams()
  const navigate = useNavigate()
  const [waitingCount, setWaitingCount] = useState(null)
  const [previousCount, setPreviousCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchWaitingCount = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
  `${API_BASE}/count/${encodeURIComponent(doctorName)}`
);

      const newCount = res.data.waiting_count
      
      // Check if count decreased
      if (previousCount !== null && newCount < previousCount) {
        const decreaseAmount = previousCount - newCount
        toast.info(`🎉 Queue reduced! ${decreaseAmount} patient${decreaseAmount > 1 ? 's' : ''} ahead of you have been served.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
      
      setPreviousCount(waitingCount)
      setWaitingCount(newCount)
      setLastUpdated(new Date())
      toast.success('Waiting count updated!')
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch waiting count')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWaitingCount()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchWaitingCount, 30000)
    
    return () => clearInterval(interval)
  }, [doctorName])

  const estimatedTime = waitingCount ? waitingCount * 15 : 0

  // Format time display
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minutes` : ''}`
    }
  }

  const getWaitTimeColor = (count) => {
    if (count === 0) return 'text-green-600'
    if (count <= 2) return 'text-blue-600'
    if (count <= 5) return 'text-orange-600'
    return 'text-red-600'
  }

  const getWaitTimeSeverity = (count) => {
    if (count === 0) return 'Low'
    if (count <= 2) return 'Moderate'
    if (count <= 5) return 'High'
    return 'Very High'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Queue <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Management</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Real-time waiting information for your medical appointment
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          
          {/* Doctor Header */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-100/50 border-b-2 border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary p-4 rounded-2xl">
                  <div className="text-2xl text-white">👨‍⚕️</div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Dr. {doctorName}</h2>
                  <p className="text-xl text-gray-700 mt-2">Current waiting queue status</p>
                </div>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold text-lg hover:bg-gray-600 transition-all duration-300 flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Waiting Information */}
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                <h3 className="text-2xl font-black text-gray-700 mb-2">Loading Queue Data...</h3>
                <p className="text-lg text-gray-600">Fetching real-time waiting information</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Current Waiting Count */}
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-all duration-500">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-2xl font-bold text-blue-100 mb-4">Patients in Queue</h3>
                  <div className="text-6xl lg:text-7xl font-black mb-4">{waitingCount}</div>
                  <p className="text-blue-200 text-lg">
                    {waitingCount === 0 ? 'No patients waiting' : `${waitingCount} patient${waitingCount !== 1 ? 's' : ''} ahead of you`}
                  </p>
                </div>

                {/* Estimated Wait Time */}
                <div className={`bg-gradient-to-br from-${waitingCount === 0 ? 'green' : waitingCount <= 2 ? 'blue' : waitingCount <= 5 ? 'orange' : 'red'}-500 via-${waitingCount === 0 ? 'green' : waitingCount <= 2 ? 'blue' : waitingCount <= 5 ? 'orange' : 'red'}-600 to-${waitingCount === 0 ? 'green' : waitingCount <= 2 ? 'blue' : waitingCount <= 5 ? 'orange' : 'red'}-700 text-white p-8 rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-all duration-500`}>
                  <div className="text-6xl mb-4">⏱️</div>
                  <h3 className="text-2xl font-bold text-black/90 mb-4">Estimated Wait Time</h3>
                  <div className="text-4xl lg:text-5xl font-black mb-4">{formatTime(estimatedTime)}</div>
                  <div className="bg-white/20 px-4 py-2 rounded-2xl inline-block">
                    <span className="font-bold text-lg">{getWaitTimeSeverity(waitingCount)} Wait</span>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 text-center">Queue Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="bg-white rounded-2xl p-4 border-2 border-blue-200">
                        <div className="text-3xl text-blue-500 mb-2">⚡</div>
                        <div className="text-lg font-semibold text-gray-700">Average Consultation</div>
                        <div className="text-xl font-black text-gray-900">15 minutes</div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border-2 border-green-200">
                        <div className="text-3xl text-green-500 mb-2">🔄</div>
                        <div className="text-lg font-semibold text-gray-700">Last Updated</div>
                        <div className="text-xl font-black text-gray-900">
                          {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 border-2 border-purple-200">
                        <div className="text-3xl text-purple-500 mb-2">📊</div>
                        <div className="text-lg font-semibold text-gray-700">Queue Status</div>
                        <div className={`text-xl font-black ${getWaitTimeColor(waitingCount)}`}>
                          {getWaitTimeSeverity(waitingCount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Helpful Tips */}
                <div className="lg:col-span-2">
                  <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                      <span>💡</span>
                      Helpful Tips
                    </h3>
                    <div className="space-y-3 text-lg text-gray-700">
                      <p className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        Arrive 10-15 minutes before your scheduled time
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        Bring your medical records and ID documents
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="text-2xl">💧</span>
                        Stay hydrated while waiting for your turn
                      </p>
                      {estimatedTime > 30 && (
                        <p className="flex items-center gap-3 text-blue-600 font-semibold">
                          <span className="text-2xl">☕</span>
                          Consider getting a refreshment during the longer wait
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-t-2 border-gray-200 px-8 py-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <button
                onClick={fetchWaitingCount}
                disabled={loading}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <span>🔄</span>
                    Refresh Queue Data
                  </>
                )}
              </button>
              
              <div className="text-center sm:text-right">
                <p className="text-gray-600 text-lg">
                  Auto-refreshes every <span className="font-black">30 seconds</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact
        <div className="mt-8 bg-red-50 rounded-3xl shadow-lg border-2 border-red-200 p-6 text-center">
          <h3 className="text-2xl font-black text-red-800 mb-3 flex items-center justify-center gap-3">
            <span>🚨</span>
            Emergency Notice
          </h3>
          <p className="text-lg text-red-700 mb-4">
            If you're experiencing a medical emergency, please proceed to the emergency department immediately.
          </p>
          <button className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all duration-300">
            🚑 Emergency Contact
          </button>
        </div> */}

      </div>
    </div>
  )
}

export default WaitingCount