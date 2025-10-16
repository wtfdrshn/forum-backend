import { Resend } from 'resend';
import config from '../config/config.js';
import RecruitmentEmailQueue from '../models/recruitmentEmailQueue.model.js';

const PROCESSING_INTERVAL = 5 * 60 * 1000; // every 5 minutes
const RETRY_DELAYS = [15 * 60 * 1000, 60 * 60 * 1000, 4 * 60 * 60 * 1000]; // 15m, 1h, 4h

const resend = new Resend('re_LxXEA3aq_Hm4RHQpn26b7Js6xBBqbkKJb');

class RecruitmentEmailQueueService {
    constructor() {
        this.isProcessing = false;
        this.startProcessing();
    }

    async addToQueue(emailData) {
        try {
            // Check if database is connected
            if (!RecruitmentEmailQueue.db || RecruitmentEmailQueue.db.readyState !== 1) {
                console.error('Database not connected, cannot add to queue');
                throw new Error('Database not connected');
            }

            const job = new RecruitmentEmailQueue({
                ...emailData,
                nextAttempt: Date.now()
            });
            await job.save();
            return job._id;
        } catch (error) {
            console.error('Error adding to recruitment email queue:', error);
            throw error;
        }
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        try {
            // Check if database is connected
            if (!RecruitmentEmailQueue.db || RecruitmentEmailQueue.db.readyState !== 1) {
                console.log('Database not connected, skipping queue processing');
                return;
            }

            const dueJobs = await RecruitmentEmailQueue.find({
                status: 'pending',
                nextAttempt: { $lte: new Date() }
            });

            for (const job of dueJobs) {
                try {
                    await this.sendEmail(job);
                    job.status = 'completed';
                    await job.save();
                } catch (err) {
                    if (job.attempts < RETRY_DELAYS.length) {
                        job.attempts += 1;
                        job.nextAttempt = new Date(Date.now() + RETRY_DELAYS[job.attempts - 1]);
                        await job.save();
                    } else {
                        job.status = 'failed';
                        await job.save();
                    }
                }
            }
        } finally {
            this.isProcessing = false;
        }
    }

    async sendEmail(job) {
        await resend.emails.send({
            from: `MIT-WPU SNSF <recruitment@snsf.live>`,
            to: job.email,
            subject: job.subject,
            html: job.html,
            replyTo: 'snsf@mitwpu.edu.in'
        });
    }

    startProcessing() {
        this.processQueue();
        setInterval(() => this.processQueue(), PROCESSING_INTERVAL);
    }
}

const recruitmentEmailQueueService = new RecruitmentEmailQueueService();

export const addRecruitmentEmailToQueue = async (emailData) => {
    return await recruitmentEmailQueueService.addToQueue(emailData);
};


