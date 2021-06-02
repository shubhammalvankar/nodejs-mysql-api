FROM node:15

# RUN mkdir -p /app/src
# RUN apk add --no-cache bash

WORKDIR /app

# RUN adduser -S -D -h /app -s /bin/bash -G root app-user
RUN useradd -ms /bin/bash -g root app-user
# RUN ["/bin/bash", "-c", "useradd -ms /bin/bash -g root app-user"]

RUN chown -R app-user:root /app

COPY --chown=app-user:root package*.json ./

RUN npm install

COPY --chown=app-user:root . ./

USER app-user

EXPOSE 3000

# VOLUME [ "/app/node_modules" ]

CMD ["npm", "start"]
