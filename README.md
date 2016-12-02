
## 作用
举例：
比如这样一个开发目录。pages为页面目录，widgets为组件目录
```
|-src
    |-pages//页面目录
        |-login//登录页
            |-index.js
            |-index.less
            |-index.jes
    |-widgets//组件目录
        |-radio//单选按钮组件
            |-index.js
            |-index.less
            |-index.jes
```
radioWidget是一个单选按钮组件

![此处输入图片的描述][1]

login只需要一行代码
```
PACKAGE * as radio from 'radio'
```
即可引用这个组件

![此处输入图片的描述][2]

## 怎么用，how to use
### webpack配置， webpack config
```npm install packages-loader --save-dev```

```
module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
        	    exclude: /node_modules/,
            	loader: 'package',
            	query: {
            	  widgets: __dirname + '/src/widgets/'//你组件的目录地址。your directory address of widgets
            	}
            }
        ]
    }
}
```

```
//和babel一起
//user with babel
var babelPresets = {presets: ['react', 'es2015']},
    packagePresets = {widgets: __dirname + '/src/widgets/'};//你组件的目录地址。your directory address of widgets
module.exports = {
    module: {
        loaders: [
            {
            	test: /\.js$/,
            	exclude: /node_modules/,
            	loaders: ['babel-loader?'+JSON.stringify(babelPresets), 'package-loader?' + JSON.stringify(packagePresets)]
            }
        ]
    }
}
```
### 开发，development
```
//pages/login/index.js
/*
只是将es6中的模块引用import换成PACKAGE，from里面的地址只需要写你组件的名称。
Just convert import statement in es6 to PACKAGE, the directory address in 'from' only need to write your widget's name.
*/
PACKAGE * as radio from 'radio'; 

var Inner = React.createClass({
	....
    render: function(){
    	return (
    		<div className="frm_control_group">
    			<label className="frm_label">首页登录</label>
    			<radio.Radio />//引用组件。Refer to the widget
    			<a href="javascript:;" class="btn">哦哦</a>
    		</div>
    	)
    }
});

React.render(
    <Inner />,
    document.getElementById('inner')
);

```
```
//widgets/radio/index.js
var Radio = React.createClass({
    ....
});
export {Radio, Inner};//像es6那样导出组件。export widget like es6
```
## 注意点
1.组件目录里只能有一个js，也就是只能有一份入口文件，比如这里的radio目录里只能有一份js，js的位置任意。

2.组件目录里的文件是组件的所有资源，包括样式



  [1]: http://mmbiz.qpic.cn/mmemoticon/Q3auHgzwzM51nY8IaV38ksPoa7TDF8bib20MxVolQewyK0eeNiaSe6XcnSsialJ3vvw/0
  [2]: http://mmbiz.qpic.cn/mmemoticon/Q3auHgzwzM6Mc3PlejPjt1Dwc3gZs76nx08B4ap4trCYNpS8eZ9BQrAU4EDWerqg/0