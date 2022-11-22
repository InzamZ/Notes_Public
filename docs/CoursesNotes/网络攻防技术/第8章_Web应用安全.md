# 第 8 章：Web 应用安全

## Web 应用安全

### HTTP 协议

- 是 client-server 模式下的一种 request-response 协议
  - Client 提交一个 http-request 消息给 server
  - Server 端根据 client 提交的请求返回 response 消息，且包含关于请求 的完成状态信息

#### HTTP Request

HTTP REQUEST 包括:

- 一个请求行:大小写敏感的 request method,一个空格，请求的 URL，一个空格，协议版本，<CR><LF>
- 0 个或者多个请求头字段(request header field)
- 仅包含<CR><LF>的空行
- 消息体(可选)

##### HTTP Request Method

- GET:获取资源
  - GET 提交的数据会放在 URL 的后面部分，以?分隔 URL 的前面部分和传输的参数，参数之间以&相连
  - GET 提交的数据大小有限制(因为浏览器对 URL 的长度有限制)，而 POST 方法提交的数据没有限制.
- POST:提交资源
  - 参数通过 request body 传输，不会出现在 URL 中，不会被缓存，不会被保存在浏览器历 史中，不限制长度
- HEAD:获取头部信息
  - 请求目标资源传输其状态描述，类似 GET 请求，但是没有响应体(Response Body)

#### HTTP：Response

- 状态行:协议版本，一个空格，响应状态码， 一个空格， 一个可能为空的状态说明文本
- 0 个或者多个响应头字段
  - 字段名(大小写敏感)，一个冒号，一个可选的 前导空格，字段值，一个可选的拖尾空格， <CR><LF>
- 一个仅包含<CR><LF>的空行
- 响应体(可选)

##### HTTP：状态码

- 2XX Successful(请求被成功收到、理解并接受)
  - 200 OK
  - 204 No Content
- 3XX Redirection(为了完成该请求还需要进一步的操作)
  - 301 Moved Permanently(总是重定向到新的 URL)
  - 302 Found (重定向一次，不存储重定向)
  - 304 Not Modified (从客户端上次访问后，内容没有变动)
  - 307 Moved Temporarily (仅在这一次重定向到新的 URL)
- 4XX Client errors (request 里面有语法错误或者不能完成)
  - 400 Bad Request
  - 401 Unauthorized
  - 403 Forbidden
  - 404 Not Found
  - 405 Method Not Allowed
- 5XX Server errors(Server 端无法响应一个明显有效的请求)
  - 500 Internal Server Error (一种通用性的错误消息)
  - 502 Bad Gateway(该服务器作为网关或者代理，且收到了从上游服务器返回的无效响应)

## URL

URL 是 URI(Uniform Resource Identifier)的一种具体类型，URL 需要遵守 URI 的语法:包含 5 个部分的层次化序列

- URI = scheme:[//authority]path[?query] [#fragment]
- 其中 authority 部分又分为 3 个部分 authority = [userinfo@]host[:port]

### scheme

Scheme:所使用的协议，例如:

- ftp:文件传输协议
- http:超文本传输协议
- https:http over tls
- file:本地文件
- git + ssh:走 ssh 隧道的 git

### location

- //... 表示远程位置
- userinfo 后面是@，这部分是可选的
- host 是远程主机，可以是主机名或者 IP 地址
- port 表示远程主机端口，如果是缺省的则不用写出(比如 http 配的是 80)，否 则需要写出(比如 http 配置为 8080)

### path

- path 部分是必须，且以 / 开始
  - 如果只有/ ，则表示为目录树的根，且必须出现
- 目录和子目录之间用/ 分隔， 注意不是 windows 风格的 \
- path 用于告诉远程主机，如何定位所共享的资源

### query

- query 部分是可选的，以 ? 开头
- 如果在 URI 的其它地方需要出现? ，则以编码%3f 表示
- 通常以 key-value 的形式成对出现，每一对之间用 & 分隔，用于给动态网页(如使用 CGI、PHP/JSP/ASP/ASP.NET 等技术制作的网页)传递参数
  - 如:Name=Mike&Role=SuperGenius

### fragment

fragment 部分是可选的，以 # 开头，比如这里的 \#top。这部分信息不会发送给远程服务器，仅对本地内容可用，用于告诉浏览器跳转到文档中的哪一个部分(锚点)。

### URL 编码

URI 是 ASCII 纯文本格式，对于可打印字符直接用字符表示;而不可打印字符空格、特殊字符(如:#, %，=, 这些字符已经用于特殊用途)，则需要进行编码，将字符编码为%xx，其中 xx 是 16 进制 ASCII 编码

- %20 = ' '
- %23 = ‘#’

## Web Page

### Form 表单

在 web 应用中，用户通过 form 表单向服务器提交数据，因此 form 表单也是攻击者攻击服务器的有效途径。 其中，action 属性说明提交表单时，向何处(URL)发送数据。而 method 属性则说明发送数据的方 式，get 通过 URL 发送数据，而 post 通过 body 发送数据。

### Javascript

一种高级、动态类型的解释型语言，并且支持对象(object) ，常用于操作网页，也可用于 server 端开发(node.js)。

### CSS

Cascading Style Sheets，用于描述应该如何显示 HTML 元素。

## Cookie 与会话管理

HTTP是无状态协议，每个请求/响应与其它请求/响应之间是相互 独立的。然而，很多web应用需要具有状态维护的功能。Web应用通过HTTP cookie来支持上述功能。

### cookie

本质上，cookies是存放在浏览器的一个数据。当用户发起请求后，服务 端在响应头中包含一个Set-Cookie字段，告诉浏览器存储一个新的cookie. 该cookie编码了需要在多个请求响应之间保持的状态。在后续的请求中，浏览器均会自动携带相关的cookie来发起请求，发送给 服务端。Cookie中的额外信息有助于web服务器定制其响应，也就是即使 请求相同，但是cookie不同，客户端得到的响应也可能不同。

### Set-Cookie 格式
 
```
<name>=<value>[; <name>=<value>]...[; expires=<date>][; domain=<domain_name>][; path=<some_path>][; secure][; httponly]
```

### Cookie 属性

- Domain属性和Path属性告诉浏览器一个请求(URL)应该携带哪些Cookies
- expires=<date>:设置cookie的有效期。如果cookie超过date所表示的日期，则cookie失效;如果没有设置这个属性，那么cookie将在浏览器关闭时失效 
- Secure，若设置了该属性，则浏览器仅能通过HTTPS通道发送该Cookies
  ```
  Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;Secure;
  ```
- HttpOnly，若设置了该属性，则只能通过http请求头携带该Cookie，而不允许JS 通过document.cookie去访问和修改该cookie

### Cookie 策略：domain和path

- 浏览器发起一个URL请求时，携带某个cookie的条件 
  - 如果cookie的domain属性是URL的域名后缀
  - 如果cookie的path属性是URL路径的前缀
- 例如:cookie的domain=example.com; path=/some/path，如果 URL为http://foo.example.com/some/path/index.html则符合条件
- 如果一个cookie没有带domain属性，则浏览器会认为当前URL的 domain为该cookie的domain

### 会话管理

- 当用户发送一个登录请求(带正确的用户名和口令)给服务端，服务端通过验证后， 会生成一个新的session token，并以cookie的方式发送给客户端
- 后续的请求中，均会携带该session token。服务端维护一个session token和用 户之间的映射，因此当服务端接收到一个带session token的请求时，能够通过 session token确定对应的用户，从而生成对应于该用户的响应
- 安全的session token应该是随机的，从而攻击者无法通过预测某个用户的 session token而发起攻击
- Session token是一种特殊的cookie，用于在多个请求/响应中将用户保持在已登 录状态

## Web安全

### Web安全目标

- 保密性(Confidentiality):恶意站点不能获得用户计算机或者其它站点上的保密信息
- 完整性(Integrity):恶意站点不能破坏用户(客户端)计算机的完整性或者用 户在其它站点的信息
- 可用性(Availability):攻击者不能阻止合法用户访问web资源 
- 隐私保护(Privacy):恶意站点不能监视用户的在线活动