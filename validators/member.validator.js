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
    .email({message: "Invalid email format"})
    .min(3, {message: "Email should be of minimum 3 characters"}),
    // .max(20, {message: "Email should be of maximum 20 characters"}),

    gender: z.string({
        required_error: 'Please provide a gender',
    })
    .trim(),

    prn: z.number({
        required_error: 'Please provide a prn',
    })
    .int()
    .min(10, {message: "PRN should be of minimum 10 characters"}),

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

