angular.module('files.provider', [])
    .provider('fileService', function() {
        this.$get = ['$http',
            function($http) {
                return {
                    getFile: function(project, user, filename) {
                        var fileParts = filename.split(".");
                        var url = app.settings.dataUrl + "files/";
                        url += project + "/" + user + "/";
                        url += fileParts[0] + "/" + fileParts[1];
                        console.log("Fetching file from " + url);
                        url = app.settings.dataUrl + "files/test/joe/treasure/ml";
                        return $http.get(url);
                    }
                };
            }
        ];
    });
