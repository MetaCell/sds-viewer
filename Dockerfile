ARG NODE_PARENT=node:16-alpine

FROM  ${NODE_PARENT} as frontend

ENV BUILDDIR=/app

RUN apk add git
RUN npm i -g @craco/craco

WORKDIR ${BUILDDIR}
COPY package.json ${BUILDDIR}
COPY yarn.lock ${BUILDDIR}
COPY nginx/default.conf ${BUILDDIR}

RUN yarn install
COPY . ${BUILDDIR}
RUN yarn build

FROM nginx:1.19.3-alpine

RUN cat /etc/nginx/conf.d/default.conf

COPY --from=frontend /app/default.conf  /etc/nginx/conf.d/default.conf

COPY --from=frontend /app/build /usr/share/nginx/html/

EXPOSE 80