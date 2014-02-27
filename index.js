//the following would be really cool to put in a decorator...
Array.prototype.slice.call(document.querySelectorAll('.mediaItem')).forEach(function(element) {
  
  //swap out for promise library later -- was having a hard time getting micropromise to work here
  
  var promise = (function () {
    var callback
    
    return {
      fulfill : function (val) {
        if (callback) callback(val)
      },
      then : function(_callback) {
        callback = _callback
      }
    }
  })()
  
  var transforms = {
    scale3d : '',
    translate3d : ''
  }
  
  var transitions = {
    all : '',
    scale3d : '',
    translate3d : ''
  }
  
  element.transitions = {}
  element.transforms = {}
  
  
  element.animate = function (options) {
    
      
    var keyframesString =
      ['from', 'to'] //could be replaced with 0%, 50% etc.
        .map(function (keyframe) {
          return options[keyframe] ? keyframe + ' {' + options[keyframe] + '}' : null
        })
        .filter(function (stringifiedKeyframes) {
          return stringifiedKeyframes
        })
        .join(' ')
    
    var keyframeUid = ++keyframeUidCounter
    var animationName = 'animate-d574bfb4' + keyframeUid; //name has part of a random guid to help ensure no name collisions
    var selector = "@-webkit-keyframes " + animationName;
    var rule = "{" + keyframesString + "}";
    
    console.warn(keyframesString)

    
    var animationEndHandler = function () {
     
      element.removeEventListener('webkitAnimationEnd', animationEndHandler)
      
      console.warn(options.persistedTransforms)
      
      if (options.persistedTransforms) { //kinda gross because there might be a run of the event loop where the transform isnt applied and may result in a flash (though I havent observed this yet)
        Object.keys(options.persistedTransforms)
          .forEach(function(transform) {
            element.transforms[transform] = options.persistedTransforms[transform]
          })
      }
      
      promise.fulfill()
      
    }
    
    element.addEventListener('webkitAnimationEnd', animationEndHandler)
        
    window.document.styleSheets[0].insertRule(selector + rule, 0);
    element.style.webkitAnimation = animationName + ' ' + options.duration + ' ' + options.easing + ' ' 
    
    return promise;
    
  }
    
  function getTransformString() {
    return Object.keys(transforms)
      .map(function (transform) {
        return transforms[transform] ? transform + '(' + transforms[transform] + ')' : null
      })
      .filter(function (stringifiedTransform) {
        return stringifiedTransform
      })
      .join(' ')
  }
  
  function getTransitionString() {
    return Object.keys(transitions)
      .map(function (transition) {
        return transitions[transition] ? transition + '(' + transitions[transition] + ')' : null
      })
      .filter(function (stringifiedTransition) {
        return stringifiedTransition
      })
      .join(' ')
  }
  
  Object.defineProperty(element.transforms, 'scale3d',{
    get : function () {
      return transforms.scale3d;
    },
    set : function (value) {
      transforms.scale3d = value
      element.style.webkitTransform = getTransformString()
    }
  })
  Object.defineProperty(element.transforms, 'translate3d',{
    get : function () {
      return transforms.translate3d
    },
    set : function (value) {
      transforms.translate3d = value
      element.style.webkitTransform = getTransformString()
    }
  })
  
  Object.defineProperty(element.transitions, 'scale3d',{
    get : function () {
      return transitions.scale3d;
    },
    set : function (value) {
      transitions.scale3d = value
      element.style.webkitTransition = getTransitionString()
    }
  })
  
  Object.defineProperty(element.transitions, 'translate3d',{
    get : function () {
      return transforms.translate3d
    },
    set : function (value) {
      transitions.translate3d = value
      element.style.webkitTransition = getTransitionString()
    }
  })
  
})
