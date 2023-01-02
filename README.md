# SpotFinder 🗺️

SpotFinder is an app that allows users to discover maps depending on their interests: 'Best Dog Parks', 'Best Restaurants in Town', etc. 

This project's goal is to revisit and add more features to an old project made with Node JS, Express and EJS templates: [Wiki Map](https://github.com/Purpleknife/Wiki-Map) + rebuild it using TypeScript, React JS and Express.

<strong><h3> 📌 This project's goals were:</h3></strong>
- Develop my skills in TypeScript.
- Develop my skills in React.
- Learn how to use Leaflet Maps API with React.
- Manage an app that has a lot of features.

## ERD
The [ERD](https://github.com/Purpleknife/SpotFinder/blob/master/back-end/ERD%20-%20SpotFinder.png) is in the back-end folder.


## Setup
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the `.env` files with your correct local information : username, password, database, port + Your `Cloudinary API keys`: 'upload_reset' and 'cloudname' to upload pictures.
3. Install dependencies: `npm i` in both `front-end` and `back-end` folders.
4. `cd back-end` then `npm start` to run the Server, and `cd front-end` to run the App.
5. To reset the database: `npm run db:reset`.


## Features
- [X] <strong>A non-logged-in user can :</strong>
  - [X] View all the maps.
  - [X] View all the pins.
  - [X] Search for maps.
  - [X] Visit other users profiles.
  - [X] View comments and likes on maps.
  - [X] View comments and likes on pins.
- [X] <strong>A logged-in user can :</strong>
  - [X] Create new maps (limited to 10 cities across Canada for the time being).
  - [X] Delete their own maps + comments on maps.
  - [X] Delete their own comments on maps.
  - [X] Edit their own maps (title).
  - [X] Edit their own pins (title, description, image).
  - [X] Add pins to maps: with a title, a description and an image.
  - [X] Delete their own pins.
  - [X] Delete their own comments on pins.
  - [X] Like and comment on maps.
  - [X] Like and comment on pins.
  - [X] Search for maps.
  - [X] Visit other users profiles.
  - [X] Edit their own profile.
- [X] <strong>Other :</strong>
  - [X] Pagination: Load only 6 maps at a time for each page in Landing Page.
  - [X] 'Load more': In Profile, only 5 Favorites and 5 Contributions are loaded at a time, if you want to see more, you need to click on 'Load more...' at the bottom of the page and it will load 5 more Favorites and Contributions. The same goes for the comments.

## Final Product
![one](https://user-images.githubusercontent.com/107894342/210190803-bb40381b-5997-4373-ad66-9fa9613c0e14.png)
![two](https://user-images.githubusercontent.com/107894342/210190804-20f99b70-3558-40c6-9809-df0256b39638.png)
![three](https://user-images.githubusercontent.com/107894342/210190806-4c41d26f-c884-4edc-ba0f-694f13dcfaf7.png)
![four](https://user-images.githubusercontent.com/107894342/210190809-eb7787d0-436f-41da-8402-c77ea4ed118d.png)

https://user-images.githubusercontent.com/107894342/210193314-28c47edd-65fd-4271-895e-121e169e8ad4.mp4

*NB.: Couldn't show in the video how you can upload an image when you create a pin, because of an issue with the recording app.*

## Built With
- Database
  - PostgreSQL

- Back-end:
  - express
  - TypeScript
  - Node JS
  - dotenv
  - method-override
  - morgan
  - pg

- Front-end
  - React JS
  - TypeScript
  - React-Router
  - React-Cookie
  - React-Bootstrap
  - SASS
  - bcryptjs
  - axios
  - moment
  - Cloudinary API
  - Leaflet Maps API

