/*
 * jQuery zoetrope
 * Author: Yves Van Broekhoven
 * Created at: 2011-06-08
 */
 
(function($){
  
  var _init
  ,   _loadImage
  ,   _setSteps
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
       _setSteps.call($this, opts);
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
            $this.append($(img));
            dfd.resolve();
          });
    
    return dfd.promise();
  };
  
  
  _setSteps = function(opts){
    var $img = $("img", this)[0];
    var scale = opts.frame_width / $img.width;
    var w = $img.width;
    var h = $img.height;
    
    $img.width  = w * scale;
    $img.height = h * scale ;
    
    if (opts.orientation == "vertical") {
      this.steps = Math.floor($img.height / opts.frame_height);
    } else {
      this.steps = Math.floor($img.width / opts.frame_width);
    }

  };
  
  
  _animate = function(opts){
    var $this = this
    ,   $img  = $("img", $this)
    ,   prop
    ,   step_distance
    ;
    
    if (opts.orientation == "vertical") {
      prop          = "top";
      step_distance = opts.frame_height;
    } else {
      prop          = "left";
      step_distance = opts.frame_width;
    }
    
    $this.interval = setInterval(function(){
        
        var z = parseInt($img.css(prop), 10) - step_distance;
        
        if (z <= -(step_distance * $this.steps)) {
          if (opts.loop === false) {
            z = z + step_distance;
            clearInterval($this.interval);
          } else {
            z = 0;
          }
          _clb.call($this, opts.clb_cycle);
        }
      
        $img.css(prop, z);

    }, opts.speed);
    //
    //if (opts.loop === false) {
    //  setTimeout(function(){
    //    clearInterval($this.interval);
    //    _clb.call($this, opts.clb_done);
    //  }, (opts.speed * $this.steps));
    //}
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
  , "orientation" : "horizontal"
  , "frame_width" : 16
  , "frame_height": 16
  , "speed"       : 100
  , "loop"        : true
  , "clb_cycle"   : undefined
  , "clb_done"    : undefined
  };
  
  
}(jQuery));