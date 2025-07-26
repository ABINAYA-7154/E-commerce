Project Overview: Ecommerce Web App

Stack Used:
--Frontend: HTML, CSS, JavaScript
--Backend: Node.js, Express, MongoDB
--Auth & Security: JWT, bcrypt
--Uploads: Admin design upload flow
--Build Type: Modular full-stack application

Backend Features :
Secure user login/registration (JWT & bcrypt)

Admin-only image upload logic with validation

Centralized logging and modular error handling

Scalable file structure: separate controllers, models, routes

.env for config variables like DB URI and JWT secret

QR Payment module is excluded for now

Frontend Features:
Responsive UI with dynamic product display

Admin panel for uploading designs

Integrated forms for user login and registration

Design upload connects with backend API

Uses proper fetch calls and routing logic

 How to Run Locally :-
 git clone https://github.com/ABINAYA-7154/E-commerce.git
 cd E-commerce
 npm install
 PORT=5000
 MONGO_URI=your_mongo_connection
 JWT_SECRET=your_jwt_secret
 Start the server with node server.js
