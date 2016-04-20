System.register(["angular2/core", "angular2/src/common/directives/core_directives", "./roles.service"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, core_directives_1, roles_service_1;
    var RolesComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_directives_1_1) {
                core_directives_1 = core_directives_1_1;
            },
            function (roles_service_1_1) {
                roles_service_1 = roles_service_1_1;
            }],
        execute: function() {
            RolesComponent = (function () {
                function RolesComponent(service) {
                    this.service = service;
                    this.isLoading = false;
                }
                RolesComponent.prototype.ngOnInit = function () {
                    this.getHeroes();
                };
                RolesComponent.prototype.getHeroes = function () {
                    var _this = this;
                    this.service.getHeroes()
                        .then(function (heroes) { return _this.data = heroes; }, function (error) { return _this.errorMessage = error; });
                };
                RolesComponent.prototype.addHero = function (name) {
                    var _this = this;
                    if (!name) {
                        return;
                    }
                    this.service.addHero(name)
                        .then(function (hero) { return _this.data.push(hero); }, function (error) { return _this.errorMessage = error; });
                };
                RolesComponent = __decorate([
                    core_1.Component({
                        selector: "test",
                        templateUrl: "app/components/roles.component.html",
                        providers: [roles_service_1.RolesService],
                        directives: core_directives_1.CORE_DIRECTIVES
                    }), 
                    __metadata('design:paramtypes', [roles_service_1.RolesService])
                ], RolesComponent);
                return RolesComponent;
            })();
            exports_1("RolesComponent", RolesComponent);
        }
    }
});
//# sourceMappingURL=roles.component.js.map