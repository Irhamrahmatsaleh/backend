import Joi from "joi"
import {users} from '../dto/user'

export type dataContent_thread =  {
    image             : string | null,
    content           : string,
    }

export type thread = {
    id: number,
    image: string,
    content: string,
    number_of_replies: number,
    updated_by: number,
    created_at: Date,
    update_at: Date,
    created_by: number
    users: users
}

export const threadValidate = Joi.object<dataContent_thread>({
    image: Joi.string().allow(null),
    content: Joi.string().min(1).max(320).required()
})