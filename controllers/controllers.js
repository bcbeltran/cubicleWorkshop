const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const { check, validationResult } = require('express-validator');

const Cube = require("../models/Cube");
const Accessory = require("../models/Accessory");
const User = require("../models/User");

const salt = 10;

const validateToken = (req, res, next) => {
	const accessToken = req.cookies["access-token"];

	if (!accessToken)
		return res.status(400).json({ error: "User not authenticated" });
	res.redirect('/register');
	try {
		const validToken = jwt.verify(accessToken, "secret key");
		if (validToken) {
			req.authenticated = true;
			return next();
		}
	} catch (err) {
		res.status(400).json({ error: err });
	}
};

const Index = (req, res) => {
	Cube.find(function (err, cubes) {
		if (err) return err;
	}).then((data) => {
		res.render("index", { cube: data });
	});
};

const Home = (req, res) => {
	Cube.find(function (err, cubes) {
		if (err) return err;
	}).then((data) => {
		res.render("home", { cube: data });
	});
};

const About = (req, res) => {
	res.render("about");
};

const Details = (req, res) => {
	let currCube = req.path.split("/")[2];
	Cube.findById(currCube, function (err, cubes) {
		if (err) return err;
	}).then((data) => {
		res.render("details", { cube: data });
	});
};

const Create = (req, res) => {
	res.render("create");
};

const AddCube = (req, res) => {
	let user =  {};
	let accessToken = req.cookies["access-token"];
	const validToken = jwt.verify(accessToken, "secret key");
	console.log("this is the valid token", validToken);

	User.findById(validToken._id, function (err, users) {}).then(user => console.log("this is user", user));
	const newCube = new Cube({
		creatorId: validToken._id,
		name: req.body.name,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
		difficulty: req.body.difficultyLevel,
	});
	console.log(newCube);
	// newCube.save(function (err, newCube) {
	// 	if (err) return console.error(err);
	// });

	res.redirect("/home");
};

const UpdatedDetails = (req, res) => {
	console.log(req.path);
	let currCube = req.params.id;
	Cube.findById(currCube, function (err, cubes) {
		if (err) return err;
	}).then((data) => {
		let cube = data;
		Accessory.find(function (err, accessories) {
			if (err) return err;
		}).then((data) => {
			res.render("updatedDetailsPage", { accessory: data, cube });
		});
	});
};

const GetAccessoryPage = (req, res) => {
	let currCube = req.path.split("/")[2];
	Accessory.find(function (err, accessories) {
		if (err) return err;
	}).then((data) => {
		res.render("attachAccessory", { accessory: data, currCube });
	});
};

const CreateAccessory = (req, res) => {
	res.render("createAccessory");
};

const AddAccessory = (req, res) => {
	const newAccessory = new Accessory({
		name: req.body.name,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
	});
	newAccessory.save(function (err, newCube) {
		if (err) return console.error(err);
	});

	res.redirect("/");
};

const AttachAccessory = (req, res) => {
	let currId = req.params.id;
	Cube.findById(currId, function (err, cube) {
		console.log(cube);
		Accessory.find(function (err, accessories) {
			if (err) return err;
		}).then((data) => {
			for (accessory of data) {
				if (accessory.name === req.body.accessory) {
					cube.accessories.push(accessory);
					cube.save(function (err, cube) {
						if (err) return console.error(err);
					});
					res.redirect("/updated/details/" + currId);
				}
			}
		});
	});
};

const LoginPage = (req, res) => {
	res.render("loginPage");
};

const LoginPagePOST = async (req, res) => {
	let currUser = req.body.username;

	const user = await User.findOne({ username: currUser });

	if (!user) res.status(400).json({ error: "User doesn't exist" });

	bcrypt.compare(req.body.password, user.password).then((match) => {
		if (!match) {
			res.status(400).json({
				error: "Wrong username and password combination",
			});
		} else {
			var token = jwt.sign({ _id: user._id }, "secret key");
			res.cookie("access-token", token, {
				maxAge: 60 * 60 * 24 * 1000,
			});

			console.log("Logged in");
			console.log(token);
			res.redirect("/home");
		}
	});

};

const RegisterPage = (req, res) => {
	res.render("registerPage");
};

const RegisterPagePOST = (req, res, err) => {
	const { username, password } = req.body;
	let user = User.find(function (err, users) {
		if (err) return err;
	}).then((data) => {
		for(currUser of data) {
			if(currUser.username === username){
				user = true;
				res.status(400).json({error: "Username has already been taken"});
			}
		}
		console.log("this is the user, ", user);
		if (password === req.body.repeatPassword && !user) {
			bcrypt.hash(password, salt, function (err, hash) {
				// Store hash in your password DB.
				let newUser = new User({
					username,
					password: hash,
				});
	
				newUser.save(function (err, newUser) {
					if (err) return console.error(err);
				});
	
				console.log("User registered");
				res.redirect("/login");
				return;
			});
		} else {
			res.status(400).json({ error: "Passwords must match" });
		}
	});
};

const EditCubePage = (req, res) => {
	res.render("editCubePage");
};

const DeleteCubePage = (req, res) => {
	res.render("deleteCubePage");
};

const DisplayError = (req, res) => {
	console.log(req.path);
	res.render("404");
};

module.exports = {
	Index,
	About,
	Create,
	AddCube,
	UpdatedDetails,
	CreateAccessory,
	AttachAccessory,
	DisplayError,
	AddAccessory,
	Details,
	GetAccessoryPage,
	LoginPage,
	RegisterPage,
	EditCubePage,
	DeleteCubePage,
	RegisterPagePOST,
	LoginPagePOST,
	Home,
	validateToken,
};

// {{#if errors}}
//  <div id="notifications">

// <div class="alert alert-warning" role="alert">
// {{errors}}
// </div>
// </div>
// {{/if}}
