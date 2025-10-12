import { z } from 'zod';

// Validate against the frontend payload shape. We'll compose name in the controller.
const applicantInfoSchema = z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }).optional(),
    first_name: z.string().trim().min(1, { message: 'First name is required' }),
    last_name: z.string().trim().min(1, { message: 'Last name is required' }),
    gender: z.string().trim().min(1, { message: 'Gender is required' }),
    email: z.string({ required_error: 'Email is required' })
        .trim()
        .min(5, { message: 'Email should be of minimum 5 characters' })
        .max(100, { message: 'Email should be of maximum 100 characters' })
        .email({ message: 'Invalid email format' })
        .refine(v => /@mitwpu\.edu\.in$/i.test(v), { message: 'Email must be a official MIT-WPU address' })
        .transform(v => v.toLowerCase()),
    prn: z.string()
        .trim()
        .min(1, { message: 'PRN is required' })
        .refine(v => /^\d{10}$/.test(v), { message: 'PRN must be exactly 10 digits' }),
    course: z.string().trim().min(1, { message: 'Course is required' }),
    year: z.string().trim().min(1, { message: 'Year is required' }),
    phone: z.string().trim().optional(),
    college: z.string().trim().optional()
});

const answerSchema = z.object({
    questionIndex: z.number(),
    question: z.string().trim().min(1),
    answer: z.any()
});

const recruitmentApplicationSchema = z.object({
    recruitmentId: z.string({ required_error: 'Recruitment ID is required' }).trim(),
    applicantInfo: applicantInfoSchema,
    answers: z.array(answerSchema).default([])
});

export default { recruitmentApplicationSchema };


