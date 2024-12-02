const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message ? err.message.toString() : 'Internal Server Error';
  const extraDetails = err.extraDetails ? err.extraDetails.toString() : 'No additional details available.';

  console.log("Status Code: %s\nMessage: %s\nDetails: %s", status, message, extraDetails);
  res.status(status).json({ error: message, details: extraDetails });

}

export default errorHandler;