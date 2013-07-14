'use strict';

var directives = angular.module('soundscry.directives', [])

directives.directive("flatuiCheckbox",function() {
  return {
    restrict: 'E',
    replace:true,
    scope: {
      name:"@",
      value:"@",
      text:"@",
      model:"="
    },
    template:
      '<label ng-class="{checked:model}" class="checkbox" for="{{chkid}}">'+
      ' <span class="icons">'+
      '   <span class="first-icon fui-checkbox-unchecked"></span>'+
      '   <span class="second-icon fui-checkbox-checked"></span> '+
      ' </span>'+
      ' <input type="checkbox" id="{{chkid}}" data-toggle="checkbox" name="{{name}}" value="{{value}}" ng-model="model" ng-checked="model"> {{text}}'+
      '</label>',
    link: function(scope,element,attrs,controller) {
      scope.chkid=uuid.v4(); //todo create factory for injection

    }
  }
});

directives.directive("sqdPopover",function() {
  return {
    restrict: 'E',
    replace:false,
    scope: {
      trigger:"@",
      title:"@",
      content:"@"
    },
    link: function(scope,element,attrs,controller) {
      //scope.chkid=uuid.v4(); //todo create factory for injection
      scope.pop = $(element).popover({
        trigger:scope.trigger,
        title:scope.title,
        content:scope.content
      });

    }
  }
});
