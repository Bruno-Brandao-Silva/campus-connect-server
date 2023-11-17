import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    academicRegistration: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const Auth = mongoose.models.Auth ?? mongoose.model('Auth', authSchema);

export default Auth;