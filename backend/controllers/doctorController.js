import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import ratingModel from "../models/ratingModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
           const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d' // 7 days - you can use '1h', '24h', '30d', etc.
})
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        
        // Get average ratings for all doctors
        const doctorsWithRatings = await Promise.all(
            doctors.map(async (doctor) => {
                const ratings = await ratingModel.find({ doctorId: doctor._id })
                let averageRating = 0
                
                if (ratings.length > 0) {
                    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0)
                    averageRating = parseFloat((total / ratings.length).toFixed(1))
                }
                
                return {
                    ...doctor.toObject(),
                    averageRating
                }
            })
        )
        
        res.json({ success: true, doctors: doctorsWithRatings })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })
        
        // Get ratings for the doctor
        const ratings = await ratingModel.find({ doctorId: docId })
        let averageRating = 0
        
        if (ratings.length > 0) {
            const total = ratings.reduce((sum, rating) => sum + rating.rating, 0)
            averageRating = parseFloat((total / ratings.length).toFixed(1))
        }

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            averageRating,
            totalRatings: ratings.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get ratings for a doctor
const getDoctorRatings = async (req, res) => {
    try {
        const { docId } = req.params

        const ratings = await ratingModel.find({ doctorId: docId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
        
        let averageRating = 0
        if (ratings.length > 0) {
            const total = ratings.reduce((sum, rating) => sum + rating.rating, 0)
            averageRating = parseFloat((total / ratings.length).toFixed(1))
        }

        res.json({ 
            success: true, 
            ratings,
            averageRating,
            totalRatings: ratings.length 
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to submit a rating for a doctor (by the doctor themselves or admin)
const submitRating = async (req, res) => {
    try {
        const { rating, comment } = req.body; // Remove docId since doctor is rating themselves
        const doctorId = req.id || req.doctorId; // This should come from authDoctor middleware

        console.log('Rating submission - DoctorId:', doctorId, 'Rating:', rating);

        if (!doctorId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Doctor not authenticated' 
            });
        }

        if (!rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating is required' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Doctor not found' 
            });
        }

        // Check if doctor already rated themselves
        const existingRating = await ratingModel.findOne({
            doctorId: doctorId,
            userId: null, // Look for ratings without userId (doctor self-ratings)
            ratedBy: 'doctor'
        });

        let result;
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.comment = comment || existingRating.comment;
            result = await existingRating.save();
        } else {
            const newRating = new ratingModel({
                doctorId: doctorId,
                userId: null, // Set to null for doctor self-ratings
                rating,
                comment: comment || '',
                ratedBy: 'doctor'
            });
            result = await newRating.save();
        }

        // Calculate new average rating
        const ratings = await ratingModel.find({ doctorId: doctorId });
        const total = ratings.reduce((sum, ratingItem) => sum + ratingItem.rating, 0);
        const averageRating = parseFloat((total / ratings.length).toFixed(1));

        res.json({ 
            success: true, 
            message: 'Rating submitted successfully',
            averageRating,
            totalRatings: ratings.length
        });

    } catch (error) {
        console.log('Submit rating error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getDoctorRatings,
    submitRating
}