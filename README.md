<p align="center">
  <img src="https://github.com/clod44/freemage-hosting/blob/main/public/assets/logo.png?raw=true" width="25%">
  <h1 align="center">Freemage Hosting</h1>
  <p align="center">Free image Hosting Service</p>
</p>

<hr>

## What does it do
Users can upload their image files to this service and use the generated unique url to access the raw image file later on:
 - `<websiteurl>/image/<generated image name>.<image format>`
 - `http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:3000/image/7e4d4eab-ddd3-4b91-b6ab-2042df461fa3.jpeg`
 - generated link can be used to embed images
 - <img src="http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:3000/image/7e4d4eab-ddd3-4b91-b6ab-2042df461fa3.jpeg" height=64px alt="embedded image. if you are seeing this that means either my test server is down or you are viewing an old version of the project">
 - Image's exif data(jpg exif) is removed on client side before uploading process starts
 - Uploaded images DO NOT gets deleted after 24 hours. i didn't implement it and forgor to change the frontend 💀
## Major Depencies
 - [x] express
 - [X] nodejs
 - [X] mongodb - image information storing
 - [X] multer - image uploading
 - [X] piexif - exif manipulation 
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

## Known Bugs
 - Rotated images at file picking especially in apple devices. possibly caused by deletion of exif data.

### ToDo
 - [ ] Find a reason to use a lightweight local database
    - but i really liked the idea of not worrying about data losses when updating, restarting or straight up deleting the local repo 🥹
 - [ ] convert to Typescript and take advantage of its abilities instead of writing plain js in .ts file like the last time 💀
 - [ ] Use validators like ZOD for conveinence
 - [ ] Image Upload rate per session
 - [ ] Image access rate per session
 - [ ] Max image upload size
 - [ ] remove exif data in server too
 - [ ] use fetch api for post request with a library like axios to show upload progress
