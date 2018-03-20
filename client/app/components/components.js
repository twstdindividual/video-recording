import angular from 'angular';
import Home from './home/home';
import AdminPanel  from './admin-panel/admin-panel'

let componentModule = angular.module('app.components', [
  Home,
  AdminPanel
])
.name;
console.log('componentModule', componentModule);

export default componentModule;
