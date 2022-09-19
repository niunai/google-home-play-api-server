FROM node:16

RUN npm update -y -g npm
RUN apt-get update
RUN apt-get install -y vim avahi-daemon libavahi-compat-libdnssd-dev locales
RUN locale-gen ja_JP.UTF-8
RUN echo "export LANG=ja_JP.UTF-8" >> ~/.bashrc

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8084

CMD ["/usr/app/boot.bash"]