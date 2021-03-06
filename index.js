/*
package 引用
*/

var path = require('path');
var fs = require("fs");
var async = require('async');
var colors = require('colors'); 

module.exports = function(source, map, resourcePath){
	var getSource = {
		sourcePath: this.resourcePath,
		widgetsPath: path.normalize(JSON.parse(this.query.substr(1, this.query.length - 1)).widgets),
		jsFileList: [],
		lessFileList: [],
		widgetState: '',//表示这个widget的状态，'not exit'不存在
		getWidget: function(dir){//获取source里面的package里的widget
			var _this = this,
				sourceReplace = source.replace(/PACKAGE\s(.*)\sfrom\s"(.*)"/gi, function(matchs, m1, m2){
	                var dataReplace;
	                if(m2){
	                	getSource.jsFileList = [];
	                	getSource.lessFileList = [];
	                	getSource.widgetState = '';
	                	getSource.getWidgetFile([getSource.widgetsPath + m2]);
			        	if(_this.widgetState == 'not exit'){//不存在这个widget
			        		console.error(('error in ' + _this.sourcePath).red);
			        		console.error((m2 + ' not exit!').red);
				        	return matchs;
			        	}else{//widget里的js不唯一
			        		if(_this.jsFileList.length > 1){
			        			console.error(('error in ' + _this.sourcePath).red);
				        		console.error(('Js file in widget ' + m2 + ' is not only!').red);
				        		return matchs;
				        	}else{
					        	return 'import ' + m1 + ' from \'' + path.relative(path.dirname(dir), _this.jsFileList[0]).replace(/\\/g, '/') + '\'';
				        	}
			        	}
			        	
	                }
	            });
				return sourceReplace;
		},
		getWidgetFile: function(dirL){
			var dList = dirL,
	            _this = this;
	        if(dirL.length == 0){
	        	
	            return;
	        }else{
	            var dir = dList.shift();

            	if(fs.existsSync(dir)){//目录存在
            		fs.readdirSync(dir).forEach(function (file) {
		                var states = fs.statSync(dir + '/' + file);
		                if (states.isDirectory()) {//is dir
		                    dList.push(dir + '\\' + file);

		                } else {//is file
		                	switch(path.extname(dir + file)){
		                		case '.js':
		                			_this.jsFileList.push(dir + '\\' + file);
		                			break;

		                		case '.less':
		                			_this.lessFileList.push(dir + '\\' + file);
		                			break;
		                	}
		                }
		            });

            	}else{//目录不存在
            		dList = [];
            		this.widgetState = 'not exit';

            	} 
            	this.getWidgetFile(dList);
	        }
		},
		main: function(){
			return this.getWidget(this.sourcePath);
		}
	};
	return getSource.main();
}