FROM golang:latest

RUN go get github.com/gin-gonic/gin

WORKDIR $GOPATH/src/jimmy_wang/Week6
COPY . $GOPATH/src/jimmy_wang/Week6

RUN go build .
EXPOSE 8080
ENTRYPOINT ["./Week6"]