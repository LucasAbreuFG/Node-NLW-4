
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from "../repositories/UserRepository";
import * as yup from 'yup'
import { AppError } from '../errors/AppErrors';


class UserController{
    async create(request : Request, response : Response){
        const {name , email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("NOME � OBRIGAT�RIO"),
            email : yup.string().email().required("EMAIL � OBRIGAT�RIO")
        })

        try{
            await schema.validate(request.body, { abortEarly: false})

        }catch(err){
            return response.status(400).json({error: err})
        }
        
        const userRepository = getCustomRepository(UserRepository);
        
        //SELECT * FROM USER WHERE EMAIL = this.email
        const UserAlreadyExists = await userRepository.findOne({
            email
        })

        if(UserAlreadyExists){
            throw new AppError("User already exists...")

        }
        const user = userRepository.create({
            name, email
        })
        await userRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
