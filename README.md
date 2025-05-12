<h1>Fitty</h1>
A comprehensive fitness application that enables users to track their progress, join supportive communities, and achieve their fitness goals.

<h2>Overview</h2>
Fitty is designed to be your all-in-one fitness companion, providing tools for tracking workouts, monitoring progress, and connecting with like-minded individuals on their fitness journey. Explore features such as post-sharing, meal/workout diaries, meal/workout suggestions, and messaging.

<h2>Getting Started</h2>
<h3>Prerequisites</h3>
<ul>
 <li>Node.js and npm installed.</li>
 <li>Expo Go app (for mobile testing)</li>
</ul>

<h3>Installation</h2>
<ol>
 <li>Clone the repository</li>
 <br>git clone https://github.com/yourusername/fitty.git
 <br>cd fitty
 <li>Install dependencies for both backend and frontend</li>
<h4>Install backend dependencies</h4>
<br>npm install

<h4>Install frontend dependencies</h4>
<br>cd frontend
<br>npm install
<br>cd ..
</ol>

<h2>Configuration</h2>
<h3>MongoDB Connection</h3>
<ol>
 <li>Create a .env file in the root directory</li>
 <li>Add your MongoDB connection string:</li>
 MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.uisle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
 <li>Replace db_username and db_password with your MongoDB credentials</li>
 <li>Make sure you have access to our MongoDB Cluster</li>
</ol>
 <h3>API URL Configuration</h3>
  The frontend application needs to know how to connect to the backend API. Configure this by creating a config file:
  <ol>
   <li>Create a new file called config.js in the frontend directory:</li>
   <br>// frontend/config.js 
<br>const config = { 
   <br> apiBaseUrl: 'http://YOUR_BACKEND_IP:19000', 
<br>};
<br>export default config;
   <li>Replace YOUR_BACKEND_IP with your device's actual IP address (e.g., http://123.456.7.890:19000)</li>
  </ol>
<h2>Running the Application</h2>
<h3>Start the Backend Server</h3>
npm start
<h3>Launch the Frontend</h3>
cd frontend
npx expo start

After running the frontend command, a QR code will appear in your terminal. Scan this code with your mobile device's camera or through the Expo Go app to launch Fitty on your device.

<h2>Testing the Application</h2>
You can create a new account directly in the app, or use these test credentials:
<br>Username: fitty
<br>  or
<br>Email: fitty@fitty.com
<br>Password: fitty

<h2>Features</h2>
<ul>
 <li>Workout tracking</li>
 <li>Community support</li>
 <li>Meal tracking</li>
 <li>Workout recommendations</li>
 <li>Meal recommendations</li>
</ul>
