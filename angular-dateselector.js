angular.module('ngDateSelector', []).directive('dateselector', ['$compile', function ($compile) {
  var template = '<div>' +
                   '<select ng-model="selectedDay" ng-options="days.indexOf(day) + 1 as day for day in days"><option ng-show="false"></option></select>' +
                   '<select ng-model="selectedMonth" ng-options="months.indexOf(month) + 1 as month for month in months"><option ng-show="false"></option></select>' +
                   '<select ng-model="selectedYear" ng-options="year for year in years"><option ng-show="false"></option></select>' +
                 '</div>';

  return {
    restrict: 'ECA',
    replace: true,
    transclude: false,
    require: '?ngModel',
    link: function postLink(scope, element, attrs, ngModel) {
      var maxDate = moment(attrs.maxDate),
          minDate = moment(attrs.minDate || moment(maxDate).subtract('years', '80')),
          yearsIni = maxDate.year(),
          yearsEnd = minDate.year(),
          dateFormat = attrs.dateFormat;

      var _years = parseInt(yearsIni);

      scope.months = moment.months();
      scope.days = [];
      scope.years = [];

      function updateViewValue() {
        var newDate = moment([scope.selectedYear, scope.selectedMonth, scope.selectedDay].join('-')),
            _days = 1,
            daysInMonth = moment(newDate).daysInMonth();

        if (!newDate.isValid()) return;

        scope.days.length = 0;

        for (; _days <= daysInMonth; _days++) {
          scope.days.push(String('00' + _days).slice(-2));
        }

        ngModel.$setViewValue(newDate.format(dateFormat));
        ngModel.$modelValue = new Date(newDate.format('YYYY-MM-DD'));
      }

      for (; _years >= yearsEnd; _years--) {
        scope.years.push(_years);
      }

      scope.$watch('selectedDay', updateViewValue);
      scope.$watch('selectedMonth', updateViewValue);
      scope.$watch('selectedYear', updateViewValue);

      ngModel.$render = function() {
        var date = moment(ngModel.$viewValue);
        if (date.isValid()) {
          scope.selectedDay   = parseInt(date.format('D'));
          scope.selectedMonth = parseInt(date.format('M'));
          scope.selectedYear  = parseInt(date.format('YYYY'));
        }
      };
    },
    template: template
  };
}]);