# monitor
## 前端性能错误监控上报简

### 简单实例：
```javascript
<!DOCTYPE html> 
<html> 
<head> 
  <title>Js错误捕获</title> 
  <script type="text/javascript"> 
  /** 
   * @param {String} errorMessage  错误信息 
   * @param {String} scriptURI   出错的文件 
   * @param {Long}  lineNumber   出错代码的行号 
   * @param {Long}  columnNumber  出错代码的列号 
   * @param {Object} errorObj    错误的详细信息，Anything 
   */
  window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) { 
    console.log("错误信息：" , errorMessage); 
    console.log("出错文件：" , scriptURI); 
    console.log("出错行号：" , lineNumber); 
    console.log("出错列号：" , columnNumber); 
    console.log("错误详情：" , errorObj); 
  } 
  </script> 
</head> 
<body> 
  <script type="text/javascript" src="error.js"></script> 
</body> 
</html>

//error.js代码，简单的一句
throw new Error("出错了！"); 
```
### 注意问题：

跨域问题：

相当于window.onerror方法只捕获到了一个errorMessage，而且是固定字符串，毫无参考价值。查了点资料（Webkit源码），发现在浏览器实现script资源加载的地方，是进行了同源策略判断的，如果是非同源资源，errorMessage就被写死为“Script error”了：

解决方法：

1、添加script的crossorigin属性

2、配置一下服务器，设置静态资源Javascript的Response为Access-Control-Allow-Origin（配置服务器返回头信息，比如：cdn加速服务器静态文件头信息设置为Access-Control-Allow-Origin:*）
