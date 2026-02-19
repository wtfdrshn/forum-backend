import { z } from 'zod';

// Question schema for form questions
const questionSchema = z.object({
    question: z.string().trim().min(1, { message: 'Question is required' }),
    type: z.enum(['text', 'textarea', 'dropdown', 'radio', 'checkbox', 'email', 'number', 'date'], {
        required_error: 'Question type is required'
    }),
    options: z.array(z.string()).optional(), // Required for dropdown, radio, checkbox
    required: z.boolean().default(false),
    placeholder: z.string().optional(),
    validation: z.object({
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        pattern: z.string().optional()
    }).optional(),
    showIf: z.object({
        questionIndex: z.number(),
        operator: z.enum(['equals']).default('equals'),
        value: z.string()
    }).optional()
}).refine((data) => {
    // If type is dropdown, radio, or checkbox, options must be provided
    if (['dropdown', 'radio', 'checkbox'].includes(data.type)) {
        return data.options && data.options.length > 0;
    }
    return true;
}, {
    message: 'Options are required for dropdown, radio, and checkbox types',
    path: ['options']
});

// Form creation/update schema
export const formSchema = z.object({
    title: z.string().trim().min(1, { message: 'Title is required' }),
    description: z.string().trim().min(1, { message: 'Description is required' }),
    headerImage: z.union([z.string().url(), z.literal(''), z.null()]).optional().transform(v => (v === '' ? undefined : v)),
    customRoute: z.string()
        .trim()
        .min(1, { message: 'Custom route is required' })
        .regex(/^[a-z0-9-]+$/, { message: 'Custom route must contain only lowercase letters, numbers, and hyphens' })
        .transform(v => v.toLowerCase()),
    isActive: z.boolean().default(true),
    customQuestions: z.array(questionSchema).default([]),
    successMessage: z.string().optional(),
    closedMessage: z.string().optional(),
    allowMultipleSubmissions: z.boolean().default(false),
    maxSubmissions: z.number().positive().nullable().optional(),
    submissionDeadline: z.coerce.date().nullable().optional(),
    collectEmail: z.boolean().default(true),
    collectName: z.boolean().default(true),
    respondentFields: z.array(z.object({
        fieldName: z.string().trim().min(1),
        label: z.string().trim().min(1),
        type: z.enum(['text', 'email', 'number', 'tel', 'url', 'date']).default('text'),
        required: z.boolean().default(false),
        placeholder: z.string().optional(),
        validation: z.object({
            minLength: z.number().optional(),
            maxLength: z.number().optional(),
            pattern: z.string().optional()
        }).optional()
    })).optional(),
    settings: z.object({}).passthrough().optional()
});

// Form response submission schema
const answerSchema = z.object({
    questionIndex: z.number(),
    question: z.string().trim().min(1),
    answer: z.any() // Can be string, array, number, etc.
});

// Dynamic respondentInfo schema - accepts any object structure
export const formResponseSchema = z.object({
    formId: z.string({ required_error: 'Form ID is required' }).trim(),
    respondentInfo: z.record(z.any()).optional(), // Dynamic object - can have any keys/values
    answers: z.array(answerSchema).default([])
}).refine((data) => {
    // Validation will be done in controller based on form.respondentFields
    return true;
});

export default {
    formSchema,
    formResponseSchema
};
