const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const bodyParser = require("body-parser")
const app = express()
const Routes = require("./routes/route.js")
const Admin = require('./models/adminSchema.js');


const PORT = process.env.PORT || 5000

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())


const connection = () => {
    try {
        mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: true,
            tlsAllowInvalidCertificates: true, // Accept invalid certificates (use with caution)
            ssl: true,
            sslValidate: false, // Disable SSL validation for testing purposes
        })
            .then(() => console.log("Connected to MongoDB"))
            .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));
    } catch (error) {
        console.log(error);

    }

}

app.use('/', Routes);

app.listen(PORT, async () => {
    await connection()
    const admin = new Admin(
        {
            name: 'saqer',
            email: 'saqer@saqer',
            password: '123456789',
            role: 'Admin',
            schoolName: 'saqer school'
        }
    );

    const existingAdminByEmail = await Admin.findOne({ email: 'saqer@saqer' });
    const existingSchool = await Admin.findOne({ schoolName: 'saqer school' });

    if (!existingAdminByEmail && !existingSchool) {
        await admin.save();
        console.log('create admin');
    }
    console.log(`Server started at port no. ${PORT}`)
})