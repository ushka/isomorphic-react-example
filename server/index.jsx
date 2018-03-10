import express from 'express';
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack';

const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const port = process.env.PORT || 3000;
const app = express();

if(process.env.NODE_ENV === 'development') {
  const config = require('../webpack.config.dev.babel').default;
  const compiler = webpack(config);

  app.use(middleware(compiler, {
    noInfo: true
  }));

  app.use(hotMiddleware(compiler));
}

app.get(['/'], function * (req, res) {
	let index = yield fs.readFile('./public/index.html', 'utf-8');
	res.send(index);
});

app.listen(port, '0.0.0.0', ()=>console.info(`App listening on ${port}`));
