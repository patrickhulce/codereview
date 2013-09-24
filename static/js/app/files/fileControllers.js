angular.module('files', ['files.provider'])
    .controller('FileCtrl', ['$scope', '$http', 'fileService',
        function($scope, $http, fileService) {
            $scope.file = {
            	'contents' : 'Loading...'
            };
            $scope.$watch("selectedFile.name + selectedPerson.id", function() {
                var title = $scope.assignment.title;
                var user = $scope.selectedPerson.id;
                var file = $scope.selectedFile.name;
                console.log("File person changed : " + user + " " + file);
                if (title === undefined || user === undefined || file === undefined) return;
                console.log("Fetching file");
                fileService.getFile(title, user, file).then(function(value) {
                	$code_view = $("#code-view");
                    $code_view.html(value.data);
                    $code_view.each(function(i, e) {hljs.highlightBlock(e)});
                });
            });
        }
    ]);
