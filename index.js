var express = require('express'),
    request = require('request'),
    app = express(),
    botRouter = express.Router(),
    server;

botRouter.get('/', function (req, res) {
  var img = 'https://nestar.in/static/logo.png';

  res.render('bot', {
    img: img,
    url: 'https://nestar.in',
    title: 'Nestar',
    descriptionText: 'Enjoy unlimited music videos you love, share it all with friends and family. Curated from YouTube.',
    imageUrl: img
  });
});

botRouter.get('/videos/:id', function (req, res) {
  request('https://nestar.in/api/video?id='+req.params.id, function (error, response, body) {
    var obj = JSON.parse(body);
    var img = 'https://i.ytimg.com/vi/'+ obj.info.videoId +'/mqdefault.jpg';
      res.render('bot', {
        img: img,
        url: 'https://nestar.in/videos/'+ obj.info.videoId,
        title:  obj.info.snippet.title,
        descriptionText: obj.info.snippet.description,
        imageUrl: img
      });
  });
});

app.use(function (req, res, next) {
  var ua = req.headers['user-agent'];

  if (/^(facebookexternalhit)|(Twitterbot)|(Pinterest)/gi.test(ua)) {
    console.log(ua, ' is a bot');
    botRouter(req, res, next);
  } else {
    next();
  }
});

app.get('/', function (req, res) {
  res.send('Serve SPA');
});

app.get('/videos/:id', function (req, res) {
  res.send('Video Page');
});

app.use('/', express.static(__dirname + '/static'));

app.set('view engine', 'jade');

server = app.listen(process.env.PORT || 8080, function () {
  console.log('Server started.');
});
