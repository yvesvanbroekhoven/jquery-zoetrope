/*
 * jQuery zoetrope
 * Author: Yves Van Broekhoven
 * Created at: 2011-06-08
 */
 
(function($){
  
  var _init
  ,   _loadImage
  ,   _animate
  ,   _clb
  ;
  
  
  _init = function(opts){
    var $this = this;
    
    $this.css({
      width: opts.frame_width
    , height: opts.frame_height
    })
    
    $.when(_loadImage.call($this, opts))
     .then(function(){
       _animate.call($this, opts);
     });
  };
  
  
  _loadImage = function(opts){
    var dfd   = $.Deferred()
    ,   $this = this
    ,   img   = new Image()
    ;
    
    $(img).attr("src", opts.path)
          .load(function(){
            $this.steps = Math.floor(img.width / opts.frame_width);
            $this.append($(img));
            dfd.resolve();
          });
    
    return dfd.promise();
  };
  
  
  _animate = function(opts){
    var $this = this
    ,   $img  = $("img", $this);
    ;
    
    $this.interval = setInterval(function(){
      
      var x = parseInt($img.css("left"), 10) - opts.frame_width;
      
      if (x <= -(opts.frame_width * $this.steps)) {
        x = 0;
        _clb.call($this, opts.clb_cycle);
      }
      
      $img.css("left", x);
      
    }, opts.speed);
    
    if (opts.loop === false) {
      setTimeout(function(){
        clearInterval($this.interval);
        _clb.call($this, opts.clb_done);
      }, (opts.speed * $this.steps));
    }
  };
  
  _clb = function(clb){
    if ($.isFunction(clb)) {
      clb.call(this);
    }
  };
  
  
  $.fn.zoetrope = function(options){
    var opts = options ? $.merge(options, $.fn.zoetrope.defaults) : $.fn.zoetrope.defaults;
    
    if (opts.path === undefined) { return false; }
    
    return $(this).each(function(){
      _init.call($(this), opts);
    });
    
  };
  
  
  $.fn.zoetrope.defaults = {
    "path"        : undefined
  , "frame_width" : 16
  , "frame_height": 16
  , "speed"       : 40
  , "loop"        : true
  , "clb_cycle"   : undefined
  , "clb_done"    : undefined
  };
  
}(jQuery));