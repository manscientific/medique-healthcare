import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import ratingModel from "../models/ratingModel.js";
import { v2 as cloudinary } from 'cloudinary';
import stripe from "stripe";
import razorpay from 'razorpay';
import crypto from "crypto";

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// ----------------------- REGISTER USER -----------------------
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password: hashedPassword
        });

        const user = await newUser.save();

        const token = generateToken(user._id);

        const userResponse = { ...user.toObject() };
        delete userResponse.password;

        res.status(201).json({
            success: true,
            token,
            user: userResponse,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "User already exists with this email" });
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ----------------------- LOGIN USER -----------------------
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        const userResponse = { ...user.toObject() };
        delete userResponse.password;

        res.json({
            success: true,
            token,
            user: userResponse,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ----------------------- GET PROFILE -----------------------
const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const userData = await userModel.findById(userId).select('-password');

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData });

    } catch (error) {
        console.error('Get profile error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ----------------------- UPDATE PROFILE -----------------------
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!userId || !name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updateData = { name, phone, dob, gender };

        if (address) {
            try {
                updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
            } catch {
                return res.status(400).json({ success: false, message: "Invalid address format" });
            }
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
                folder: "user-profiles"
            });
            updateData.image = imageUpload.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            user: updatedUser,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ----------------------- BOOK APPOINTMENT -----------------------
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const docData = await doctorModel.findById(docId).select("-password");
        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        if (!docData.available) {
            return res.status(400).json({ success: false, message: 'Doctor is not available' });
        }

        let slots_booked = docData.slots_booked || {};

        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            return res.status(400).json({ success: false, message: 'Time slot is not available' });
        }

        if (!slots_booked[slotDate]) slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const appointment = new appointmentModel({
            userId,
            docId,
            userData,
            docData: { ...docData.toObject(), slots_booked: undefined },
            amount: docData.fees,
            slotTime,
            slotDate,
            date: new Date()
        });

        await appointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.status(201).json({
            success: true,
            appointment,
            message: 'Appointment booked successfully'
        });

    } catch (error) {
        console.error('Book appointment error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        res.status(500).json({ success: false, message: "Failed to book appointment" });
    }
};

// ----------------------- CANCEL APPOINTMENT -----------------------
const cancelAppointment = async (req, res) => {
    try {
        const { userId, appointmentId } = req.body;

        if (!userId || !appointmentId) {
            return res.status(400).json({ success: false, message: 'User ID and appointment ID are required' });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized action' });
        }

        if (appointmentData.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment already cancelled' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
            cancelledAt: new Date()
        });

        const appointmentDate = new Date(appointmentData.slotDate);
        const today = new Date();

        if (appointmentDate >= today) {
            const { docId, slotDate, slotTime } = appointmentData;
            const doctorData = await doctorModel.findById(docId);

            if (doctorData?.slots_booked?.[slotDate]) {
                let slots_booked = doctorData.slots_booked;
                slots_booked[slotDate] = slots_booked[slotDate].filter(t => t !== slotTime);

                if (slots_booked[slotDate].length === 0) {
                    delete slots_booked[slotDate];
                }

                await doctorModel.findByIdAndUpdate(docId, { slots_booked });
            }
        }

        res.json({ success: true, message: 'Appointment cancelled successfully' });

    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({ success: false, message: "Failed to cancel appointment" });
    }
};

// ----------------------- LIST APPOINTMENTS -----------------------
const listAppointment = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });

        res.json({ success: true, appointments });

    } catch (error) {
        console.error('List appointments error:', error);
        res.status(500).json({ success: false, message: "Failed to fetch appointments" });
    }
};

// ----------------------- USER RATE DOCTOR -----------------------
const userRateDoctor = async (req, res) => {
    try {
        const { docId, rating, comment } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not authenticated' 
            });
        }

        if (!docId || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Doctor ID and rating are required' 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Check if doctor exists
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Doctor not found' 
            });
        }

        // Check if user already rated this doctor
        const existingRating = await ratingModel.findOne({
            doctorId: docId,
            userId: userId
        });

        let result;
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.comment = comment || existingRating.comment;
            result = await existingRating.save();
        } else {
            const newRating = new ratingModel({
                doctorId: docId,
                userId: userId,
                rating,
                comment: comment || '',
                ratedBy: 'user'
            });
            result = await newRating.save();
        }

        // Calculate new average rating
        const ratings = await ratingModel.find({ doctorId: docId });
        const total = ratings.reduce((sum, ratingItem) => sum + ratingItem.rating, 0);
        const averageRating = parseFloat((total / ratings.length).toFixed(1));

        res.json({ 
            success: true, 
            message: 'Rating submitted successfully',
            averageRating,
            totalRatings: ratings.length
        });

    } catch (error) {
        console.log('User rate doctor error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ----------------------- RAZORPAY PAYMENT -----------------------
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment is cancelled' });
        }

        if (appointmentData.payment) {
            return res.status(400).json({ success: false, message: 'Appointment is already paid' });
        }

        const order = await razorpayInstance.orders.create({
            amount: Math.round(appointmentData.amount * 100),
            currency: process.env.CURRENCY || 'INR',
            receipt: appointmentId.toString(),
            payment_capture: 1
        });

        res.json({ success: true, order });

    } catch (error) {
        console.error('Razorpay payment error:', error);
        res.status(500).json({ success: false, message: "Failed to create payment order" });
    }
};

// ----------------------- VERIFY RAZORPAY PAYMENT -----------------------
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification data is missing' });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === "paid") {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
                payment: true,
                paymentId: razorpay_payment_id,
                paymentDate: new Date()
            });

            return res.json({ success: true, message: "Payment verified successfully" });
        }

        return res.json({ success: false, message: "Payment not completed" });

    } catch (error) {
        console.error("Razorpay verification error:", error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }
};

// ----------------------- STRIPE PAYMENT -----------------------
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.cancelled) {
            return res.status(400).json({ success: false, message: 'Appointment is cancelled' });
        }

        if (appointmentData.payment) {
            return res.status(400).json({ success: false, message: 'Appointment is already paid' });
        }

        const currency = (process.env.CURRENCY || 'usd').toLowerCase();

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency,
                    product_data: {
                        name: `Appointment with Dr. ${appointmentData.docData.name}`,
                        description: `Appointment on ${appointmentData.slotDate} at ${appointmentData.slotTime}`
                    },
                    unit_amount: Math.round(appointmentData.amount * 100),
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            client_reference_id: appointmentId.toString(),
            metadata: { appointmentId: appointmentId.toString() }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error('Stripe payment error:', error);
        res.status(500).json({ success: false, message: "Failed to create payment session" });
    }
};

// ----------------------- VERIFY STRIPE -----------------------
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, {
                payment: true,
                paymentDate: new Date()
            });

            return res.json({ success: true, message: 'Payment successful' });
        }

        res.json({ success: false, message: 'Payment failed or cancelled' });

    } catch (error) {
        console.error('Stripe verification error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

// ----------------------- EXPORTS -----------------------
export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    userRateDoctor,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
};