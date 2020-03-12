FROM golang:latest

RUN go get github.com/gin-gonic/gin
RUN go get github.com/gomodule/redigo/redis

WORKDIR $GOPATH/src/jimmy_wang/Week8_docker
COPY . $GOPATH/src/jimmy_wang/Week8_docker

RUN go build .
EXPOSE 8080
ENTRYPOINT ["./Week8_docker"]