<p align="center">
  <img src="https://github.com/clod44/freemage-hosting/blob/main/public/assets/logo.png?raw=true" width="25%">
  <h1 align="center">Freemage Hosting</h1>
  <p align="center">Free image Hosting Service</p>
</p>

<hr>

## What does it do
Users can upload their image files to this service and use the generated unique url to access the raw image file later on:
 - `<websiteurl>/api/image/<generated image name>.<image format>`
 - `http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:3000/api/image/8799c5e9-9fb8-4588-9a70-be0dcdd45b35.jpg`
 - generated link can be used to embed images
 - <img src="http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:3000/api/image/8799c5e9-9fb8-4588-9a70-be0dcdd45b35.jpg" height=64px alt="embedded image. if you are seeing this that means either my test server is down or you are viewing an old version of the project">
 - Image's exif data(jpg exif) is removed on client side before uploading process starts
 - Uploaded images DO NOT gets deleted after 24 hours. i didn't implement it and forgor to change the frontend 💀

## Dependencies
```json
"dependencies": {
  "dotenv": "^16.3.1",
  "ejs": "^3.1.9",
  "express": "^4.18.2",
  "express-rate-limit": "^6.7.1",
  "express-slow-down": "^1.6.0",
  "http": "^0.0.1-security",
  "mongodb": "^5.7.0",
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.1",
  "uuid": "^9.0.0",
  "yup": "^1.2.0"
}
```
## Host your own
 - `git clone https://github.com/clod44/freemage-hosting/` (latest stable)
 - cd into the folder
 - `npm i`
 - create a `.env` file in the root and fill the values:
   -  ```env
      MONGO_URI = //mongodb+srv:// ... //required field
      DB_NAME = //database name
      COLLECTION_NAME = //collection name
      MAX_UPLOAD_SIZE = //max image upload size in kb
      UPLOAD_SPEED = //max image upload speed kbps
      PORT = //port number
      PAGE_RATE_LIMIT = //requests per ip adress per 10 seconds
      API_RATE_LIMIT = //requests per ip adress per 10 seconds
      ```
   - default values are in the config.js
 - run with `npm start`
 - (optional) install pm2 to run it in background
   - `npm i pm2 -g`
   - add and start the server with `pm2 start server.js --name <a custom name>`
   - run `pm2 examples` for a general understanding of pm2

## [Website](http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:3000/)
  <img src="https://github.com/clod44/freemage-hosting/blob/main/screenshots/home.PNG?raw=true" width="100%">

## About Versions
 - `main` branch will hold the latest stable version with patches.
 - `stable-v*` branches are stable archives.
 - `dev` branch holds the latest work-in-progress version.

## Known Bugs
 - Rotated images at file picking especially in apple devices. possibly caused by deletion of exif data.

### ToDo
 - [ ] Find a reason to use a lightweight local database
    - but i really liked the idea of not worrying about data losses when updating, restarting or straight up deleting the local repo 🥹
 - [ ] convert to Typescript and take advantage of its abilities instead of writing plain js in .ts file like the last time 💀
 - [X] Use validators like ~~ZOD~~ `yup` for conveinence
 - [X] ~~Image Upload rate per session~~ API access rate per ip
 - [X] ~~Image access rate per session~~ Page access rate per ip
 - [X] Max image upload size
 - [ ] remove exif data in server too
 - [X] Use a modern requesting library like `axios`
