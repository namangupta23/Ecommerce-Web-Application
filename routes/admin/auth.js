const express = require('express');

const { handleErrors } = require("./middlewares.js");
const usersRepo = require("../../repositories/users.js");
const signupTemplate = require("../../views/admin/auth/signup.js");
const signinTemplate = require("../../views/admin/auth/signin.js");
const { requireEmail, requirePassword, requirePasswordConfirmation, requiredValidEmail, requiredValidPassword } = require("./validators.js");

const router = express.Router()

router.get("/signup", (req, res) => {
    res.send(signupTemplate({ req }));
});

router.post("/signup", [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate), async(req, res) => {
        const { email, password } = req.body;
        const user = await usersRepo.create({ email, password });

        req.session.userId = user.id;
        res.redirect("/admin/products");
    })

router.get("/signout", (req, res) => {
    req.session = null;
    res.redirect("/");
})

router.get("/signin", (req, res) => {
    res.send(signinTemplate({}))
});

router.post("/signin", [requiredValidEmail, requiredValidPassword],
    handleErrors(signinTemplate), async(req, res) => {
        const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;
        res.redirect("/admin/products");
    });

module.exports = router;