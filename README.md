# kgk_task
1)First Clone the Repository and then run npm install



2)For .env file the configuration is given below
       PORT=Any Port Number of your choice
        JWT_SECRET_KEY = Your_SEcret_KEY_Here
        DATABASE_URL="Postgres_Url"




3)Then run "npx prisma migrate dev" and after that run npx prisma generate



4)Our model has been generated



5)To run the first Register route go to postman and http://localhost:<Your_Port_Number>/user/register and in the body choose raw and json data
         "username":"___"       //Any username of your choice
         "password":"_"         //Any password of your choice minimum 6 letters

         
6)You will get a success message with all the date if all the steps are performed successfully.


7)Similarly you can perform for login and logout 


8)You can also go to (http://localhost:<Your_Port_Number>/user/dashboard to check this is protected route.


9)And at last http://localhost:<Your_Port_Number>/user/refreshtoken to generate a new token .

