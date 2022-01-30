FROM node:12 as installer

# Run everything
WORKDIR /Jwtfuzzy
ENV PORT 80
# Copy over files
COPY package.json /Jwtfuzzy
RUN npm install --production --unsafe-perm

COPY . /Jwtfuzzy
EXPOSE 42000
CMD ["npm", "start"]