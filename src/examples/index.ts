import express, { json } from 'express';
import router from './router/router';

const app = express();

app.use(json());

app.use('/', router());

const PORT = process.env.PORT;

app.listen(PORT, () => { 
    console.log(`Server running at PORT: ${PORT}`); 
}).on("error", (error) => {

    console.error('Server error:', error.message);
});