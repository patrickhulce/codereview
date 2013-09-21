var app = {
    settings: {
        'dataUrl': 'http://localhost:8000/',
        'qualityOptions': ['Bad', 'Ugly', 'Good'],
        'testingOptions': ['Lacking', 'Decent', 'Solid'],
        'severityOptions': ['Awful', 'Bad', 'Ugly', 'Minor', 'Neutral'],
        'qualityDisplayNames': {
            'Bad': '*',
            'Ugly': '**',
            'Good': '***'
        },
        'testingDisplayNames': {
            'Lacking': '*',
            'Decent': '**',
            'Solid': '***'
        },
        'severityDisplayNames': {
            'Awful': '-5',
            'Bad': '-3',
            'Ugly': '-2',
            'Minor': '-1',
            'Neutral': '-0'
        },
        /**
        All input of form {'name' : "Bad", 'count' : 10}
        @TODO fill in score function
        */
        'scoreFunction': function(qualities, tests, severities) {
            return 10;
        }
    }
};

angular.module("codereview", ['ui.bootstrap', 'files', 'assignments', 'assessments']);
