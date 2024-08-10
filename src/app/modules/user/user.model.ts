import { Schema, model } from 'mongoose'
import { IUser, UserModel } from './user.interface'
import { userRole } from './user.constant'
import config from '../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: userRole,
    },
    isDeleted: {
      type: Boolean,
      trim: true,
      default: false,
    },
  },
  { timestamps: true },
)

// // check if the user exists
// userSchema.statics.isUserExists = async function (email: string) {
//   return await User.findOne({ email })
// }
// // check if the user is already deleted
// userSchema.statics.isUserDeleted = async function (email: string) {
//   const user = await User.findOne({ email })
//   return user?.isDeleted
// }

// matched password
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashPassword: string,
): Promise<boolean> {
  const passwordMatched = await bcrypt.compare(plainTextPassword, hashPassword)
  return passwordMatched
}

// // set hash before save password to db
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// remove password after save
userSchema.post('save', async function (doc, next) {
  next()
})

export const User = model<IUser, UserModel>('User', userSchema)
