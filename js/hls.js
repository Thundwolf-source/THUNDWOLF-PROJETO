/*! hls.js v1.5.8 simplified loader */
(function (global) {
  if (global.Hls) return;

  function Hls() {
    this.video = null;
    this.src = null;
  }

  Hls.isSupported = function () {
    var video = document.createElement("video");
    return video.canPlayType("application/vnd.apple.mpegurl") !== "";
  };

  Hls.prototype.loadSource = function (src) {
    this.src = src;
  };

  Hls.prototype.attachMedia = function (video) {
    this.video = video;
    video.src = this.src;
    video.play();
  };

  Hls.prototype.destroy = function () {
    if (this.video) {
      this.video.pause();
      this.video.src = "";
    }
  };

  global.Hls = Hls;
})(window);