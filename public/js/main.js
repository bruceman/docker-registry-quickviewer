// the main js
var app = angular.module("app", []);


app.controller("mainCtrl", ["$scope", "dataService", function ($scope, dataService) {
    $scope.keyword = "";

    $scope.searchImages = function () {
        dataService.findResults($scope.keyword, function (data) {
            $scope.results = data;
        });
    };
    
    $scope.showImageDetails = function (item) {
        dataService.getImageData(item.imgId, function (data) {
            $scope.title = item.name + ":" + item.tag;
            $scope.details = data;
            $("#imgDetails").modal('show');
        });
    }

}]); //--end mainCtrl


//--------------------- services -------------------------//
app.service("dataService", ["$http", function ($http) {

    this.findResults = function (keyword, callback) {
        var url = "api/search?q=" + keyword;

        $http.get(url).success(function (data) {
            callback(data);
        });
    };

    this.getImageData = function (imgId, callback) {
        var url = "api/images/" + imgId;

        $http.get(url).success(function (data) {
            callback(data);
        });
    }

    
}]); //--end dataService
