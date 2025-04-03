<h1>Fitty</h1>
A fitness app that allows users to track progress, join communities, and reach their goals.

MONGODB Connection:
create .env file in the root directory
paste:
 MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.uisle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

add your username and password to .env file
You must create your credentials in our cluster on MongoDB

API URL CONFIGURATION:
the frontend (on your phone) accesses the backend routes by making HTTP requests.
To access the server, you must configure your ip address and port for the API Url.
Within the frontend, create a new file called config.js
Add the following code:

// frontend/config.js
const config = {
    apiBaseUrl: 'http://YOUR_BACKEND_IP:19000',
    //add other configuration here if needed
  };
  
  export default config;

**Replace 'YOUR_BACKEND_IP' with your device's actual ip address**
ex: http://123.456.7.890:19000

RUNNING THE APP:
run the backend: npm start
run the frontend: 
    navigate to frontend (cd frontend) 
    then type: npx expo start



