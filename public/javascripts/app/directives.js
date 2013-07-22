/* jshint jquery:true */
/* global angular:true */
/* global _:true */
/* global uuid:true */


var directives = angular.module('soundscry.directives', []);

directives.directive("flatuiCheckbox", function () {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    scope: {
      name: "@",
      value: "@",
      text: "@",
      model: "="
    },
    template: '<label ng-class="{checked:model}" class="checkbox" for="{{chkid}}">' +
      ' <span class="icons">' +
      '   <span class="first-icon fui-checkbox-unchecked"></span>' +
      '   <span class="second-icon fui-checkbox-checked"></span> ' +
      ' </span>' +
      ' <input type="checkbox" id="{{chkid}}" data-toggle="checkbox" name="{{name}}" value="{{value}}" ng-model="model" ng-checked="model"> {{text}}' +
      '</label>',
    link: function (scope, element, attrs, controller) {
      scope.chkid = uuid.v4(); //todo create factory for injection

    }
  };
});

directives.directive("sqdPopover", function () {
  'use strict';


  return {
    restrict: 'EA',
    replace: false,
    scope: {
      popoverTrigger: "@",
      popoverTitle: "@",
      popoverContent: "@",
      popoverName: "@",
      popoverPlacement: "@",
      popoverShow: "@"
    },
    link: function (scope, element, attrs, controller) {
      //scope.chkid=uuid.v4(); //todo create factory for injection
      function update(newVal, oldVal, curScope) {
        if (curScope.popoverTrigger && curScope.popoverContent && curScope.popoverName &&
          curScope.popoverPlacement) {
          console.log('vars  set ');
          curScope[curScope.popoverName] = $(element).popover({
            trigger: curScope.popoverTrigger,
            title: curScope.popoverTitle,
            content: curScope.popoverContent,
            placement: curScope.popoverPlacement
          });
        } else {
          console.log('vars not set yet');
        }

      }

      scope.$watch('popoverTrigger', update);
      scope.$watch('popoverTitle', update);
      scope.$watch('popoverContent', update);
      scope.$watch('popoverName', update);
      scope.$watch('popoverPlacement', update);
      scope.$watch('popoverShow', function (newVal, oldVal, curScope) {
        if (curScope.popoverName && curScope[curScope.popoverName]) {
          if (newVal) {
            curScope[curScope.popoverName].show();
          } else {
            curScope[curScope.popoverName].hide();
          }

        }
      });
      //attrs.$observe('sqdPopover');


    }
  };
});
