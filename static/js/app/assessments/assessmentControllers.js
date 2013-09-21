angular.module("assessments", [])
    .controller('AssessmentCtrl', ['$scope',
        function($scope) {
            $scope.qualityOptions = app.settings.qualityOptions;
            $scope.testingOptions = app.settings.testingOptions;

            var initialSliderY = $('.assessment-slider').offset().top;
            var initialNavY = $('.problem-nav').offset().top;
            $(window).scroll(function() {
                var position = window.scrollY;
                if (position > initialSliderY - 10) {
                    var newMargin = Math.max(position - initialSliderY + 80, 0);
                    $('.assessment-slider').stop().animate({
                        'margin-top': newMargin + 'px'
                    }, 200);
                }
                if(position > initialNavY + 30) {
                    if($('.problem-nav').hasClass('scrolled')) return;
                    $('.problem-nav').addClass('scrolled');
                }
                else {
                    if(!$('.problem-nav').hasClass('scrolled')) return;
                    $('.problem-nav').removeClass('scrolled');
                }
            });
        }
    ])
    .controller('IssuesCtrl', ['$scope',
        function($scope) {
            var defaultSeverity = function() {
                return $scope.severityOptions[0];
            };

            $scope.severityOptions = app.settings.severityOptions;
            $scope.issue = {};

            $scope.selectIssue = function(index) {
                $scope.issue = $scope.selectedAssessment.issues[index];
                $scope.issue.index = index;
            }

            $scope.newIssue = function() {
                $scope.issue = {
                    'index': -1,
                    'severity': defaultSeverity()
                };
            }

            $scope.addIssue = function(problem) {
                $scope.selectedAssessment.issues.push($scope.issue);
                $scope.newIssue();
            };

            $scope.deleteIssue = function() {
                $scope.selectedAssessment.issues.splice($scope.issue.index, 1);
                $scope.newIssue();
            };

            $scope.newIssue();

            $scope.$watch("issue.name",function(newValue,oldValue) {
                if(newValue == oldValue) return;
                var templates = $scope.assignment.issueTemplates;
                for(var i=0;i<templates.length;i++) {
                    if(templates[i].name == newValue) {
                        $scope.issue.description = templates[i].description;
                        $scope.issue.severity = templates[i].severity;
                        break;
                    }
                }
            })
        }
    ]);
