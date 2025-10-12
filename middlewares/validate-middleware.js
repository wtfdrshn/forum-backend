const validate = (schema) => async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (err) {
        const status = 400;
        const msg = 'Validation Error';
        const first = Array.isArray(err.errors) && err.errors.length > 0 ? err.errors[0] : null;
        const path = first?.path ? first.path.join('.') : 'unknown';
        const code = first?.code || 'zod_error';
        const detailMessage = first?.message || 'Invalid request body';
        // Show a clean, user-friendly message without nested path prefixes
        const extraDetails = `${detailMessage}`;

        const error = {
            status,
            message: msg,
            extraDetails,
            errors: err.errors || []
        }

        console.error('[ValidateMiddleware] Schema validation failed:', {
            path,
            code,
            message: detailMessage,
            errors: err.errors
        });
        next(error);
    }
}

export default validate;