const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const nodemailer = require("../libs/nodemailer");
const { formattedDate } = require("../libs/formattedDate");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, phoneNumber, password } = req.body;

      const exist = await prisma.user.findUnique({
        where: { email },
      });

      if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({
          status: false,
          message: "Input must be required",
          data: null,
        });
      } else if (exist) {
        return res.status(401).json({
          status: false,
          message: "Email already used!",
        });
      }

      let encryptedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          password: encryptedPassword,
        },
      });
      delete user.password;

    //   const notification = await prisma.notification.create({
    //     data: {
    //       title: "Welcome!",
    //       message: "Your account has been created successfully.",
    //       createdDate: formattedDate(new Date()),
    //       user: { connect: { id: user.id } },
    //     },
    //   });

    //   global.io.emit(`user-${user.id}`, notification);

      res.status(201).json({
        status: true,
        message: "User Created Successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
//   login: async (req, res, next) => {
//     try {
//       let { email, password } = req.body;
//       let user = await prisma.user.findFirst({ where: { email } });
//       if (!user) {
//         return res.status(400).json({
//           status: false,
//           message: "invalid email or password",
//           data: null,
//         });
//       }

//       let isPasswordCorrect = await bcrypt.compare(password, user.password);
//       if (!isPasswordCorrect) {
//         return res.status(400).json({
//           status: false,
//           message: "invalid email or password",
//           data: null,
//         });
//       }

//       delete user.password;
//       let token = jwt.sign(user, JWT_SECRET_KEY);

//       const notification = await prisma.notification.create({
//         data: {
//           title: "Successfully Login",
//           message: "Enjoy your access Web.",
//           createdDate: formattedDate(new Date()),
//           user: { connect: { id: user.id } },
//         },
//       });

//       global.io.emit(`user-${user.id}`, notification);

//       return res.status(201).json({
//         status: true,
//         message: "success",
//         data: { ...user, token },
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
  auth: async (req, res, next) => {
    try {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  },
};
