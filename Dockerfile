# Docker Registry Quick Viewer
FROM dockerfile/nodejs

MAINTAINER bruceman<dev.bruce.li@gmail.com>

ADD . /app

WORKDIR /app

VOLUME ["/app"]

CMD node index

EXPOSE 3000
