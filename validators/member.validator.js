import { z } from 'zod';
import Member from '../models/member.model.js';

const memberRegistrationSchema = z.object({
    first_name: z.string({
        required_error: 'Please provide a first name',
    })
    .trim()
    .min(3, {message: "Username should be of minimum 3 characters"})
    .max(25, {message: "Username should be of maximum 25 characters"}),

    last_name: z.string({
        required_error: 'Please provide a last name',
    })
    .trim()
    .min(3, {message: "Username should be of minimum 3 characters"})
    .max(25, {message: "Username should be of maximum 25 characters"}),

    email: z.string({
        required_error: 'Please provide an email',
    })
    .trim()
    .min(5, {message: "Email should be of minimum 5 characters"})
    .max(50, {message: "Email should be of maximum 50 characters"})
    .email({message: "Invalid email format"})
    .transform(email => email.toLowerCase())
    .refine(async (email) => {
        const existingEmail = await Member.findOne({ email });
        return !existingEmail;
    }, {message: "Email already exists"}),

    gender: z.string({
        required_error: 'Please provide a gender',
    })
    .trim(),

    prn: z
    .number()
    .int()
    .positive()
    .gte(1000000000, {message: "PRN should be of 10 digits"})
    .lte(9999999999, {message: "PRN should be of 10 digits"})
    .refine(async (prn) => {
        const existingPRN = await Member.findOne({ prn });
        return !existingPRN;
    }, {message: "PRN already exists"}),

    course: z.string({
        required_error: 'Please provide a course',
    })
    .trim()
    .min(3, {message: "Course should be of minimum 3 characters"})
    .max(50, {message: "Course should be of maximum 50 characters"}),

    year: z.string({
        required_error: 'Please provide a year',
    })
    .trim()
    .min(3, {message: "Year should be of minimum 3 characters"})
    .max(50, {message: "Year should be of maximum 50 characters"}),
});

export default { memberRegistrationSchema };

