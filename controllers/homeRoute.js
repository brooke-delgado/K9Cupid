const router = require("express").Router();
const { User, Pet } = require("../models");
const { sequelize } = require("../models/favorite");
// const Pet = require("../models/pet");
//const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: { exclude: ["password"] }
    });

    const users = userData.map((user) => user.get({ plain: true }));

    res.render("homepage", {
      users,
      logged_in: req.session.logged_in
      // text: "We 💗 dogs!!!"
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) =>
  res.render("homepage", { logged_in: req.session.logged_in })
);

router.get("/pets", async (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/"); //profile
    return;
  }

  res.render("pets");
});

router.get("/edit/:id", async (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login"); //profile
    return;
  }

  const editPet = await Pet.findByPk(req.params.id);

  if (editPet.owner_id === req.session.user_id) {
    res.render("edit-pet");
  } else {
    res.redirect("/profile");
  }
});

router.get("/register", async (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile"); //profile
    return;
  }

  res.render("register");
});

router.get("/login", async (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/profile"); //profile
    return;
  }

  res.render("login");
});

router.get("/profile", async (req, res) => {
  try {
    const profileData = await Pet.findAll({
      where: {
        owner_id: req.session.user_id
      }
    });

    const profile = profileData.map((item) => item.get({ plain: true }));

    res.render("profile", {
      pets: profile,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/results/:age/:breed/:gender/:size", async (req, res) => {
  try {
    const resultsData = await Pet.findAll({
      where: {
        age: req.params.age,
        breed: req.params.breed,
        gender: req.params.gender,
        size: req.params.size
      }
    });

    const results = resultsData.map((item) => item.get({ plain: true }));

    res.render("results", {
      pets: results,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
