## 配置步骤

具体配置如下，假设网站根目录设定在 /usr/local/nginx/html

1、在 /usr/local/nginx/html/ 下新建两个目录

```bash
/usr/local/nginx/html/xbzyk-web
/usr/local/nginx/html/xbzyk-admin-web
```

2、编辑 /usr/local/nginx/nginx.conf 文件

```nginx
#user  nobody;
user root;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
  worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

	 #导入外部服务器配置文件
	 include /etc/nginx/conf.d/*.conf;
}
```

3、在 /etc/nginx/conf.d 下新建两个conf文件

```
/etc/nginx/conf.d/xbzyk-web.conf
/etc/nginx/conf.d/xbzyk-admin-web.conf
```

4、复制如下配置信息到两个文件中

```
server {
	listen 1035;	
	charset utf-8;		
    client_max_body_size 50m;
	client_header_buffer_size 10m;
	large_client_header_buffers 4 10m;
    location / {
	    root /usr/local/nginx/html/performance-web/dist;
	    index  index.html index.htm;
	}
	location /v1 {			
		proxy_pass http://192.168.2.240:9066/v1;        
	}
}
```

5、重启Nginx

```bash
# nginx未配置开机启动
nginx -s reload
# nginx配置为开机启动
service nginx reload
```

