# lambda-vehicle-image-resize
AWS Lambda NodeJS 8.10 Vehicle Image Resizer Script

Using Node 8.10 right now. Cannot be tested locally using node. Must be ran inside a Docker container due to lambda OS requirements.

In the current working directory connect to the Docker container (to run npm or other node commands) using the following:

`docker run -it --rm -v "$PWD":/var/task lambci/lambda:build-nodejs8.10 /bin/bash`

You can simulate running the lambda function in an AWS Lambda environment with the following command. Remember to change the ACCESS_KEY_HERE and SECRET_KEY_HERE to your credentials. It'll use the sample event.json to send the event.

`cat event.json | docker run --rm -v "$PWD":/var/task -i -e DOCKER_LAMBDA_USE_STDIN=1 -e AWS_ACCESS_KEY_ID=ACCESS_KEY_HERE -e AWS_SECRET_ACCESS_KEY=SECRET_KEY_HERE lambci/lambda:nodejs8.10`

At the moment, it will resize to 90x68, 345x260, and 1024x768 (max). On photos that don't match those dimensions (that aren't larger than 1024x768) it will add a white border to keep the size the same!

Happy coding!
