const express = require('express');
const connectionMongoDB = require('./src/DB/config');
const clientRouter = require('./src/routes/Client.route');
const freelancerRouter = require('./src/routes/Freelancer.route');
const reviewRouter = require('./src/routes/Review.route');
const orderRouter = require('./src/routes/order.route');
const serviceRouter = require('./src/routes/Service.route');
const categoryRouter = require('./src/routes/Category');
const subcategoryRouter = require('./src/routes/subcategory');
const inquiryRouter = require('./src/routes/Inquiry');
const reportRouter = require('./src/routes/report');
const settingRouter = require('./src/routes/setting');
const adminRouter = require('./src/routes/admin.route');


const app = express();


const PORT = 8080;
const DB_name = "fiverr_clone_db";
const URI = `mongodb://localhost:27017/${DB_name}`;



connectionMongoDB(URI).then(() => {

    console.log("MongoDB connected successfully");

}).catch((err) => {
    console.log(err);
})

app.use(express.json());

app.use("/client", clientRouter);
app.use("/freelancer", freelancerRouter);
app.use ("/review",reviewRouter)
app.use ("/order",orderRouter)
app.use("/service", serviceRouter)
app.use("/category", categoryRouter)
app.use("/subcategory", subcategoryRouter)
app.use("/inquiry", inquiryRouter)
app.use("/report", reportRouter)
app.use("/setting", settingRouter)
app.use("/admin", adminRouter)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



