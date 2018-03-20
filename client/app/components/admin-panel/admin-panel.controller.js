import { remove } from 'lodash';

class AdminPanelController {

  constructor($http) {
    'ngInject';
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api')
      .then((res) => {
          this.savedRecords = res.data;
          console.log('this.savedRecords', this.savedRecords);
      })
      .catch(angular.noop);
  }

  deleteVideo(id) {
    remove(this.savedRecords, ['_id', id]);

    this.$http.delete('/api', {params: {_id: id}});
  }
}

export default AdminPanelController;
