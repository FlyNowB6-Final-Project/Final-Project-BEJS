const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const { generatedOTP } = require("../utils/otpGenerator");
const nodemailer = require("../utils/nodemailer");
const { formattedDate } = require("../utils/formattedDate");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { fullname, email, phoneNumber, password } = req.body;
      const passwordValidator =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
      const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check for existing user with the same email
      const exist = await prisma.user.findUnique({
        where: { email },
      });

      // Validate required fields
      if (!fullname || !email || !phoneNumber || !password) {
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

      // Validate email format
      if (!emailValidator.test(email)) {
        return res.status(400).json({
          status: false,
          message: "Invalid email format.",
          data: null,
        });
      }

      // Validate phone number format
      if (!/^\d+$/.test(phoneNumber)) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid phone number format. It must contain only numeric characters.",
          data: null,
        });
      }

      // Validate phone number length
      if (phoneNumber.length < 10 || phoneNumber.length > 12) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid phone number length. It must be between 10 and 12 characters.",
          data: null,
        });
      }

      // Validate password format
      if (!passwordValidator.test(password)) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid password format. It must contain at least 1 lowercase, 1 uppercase, 1 digit number, 1 symbol, and be between 8 and 12 characters long.",
          data: null,
        });
      }

      // Generate and store OTP for email verification
      const otpObject = generatedOTP();
      otp = otpObject.code;
      otpCreatedAt = otpObject.createdAt;

      // Encrypt user password
      let encryptedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          fullname,
          email,
          phoneNumber,
          otp,
          otpCreatedAt,
          password: encryptedPassword,
        },
      });
      delete user.password;

      // Send email verification OTP
      const html = await nodemailer.getHTML("otp.ejs", { email, otp });
      await nodemailer.sendMail(email, "Email Activation", html);

      // Register Notification
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
  login: async (req, res, next) => {
    try {
      const { emailOrPhoneNumber, password } = req.body;
      // Find user by email or phone number
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: emailOrPhoneNumber },
            { phoneNumber: emailOrPhoneNumber },
          ],
        },
      });

      // Return error if user not found
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "invalid email or password",
          data: null,
        });
      }

      // Check if the provided password is correct
      let isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: "invalid email or password",
          data: null,
        });
      }

      // Return error if the user account is not verified
      if (!user.isVerified) {
        return res.status(403).json({
          status: false,
          message: "Account not verified. Please check your email!",
          data: null,
        });
      }

      delete user.password;
      let token = jwt.sign(user, JWT_SECRET_KEY);

      return res.status(201).json({
        status: true,
        message: "success",
        data: { ...user, token },
      });
    } catch (error) {
      next(error);
    }
  },
  verifyOtp: async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      // Set OTP expired at 2 minutes
      const otpExpired = 2 * 60 * 1000;

      // Check for existing user with the same email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found!",
        });
      }

      // Return error if the provided OTP is incorrect
      if (user.otp !== otp) {
        return res.status(401).json({
          status: false,
          message: "Invalid OTP",
          data: null,
        });
      }

      // Set Expired otp
      const currentTime = new Date();
      const isExpired = currentTime - user.otpCreatedAt > otpExpired;

      if (isExpired) {
        return res.status(400).json({
          status: false,
          message: "OTP has expired. Please resend new otp.",
          data: null,
        });
      }

      // Update user verification status
      const statusUser = await prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });

      res.status(200).json({
        status: true,
        message: "Activation successfully. You're Account is Verified",
        data: statusUser,
      });
    } catch (error) {
      next(error);
    }
  },
  resendOtp: async (req, res, next) => {
    try {
      const { email } = req.body;

      // Generate a new OTP and its creation timestamp
      const otpObject = generatedOTP();
      otp = otpObject.code;
      otpCreatedAt = otpObject.createdAt;

      // Send the new OTP via email
      const html = await nodemailer.getHTML("otp.ejs", { email, otp });
      await nodemailer.sendMail(email, "Email Activation", html);

      // Update user's OTP and OTP creation timestamp
      const resendOtp = await prisma.user.update({
        where: { email },
        data: { otp, otpCreatedAt },
      });

      res.status(200).json({
        status: true,
        message: "Resend OTP successfully",
        data: resendOtp,
      });
    } catch (error) {
      next(error);
    }
  },
  forgetPassword: async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findFirst({ where: { email } });

        if (!user) {
          return res.status(404).json({
            status: false,
            message: "user not found",
            data: null,
          });
        }

        const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY);

        const html = await nodemailer.getHTML("link-reset.ejs", {
            name: user.name,
            url: `${req.protocol}://${req.get('host')}/reset-password/${token}`,
        });

        await nodemailer.sendMail(user.email, "Password Reset Request", html);

        // Setelah pengiriman email berhasil
        return res.status(200).json({
          status: true,
          message: "Success Send Email Forget Password",
        });

    } catch (error) {
        next(error);
      }
  },
  resetPassword: async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const passwordValidator =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

        if (!passwordValidator.test(password)) {
            return res.status(400).json({
              status: false,
              message:
                "Invalid password format. It must contain at least 1 lowercase, 1 uppercase, 1 digit number, 1 symbol, and be between 8 and 12 characters long.",
              data: null,
            });
          }

        let hashPassword = await bcrypt.hash(password, 10);

        // Verify the token
        jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
              return res.status(403).json({
                status: false,
                message: "Invalid or expired token!",
                data: null,
              })
            }

            // Update password for the user
            let updateUser = await prisma.user.update({
                where: { email: decoded.email },
                data: { password: hashPassword },
            });

//            const notification = await prisma.notification.create({
//                data: {
//                    title: "Password Updated!",
//                   message:
//                        "Your password has been updated successfully!",
//                    createdDate: new Date().toISOString(),
//                    user: { connect: { id: updateUser.id } },
//                },
//            });

            // req.io.emit(`user-${updateUser.id}`, notification);
            res.status(200).json({
              status: true,
              message: "Your password has been updated successfully!",
              data: updateUser,
            });
        });
    } catch (error) {
        next(error);
    }
},  
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
