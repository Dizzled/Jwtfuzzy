FROM node:12 as installer

# Create app directory
WORKDIR /Jwtfuzzy
WORKDIR /Jwtfuzzy/api
WORKDIR /Jwtfuzzy/client
WORKDIR /Jwtfuzzy
RUN npm i concurrently

# Copy over files
COPY . .

# Install required packages
WORKDIR /Jwtfuzzy/api
RUN npm i -g typescript ts-node
RUN npm install --production --unsafe-perm
RUN npm install react-scripts@4.0.3 -g --silent
RUN npm dedupe
WORKDIR /Jwtfuzzy/client
RUN npm i -g typescript ts-node
RUN npm install --production --unsafe-perm
RUN npm install react-scripts@4.0.3 -g --silent
RUN npm dedupe

# Run everything?
WORKDIR /Jwtfuzzy
FROM node:12-alpine
ARG BUILD_DATE
ARG VCS_REF
LABEL maintainer="Dustin L" \
    org.opencontainers.image.title="JWT Token" \
    org.opencontainers.image.description="The safest nest for your most valuable eggs." \
    org.opencontainers.image.authors="Netspi-U-2021" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.version="12.7.1" \
    org.opencontainers.image.url="insert-url-here" \
    org.opencontainers.image.source="https://github.com/Yaeger/ChickenFinancial" \
    org.opencontainers.image.revision=$VCS_REF \
    org.opencontainers.image.created=$BUILD_DATE
COPY --from=installer --chown=chicken /ChickenFinancial .
EXPOSE 30001
CMD ["npm", "start"]