# Minna-Cab

## Project Goals

To create a cross-platform front end for multiple emulators, with built in support for MAME, that runs just as well on Windows, Linux and Mac OS, and once set up is completely controllable via arcade controls only.

It should be fast, allow others to easily tweak the themes by just editing HTML and CSS.

## Technology

The application is built using a combination of io.js (forked from node.js), atom-shell (combines io.js and chrome web browser components), and angular.js (ui framework).

It should combine the best of V8 for speedy JavaScript, async advantages of node.js, data binding advantages of angular.js, and the rendering and animation capabilities of Chrome.

If someone wants to tweak how things look, by changing colours, fonts, animations and layouts, they will be able to do it by just editing HTML and CSS. This should put theming in the realm of a large number of creative people who don't feel comfortable with getting dirty in code.

Likewise, if someone does want to contribute by extending features of the code, they should be able to easily do so since everything is done in JavaScript.

Whilst often when distributing an application it makes sense to bundle all the assets into as fewer files as possible, there is little benefit doing this for an emulator front end. Also it increases the learning curve for users unfamiliar with whatever build process you choose, and requires them to rebuild it everytime they make a change. So the decision has been made to leave everything unbundled and easy to tweak for end users.

## Installation

### All platforms

The minimum requirement to install version 1.6.1 of io.js:
https://iojs.org/en/index.html

Newer versions may work, but this is the version currently used for development.

### Windows

To install the depencies, open a Command Prompt window and run the following command from the minna-cab directory:

```bash
npm install
```

This should download and build atom-shell

Providing you don't get any errors, that should be all you need to do. You can now launch the app with the following batch file:

```bash
$ start-windows.bat
```

## Linux

To install the depencies, open a terminal window and and run the following command from the minna-cab directory:

```bash
$ npm install
```

Providing you don't get any errors, that should be all you need to do. You can now launch the app with the following shell script:

```bash
$ start-linux.sh
```


## Mac OS

Don't own one, not sure. :( Probably a bit like Linux?
