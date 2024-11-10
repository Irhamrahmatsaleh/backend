import Joi from "joi"

export type registerSchema = {
    full_name     : string,
    email         : string,
    password      : string,
    }

export type editProfileSchema = {
    photo_profile : string,
    full_name : string,
    username : string,
    bio : string
    }
export type loginSchema = {
    email         : string,
    password      : string,
    }

export type followers = {
    id?: number,
    full_name: string,
    username: string,
    photo_profile: string,
    }

export type following = {
  id         : number,
  followed_id    : number,
  follower_id  : number,
  created_at : Date,
  update_at  : Date,
  follower    : followers
}

export type users = {
    id: number,
    username: string,
    full_name: string
    email: string,
    password?: string,
    photo_profile: string,
    bio: string,
    created_at: Date,
    created_by: string,
    updated_at: Date,
    updated_by: string,
}

export const loginValidate = Joi.object<loginSchema>({
    email         : Joi.string().required(),
    password      : Joi.string().min(8).alphanum().required(),
})

export const registerValidate = Joi.object<registerSchema>({
    full_name     : Joi.string().required(),
    email         : Joi.string().required(),
    password      : Joi.string().min(8).alphanum().required(),
})

export const editProfileValidate = Joi.object<editProfileSchema>({
    full_name     : Joi.string().required(),
    username     : Joi.string().required(),
    bio     : Joi.string(),
    photo_profile: Joi.string().allow(null),
})
