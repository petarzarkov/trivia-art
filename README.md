# trivia-art

Trivia Art

## Setup the DB

- Build the image
  - `docker build -f db.Dockerfile -t trivia-art:local .`
- Run it
  - `docker container run -d -p 5445:5445 trivia-art:local`
