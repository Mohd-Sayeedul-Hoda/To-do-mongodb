//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const listSchema = new mongoose.Schema({
	todo: String,
});
let foundto = [];
const List = new mongoose.model('List', listSchema);
const list1 = new List({
	todo: 'Woke up at 6 am',
});
const list2 = new List({
	todo: 'Do 50 push ups',
});
const list3 = new List({
	todo: 'Do three DSA problem',
});

const defaultList = [list1, list2, list3];

async function main() {
	await mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });
	let x = await List.find();
	if (x.length <= 1) {
		await List.insertMany(defaultList);
	}
	mongoose.connection.close();
}
main();
async function found() {
	await mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });

	foundto = await List.find();
	console.log(foundto);
	mongoose.connection.close();
}

async function add(toadd) {
	await mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });

	const item = new List({
		todo: toadd,
	});
	await item.save();
	mongoose.connection.close();
}

async function deletemongo(idmongo) {
	await mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true });
	await List.findByIdAndDelete(idmongo);
	mongoose.connection.close();
}

app.get('/', async function (req, res) {
	const day = date.getDate();
	await found();
	res.render('list', { listTitle: day, newListItems: foundto });
});

app.post('/', async function (req, res) {
	const item = req.body.newItem;
	console.log(item);
	console.log('iam working here');
	await add(item);
	res.redirect('/');
});

app.get('/work', function (req, res) {
	res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.get('/about', function (req, res) {
	res.render('about');
});

app.post('/delete', async function (req, res) {
	const checkedItemId = req.body.checkbox;
	console.log(req.body);
	await deletemongo(checkedItemId);
	res.redirect('/');
});

app.listen(3000, function () {
	console.log('Server started on port 3000');
});
