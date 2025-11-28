# How to run with Docker (recommended)

- ensure you have docker installed and running
- in the root directory run docker-compose up --build
- the app will be running at http://localhost/
- the backend routes can be inspected directly at http://localhost/api/<route>
- all the tests are run automatically during the build

  
# How to run without Docker

- navigate to the backend folder
- run these commands:
-   pip install -r requirements.txt
-   python mange.py makemigrations
-   python manage.py migrate
-   python manage.py runserver
- and to test run:
-   python manage.py test

- naviagte to the frontend/client folder
- run these commands:
-   npm install
-   npm run start
- and to test run:
-   npm test

- also navigate to frontend/client/constants.js and update it from "export const API = "http://localhost";" to "export const API = "http://localhost:8000";"

- the app will be running at http://localhost:3000/
- the backend routes can be inspected directly at http://localhost:8000/api/<route>
