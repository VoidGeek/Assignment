require('dotenv').config(); // Load environment variables from a .env file

const MONGODB_URI = process.env.MONGODB_URI;
const COOKIE_SECRET = process.env.COOKIE_SECRET; // You can also set a default port

const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: "*", // Allow requests from any origin
  credentials: true, // Enable sending cookies with the request
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: [COOKIE_SECRET], // Use your actual secret key
  }));

// Set up the MongoDB connection
try {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit(1); // Exit the process with an error code
    });
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit the process with an error code
}

app.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome to bezkoder application." });
  } catch (error) {
    console.error("Error handling the / route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Import the contact and patient routers
const contactRouter = require("./routes/contact.routes");
const patientRouter = require("./routes/patient.routes"); // Import the patient router
const postRoutes = require("./routes/postRoutes");
const serviceRouter = require("./routes/service.routes")
const testimonialRouter = require("./routes/testimonial.routes")
const imageRoutes = require('./routes/imageRoutes')
const resetRouter=require('./routes/reset.routes')

app.use("/", contactRouter); // Mount the contact router on the /api/contacts route
app.use("/", patientRouter); // Mount the patient router on the /api/patients route

app.use("/", serviceRouter);
app.use("/", testimonialRouter);
app.use('/', postRoutes);
app.use('/api', imageRoutes);
app.use('/',resetRouter);

// Import the authentication and user routes (replace with actual paths)
try {
  require("./routes/auth.routes")(app);
  require("./routes/user.routes")(app);
} catch (error) {
  console.error("Error setting up routes:", error);
}

const PORT = 8080;
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
} catch (error) {
  console.error("Error starting the server:", error);
}

// Set up the initial roles
function initial() {
  try {
    const Role = require("./models/role.model");

    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'user' to roles collection");
        });

        new Role({
          name: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }

          console.log("added 'admin' to roles collection");
        });
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
      }
    });
  } catch (error) {
    console.error("Error in the initial setup:", error);
  }
}
initial();