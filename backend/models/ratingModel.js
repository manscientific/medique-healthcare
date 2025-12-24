import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false // Make this optional
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 500
    },
    ratedBy: {
        type: String,
        enum: ['user', 'doctor', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Prevent duplicate ratings from same user for same doctor
ratingSchema.index({ doctorId: 1, userId: 1 }, { unique: true, sparse: true });

const ratingModel = mongoose.models.rating || mongoose.model("rating", ratingSchema);
export default ratingModel;