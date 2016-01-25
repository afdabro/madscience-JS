#Gulp research notes

##Why use Gulp? 

Well, I personally found the task runner to be *extremely* easy to setup and start running tasks. I was able to get a viable build running in less than an hour! This was a welcomed change from my experiences with rapid development using Grunt. Gulp's code over configuration mantle enables quick prototyping iterations. It was built from the ground up for node streaming and maximum concurrency. Customizing the pipeline of a task can be accomplished from installing gulp plugins or using one of the node stream packages. There is even a plugin for enabling the use of Grunt packages.

View [`gulpfile.js`](https://github.com/afdabro/madscience-JS/blob/develop/DarkParadise.WarOfTheDamned/gulpfile.js) for a few example tasks. I extended the original work from [`gulp-recipes`](https://github.com/sogko/gulp-recipes/blob/master/browser-sync-nodemon-expressjs/gulpfile.js). The [`gulpfile.config.js`](https://github.com/afdabro/madscience-JS/blob/develop/DarkParadise.WarOfTheDamned/gulpfile.config.js) file helps maintain the build configuration settings. Although, I should switch to using a JSON environment configuration to separate development, test, and production variables.
