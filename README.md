# increment.build

> Incrementing build numbers as a service.

<p align="center">
<img src="static/logo.png" align="center" height="80">
</p>

increment.build is a free web service which keeps track of your build numbers and increments them as needed.

```sh
❯ curl https://increment.build/my-awesome-app
1
❯ curl https://increment.build/my-awesome-app
2
❯ curl https://increment.build/my-awesome-app
3
❯ curl https://increment.build/my-other-awesome-app
1
❯ curl https://increment.build/my-other-awesome-app/set/1267
1267
❯ curl https://increment.build/my-other-awesome-app
1268
```

## Why?
- If you give every build that you make it's own build number, you can easily figure out which build caused trouble if problems arise.
- Automatically incrementing the build number requires you to first figure out what is the highest build number out there, which might not be trivial.
- As an iOS or Android developer, you are required to increase the build number for each binary that you upload. If you forget it, the binary will be rejected and you will have to compile and upload again.
- You want to use continuous integration and don't want to commit version code increases.

## Integrating with your project

### Xcode projects

Move into the folder where your Info.plist is and execute this command:

```sh
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion (curl https://increment.build/my-awesome-app)" Info.plist
```

### Android projects

In your build.gradle, make the `versionCode` variable:
`versionCode project.hasProperty('versionCode') ? project.property('versionCode') as int : 1`
then pass the version code like this:

```sh
./gradlew assembleRelease -PversionCode=$(curl https://increment.build/my-awesome-app)
```

### Fastlane
For iOS projects, use this step:
```rb
increment_build_number(
  xcodeproj: './ios/MyAwesomeApp.xcodeproj',
  build_number: sh('curl -s https://increment.build/my-awesome-app-ios')
)
```

For Android projects, first change the `build.gradle` file as described above. Then specify the versionCode during your Gradle step:

```rb
gradle(task: 'assemble', build_type: 'Release', properties: {
  versionCode: sh('curl -s https://increment.build/my-awesome-app-android')
})
```

### Expo
```sh
node -e "a=require('./app.json');a.expo.ios.buildNumber=String((curl https://increment.build/my-app-ios));a.expo.android.versionCode=(curl https://increment.build/my-app-android);require('fs').writeFileSync('app.json', JSON.stringify(a, null, 2))"
```

## FAQ
- **My cURL also prints the progress, not just the build number!** <br>
Try to add the -s flag to prevent progress being printed:
```sh
curl -s https://increment.build/
```

- **There is no authentication! How do I prevent others from incrementing my build number?** <br>
Just use an identifier that is really hard to guess, like https://increment.build/h8i4gzu28ohw94ul. Maybe not that one exactly, but you get the idea.

- **I incremented by accident. Can I go back?** <br>
You cannot decrease the counter. I recommend that you just don't care - skipping build numbers is not the end of the world. If you really want to go back, just use a new identifier.

- **I don't trust you, you will one day serve me malicious code instead of build numbers!** <br>
Good for you, the saying is that trust is good, control is better. You can add a check that the response that you get from increment.build is purely numeric.

- **My current build number is already at 2498. How can I make increment.build start from this number?**<br>
There is another endpoint for this. Simply append `/set/{your_number}` and your counter will jump to this number.
```sh
curl https://increment.build/my-awesome-app/set/2498
```

## Running the service yourself
Clone the repo and run `npm i`. Compile the sources with `npm run build` and start with `npm start`.
You need to have a MongoDB running and expose the connection string under the environment variable `MONGO_URL`. It will create a new database called `'incrementbuild'`.

It can be deployed to Heroku with no additional configuration, just make sure you have specified the `MONGO_URL` environment variable.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Pull requests are welcome, especially about how to integrate with certain services.


## Credits
This service is brought to you by [Jonny Burger](jonny.io) for free! As a return, let me advertise two things really quick! 😊

- Check out my app [AnySticker](https://anysticker.app), which allows you to create and publish WhatsApp and Instagram stickers for your brand!
- Hire me and and a team of experts to build your MVP in 100 days: We are [Axelra](https://axelra.com).

## License
MIT
