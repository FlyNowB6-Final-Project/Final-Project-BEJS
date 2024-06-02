const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    getDetail: async (req, res, next) => {
        try {
            let userId = req.user.id; // Get user ID from the middleware-added user object
    
            let user = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId)
                },
            });
    
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found",
                    data: null
                });
            }
    
            delete user.password; // Remove password from the user object before sending it
    
            res.status(200).json({
                status: true,
                message: 'OK',
                data: user,
            });
    
        } catch (err) {
            next(err);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            let userId = req.user.id; // Get user ID from the middleware-added user object
            let { fullname, phoneNumber } = req.body;
    
            let existingUser = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId)
                },
            });
    
            if (!existingUser) {
                return res.status(404).json({
                    status: false,
                    message: "User not found",
                    data: null
                });
            }
    
            if (!fullname || !phoneNumber) {
                return res.status(400).json({
                    status: false,
                    message: "Name and phone number are required",
                    data: null
                });
            }
    
            let updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                  fullname,
                  phoneNumber,
                },
            });
    
            res.status(200).json({
                status: true,
                message: 'Update Data Successfully',
                data: updatedUser
            });
    
        } catch (err) {
            next(err);
        }
    },
}