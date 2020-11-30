export class EventHandler {
  domID: String;

  handlers: { [key: string]: Function } = {};


  constructor(_domID: string,
              functions: { [key: string]: Function }) {
    this.domID = _domID;
    this.addFunctions(functions);
  }

  public addFunctions(functions: { [key: string]: Function }) {
    for (const key in functions) {
      if (functions.hasOwnProperty(key)) {
        this.handlers[key] = functions[key];
      }
    }
  }

}
