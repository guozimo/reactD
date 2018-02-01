# 商户管理后台 （merchants）
------------
* 项目依赖React、Ant Design、DVA, 工程构建基于[roadhog](https://github.com/sorrycc/roadhog)

### 快速开始
* `tnpm install` 安装所有依赖包
* `tnpm start` 启动本地HTTP服务（默认监听8000端口）

### 打包构建
* `tnpm build` 文件都自动构建到 dist 目录下
* 开发环境部署：可以直接 SFTP 连接至服务器 sftp://101.200.61.20/var/www/chensen/air-chain-web/current/， 同步dist文件至current目录下
* [线下环境连接文档](http://gitlab.choicesoft.com.cn/doc/wiki/wikis/offlineevn)


### 代码规范
* 本项目代码规范基于AirBnb的代码约定, 可参考此[文档说明](https://github.com/dwqs/react-style-guide)
* 代码提交前会进行eslint校验，**请所有同学务必遵守代码规范**。
* 相关的 IDE 可以配置eslint检验，以方便你在编辑代码的时候就可以清楚知道，自己错误的地方。 
* 如：Webstorm 可以参考此[文档](https://www.jetbrains.com/help/webstorm/2017.1/eslint.html)进行配置


### 目录结构约定
* 商家后台根据菜单主要划分为
	* 首页、营业资料、营业报表、库存管理、订单中心
* 目前营业资料(Settled)和库存管理(Inventory)有一部页面已基于此项目框架进行开发，后续会陆续对老业务进行迁移

##### 目录
* mock (mock数据)
* public （页面入口）
* src
	* common(公共样式文件)
	* components（所有组件）
		* common （公共组件）
		* Inventory(库存管理相关组件)
		* Settled（营业资料相关组件）
	* entry （页面入口文件）
	* images （所有依赖的图片）
	* models
		* app.js (主框架modal)
		* inventory
		* settled
	* routes （路由配置）
		* inventory
		* settled
		* router.jsx 	（路由主入口）
	* services (所有调用的接口)
		* inventory
		* settled
		* app.js
	* utils（公共的方法）		

### 结合NG项目(chain-web)进行开发
* 目前，整个商家后台原版是基于AngularJS进行开发，现在新的业务需求已经基于React框架进行开发，因此在本地开发过程存在需要同时起两个工程项目的 HTTP 服务 进行页面联调的情况
	* chain-web 启动HTTP服务：`grunt server` 监听9000端口
	* merchants 启动HTTP服务：`tnpm start` 监听8000端口  
* 页面登陆逻辑在chain-web工程中进行，登陆后会把服务端返回的用户信息（如：用户名、用户ID 等等）存储到localstorage里面，然后 merchants工程 会去获取本地的用户信息进行展示
* 由于本地域名跨端口无法共享localstorage信息，因此需要通过统一域名+端口访问两个工程页面
	* 此处引入nginx服务，进行代理转发,相关概念逻辑可参考此[文档](http://gitlab.choicesoft.com.cn/doc/wiki/wikis/gum9ne)
	* 代理转发配置：

	```
	http {
    	server {
	        # 本地访问入口（nginx服务）
	        listen 7888;
	        server_name localhost;

	        location / {
	        	index            index.html index.php;
				proxy_pass 		http://localhost:9000;
	        }

	        location ~* /(style|views) {
				proxy_pass 		http://localhost:9000;
	        }

			 location ~* /(settled|common|inventory) {
	            proxy_pass 		http://localhost:8000;
	        }
    	}
	}
	``` 			

### 相关学习文档：
* [Ant Design](https://react-guide.github.io/react-router-cn/)
* [DVA](https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md)
* [React-router](https://react-guide.github.io/react-router-cn/)
* [Redux](http://cn.redux.js.org/index.html)
* [Redux-saga](http://leonshi.com/redux-saga-in-chinese/index.html)

更多学习文档请移步 [知识体系文档](http://gitlab.choicesoft.com.cn/doc/wiki/wikis/knowledge)
