const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
    },
    email: {
        type: String,
        required: [true, 'A user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'password must match with the confirm password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: "password are not same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}

const user = mongoose.model('User', userSchema)

module.exports = user