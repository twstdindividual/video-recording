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

  _getRecordLength(record) {
    let result = 0;
    for (let source of record.sources) {
      result += parseFloat(source.src.substr(source.src.length - 8));
    }
    return result;
  }

  getDistribution(record, source) {
    const recordLength =  this._getRecordLength(record);
    return Math.ceil(parseFloat(source.src.substr(source.src.length - 8)) / recordLength * 100) + '%';
  }

  getAverageRate() {
    let allRecordLength = 0;
    let result = 0;
    for (let record of this.savedRecords) {
      allRecordLength += this._getRecordLength(record);
    }

    return Math.round(this.savedRecords.length / allRecordLength * 100) / 100;
  }
}

export default AdminPanelController;
