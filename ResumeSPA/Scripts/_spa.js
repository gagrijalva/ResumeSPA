var app = angular.module("spa", ['ngResource', 'ngRoute','ngSanitize']);


app.factory('personService', function ($resource) {
    return $resource('/api/People/:id',
        { id: '@Id' },
        {
            update: { method: 'PUT' }
        });
});

app.factory('jobService', function ($resource) {
    return $resource('/api/Jobs/:id',
        { id: '@Id' },
        {
            update: { method: 'PUT' }
        });
});

app.controller("mainController", function ($sce, $scope, jobService) {


    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();

  
    jobService.query($scope.parseContent);
    
    $scope.parseContent = function (jobs) {
        $scope.jobs = jobs.map(function(job) {
            var parsed = reader.parse(job.Description);
            job.Description = writer.render(parsed);
            return job;
        });
    };

});


app.controller("personController", function ($scope, personService) {



    $scope.errors = [];
    $scope.title = '';

    $scope.people = personService.query();

    $scope.person = {
        Id: 0,
        Name: '',
        Email: ''
    };

    $scope.deletePerson = function (person) {
        personService.remove(person, $scope.refreshData, $scope.errorMessage);
    };

    $scope.savePerson = function (person) {
        if ($scope.person.Id > 0) {
            personService.update($scope.person, $scope.refreshData, $scope.errorMessage);
        }
        else {
            personService.save($scope.person, $scope.refreshData, $scope.errorMessage);
            $scope.clearCurrentPerson();
        }
    };

    $scope.refreshData = function () {
        $scope.people = personService.query();
        $("#modal-dialog").modal('hide');
    };

    $scope.showAddDialog = function () {
        $scope.errors = [];
        $scope.clearCurrentPerson();
        $scope.title = 'Add Person';
        $("#modal-dialog").modal('show');

    };

    $scope.showUpdateDialog = function () {
        $scope.errors = [];
        $scope.title = 'Update Person';
        $("#modal-dialog").modal('show');
    };

    $scope.showJobs = function (person) {


        $scope.errors = [];
        $scope.person = personService.get(person);


        $("#modal-jobs").modal('show');
    };


    $scope.clearCurrentPerson = function () {
        $scope.person = {
            Id: 0,
            Name: '',
            Email: ''
        };
    };

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

    $scope.selectPerson = function (person) {
        $scope.person = person;
        $scope.showUpdateDialog();
    };

    

});

app.controller("jobController", function ($scope, jobService, personService) {


    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();

  
    jobService.query($scope.parseContent);

    $scope.people = personService.query();
    
    $scope.parseContent = function (jobs) {
        $scope.jobs = jobs.map(function(job) {
            var parsed = reader.parse(job.Description);
            job.Description = writer.render(parsed);
            return job;
        });
    };


    $scope.errors = [];
    $scope.title = '';
    
    $scope.disableContent = false;


    


    $scope.job = {
        Id: 0,
        Title: '',
        Date: '',
        Description:'',
        PersonId:0
    };

    $scope.deleteJob = function (job) {
        jobService.remove(job, $scope.refreshData, $scope.errorMessage);
    };

    $scope.refreshData = function () {
        jobService.query($scope.parseContent);
        $scope.parseContent = function (jobs) {
            $scope.jobs = jobs.map(function (job) {
                var parsed = reader.parse(job.Description);
                job.Description = writer.render(parsed);
                return job;
            });
        };
        $("#modal-dialog").modal('hide');
    };

    $scope.showAddDialog = function () {
        $scope.disableContent = true;
        $scope.errors = [];
        $scope.title = 'Add Job';
        $scope.clearCurrentJob();
        $("#modal-dialog").modal('show');

    };

    $scope.showUpdateDialog = function () {
        $scope.disableContent = false;
        $scope.errors = [];
        $scope.title = 'Update Job';
        $("#modal-dialog").modal('show');
    };

    $scope.saveJob = function () {
        if ($scope.job.Id > 0) {
            jobService.update($scope.job, $scope.refreshData, $scope.errorMessage)
        }
        else {
            jobService.save($scope.job, $scope.refreshData, $scope.errorMessage)
            $scope.clearCurrentJob();
        };

    };

    $scope.viewContent = function () {
        $("#modal-dialog").modal('hide');
        $("#modal-content").modal('show');
        var reader = new commonmark.Parser();
        var writer = new commonmark.HtmlRenderer();
        var parsed = reader.parse($scope.job.Description);
        $scope.commonMark = writer.render(parsed);
        
    };

    $scope.selectJob = function (job) {
        job.Date = new Date(job.Date);
        $scope.job = job;
        $scope.showUpdateDialog();
    };

    $scope.clearCurrentJob = function () {
        $scope.job = {
            Id: 0,
            Name: '',
            Title: '',
            Date: '',
            Description: '',
            PersonId: 0
        };

    };

    $scope.errorMessage = function (response) {
        var errors = [];
        for (var key in response.data.ModelState) {
            for (var i = 0; i < response.data.ModelState[key].length; i++) {
                errors.push(response.data.ModelState[key][i]);
            }
        }
        $scope.errors = errors;
    };

});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'mainController',
            templateUrl:"/Content/Views/Content.html"
        }).when('/people', {
            templateUrl: "/Content/Views/People.html",
            controller: "personController"
        }).when('/jobs', {
            templateUrl: "/Content/Views/Jobs.html",
            controller: "jobController"
        });
});