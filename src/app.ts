import express, { Application, NextFunction, Request, Response } from "express";
import { connect } from 'mongoose';
import morgan from "morgan";
import bodyParser from "body-parser";
import personRoutes from "./api/routes/person";
import userRoutes from "./api/routes/user";

const app: Application = express();

interface httpError extends Error {
	status: number;
}

connect(
	"mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/" + process.env.DB_DATABASE + "?authSource=admin")
	.then(() => {
		console.log("✔ Connected to the database!");
	})
	.catch(err => {
		console.log("❌ Cannot connect to the database!", err);
		process.exit();
	});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

app.use('/person', personRoutes);
app.use('/user', userRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
	const error: httpError = new Error('Not found') as httpError;
	error.status = 404;
	next(error);
})

app.use((error: httpError, req: Request, res: Response, next: NextFunction) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});


module.exports = app;