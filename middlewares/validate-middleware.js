const validate = (schema) => async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (err) {
    
        const status = 400;
        const msg = 'Validation Error';
        const details = err.errors[0].message;
        const extraDetails = details.toString();

        const error = {
            status,
            message: msg,
            extraDetails,
        }

        //console.log(error);
        next(error); 
    }
}

export default validate;