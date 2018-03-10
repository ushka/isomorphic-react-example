import express from 'express';
import yields from 'express-yields';
import fs from 'fs-extra';
import webpack from 'webpack';
import { argv } from 'optimist';
import { get } from 'request-promise';
import { questions, question } from '../data/api-real-urls';
import { delay } from 'redux-saga';

const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const port = process.env.PORT || 3000;
const app = express();

const useLiveData = argv.useLiveData === "true";

function * getQuestions() {
	let data;
	if(useLiveData) {
		data = yield get(questions, {gzip:true});
	} else {
		data = yield fs.readFile('./data/mock-questions.json', 'utf-8');
	}
	return JSON.parse(data);
}

function * getQuestion(question_id) {
	let data;
	if(useLiveData) {
		data = yield get(question(question_id), {gzip:true, json:true});
	} else {
		const questions = yield getQuestions();
		const question = questions.items.find(_question => _question.question_id == question_id);
		question.body = `Mock question body: ${question_id}`;
		data = {items:[question]};
	}
	return data;
}

app.get('/api/questions', function * (req, res) {
	const data = yield getQuestions();
	yield delay(150); // simulate real API delay
	res.json(data);
});

app.get('/api/questions/:id', function * (req, res) {
	const data = yield getQuestion(req.params.id);
	yield delay(150); // simulate real API delay
	res.json(data);
});

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
