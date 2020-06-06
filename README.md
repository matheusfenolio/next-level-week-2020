# next-level-week-2020

Hello, this is my project created during the Next Level Week 2020. I used TypeScript for all of them. Here you'll see 3 folders, server, web and mobile. You can test all them, just follow the steps :wink:

## Ecoleta

Ecoleta is a tool to facilitate people to find recycle points based in categories and connect those people to the collectors.

### Node.js installation

Go to: https://nodejs.org/en/download/ and download the LTS version of Node.js. We'll you him to run all this project.

### Yarn

I used the Yarn to handle with the packages, but you can use the NPM as well.
To install the Yarn, go to https://classic.yarnpkg.com/en/docs/install/#debian-stable and follow the instructions.

### Expo

Here we'll install the expo. Open your terminal and run:

```
$ yarn global add expo
```

### server

Developed with Node.js, it's a endpoint where you'll get and store all the data. In this repository I already uploaded the database file, but, if you want to create from the beginning just execute this commands inside the **server** folder:

```
$ yarn migrate

$ yarn seed
```

Now, les's put it to run :muscle:
Still inside the folder, execute this command:

```
$ yarn dev
```

You server will run in http://localhost:3333

### web

This the front end of the application, but not all of it. In this part you'll be able to create new points of recycle collect.
In your terminal run inside the **web** folder:

```
$ yarn start
```

Then the application shoul be on: http://localhost:3000

### mobile

Now you'll be able to see your registers. But first :grin: you need to download an app in your cellphone. The name of the app is Expo and you can found the link here: 

**IOS** https://apps.apple.com/br/app/expo-client/id982107779

**Android** https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en

Go to the terminal again and run inside the **mobile** folder:

```
yarn start
```

You'll be redirect to a web page where you can see a QRCode. Now, scan the QRCode with your cellphone.

**Warning**: Android's expo app you have the option too scan the code from there, but in IOS you should open your camera and scan from there.

Now, you should be redirect to the app. Wait it load and then enjoy! :tada:

### Notes

If you know how NLW was, you probably realize of this project is not exactly equal of the presented in the course.
And yes, you right! I modified some details. Following there, I'll list all modifications:


#### server

- Backend handle if the 'sigla' and 'nome' from states.
- Separated files to IBGE api.
- Sending the image url to a specific point too.

#### web

- Imlemented the finish screen, where you can see if the register was stored.

#### mobile

- Separated files to IBGE api.
- Picker selector for 'Estado' and 'Cidade'.
- Created a method to calculate the distance between the user to the point. (It isn't precisable, but it will able me to add a new feature: put a range filter)
- In the page Details instead of just write the categories, I printed the imagem of them.
- Created a new button to redirect you to your map app, where will already be with a route selected.

### References

I didn't do it alone, so, let's give some credits :pray:

- **Rocketseat:** https://rocketseat.com.br/
- **GeoDataSource:** https://www.geodatasource.com/developers/javascript
- **React Native Picker Select:** https://github.com/lawnstarter/react-native-picker-select
- **React Native Map Link:** https://github.com/tschoffelen/react-native-map-link

### Contact

**E-mail:** mtfprado@outlook.com



