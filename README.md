<p align="center">
  <img src="https://github.com/clod44/freemage-hosting/blob/main/public/assets/logo.png?raw=true" width="25%">
  <h1 align="center">Freemage Hosting</h1>
  <p align="center">Free image Hosting Service</p>
</p>


<hr>

## Major Depencies
 - [x] express
 - [X] nodejs
 - [X] mongodb - image information storing
 - [X] multer - image uploading
 - and others in `package.json`  
## Host your own
 - `git clone https://github.com/clod44/freemage-hosting/`
 - cd into the folder
 - `npm i`
 - create a `.env` file in the root and fill the values:
   - ```env
      PORT=#port number
      MONGO_URI=#mongodb+srv link
      DB_NAME=#database name
      COLLECTION_NAME=#collection name for upload informations
      UPLOAD_SPEED=#upload speed in kbps example: 300 ```
 - run with `npm start`
 - (optional) install pm2 to run it in background
   - `npm i pm2 -g`
   - add and start the server with `pm2 start server.js --name <a custom name>`
   - run `pm2 examples` for a general understanding of pm2

## [Website](http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:3000/)
  <img src="https://github.com/clod44/freemage-hosting/blob/main/screenshots/home.PNG?raw=true" width="100%">

