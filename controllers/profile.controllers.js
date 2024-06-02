const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    getDetail: async (req, res, next) => {
        try {
    
            let userId = req.params.id;
    
            // cek id users 
            let existingUsers = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId)
                },
            });
    
            if (!existingUsers) {
                return res.status(404).json({
                    status: false,
                    message: "Users not found",
                    data: null
                });
            }
    
            let users = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId)
                },
            });
            delete users.password
    
            res.status(200).json({
                status: true,
                message: 'OK',
                data: users,
            })
    
        } catch (err) {
            next(err);
        }
    },
      updateProfile: async (req, res, next) => {
        try {
            let userId = req.params.id;
            let {fullname, phoneNumber} = req.body;
    
            // cek id users
            let existingUsers = await prisma.user.findUnique({
                where: {
                    id: parseInt(userId)
                },
            });
    
            if (!existingUsers) {
                return res.status(404).json({
                    status: false,
                    message: "Users not found",
                    data: null
                });
            }
    
            // validasi untuk update data
            if (!fullname || !phoneNumber) {
                return res.status(400).json({
                    status: false,
                    message: "name and phone number are required",
                    data: null
                })
            }
            // update data
            let updateUsers = await prisma.user.update({
                where: {
                    id: parseInt(userId)
                },
                data: {
                  fullname,
                  phoneNumber,
                },
            })
            res.status(200).json({
                status: true,
                message: 'Update Data Successfully',
                data: updateUsers
            })   
        } catch (err) {
            next(err);
        }
    },
}