# Welcome on our Programmable web Music mix app

This app is developed for both frontend and backend sides.

## Authors

Polytech Nice-Sophia SI - Programmable Web 2015-2016:

* [Garance Vallat](mailto:garance.vallat@etu.unice.fr)
* [Max Destors](mailto:max@destors.com)
* [Hugo Simond](mailto:hugo.simond@etu.unice.fr)
* [Benjamin Benni](mailto:benjamin.benni@etu.unice.fr)


## Setting up the project
### Prerequisites
This project uses **MongoDB**, make sure it is up and running on your computer!
The preferred version is *3.2.1*
Once it is installed, you can run: 
    $ mongod
And leave it there !

You also need **npm** installed. 
You need at least to have the *2.14.12* version installed. 


You also need **bower** installed. 
You can install it with: 
    
    $ npm install -g bower
    
If you already have it, make sure your version is higher than *1.7.2*, which is the smallest the project has been tested with. 


Finally, the project uses the **ECMA Script 6** specification. If some methods are not recognised by your javascript version, make sure you have the right one!

### WebAudio API reminder
This app uses the WebAudio API.
For better results, you should use Google Chrome.

Here are the browser compatibility specifications:
 
 Feature       | Chrome      | Edge  | Firefox (Gecko) |  Internet Explorer  | Opera  | Safari
 ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | -------------
 Basic support | 14 | (yes) | 23 | Not supported | 15 | 6

 
For better results, you should use Google Chrome.

The project works well on Firefox, but you might encounter some unexpected behaviour. 

### Launching the project
To launch the project, after cloning or forking the repository, and placing yourself in the project folder: 
here are the commands you can apply for the backend part: 

	$ cd backend
	$ npm install
	$ node server.js

The backend is now running!
Now place yourself back in the project folder, and for the frontend part you can do: 

	$ cd frontend
	$ npm install && bower install
	$ grunt serve

The frontend is now running!
This frontend is associated with a watcher and a livereload module. This means it opens itself in your default browser. 

### Testing the project
You can run tests on the backend of the project. They were written using **mocha** and **sinon**.
To run them, place yourself in the *backend* folder :

    $ mocha -u tdd

# Role distribution

## Frontend part
Hugo and Garance mainly worked on the frontend part. 

If you have any thoughts regarding the music or the effects applied on the tracks, you can ask Hugo. 

About communication with the server, eg the connection or saving new mixes, you can ask Garance. 

## Backend part
Max and Benjamin mainly worked on the backend part.
 
If you have any thoughts regarding the server, you can ask any of these guys: they both worked equally on each part.
 
This includes routes, API, database, tests and tool use. 