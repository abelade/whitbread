'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', []);



angular.module('myApp').controller('AppController', function($scope, $http) {
  $scope.obj = {
    searchString: 'London',
    state: 'isLoading'
  };


  document.addEventListener(
      'prepop',
      function() {
        $scope.search();
      });


  $scope.$on('$routeChangeSuccess', function() {});



  $scope.search = function() {
    $scope.obj.state = 'isLoading';

    // load filter options from localStorage
    var records = JSON.parse(localStorage.getItem('records'));

    localStorage.setItem('records', JSON.stringify(records));


    var clientID = "YZQZP1Q2HEJWMD5ZVBMIQD3VSZC1W4BQCCQTVFEPJWNHL0RK";
    var clientSecret = "ORHPL2VKKHUTB3KTJVDTB4D20AXBRCFKWVL12EPQNJNDFYBX";

    $http.get("https://api.foursquare.com/v2/venues/explore/?near=" + $scope.obj.searchString + "&venuePhotos=1&section=" + "&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20160830")
        .then(function(result, status) {
          var items = result.data.response.groups[0].items;

          var help = [];
          for (var el in items) {
            var place = $scope.parseVenue(items[el]);


            help.push(place);
          }

          $scope.obj.state = 'loaded';
          $scope.venues = help;
        }, function(data, status) {
          $scope.obj.state = 'noResult';
        }).
    success(function (data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
      defer.resolve(data);
    }).
    error(function (data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      defer.reject();
    });

    return defer.promise;
  };

  $scope.parseVenue = function(data) {
    var venue = data.venue;

    return {
      title: venue.name,
      venueID: venue.id,
      picture_url: venue.photos.groups[0].items[0].prefix + '100x100' + venue.photos.groups[0].items[0].suffix,
      place: venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1]
    };
  };


  $scope.$watch('obj.searchString', function() {
    $scope.search();
  });
});


// ---SPECS-------------------------

describe('myApp', function () {
  beforeEach(function () {
    module('myApp');
  });
  it('has a bool filter', inject(function($filter) {
    expect(true).toBe(true);
  }));
  it('has a bool filter', inject(function($filter) {
    expect(false).toBe(false);
  }));
});


// --- Runner -------------------------
(function () {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function (spec) {
    return htmlReporter.specFilter(spec);
  };

  var currentWindowOnload = window.onload;

  window.onload = function () {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    execJasmine();
  };

  function execJasmine() {
    jasmineEnv.execute();
  }
})();




