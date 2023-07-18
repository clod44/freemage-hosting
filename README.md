<p align="center">
  <img src="https://github.com/clod44/freemage-hosting/blob/main/public/assets/logo.png?raw=true" width="25%">
  <h1 align="center">Freemage Hosting</h1>
  <p align="center">Free image Hosting Service</p>
</p>

<hr>

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fclod44%2Ffreemage-hosting%2Fmain%2Fpackage.json&query=%24.version&label=version)
![Website](https://img.shields.io/website?url=http%3A%2F%2Fec2-3-8-184-85.eu-west-2.compute.amazonaws.com%3A2999&label=website)
![Known Vulnerabilities](https://snyk.io/test/github/clod44/freemage-hosting/badge.svg)
![Codacy branch grade](https://img.shields.io/codacy/grade/65e3a4002ee747a5af0e54aaef3a015b/main)


## What does it do
Users can upload their image files to this service and use the generated unique url to access the raw image file later on:
 - `<websiteurl>/api/image/<generated image name>.<image format>`
 - `http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:2999/api/image/8799c5e9-9fb8-4588-9a70-be0dcdd45b35.jpg`
 - generated link can be used to embed images
 - <img src="http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:2999/api/image/8799c5e9-9fb8-4588-9a70-be0dcdd45b35.jpg" height=64px alt="embedded image. if you are seeing this that means either my test server is down or you are viewing an old version of the project">
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
  "https": "^1.0.0",
  "mongodb": "^5.7.0",
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.1",
  "uuid": "^9.0.0",
  "yup": "^1.2.0"
}
```
## Host your own
 - `git clone https://github.com/clod44/freemage-hosting/ --branch stable-v2.0.0`
    - use `--branch main` for the latest version and follow the instructions in the `main` branch instead.
 - cd into the folder
 - `npm i`
 - create `.env` file in the root and fill the values:
   -  ```env
      ENABLE_HTTPS=       //true - false
      HTTP_PORT=          //if https isn't enabled
      HTTPS_PORT=         //if https is enabled
      MONGO_URI =         //mongodb+srv:// ... //required field
      DB_NAME =           //database name
      COLLECTION_NAME =   //collection name
      MAX_UPLOAD_SIZE =   //max image upload size in kb
      UPLOAD_SPEED =      //max image upload speed kbps
      PAGE_RATE_LIMIT =   //requests per ip adress per 10 seconds
      API_RATE_LIMIT =    //requests per ip adress per 10 seconds
      ```
   - default values are in the config.js
 - run with `npm start`
 - (optional) install pm2 to run it in background
   - `npm i pm2 -g`
   - add and start the server with `pm2 start server.js --name <a custom name>`
   - run `pm2 examples` for a general understanding of pm2
 - https option expects `private-key.key` and `certificate.crt` files in `ssl` folder
## Features
fill here

#### Tips
 - [how to make self signed ssl certificate](https://adamtheautomator.com/https-nodejs/)

## [Website](http://ec2-3-8-184-85.eu-west-2.compute.amazonaws.com:2999/)
  <img src="https://github.com/clod44/freemage-hosting/blob/main/screenshots/home.PNG?raw=true" width="100%">

## About Versions
 - `main` : has the latest stable version
 - `stable-v*` : stable/completed versions
 - `dev-v*` : work-in-progress versions
 - `dev` : playground

## Known Bugs
 - Rotated images at file picking especially in apple devices. possibly caused by deletion of exif data.

### ToDo
 - [ ] Find a reason to use a lightweight local database
    - but i really liked the idea of not worrying about data losses when updating, restarting or straight up deleting the local repo 🥹
 - [ ] convert to Typescript and take advantage of its abilities instead of writing plain js in .ts file like the last time 💀
 - [ ] remove exif data in server too
