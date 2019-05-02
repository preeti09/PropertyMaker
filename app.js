var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const flash = require('express-flash-notification');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");
var nocache = require('nocache');
var compression = require('compression');
var winston = require('./config/winston');
var helmet = require('helmet');
var minify = require('express-minify');
var cache = require('./cache-middleware');
var cacheConfig = require('./cache.json');
const ThumbnailGenerator = require('video-thumbnail-generator').default
var app = express();

bodyParser.json({limit: '50mb'});
bodyParser.urlencoded({limit: '50mb', extended: true});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(cors());
app.use(helmet());
app.use(minify());
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(nocache());
//app.use(express.static(path.join(__dirname, 'public')));
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
// app.use(express.static('public',options));
app.use(cache(cacheConfig), express.static('public',options));
const sessionConfig = {
  resave: true,
  saveUninitialized: true,
  secret: 'DishmizeSecret',
};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session(sessionConfig));
const flashNotificationOptions = {
  beforeSingleRender: function(item, callback) {
    if (item.type) {
      switch(item.type) {
        case 'success':
          item.alertClass = 'alert-success';
          break;
        case 'error':
          item.alertClass = 'alert-danger';
          break;
      }
    }
    callback(null, item);
  }
};
app.use(flash(app, flashNotificationOptions));

app.use('/', require('./routes/home/crud'));
app.use('/submit-property', require('./routes/submit-property/crud'));
app.use('/submit-request', require('./routes/submit-request/crud'));
app.use('/newsletter', require('./routes/newsletter/crud'));
app.use('/subscribe', require('./routes/subscribe/crud'));
app.use('/file-upload', require('./routes/file-upload/crud'));
app.use('/login', require('./routes/login/crud'));
app.use('/registration', require('./routes/registration/crud'));
app.use('/contact-us', require('./routes/contact-us/crud'));
app.use('/about-us', require('./routes/about-us/crud'));
app.use('/amaravati-price-trends', require('./routes/price-trends/crud'));
app.use('/services', require('./routes/services/crud'));
app.use('/term-of-services', require('./routes/term-of-services/crud'));
app.use('/privacy-policy', require('./routes/privacy-policy/crud'));
app.use('/blog', require('./routes/blog/crud'));
app.use('/buy', require('./routes/buy/crud'));
app.use('/property-listing', require('./routes/property-listing/crud'));
app.use('/faq', require('./routes/faq/crud'));
app.use('/requirement', require('./routes/requirement/crud'));
app.use('/profile', require('./routes/profile/crud'));
app.use('/single-property', require('./routes/single-property/crud'));
app.use('/api', require('./routes/seo/crud'));
app.use('/price-trends/getPriceTrends', require('./routes/price-trends/crud'));
app.use('/iaminterested', require('./routes/Aminterested/crud'));
app.use('/MyFavorites', require('./routes/favorites/crud'));
app.use('/disclaimer', require('./routes/disclaimer/crud'));
app.use('/myproperties', require('./routes/myproperties/crud'));
app.use('/404', require('./routes/404/crud'));
app.use('/amaravati-plots', require('./routes/amaravati-plots/crud'));
app.use('*',function(req, res, next){
    res.status(404).redirect('/404');
});


/* const tg = new ThumbnailGenerator({
  sourcePath: 'https://avenueproperty.s3.ap-south-1.amazonaws.com/videos/small.mp4',
  thumbnailPath: './public',
  tmpDir: './public/' //only required if you can't write to /tmp/ and you need to generate gifs
});
 
tg.generateOneByPercentCb(90, (err, result) => {
  // console.log(result,' ============= ',err);
  // 'test-thumbnail-320x240-0001.png'
});
 */
 app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(9001, function(){
    console.log('Listening on 9001 Port');
});
app.setTimeout=0;
module.exports = app;
