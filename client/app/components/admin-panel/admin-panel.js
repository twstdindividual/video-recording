import angular from 'angular';
import uiRouter from 'angular-ui-router';
import adminPanelComponent from './admin-panel.component';

let adminPanelModule = angular.module('admin-panel', [
  uiRouter
])

.config(($stateProvider) => {
  'ngInject';
  $stateProvider
    .state('admin', {
      url: '/admin',
      component: 'admin'
    });
})

.component('admin', adminPanelComponent)

.name;

export default adminPanelModule;
