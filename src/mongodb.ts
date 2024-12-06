import { connect } from 'mongoose';

connect(
	"mongodb://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST + "/" + process.env.DB_DATABASE + "?authSource=admin")
	.then(() => {
		console.log("✔ Connected to the database!");
	})
	.catch(err => {
		console.log("❌ Cannot connect to the database!", err);
		process.exit();
	});