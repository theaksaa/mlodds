# Marble League Odds
![build](https://img.shields.io/badge/build-success-brightgreen.svg?style=flat-square) ![version](https://img.shields.io/badge/version-1.0-blue.svg?style=flat-square)

**Marble League Odds** is hub for voting on which teams are going to win, and it gives predictions based on those votes.

## Get started
### Requirements
* [Nginx](https://www.nginx.com/ "Nginx")
* [NodeJS](https://nodejs.org/en/ "NodeJS") (v18.12.0+)

### Installation
1. Install/import SSL certificate

2. Installing Nginx
```sh
$ sudo apt update
$ sudo apt install nginx
```

3. Adjusting the Firewall
```sh
$ sudo ufw enable
$ sudo ufw allow 'Nginx Full'
```

3. Change nginx config
```sh
$ sudo nano /etc/nginx/sites-available/default
```

Don't forget to change DOMAIN with your domain and path for SSL
```
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN.com www.DOMAIN.com;
    return 302 https://$server_name$request_uri;
}

server {
    # SSL configuration

    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    ssl_certificate         /etc/nginx/ssl/cert.pem;
    ssl_certificate_key     /etc/nginx/ssl/cert.key;

    server_name DOMAIN.com www.DOMAIN.com;

    location / {
        proxy_pass http://0.0.0.0:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Checking and reloading your web server
```sh
$ sudo systemctl status nginx
$ sudo systemctl reload nginx
```

5. Installing npm and NodeJS
```sh
$ sudo apt install npm
$ npm install -g n
$ n stable
```

5. Create log directory
```sh
$ sudo mkdir /var/log/web
```

6. Configure ENV
```sh
$ sudo cd /root/server
$ sudo nano .env
```

```sh
MongoDB_URL=
MongoStore_URL=
SessionSecret=
MongoStoreSecret=
JWTSecret=
PORT=
Email_SERVICE=
Email_USER=
Email_PASS=
```

5. Run server
```sh
$ sudo screen -dm -S web npm start 
```


## Author
##### Uros Aksentijevic (aksaa002@gmail.com)