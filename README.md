# Release1

This is The repository for Release 4 for the application Atomica being developed for the module *Collaborative Project* by The Pioneers

###### Prototype Design: https://www.figma.com/file/JcJeYDHMMXVelcdbKIeU9w/Guidify-Prototype?node-id=0%3A1&t=UqWPkVShNYlVzUr2-0

### Requirements
- [npm](https://nodejs.org/en/download/)
- [Android Studio Dolphin | 2021.3.1 Patch 1](https://developer.android.com/studio/archive) (to launch the emulator)


### Setup
3. `git clone` the repository
1. Change the IP address in the code to the IPv4 address in the file `frontend/ip.json`
2. Start an emulator with an API version 32
4. `cd backend`
5. `npm i`
6. `npm start`
7. In a different console `cd frontend`
8. `npm i`
9. `npx react-native run-android`


The application should start compiling and then launch onto the emulator device
