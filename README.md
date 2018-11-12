# nodejs_tut
This is an introductory app to learn about nodejs and its deployment through heroku  

Notes:  
-This app is synced to github so it will rebuild autmatically when change is detected on master branch  
    sync is done on heroku web portal  
-config files  
    Procfile  
        specifies the commands that are executed by the app's dynos. E.g. web:app.js for web appplications or server  
        https://devcenter.heroku.com/articles/procfile  
    package.json  
        defines dependencies in installation. To create, run 'npm init' in app root directory.  
        https://devcenter.heroku.com/articles/deploying-nodejs  
-node_modules  
    dependency modules  
    install locally with 'npm install <pkg>'  
    
