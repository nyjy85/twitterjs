var router = require('express').Router();

var tweetBank = require('../tweetBank');

function routes (io) {
	router.get('/', function (req, res) {
		// send the index.html
		var allTweets = tweetBank.list();
		res.render('index', {
			title: 'Twitter.js - all tweets',
			showForm: true,
			tweets: allTweets
		});
	});

	router.get('/users/:name', function (req, res) {
		var userName = req.params.name,
			userTweets = tweetBank.find({name: userName});
		res.render('index', {
			title: 'Posts by - ' + userName,
			showForm: true,
			tweets: userTweets
		});
	});

	router.get('/users/:name/tweets/:id', function (req, res) {
		var userName = req.params.name,
			tweetId = parseInt(req.params.id),
			userTweets = tweetBank.find({id: tweetId});
		res.render('index', {
			title: 'Tweet ' + tweetId + ' by ' + userName,
			tweets: userTweets
		});
	});

	router.post('/submit', function (req, res) {
		var tweetName = req.body.name,
			tweetText = req.body.text;
		tweetBank.add(tweetName, tweetText);
		var allTweets = tweetBank.list(),
			newTweet = allTweets[allTweets.length - 1];
		io.sockets.emit('new_tweet', newTweet);
		res.redirect('/');
	});

	return router;
}


module.exports = routes;