console.log('script.js');
//公共js区别移动端和pc端
window.onload=()=>{
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) { 
      // alert('手机端')  
      // if(!window.location.href.includes('mobile.html'))
        // window.location.href='http://localhost:9000/mobile.html'
  }else{
      // alert('PC端')      
      // if(window.location.href.includes('mobile'))
        // window.location.href='http://localhost:9000/index.html'
  } 
}
