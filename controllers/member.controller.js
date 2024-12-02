import e from 'express';
import Badge from '../models/badge.model.js';
import Member from '../models/member.model.js';

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

        const existingPRN = await Member.findOne({ prn });
        const existingEmail = await Member.findOne({ email });
        if (existingPRN) {
            const error = new Error();
            error.message = 'PRN already exists';
            error.statusCode = 400;
            throw error;
        }
        if (existingEmail) {
            const error = new Error();
            error.message = 'Email already exists';
            error.statusCode = 400;
            throw error;
        }

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

        res.status(201).json({
            details: 'Member registered successfully',
            member
        });
    } catch (error) {
        console.error(error);    
        return res.status(400).json({ details: error.message });
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

        const member = await Badge.findOne({ token: id });

        if (!member) {
            const error = new Error();
            error.message = 'Member does not exists';
            error.statusCode = 404;
            throw error;
        }

        return res.status(200).json({ member });

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