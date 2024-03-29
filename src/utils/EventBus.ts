type Handle = (event: MyEvent) => any;
export interface MyEvent {
  name: string;
  [key: string]: any;
}

export interface LoveEvent extends MyEvent {
  value: boolean;
  id: string;
}

export interface PlaylistEvent extends MyEvent {
  action: "add" | "remove";
  pid: string;
  uri: string;
}

class EventBus {
  handles: { [key: string]: Handle[] };
  constructor() {
    this.handles = {};
  }

  addHandle(name: string, handle: Handle) {
    if (this.handles[name] === undefined) {
      this.handles[name] = [];
    }
    this.handles[name].push(handle);
  }

  trigger(event: MyEvent) {
    if (Array.isArray(this.handles[event.name])) {
      this.handles[event.name].forEach((h) => h(event));
    }
  }

  removeHandle(name: string, handle: Handle) {
    if (Array.isArray(this.handles[name])) {
      let i = 0;
      while (
        i < this.handles[name].length &&
        handle !== this.handles[name][i]
      ) {
        i++;
      }
      if (i < this.handles[name].length) {
        this.handles[name].splice(i, 1);
      }
    }
  }
}

export default new EventBus();
