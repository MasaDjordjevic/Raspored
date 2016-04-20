System.register(["rxjs/Rx", "angular2/http", "angular2/core", 'angular2/http'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var http_1, core_1, http_2;
    var RolesService;
    return {
        setters:[
            function (_1) {},
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_2_1) {
                http_2 = http_2_1;
            }],
        execute: function() {
            RolesService = (function () {
                function RolesService(http) {
                    this.http = http;
                    this._heroesUrl = 'api/roles';
                }
                RolesService.prototype.get = function (onNext) {
                    this.http.get("api/roles").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                RolesService.prototype.getHeroes = function () {
                    return this.http.get(this._heroesUrl)
                        .toPromise()
                        .then(this.extractData)
                        .catch(this.handleError);
                };
                RolesService.prototype.addHero = function (name) {
                    var body = JSON.stringify({ name: name });
                    var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_2.RequestOptions({ headers: headers });
                    return this.http.post(this._heroesUrl, body, options)
                        .toPromise()
                        .then(this.extractData)
                        .catch(this.handleError);
                };
                RolesService.prototype.extractData = function (res) {
                    if (res.status < 200 || res.status >= 300) {
                        throw new Error('Bad response status: ' + res.status);
                    }
                    var body = res.json();
                    return body || {};
                };
                RolesService.prototype.handleError = function (error) {
                    // In a real world app, we might send the error to remote logging infrastructure
                    var errMsg = error.message || 'Server error';
                    console.error(errMsg); // log to console instead
                    return Promise.reject(errMsg);
                };
                RolesService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], RolesService);
                return RolesService;
            })();
            exports_1("RolesService", RolesService);
        }
    }
});
//# sourceMappingURL=roles.service.js.map