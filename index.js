import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.render('index', { message: 'Home Page' });
});

app.get('/articles', (req, res) => {
	res.render('index', { message: 'Articles' });
});

app.get('/edit', (req, res) => {
	res.render('index', { message: 'Edit' });
});

app.use((req, res) => {
	res.render('index', { message: 'Sorry, we couldn\'t find that page!' });
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});