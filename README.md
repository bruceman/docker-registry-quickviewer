About Docker Registry Quick Viewer
==================================
Docker Registry Quick Viewer is a simple web frontend of docker registry. 
It provide a easy UI based bootstrap to search images and view image details in docker registry.


Run with NodeJS
===============
1. Please make sure the NodeJS has been installed on your system.
2. Download project and unzip it or use git clone this project
```
git clone https://github.com/bruceman/docker-registry-quickviewer.git docker-registry-quickviewer

```
3. Modify config.js to feed your need, here are an example.
```js
{
    "docker.hostname": "localhost",
    "docker.port": 5000
}

```
4. Run server
```
node index
or
npm start

```

That's all, you can access http://your-host-name:3000/ to play it.


Run with Docker
===============
1. Please make sure the docker has been installed on your system.
2. Download project and unzip it or use git clone this project
```
git clone https://github.com/bruceman/docker-registry-quickviewer.git docker-registry-quickviewer

```
3. Build docker image, for example:
```
docker build -t bruceman/dr-quickviewer .

```
4. Run with docker
```
 docker run -v /root/docker-registry-quickviewer/my-config.js:/app/config.js -p 3000:3000 --name dr-quickviewer bruceman/dr-quickviewer

```
5. You can access http://your-host-name:3000/ to play it now.

> You should create my-config.js to config your docker registry server info.

Others
======
If you want to known more details about docker registry, please refer to https://github.com/docker/docker-registry


