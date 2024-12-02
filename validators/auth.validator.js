import { z } from 'zod';

const loginSchema = z.object({
    email: z.string({
        required_error: 'Please provide an email',
    })
    .trim()
    .email({message: "Invalid email format"})
    .min(3, {message: "Email should be of minimum 3 characters"})
    .max(50, {message: "Email should be of maximum 50 characters"}),

    password: z.string({
        required_error: 'Please provide a password',
    })
    .min(6, {message: "Password should be of minimum 6 characters"})
    .max(50, {message: "Password should be of maximum 50 characters"}),
});

const registerSchema = z.object({
    first_name: z.string({
        required_error: 'Please provide a name',
    })
    .trim()
    .min(3, {message: "Username should be of minimum 3 characters"})
    .max(25, {message: "Username should be of maximum 25 characters"}),

    last_name: z.string({
        required_error: 'Please provide a name',
    })
    .trim()
    .min(3, {message: "Username should be of minimum 3 characters"})
    .max(25, {message: "Username should be of maximum 25 characters"}),

    email: z.string({
        required_error: 'Please provide an email',
    })
    .trim()
    .email({message: "Invalid email format"})
    .min(3, {message: "Email should be of minimum 3 characters"})
    .max(50, {message: "Email should be of maximum 50 characters"}),

    password: z.string({
        required_error: 'Please provide a password',
    })
    .min(6, {message: "Password should be of minimum 6 characters"})
    .max(50, {message: "Password should be of maximum 50 characters"}),
});

export default {
    registerSchema,
    loginSchema
};