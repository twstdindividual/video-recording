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
      })
      .catch(angular.noop);
  }

  deleteVideo(id) {
    remove(this.savedRecords, ['_id', id]);

    this.$http.delete('/api', {params: {_id: id}});
  }

  getAverageRate() {
    let overallTimeArr = [];
    let result = 0;
    for (let record of this.savedRecords) {
      let overallTime = 0;
      for (let source of record.sources) {
        overallTime += parseFloat(source.src.substr(source.src.length - 8));
      }
      overallTimeArr.push(overallTime);
    }

    for (let time of overallTimeArr) {
      result += time;
    }

    return Math.round(this.savedRecords.length / result * 100) / 100;
  }
}

export default AdminPanelController;
