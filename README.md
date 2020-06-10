# next-level-week-2020

Hello, this is a project created using TypeScript during the Next Level Week 2020. Here you'll see 3 folders: server, web and mobile. You can test all of them, to do this just follow steps below :wink:

## Ecoleta

Ecoleta is a tool to connect people and garbage collectors.

### Node.js installation

Go to: https://nodejs.org/en/download/ and download the LTS version of Node.js. We'll you need him to run this project.

### Yarn

I used Yarn for package handling, but you can use NPM as well.
To install Yarn, go to https://classic.yarnpkg.com/en/docs/install and follow the instructions.

### Expo

Here we'll install expo. Open your terminal and run:

```shell
$ yarn global add expo
```

### Repository

After that clone the project. Go to your terminal and execute the following command:

```shell
$ git clone https://github.com/matheusfenolio/next-level-week-2020.git
```

Now go to the downloaded folder:

```shell
$ cd next-level-week-2020
```

### server

Developed with Node.js, it's an endpoint where you'll get and store all the data. In this repository I already uploaded the database file, but, if you want to create a new database execute the commands inside the **server** folder:

```shell
$ yarn migrate
```

then

```shell
$ yarn seed
```

Now, let's put it to run :muscle:
Still inside the folder, execute this command:

```shell
$ yarn dev
```

Your server will run at http://localhost:3333

### web

This a part of the front-end of the application. In this part you'll be able to create new recycling points.
In your terminal run inside the **web** folder:

```shell
$ yarn start
```

After the server is ready, the application should be accessed at: http://localhost:3000

### mobile

Now you'll be able to see your registers. But first :grin: you need to download an app in your phone. The name of the app is Expo and you can find the link here: 

**IOS** https://apps.apple.com/br/app/expo-client/id982107779

**Android** https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en

Run the terminal inside of the **mobile** folder:

```shell
$ yarn start
```

You'll be redirect to a web page where you can see a QRCode. Now, scan the QRCode with your phone.

**Warning**: In Android's expo app you have the option too scan the code from there. In IOS you should open your camera and scan from there.

Now, you should be redirected to the app. Wait until it loads and then enjoy! :tada:

### Notes

If you know how NLW was, you probably notice that this project is not exactly equal to the one presented in the course. and yes, you're right! I changed some details. 
Below there are lists of all changes:


#### server

- Backend can now handle with the 'sigla' and 'nome' from IBGE's api.
- Separated files for IBGE's api methods.
- Sends the urls catergories images to a specific point.

#### web

- Implemented the final screen, where you can see if the register was stored.

#### mobile

- Separated files for IBGE's api.
- Picker selector for 'Estado' and 'Cidade'.
- Created a method to calculate the distance between the user and the recycling point. (It isn't accurate, but it will enable me to add a new feature: Create a range filter)
- In the page Details instead of just writing the categories, I show images of them.
- Created a new button to redirect you to your map app, where there will be a route created.

### References

I didn't do it alone, so, let's give some credits :pray:

- **Rocketseat:** https://rocketseat.com.br/
- **GeoDataSource:** https://www.geodatasource.com/developers/javascript
- **React Native Picker Select:** https://github.com/lawnstarter/react-native-picker-select
- **React Native Map Link:** https://github.com/tschoffelen/react-native-map-link
- **Luis Gustavo Fernandes Ferreira (English advisor):** https://github.com/lgpinguim

### Contact

**LinkedIn:** https://www.linkedin.com/in/matheusfprado/

**E-mail:** mtfprado@outlook.com

### Images

![](Web.gif)

<p align="center">
  <img src="Mobile.gif">
</p>

