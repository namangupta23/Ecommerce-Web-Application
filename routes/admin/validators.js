const { check } = require("express-validator");
const usersRepo = require("../../repositories/users.js")

module.exports = {
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must provide a valid email")
        .custom(async(email) => {
            const exisitngUser = await usersRepo.getOneBy({ email });

            if (exisitngUser) {
                throw new Error("Email in use")
            }
        }),

    requirePassword: check("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 to 20 characters"),

    requirePasswordConfirmation: check("passwordConfirmation")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Must be between 4 and 20 characters")
        .custom((passwordConfirmation, { req }) => {
            console.log(req.body)
            if (passwordConfirmation !== req.body.password) {
                throw new Error("Passwords must match");
            }
            return true;
        }),

    requiredValidEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must provide a valid email")
        .custom(async(email) => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) {
                throw new Error("Email not found");
            }
        }),
    requiredValidPassword: check("password")
        .trim()
        .custom(async(suplied, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) {
                throw new Error("Invalid Password");
            }
            const validPassword = await usersRepo.comparePasswords(user.password, suplied);
            if (!validPassword) {
                throw new Error("Invalid Password");
            }
        }),
    requireTitle: check("title")
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage("Must be between 5 and 40 characters"),
    requirePrice: check("price")
        .trim()
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage("Must be a number greater than 1")
};