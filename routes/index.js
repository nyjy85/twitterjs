var router = require('express').Router();
var User = require('../models').User;
var Tweet = require('../models').Tweet;
var obj = {};

function routes (io) {
	router.get('/', function (req, res) {
		Tweet.findAll({include:[ User ]}).then(function(tweets){
			res.render('index', {
				title: 'Twitter.js - all tweets',
				showForm: true,
				tweets: tweets
			});
		})
	});

	router.get('/users/:name', function (req, res) {
		var userName = req.params.name;
		userTweets = User.find({where: {name: userName}}).then(function(user){
			user.getTweets({include:[User]}).then(function(list){
				console.log("THe user NAME: ", list);
				res.render('index', {title: 'Posts by - ' + userName, tweets: list, showForm: true, name:userName, namePage: true})
			})
		})
	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var userName = req.params.name,
		tweetId = parseInt(req.params.id)
		var userTweets = User.find({where: {name: userName}}).then(function(user){
			user.getTweets({where: {id: tweetId}}, {include:[User]}).then(function(tweet){
				res.render('index', {
					title: 'Tweet ' + tweetId + ' by ' + userName,
					tweets: tweet,
					name: userName,
					id: tweetId
				})
			});
		});
	});

	router.post('/submit', function (req, res) {
		var tweetName = req.body.name;
		var	tweetText = req.body.text;
		io.sockets.emit('new_tweet', {name: tweetName, text: tweetText});
		User.findOrCreate({ where: { name: tweetName }, defaults: {pictureUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKK2fghaZTkc3MLZEbrgzki1L13HN6D5wuIiZOaBgcJSRwLnaBZOkhM26I"}
	}).spread(function(user){
		Tweet.create({tweet: tweetText, UserId: user.id});
	})
});

	return router;
}
module.exports = routes;