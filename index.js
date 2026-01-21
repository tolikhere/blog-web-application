import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { title } from 'process';

const app = express();
// If app runs from different directories it will insure that app works correctly
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3000;
// Add all posts into the posts array as an object during session 
const posts = [];

for (let i = 0; i < 15; i++) {
	posts.unshift({
		title: "hello @world " + i,
		message: "What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?What is Lorem Ipsum?",
		id: (Date.now() + i).toString(),
	})
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Route to display all posts
app.get('/', (req, res) => {
	res.render('index', { posts: posts });
});

// Route to handle new post creation
app.post('/new-post', (req, res) => {
  if (!req.body) return res.sendStatus(400);
	posts.unshift({
		title: req.body.title,
		message: req.body.message,
		id: Date.now().toString(),
	});
	res.redirect('/'); // Back to the homepage
});

// Checking if id is integer
app.param('id', (req, res, next, id) => {
	if (/^\d+$/.test(id)) {
		next();
	} else {
		res.status(404).send('Invalid Post ID format');
	}
});

// Route to show the form for editing a specific post
app.get('/edit/:id', (req, res) => {
	const postId = req.params.id;
	const postToEdit = posts.find(p => p.id === postId);
	if (postToEdit) {
		res.render('edit-form', { post: postToEdit });
	} else {
		res.status(404).send('Post not found');
	}
});

// Route to receive the submitted edited data
app.post('/edit/:id', (req, res) => {
	const postId = req.params.id;
	const { title, message } = req.body;

	const postIndex = posts.findIndex(p => p.id === postId);

	if (postIndex !== -1) {
		posts[postIndex].title = title;
		posts[postIndex].message = message;
		console.log(`Post ${postId} updated successfully.`);

		res.redirect(`/#${postId}`);
	} else {
		res.status(404).send('Post not found for update.');
	}
});

// Route to delete a specific post
app.get('/delete/:id', (req, res) => {
	const postId = req.params.id;
	const postIndex = posts.findIndex(p => p.id === postId);

	if (postIndex !== -1) {
		posts.splice(postIndex, 1);
		console.log(`Post ${postId} deleted successfully.`);
		let anchor = "";
		if (postIndex > 0) {
			anchor = `#${posts[postIndex - 1].id}`
		}
		res.redirect(`/${anchor}`);
	} else {
		res.status(404).send('Post not found for delete');
	}
});

// Middleware to handle all invalid routes
app.use((req, res) => {
	res.status(404).send('Not found');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});