describe('cliffhanger.queries module', function () {
    beforeEach(angular.mock.module('ngRoute'));
    beforeEach(angular.mock.module('ngSanitize'));
    beforeEach(angular.mock.module('ngCsv'));
    beforeEach(angular.mock.module('cliffhanger.queries'));
    beforeEach(angular.mock.module('ui.bootstrap'));
    var mockQuery;
    var mockQueryService;
    var test_query_data;
    var testDate = new Date();
    describe('QueriesCtrl', function () {
        beforeEach(inject(function ($controller, $rootScope, $q, $log, $uibModal, queryService) {
            scope = $rootScope.$new();
            modal = $uibModal;
            $log = $log;
            mockQueryService = queryService;
            test_query_data = [
                {
                    name: "test1"
                    , description: "test1 desc"
                    , dateCreated: testDate
                    , sqlString: "SELECT * FROM table;"
                }
                , {
                    name: "test2"
                    , description: "test2 desc"
                    , dateCreated: testDate
                    , sqlString: "SELECT * FROM table;"
                }
            ];
            mockQuery = {
                name: "test"
                , description: "desc"
                , dateCreated: testDate
                , sqlString: "SELECT * FROM table;"
            };
            deferred = $q.defer();
            resp = {};
            spyOn(mockQueryService, "getAllQueries").and.callFake(function () {
                resp.data = test_query_data;
                resp.status = "Success";
                deferred.resolve(resp);
                return deferred.promise;
            })
            serviceError = false;
            spyOn(mockQueryService, "runQuery").and.callFake(function () {
                var bad_result = {
                    status: 'Error'
                }
                var testTableResult = {
                    colCount: 2
                    , colNames: [
                        "test.col1"
                        , "test.col2"
                    ]
                    , rows: [
                        [
                            1
                            , "abc"
                        ]
                        , [
                            2
                            , "def"
                        ]
                        , [
                            3
                            , "ghi"
                        ]
                    ]
                }
                var deferred = $q.defer();
                if (serviceError) deferred.reject(bad_result);
                else deferred.resolve(testTableResult);
                return deferred.promise;
            })
            queriesCtrl = $controller('QueriesCtrl', {
                $scope: scope
                , $uibModal: modal
                , $log: $log
                , queryService: mockQueryService
            })
        }));
        it('should have a QueriesCtrl controller', function () {
            expect(queriesCtrl).toBeDefined();
        });
        it('should be able to load the queries', function () {
            scope.$apply();
            expect(scope.queryList).not.toBe(undefined);
            expect(scope.queryList).toEqual(test_query_data);
        });
        afterEach(function () {
            //console.log($log.debug.logs);
        });
    });
    describe('ViewQueryModalInstanceCtrl', function () {
        beforeEach(inject(function ($controller, $rootScope, $log) {
            scope = $rootScope.$new();
            modalInstance = {
                close: jasmine.createSpy('uibModalInstance.close')
                , dismiss: jasmine.createSpy('uibModalInstance.dismiss')
                , result: {
                    then: jasmine.createSpy('uibModalInstance.result.then')
                }
            };
            viewQueryModalCtrl = $controller('ViewQueryModalInstanceCtrl', {
                $scope: scope
                , $uibModalInstance: modalInstance
                , $log: $log
                , query: mockQuery
                , queryService: mockQueryService
            });
        }));
        it('should instantiate the viewQueryModalInstanceCtrl controller', function () {
            expect(viewQueryModalCtrl).not.toBeUndefined();
        });
        it('should dismiss the modal with cancel', function () {
            scope.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
        });
        it('should advance to the 2nd step', function () {
            scope.next();
            expect(scope.step).toBe(2);
        });
        it('should be able to go back to the previous step', function () {
            scope.next();
            scope.previous();
            expect(scope.step).toBe(1);
        });
        it('should load the correct query', function () {
            scope.step = 1;
            expect(scope.query.sqlString).toEqual('SELECT * FROM table;');
            expect(scope.query.name).toEqual('test');
            expect(scope.query.dateCreated).toEqual(testDate);
        });
        it('should run the query and return a table result object', function () {
            scope.step = 1;
            scope.next();
            scope.$apply();
            expect(scope.tableResult).not.toBeNull();
            expect(scope.tableResult).toEqual({
                colCount: 2
                , colNames: [
                        "test.col1"
                        , "test.col2"
                    ]
                , rows: [
                        [
                            1
                            , "abc"
                        ]
                        , [
                            2
                            , "def"
                        ]
                        , [
                            3
                            , "ghi"
                        ]
                    ]
            });
            //expect(scope.tableResult.colCount).toEqual(2);
            //expect(scope.tableResult.colNames[1]).toBe("test.col2");
            //expect(scope.tableResult.rows[0][1]).toBe("abc");
        });
    });
    describe('QueryDeleteModalCtrl', function () {
        beforeEach(inject(function ($controller, $rootScope, $log) {
            scope = $rootScope.$new();
            modalInstance = {
                dismiss: jasmine.createSpy('uibModalInstance.dismiss')
                , close: jasmine.createSpy('uibModalInstance.close')
                , result: {
                    then: jasmine.createSpy('uibModalInstance.result.then')
                }
            };
            queryDeleteCtrl = $controller('QueryDeleteModalCtrl', {
                $scope: scope
                , $uibModalInstance: modalInstance
                , $log: $log
                , query: mockQuery
            });
        }));
        it('should be able accept and close the modal', function () {
            scope.delete();
            expect(modalInstance.close).toHaveBeenCalledWith(mockQuery);
        });
        it('should be able to cancel and dismiss the modal', function () {
            scope.cancel();
            expect(modalInstance.dismiss).toHaveBeenCalled();
        });
    });
});