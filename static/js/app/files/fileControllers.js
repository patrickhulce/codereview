angular.module('files', ['files.provider'])
    .controller('FileCtrl', ['$scope', '$http', 'fileService',
        function($scope, $http, fileService) {
            $scope.fileContents = 'Loading...';
            $scope.$watch("selectedFile.name + selectedPerson.id", function() {
            	var title = $scope.assignment.title;
            	var user = $scope.selectedPerson.id;
            	var file = $scope.selectedFile.name;
            	if(title === undefined || user === undefined || file === undefined) return;
                fileService.getFile(title, user, file).then(function(value) {
                    $scope.fileContents = value.data;
                });
            });
        }
    ]);
