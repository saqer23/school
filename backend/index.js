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

const corsOptions = {
    origin: '*', // Specify the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify which methods are allowed
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify which headers are allowed
};


app.use(cors(corsOptions))


const connection = () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10, // Adjust based on your needs
            serverSelectionTimeoutMS: 90000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        })
            .then(() => console.log('Connected to MongoDB'))
            .catch(err => console.error('Could not connect to MongoDB', err));
    } catch (error) {
        console.log('error: ::', error);

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