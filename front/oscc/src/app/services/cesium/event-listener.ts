export class EventListener {

  domElID: string;
  callback: {[key: string]: any} = {};

  public leftClickListeners: {[key: string]: any} = {};
  public rightClickListeners: {[key: string]: any} = {};
  public mouseOverListeners: {[key: string]: any} = {};
  public mouseDownListeners: {[key: string]: any} = {};
  public mouseUpListeners: {[key: string]: any} = {};
  public doubleClickListener: {[key: string]: any} = {};


  constructor(_domElID: string) {
    this.domElID = _domElID;
  }

  public setCallback = (callbackName, callbackFunction) => {
    this.callback[callbackName] = callbackFunction;
  };

  public sendLeftClickToService = (click) => {
    this.callback['leftClick'](this.domElID, click, this.leftClickListeners, 'leftClick');
  };

  public sendRightClickToService = (click) => {
    this.callback['rightClick'](this.domElID, click.position, this.rightClickListeners, 'rightClick');
  };

  public sendMouseDownToService = (click) => {
    this.callback['mouseDown'](this.domElID, click, this.mouseDownListeners, 'mouseDown');
  };

  public sendMouseUpToService = (click) => {
    this.callback['mouseUp'](this.domElID, click, this.mouseUpListeners, 'mouseUp');
  };

  public sendMouseOverToService = (click) => {
    this.callback['mouseOver'](this.domElID, click, this.mouseOverListeners, 'mouseOver');
  };

  public sendDoubleClickToService = (click) => {
    this.callback['doubleClick'](this.domElID, click, this.doubleClickListener, 'doubleClick');
  };

}
