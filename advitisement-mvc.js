/*
name:广告组件
author:lihaoliang
data:2014-08-04
version:1.0
*/
  //UI展示部分
  function ShowBoxView(target,option) {

     this.config = $.extend({
        targetEle:"",    //目标元素
        hoverEle:"", //鼠标hover元素
        contentEle:"",//存放广告元素
        imageArray:[],//轮播的图片
        Speed:"1000",//滚动或者淡入淡出的速度
        UnsidleTime:"2000" , //中间间隔时间
        Method:1,//轮播的方式{1:淡入淡出，2：向上滚动，3，向左滚动，4：向右滚动}
        Index:0,
        First:0,//从哪一张开始
        Len:"",
        Width:780,
        Height:58,
        IsAdaptSize:false,
        IsAutoClose:false,
        ShowTime:30000,
        AdID:0
      },option || {});

     this.config.targetEle = target;
     this.errorImages = [];
  }
  ShowBoxView.prototype = {
    constructor:ShowBoxView,

      init: function() {

        this.config.Len = this.config.imageArray.length;
        this.initDom();
        this.initStyle();
        this.loadImage();
        this.bindEvent();
      },

      initDom: function() {

        var    arr = this.config.imageArray,
            strTab = "<div class='m_tab tab'>",
        strContent = "<ul class='m_content' data-AdID= '"+this.config.AdID+"'>",
                 i = 0,
              href = "",
               src = "",
               len = this.config.Len;
        for( ; i < len ; i++ ) {
             href = arr[i].Href || "javascript:void(0)";
              src = arr[i].Src  || "";
              AdIndex = arr[i] || 1;
             if(href.indexOf("http") == 0) {
                 strContent += "<li data-Index='"+i+"'><a target='_blank' preSrc='"+arr[i].Src+"' href='"+href+"' data-AdIndex= '"+(Number(arr[i].AdIndex)+1)+"' data-ImageID='"+arr[i].ImageID+"'></a></li>";
             } else {
                 strContent += "<li data-Index='"+i+"'><a preSrc='"+arr[i].Src+"' href='"+href+"' data-AdIndex= '"+(Number(arr[i].AdIndex)+1)+"' data-ImageID='"+arr[i].ImageID+"'></a></li>";
             }
            
             strTab +="<span></span>";
        };

        strContent +="</ul>";
        strTab +="</div>";

        this.config.targetEle.empty();
        this.config.targetEle.append(strContent);

        if(arr.length > 1) {
          this.config.targetEle.append(strTab);
        }
        // if(arr.length > 0) {
        //    var tcmmStr = '<a  class="tcmm_ad" target="_blank" href="http://www.108mama.com/TcmmZone/AdPosition.aspx?AdpID='+this.config.AdID+'"  title="进入同城妈妈" ><b></b>'+
        //                       '<span class="tcmm_text"><i></i><strong>同城妈妈提供的广告</strong></span></a>';
        //    this.config.targetEle.append(tcmmStr);
        // }    

        this.config.hoverEle = this.config.targetEle.find('.m_tab');
        this.config.hoverEle.find("span").eq(this.config.Index).addClass("cur");
        this.config.contentEle = this.config.targetEle.find('.m_content');
        this.config.contentEle.append(this.config.contentEle.find("li[data-index=" + this.config.First + "]"));
      },

      initStyle: function(){

        var   $content_a = this.config.contentEle.find('a'),
              $content_li = this.config.contentEle.find('li');
              this.config.hoverEle.css({"display":"none"});

         if(this.config.IsAdaptSize) {
               this.autoResizeImage();
         }
          
          $content_a.css({width:this.config.Width+"px",height:this.config.Height+"px","line-height":this.config.Height+"px"});

          if( this.config.Method == 1 ) {
              $content_li.css({position:"absolute",top:"0px",left:"0px"});
              this.config.contentEle.css({width:this.config.Width+"px",height:this.config.Height+"px",overflow:"hidden"});
              this.config.targetEle.css({width:this.config.Width+"px",height:this.config.Height+"px"})
              return;
          } 

          if( this.config.Method == 2 ) {
                this.config.contentEle.css({position:"absolute",top:"0px",left:"0px"});               
          } else if( this.config.Method == 3 ) {
                $content_li.css({float:"left"});
                this.config.contentEle.css({position:"absolute",width:this.config.Width*this.config.Len+"px",height:this.config.Height+"px"});
          } else if( this.config.Method == 4 ) {
                $content_li.css({float:"right"});
                this.config.contentEle.css({position:"absolute",width:this.config.Width*this.config.Len+"px",height:this.config.Height+"px"}); 
          }   else {

          };  

          this.config.targetEle.css({width:this.config.Width+"px",height:this.config.Height+"px"});         
     

    },

    loadImage: function() {
        var item =  this.config.targetEle.find("a");
        var len = item.length;
        var _this = this;
        for(var i = 0 ; i < len ;i++) {

            (function(i){
                var $img = $(item[i]);
                var _src = $img.attr("preSrc");
                var img = new Image();

                 img.onload = function () {
                    $img.attr("background","");
                    $img.append('<img src="'+_src+'"/>');
                 };

                 img.onerror = function () {
                    var index = $(item[i]).closest('li').attr("data-index");
                    _this.errorImages.push({"index":index,"src":_src});
                    setTimeout(function(){
                            _this.processErrorImages();
                    },Math.max(_this.config.UnsidleTime*len,10000))
                 };

                 img.src = _src;

            })(i);

        }
    },

    processErrorImages: function () {
          var arr = this.errorImages.slice(0),
              len = arr.length,
            _this = this,
                i = 0;
          for(; i < len ; i++) {
             (function(i){
                var img = new Image();

                   img.onerror = function() {
                        _this.config.imageArray.splice(arr[i].index,1);  
                        _this.constructor.prototype.isError = true;
                   }

                   img.src = arr[i].src;
                
             })(i);
          }
    },

    autoResizeImage: function() {
          var _width = $(window).width(),
             _height = $(window).height(),
                rate = 1,
          imageWidth = this.config.Width,
         imageHeight = this.config.Height,
               wrate = _width / imageWidth,
               hrate = _height / imageHeight;

           if(wrate < 1 && hrate < 1) {
               rate = (wrate <= hrate)? wrate : hrate;
           } else if(hrate < 1) {
               rate = hrate;
           } else if(wrate < 1) {
               rate = wrate;
           } else {

           }

          if (rate < 1){
             imageWidth = Math.ceil(imageWidth * rate);
             imageHeight = Math.ceil(imageHeight * rate);
          }

          this.config.targetEle.find("img").css({widh:imageWidth+"px",height:imageHeight+"px","overflow":"hidden"});
          this.config.Width = imageWidth;
          this.config.Height = imageHeight;

    },

    start: function() {

        var _this=this;
        if ( this.config.Len <= 1) {
          return;
        }

        this.interval = setInterval(function() {
             _this.config.Index++;
             if( _this.config.Index >= _this.config.Len ) {
                _this.config.Index = 0;
             }
            _this.change(_this.config.Index);
         },this.config.UnsidleTime);

        if(this.config.IsAutoClose) {
           setTimeout("window.close()", this.config.ShowTime);
        }
    },

    change: function(index) {
       var _this = this;
       this.config.hoverEle.find("span").eq(index).addClass("cur").siblings().removeClass("cur");
       
       switch(this.config.Method) {
          case 1:  
             var _ele = this.config.contentEle.find("li[data-index=" + index + "]");
                 _ele.css({ "opacity": 0 });
                 this.config.contentEle.append(_ele);
                _ele.animate({ "opacity": 1 }, this.config.Speed);
              break;
          case 2:
                this.config.contentEle.animate({top:-parseInt(this.config.Height)*index+"px"},this.config.Speed);
              break;
          case 3:
              this.config.contentEle.animate({ "left":"-"+index*100+"%"}, this.config.Speed);
              break;
          case 4:
               this.congfig.contentEle.animate({ "right":"-"+index*100+"%"}, this.config.Speed);
               break;
          default: 
               this.congfig.contentEle.animate({ "left":"-"+index*100+"%"}, this.config.Speed);
       };

       if(this.isError) {
          if(index == this.config.Len-1) {
             _this.stop();
            setTimeout(function(){
               _this.reInit();
            },this.config.UnsidleTime)
          }
       }
       
    },

    goto: function(index) {

      this.config.Index = index;
        this.change(index);
    },

    stop: function() {

      if( this.interval ) {
        clearInterval(this.interval);
      }    
    },

    reInit: function() {
        this.errorImages.splice(0,this.errorImages.length);
        this.isError = false;
        this.config.Index = 0;
        this.init();
        this.start(); 
        
    },

    bindEvent: function() {

      var _this=this;
      this.config.targetEle.mouseenter(function(event) {
          _this.config.hoverEle.show();
      });
      this.config.targetEle.mouseleave(function(event) {
          _this.config.hoverEle.hide();
      });
      this.config.hoverEle.find('span').mouseenter(function(event) {      
          _this.stop();
          _this.goto($(this).index());
      });
      this.config.hoverEle.find('span').mouseleave(function(event) {
          _this.start();
      });

      this.config.targetEle.find("a").bind("click",function(e){
        var adpID = $(this).closest('.m_content').attr("data-AdID");
        var AdChildBit = $(this).attr("data-AdIndex") ;
        var boardID = $(this).attr("data-ImageID");
        $.getJSON("http://www.108mama.com/public/TcyAdClickAjax.aspx?adpID="+adpID+"&AdChildBit="+AdChildBit+"&boardID="+boardID+"&sourceUrl="+document.URL+"&format=json&jsoncallback=?", function(data) { });
      });

      // this.config.targetEle.find(".tcmm_ad").hover(function(){
      //   $('.tcmm_text').css("display","block");
      // },function(){
      //   $('.tcmm_text').css("display","none");
      // })
     }
   };

//业务逻辑部分,输出最终数据
 function ShowBoxModel(data){
    this.source = data;
    this.targetSource = [];
    this.buffer = null;
    this.current = null;
    this.Method = data.Method;
    this.Width = data.Width;
    this.Height = data.Height;
    this.UnsidleTime = data.UnsidleTime;
    this.serverTime = data.Time;
    this.IsAdaptSize = data.IsAdaptSize;
    IsAutoClose = data.IsAutoClose;
    this.AdID = data.AdID;
    this.init();
 }

 ShowBoxModel.prototype = {

   constructor: ShowBoxModel,

   init: function () {

      if (this.source) {
        this.filterData();
      }
   },

   filterData: function(_time) {//根据时间过滤数据
     this.targetSource = [];
     var preTime = 0;
     if(window.location.search.indexOf("=") != -1) {
          var index = window.location.search.indexOf("=");
           preTime = parseInt(window.location.search.substring(index+1)) * 60 * 60 * 1000; 
     }

     var bufferTime = ( _time && _time*1000+100000 || 0 );
      if( typeof this.source == "undefined" ) return;
        var data = this.source.List,
            len = this.source.List ? this.source.List.length : 0,
            _data = [],
            i = 0;
        for(;i < len ; i++){
             var starttime = this.formatDateToMillisecond(data[i].StartTime);
             var endtime = this.formatDateToMillisecond(data[i].EndTime);
           //  var  time = this.formatDateToMillisecond(this.serverTime);
             var time = new Date().getTime() + bufferTime  + preTime;

             if( time >= starttime && time < endtime ) {
               _data.push(data[i]);
             }
        } 

        this.setDataPosition(_data);
   },

   formatDateToMillisecond: function (_time) {
      var time = _time && _time.replace(new RegExp("-","gm"),"/");
      return (new Date(time)).getTime();
   },

   setDataPosition: function(data) { // 根据广告位置列队

     var arr = [];
     var len = this.source.MaxNum;

     for( var i = 0 ; i < len ; i++ ) {
         arr[i] = [];
       for( var j = 0 ; j < data.length ; j++ ) {
          if( data[j].AdIndex == i ) {
             arr[i].push(data[j]);
          }
       }        
     };
     this.sortData(arr);
   },

   sortData: function(arr) { //单个位置根据AdLevel 和 CreateTime 来排序
     
      var t1,t2;

      for(var i = 0 ; i < arr.length ; i++) {

          if (arr[i].length <= 1 ) continue;

          arr[i].sort(function(a,b) {
              if (a.AdLevel > b.AdLevel) return -1;
              if (a.AdLevel < b.AdLevel) return 1;
              if (a.AdLevel == b.AdLevel) {
                var _t1 = a.CreateTime.replace(new RegExp("-","gm"),"/");
                var _t2 = b.CreateTime.replace(new RegExp("-","gm"),"/");
                var t1 = (new Date(_t1)).getTime(); //得到毫秒数
                var t2 = (new Date(_t2)).getTime(); 
                 if (t1 == t2 ) return 0;
                 return ( t1 < t2 ) ? -1 : 1; 
              }
          });
      } 

     this.buildData(arr);
   },

   buildData: function(arr) {

     if( this.source.MaxNum == this.source.MaxShowNum ) { //正常广告
        this.doBuiltNormal(arr);
     } else { //代理商广告
        this.doBuiltProxy(arr);
     }

     this.doInSertDefaultPisitoinData(); 
   },

   doBuiltNormal:function(arr) {  

        var len = this.source.MaxNum;
        var arr = arr;
 
        for( var i = 0 ; i < len ; i++ ) {
          if( arr[i].length > 0 ) {
            this.targetSource.push(arr[i].shift())
          } else {
            this.targetSource.push(undefined);
          }
        }

        for( var j = 0 ; j < this.targetSource.length ; j++ ) {
             if( typeof this.targetSource[j] == "undefined" ) {
                for(var k = 0 ; k  < arr.length ; k++){
                   if(arr[k].length > 0){
                      this.targetSource[j] = arr[k].shift();
                      break;
                   }
                }

             }
        }
   },

   doBuiltProxy: function(arr) {

    for( var i = 0 ; i < arr.length ; i++ ) {
          if( arr[i].length !=0 ) {
            this.targetSource.push(arr[i][0]);
          } else {
            this.targetSource.push(undefined);
          }
    }

    var pos = this.source.MaxShowNum-1;
    var num = this.source.MaxNum -this.source.MaxShowNum;
    var temp = this.targetSource.splice(pos,this.targetSource.length-pos);

    for( var j = temp.length -1 ; j >= 0 ; j-- ) {//删除undefined的对象
      if( typeof temp[j] == "undefined" ) {
        temp.splice(j,1);
      }
    };

    if( temp.length == 0 ) {

    } else {
      var n = Math.floor(Math.random() * temp.length);  
      this.targetSource.push(temp[n]);
    }
   },

   doInSertDefaultPisitoinData: function() {

    var i = 0,
        j = 0,
        _taggetLen = this.targetSource.length,
        _defaultLen = this.source.DefaultList ? this.source.DefaultList.length : 0;

    for( ; i < _taggetLen ; i++ ) {
      if( typeof this.targetSource[i] == "undefined" ) {
        for( ; j < _defaultLen ; j++ ) {
          if( this.source.DefaultList[j].AdIndex == i ) {
             this.targetSource[i] = this.source.DefaultList[j];
             break;
          }
        }
      }
    };
    
    for(var k = this.targetSource.length - 1; k >= 0; k--) {
      if(typeof this.targetSource[k] == "undefined") {
          this.targetSource.splice(k,1);
      }
    }

    if( this.targetSource.length == 0 ) {
      this.doInsertDefaultSizeData();
    }

    this.doBuiltFinalData();
   },

   doInsertDefaultSizeData: function() {
       this.targetSource.push(this.source.SizeList || undefined);
   },

   doBuiltFinalData: function() {

    for(var i = this.targetSource.length ; i >= 0 ; i--) {
      if(typeof this.targetSource[i] == "undefined") {
          this.targetSource.splice(i,1);
      }
    };

    if( this.source.IsRandom ) {
      this.randomArray();
    }

    this.formatFinalData();
   },
   
   randomArray: function() {

      var i = this.targetSource.length;
      var temp = [];

      while(i){
        temp.push(this.targetSource.splice(parseInt(Math.random()*i--),1)[0]);
      };

      this.targetSource = temp;

   },

   formatFinalData:function() {
     this.current = this.buffer = {
        imageArray: this.targetSource,
        Width: this.Width,
        Height: this.Height,
        Method: this.Method,
        UnsidleTime: this.UnsidleTime,
        IsAdaptSize:this.IsAdaptSize,
        AdID:this.AdID,
        IsAutoClose:this.IsAutoClose
     };
   }

 }

 //控制模块
 function ShowBoxController(model,view,updateTime){ 
    this._model = model;
    this._view = view;
    this.updateTime = updateTime || 60;
    this.bufferTime =  (Math.floor(Math.random()*10) + 1)*60; //10分钟以内缓存随机
    this.waitTime = this.updateTime*60;
    //this.currentTime = new Date(model.serverTime.replace(new RegExp("-","gm"),"/"));
    this.currentTime = new Date();
    this.remainTime = ((this.currentTime.getMinutes() >= this.updateTime) ? (60-this.currentTime.getMinutes() ) : (this.updateTime-this.currentTime.getMinutes()-1) )*60
                      +(60 - this.currentTime.getSeconds());
    this.interval = "";
    this.isBuffered = false;
 }

 ShowBoxController.prototype = {

  init: function(){
      this.countDownTime();
  },

  countDownTime: function(){

    var _this = this;
    this.remainTime--;
    if( this.remainTime <= this.bufferTime  && !this.isBuffered ) {
          this._model.filterData(this.remainTime);
          this.preLoadImage(this._model.buffer);
          this.isBuffered = true ;
    } else {

    };
    if( this.remainTime == 0 ) {

        this._view.stop();
        this._view.config = $.extend(this._view.config,this._model.buffer || {});
        this._view.init();
        this._view.start();
        this.remainTime = this.waitTime;
        this.isBuffered = false ;
      //clearInterval(this.interval);
    }

    this.interval = setTimeout(function() {
        _this.countDownTime();
   },1000)
  },

  preLoadImage: function(imageArray) {
     var _this = this;
     var  len = total = imageArray.length,
          img = null,
          i = 0;
        for(; i < len ; i++) {
            (function(i){
             var img = new Image();
                 img.onload = function () {
                      if(i == len-1) {
                         _this._model.buffer.imageArray = imageArray;
                      }
                 };
                 img.onerror = function () {
                     imageArray.splice(i,1);
                     if(i == len-1) {
                       _this._model.buffer.imageArray = imageArray;
                     }
                 };
                 img.src = imageArray[i].Src;

            })(i);

        }
   }
}