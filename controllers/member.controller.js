import e from 'express';
import Badge from '../models/badge.model.js';
import Member from '../models/member.model.js';
import { sendRegistrationMail } from '../utils/mailUtils.js';

const getAllMembers = async (req, res, next) => {
    try {
        const members = await Member.find();
        return res.status(200).json(members);
    } catch (error) {
        next(error);
    }
}

const memberRegistration = async (req, res, next) => {
    try {
        const { first_name, last_name, email, prn, course, year, gender } = req.body;

        const member = new Member({
            first_name,
            last_name,
            email,
            prn,
            course,
            year,
            gender,
            member_id : 'MEM' + Math.floor(Math.random() * 10000).toString(),
        });

        const name = first_name + ' ' + last_name;

        const badge = new Badge({
            name: name,
            member_id: member.member_id,
            token: member._id,
        });

        await member.save();
        await badge.save();

        const emaildata = {
            email: email,
            name: name,
            token: badge.token,
            memId: badge.member_id,
        }

        await sendRegistrationMail(emaildata);

        res.status(201).json({
            details: 'Member registered successfully',
            member
        });
    } catch (error) {
        next(error);
    }
}


const getMemberBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Badge.findOne({ token: id });
        if (!member) {
            const error = new Error();
            error.message = 'Member does not exists';
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({ member });
    } catch (error) {
        return res.status(400).json(error);
    }
}

const verifyMemberBadge = async(req, res, next) => {
    try {
        const { id } = req.params;
        
        // First find the badge
        const badge = await Badge.findOne({ token: id });
        
        if (!badge) {
            const error = new Error();
            error.message = 'Member does not exist';
            error.statusCode = 404;
            throw error;
        }

        // Then find the corresponding member using member_id
        const member = await Member.findOne({ member_id: badge.member_id });
        
        if (!member) {
            const error = new Error();
            error.message = 'Member details not found';
            error.statusCode = 404;
            throw error;
        }

        // Combine relevant information
        const memberData = {
            name: badge.name,
            member_id: badge.member_id,
            created_at: member.createdAt,
            email: member.email,
            course: member.course,
            year: member.year
        };

        return res.status(200).json({ member: memberData });

    } catch (error) {
        next(error);
    }
}

export default { 
    memberRegistration,
    getAllMembers,
    getMemberBadge,
    verifyMemberBadge
};