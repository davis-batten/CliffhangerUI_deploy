describe('cliffhanger.issue module', function () {
    beforeEach(angular.mock.module('ngRoute'));
    beforeEach(angular.mock.module('cliffhanger.issue'));

    var scope, root, issueCtrl, mockRouteParams, mockIssueService;
    describe('IssueCtrl', function () {
        beforeEach(inject(function ($controller, $rootScope, $routeParams, $q, $log, issueService) {
            scope = $rootScope.$new();
            root = $rootScope;
            mockIssueService = issueService;

            //mock user
            root.user = {
                username: 'hdfs',
                role: {
                    roleId: 'DEVELOPER'
                }
            }

            //mock routeParams
            mockRouteParams = {
                threadId: 1
            }

            scope.alerts = [];

            //create issueService spies
            serviceError = false;
            //TODO
            spyOn(mockIssueService, 'postComment').and.callFake(function () {
                var deferred = $q.defer();
                if (!serviceError) deferred.resolve({
                    status: 'Success',
                    data: {
                        body: "new comment",
                        commentBy: {
                            username: 'hdfs',
                            role: {
                                roleId: 'DEVELOPER'
                            }
                        },
                        createDate: new Date()
                    }
                });
                else deferred.resolve({
                    status: 'Error'
                });
                return deferred.promise;
            })
            spyOn(mockIssueService, 'getComments').and.callFake(function () {
                var deferred = $q.defer();
                if (!serviceError) deferred.resolve({
                    status: 'Success',
                    data: []
                });
                else deferred.resolve({
                    status: 'Error',
                    data: 'Could not get comments'
                });
                return deferred.promise;
            })
            spyOn(mockIssueService, 'getIssue').and.callFake(function () {
                var deferred = $q.defer();
                if (!serviceError) deferred.resolve({
                    status: 'Success',
                    data: {
                        threadId: 1,
                        opener: {
                            username: 'hdfs',
                            role: {
                                roleId: 'DEVELOPER'
                            }
                        },
                        open: true,
                        createDate: new Date(),
                        closer: null,
                        closeDate: null
                    }
                });
                else deferred.resolve({
                    status: 'Error',
                    data: 'Could not get issue'
                });
                return deferred.promise;
            })


            issueCtrl = $controller('IssueCtrl', {
                $scope: scope,
                $rootScope: root,
                $q: $q,
                $log: $log,
                issueService: issueService,
                $routeParams: mockRouteParams

            });
        }));

        //able to load an issue (w/comments)
        it('should be able to load an issue with comments', function () {
            scope.$apply();

        })


        //test role/open styling (optional)
        //TODO

        //able to post a new comment
        it('should be able to post a new comment', function () {
            scope.newComment = "new comment";
            scope.postComment();
            scope.$apply();
            expect(mockIssueService.postComment).toHaveBeenCalled();
            expect(scope.comments[0].body).toEqual("new comment");
        });

        //able to toggle issue open/close
        it('should be able to toggle the issue open/close', function () {

        })
    });
});
