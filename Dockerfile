FROM node:17 as installer

# Run everything
WORKDIR /Jwtfuzzy

# Copy over files
COPY package.json /Jwtfuzzy
RUN npm install --production --unsafe-perm
RUN npm install nodemon

COPY . /Jwtfuzzy
EXPOSE 3000
CMD ["npm", "start"]