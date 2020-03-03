# Introduction

This project is done using MEAN Stack

The front end is using Angular 4

The back end is using NodeJS

The Database is Mongodb and Firebase


# Software preparation

1/Contact the prior authorized person to get the environments folder which contains the api keys of Firebase, then paste it inside src folder. Also get the admin authorization to the Firebase console

2/ Install NodeJS

3/ Install Filezilla

4/ Install MobaXterm

5/ Install MongoDB

5/ Use NodeJS to install pm2, http-server globally 


# Development server
For developing purpose, run on localhost. Follow the following steps

0/ Change all the url in all files from deploy server to developing server

1/ Turn on the Database: Navigate to \data. Run in the terminal this command:  mongod --dbpath <path to \data folder>

2/ Turn on the Backend: Navigate to main folder, Run in the terminal this command: node server 

3/ Turn on the Frontend: Navigate to \src folder, Run in the terminal this command: npm start

4/ Turn on the Image hosting server: Navigate to \uploads folder, Run in the terminal this command: http-server -p 7777

4/ In browser, go to localhost:4444


Note: The API server is running on localhost:4000, The image server is running on localhost:7777



# Files need to change the url when alternate between deploy and develop server. Please refer to the comment in the file

global.ts

server.js

image-panel-canvas.component.ts 

attach-metada.component.ts

sample-file-list.component.ts

new-image.component.ts

