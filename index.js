import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3000;

const posts = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded());
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.render('index', { posts: posts });
});

app.post('/new-post', (req, res) => {
  if (!req.body) return res.sendStatus(400);
	posts.push({
		title: req.body.title,
		message: req.body.message,
		id: Date.now().toString(),
	});
	res.redirect('/');
});

app.param('id', (req, res, next, id) => {
	if (/^\d+$/.test(id)) {
		next();
	} else {
		res.status(404).send('Invalid Post ID format');
	}
});

app.get('/edit/:id', (req, res) => {
	const postId = req.params.id;
	const postToEdit = posts.find(p => p.id === postId);
	if (postToEdit) {
		res.render('edit-form', { post: postToEdit });
	} else {
		res.status(404).send('Post not found');
	}
});

app.post('/edit/:id', (req, res) => {
	const postId = req.params.id;
	const { title, message } = req.body;

	const postIndex = posts.findIndex(p => p.id === postId);

	if (postIndex !== -1) {
		posts[postIndex].title = title;
		posts[postIndex].message = message;
		console.log(`Post ${postId} updated successfully.`);

		res.redirect('/');
	} else {
		res.status(404).send('Post not found');
	}
});

app.use((req, res) => {
	res.status(404).send('Not found');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});