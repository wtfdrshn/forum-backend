import { addEmailToQueue } from '../queues/emailQueue.js';

const sendRegistrationMail = async (emailData) => {
    try {
        await addEmailToQueue(emailData);
    } catch (error) {
        console.error('Error adding email to queue:', error);
        throw error;
    }
};

export { sendRegistrationMail };