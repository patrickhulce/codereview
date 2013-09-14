angular.module("codereview", ['ui.bootstrap'])
    .controller('IssuesCtrl', ['$scope',
        function($scope) {
            var defaultSeverity = function() {
                return $scope.severityOptions[0];
            }

            $scope.issues = [];
            $scope.severityOptions = ['Good', 'Ugly', 'Bad'];
            $scope.issue = {};

            $scope.selectIssue = function(index) {
                $scope.issue = $scope.issues[index];
                $scope.issue.index = index;
            }

            $scope.newIssue = function() {
                $scope.issue = {
                    'index': -1,
                    'severity': defaultSeverity()
                };
            }

            $scope.addIssue = function() {
                $scope.issues.push($scope.issue);
                $scope.newIssue();
            }
            $scope.deleteIssue = function() {
                $scope.issues.splice($scope.issue.index, 1);
                $scope.newIssue();
            }

            $scope.newIssue();
        }
    ]);
