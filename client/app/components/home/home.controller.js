import { findIndex } from 'lodash';

class HomeController {

  constructor($document, $scope, $http) {
    'ngInject';
    this.$document = $document;
    this.$http = $http;
    this.$scope = $scope;
    this.isAutoplay = false;
    this.isRecording = false;
    this.lastRecord = {
      sources: []
    };
    this.savedRecords = [];
    this.lastRecordId = 0;
    this.videos = {
      FIRST_VIDEO: 'https://d15t3vksqnhdeh.cloudfront.net/videos/1.mp4',
      SECOND_VIDEO: 'https://d15t3vksqnhdeh.cloudfront.net/videos/2.mp4',
      THIRD_VIDEO: 'https://d15t3vksqnhdeh.cloudfront.net/videos/3.mp4'
    }
  }

  $onInit() {
    this.currentVideo = this.videos.FIRST_VIDEO;
    this.recordButtonLabel = 'REC';
    this.$http.get('/api')
      .then((res) => {
          this.savedRecords = res.data;
      })
      .catch(angular.noop);
  }

  changeVideoClip(src) {
    this._saveTimestamp();
    this.isAutoplay = true;
    if (this.currentVideo === src) {
      this.videoElement.play();
    } else {
      this.currentVideo = src;
    }
  }

  toggleRecord() {
    this._saveTimestamp();
    this.isRecording = !this.isRecording;
    this.recordButtonLabel = this.isRecording ? 'STOP' : 'REC';
    if (this.isRecording) {
      this.lastRecord = {
        sources: []
      };
    }
  }

  /**
   * save timestamp of the last played video clips
   */
  _saveTimestamp() {
    if (this.isRecording && this.videoElement.currentTime > 0) {
      this.lastRecord.sources.push({src: `${this.currentVideo}#t=${this.videoElement.currentTime}`});
    }
  }

  saveRecordedVideo() {
    this.lastRecord.id = ++this.lastRecordId;
    this.savedRecords.push(this.lastRecord);

    this.$http.post('/api', this.lastRecord)
      .then(() => {
        console.log('Saved', this.lastRecord);
      })
      .catch((e) => {
        console.log(e);
      });

    this.lastRecord = {
      sources: []
    };
  }

  showSaveButton() {
    return !this.isRecording && this.lastRecord.sources.length > 0;
  }

  playRecord(id) {
    const index = findIndex(this.savedRecords, ['id', id]);
    let nextClipIndex = 0;
    this.$scope.$applyAsync(() => {
      this.changeVideoClip(this.savedRecords[index].sources[0].src);
      nextClipIndex++;
    });

    this.videoElement.addEventListener('ended', () => {
      this.$scope.$applyAsync(() => {
        if (this.savedRecords[index].sources[nextClipIndex]) {
          this.changeVideoClip(this.savedRecords[index].sources[nextClipIndex].src);
          nextClipIndex++;
        }
      });
    });
  }

  $postLink() {
    this.videoElement = this.$document[0].querySelector('video');

    this.$document.bind('keydown', (e) => {
      this.$scope.$applyAsync(() => {
        switch(e.key) {
          case '1': this.changeVideoClip(this.videos.FIRST_VIDEO); break;
          case '2': this.changeVideoClip(this.videos.SECOND_VIDEO); break;
          case '3': this.changeVideoClip(this.videos.THIRD_VIDEO); break;
        }
      });
    });
  }
}

export default HomeController;
