const express = require('express');
const app = express();
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./middleware/passport'); // Adjusted to require passport config
const mongoose = require('mongoose');
require('dotenv').config();

const {seedProspectDB} = require('./prospectseed');
const {seedClientDB} = require('./clientseed')

const { authRoutes } = require('./routes/authRoutes');
const { adminClientRoutes } = require('./routes/adminRoutes/adminClientRoutes');
const { advisorRoutes } = require('./routes/advisorRoutes');
const { meetingAndTasksRoutes } = require('./routes/meetingAndTaskRoutes');
const { firefliesRouter } = require('./fireFlies/fetchFromFireflies');
const { rowWiseTaskRoutes } = require('./routes/rowWiseTaskRoutes');
const {calendlyRoutes} = require('./routes/adminRoutes/calendlyRoutes')
const{calendlyRes} = require('./Calendly/calendlyGetRes')
const {bookingRoutes} = require('./routes/adminRoutes/bookingRoutes')
const {prospectRoutes} = require('./routes/adminRoutes/prospectRoutes')
const {adminMemberRoutes} = require('./routes/adminRoutes/memberRoutes')
const cors = require('cors');

// Initialize constants
const port = process.env.PORT || 8000;
mongoose.connect(process.env.DB_URL)
  .then(() => { console.log('connection open to DB'); })
  .catch((err) => { console.log(err); });

// Middleware configuration
app.use(express.json());  // Only use once
app.use(cors({
  origin: process.env.CORS_URL,  // Replace with your frontend's origin
  credentials: true
}));

app.use(cookieParser());  // Should come before routes that need cookies
app.use(passport.initialize());  // Should come before routes that use passport

// Import the authMiddleware to protect routes
// const { protect } = require('./middleware/authMiddleware');

// Apply routes with authMiddleware where needed (e.g., for /admin/clients route)
app.use('/admin',adminClientRoutes);  // Example of protected route
app.use('/admin',advisorRoutes);
app.use(firefliesRouter);
app.use('/admin',meetingAndTasksRoutes);
app.use('/admin',rowWiseTaskRoutes);
app.use('/admin',bookingRoutes);
app.use('/admin',adminMemberRoutes)
app.use('/admin/api/calendly', calendlyRoutes);
app.use('/admin/api/calendly',calendlyRes);
app.use('/admin',prospectRoutes)

// seedProspectDB()
// seedClientDB()


// Auth routes (these might not need protection)
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'hello from turtle finance server' });
});

app.listen(port, () => {
  console.log(`server started at ${port}`);
});
