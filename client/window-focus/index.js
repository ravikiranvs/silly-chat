class WindowVisibilityBroadcaster {
  constructor() {
    this._subscribers = [];

    window.onfocus = this.visible.bind(this);
  }

  static Instance() {
    if (!this._instance)
      this._instance = new WindowVisibilityBroadcaster();

    return this._instance;
  }

  subscribe(callback){
    this._subscribers.push(callback);
  }

  visible(){
    this._subscribers.map((callback) => {
      callback();
    });
  }

  isHidden(){
    return document.hidden;
  }
}

export default WindowVisibilityBroadcaster;