
// Derived: https://basarat.gitbook.io/algorithms/datastructures/queue
// Basic Queue functionality. Supports:
// 	- push
// 	- pop
// 	- front
// 	- clear
// 	- length
// usage:
// let q = new Queue<Type>()
export default class Queue<T> {
  _store: T[] = [];
  push(val: T) {
    this._store.push(val);
  }
  pop(): T | undefined {
    return this._store.shift();
  }
  front(): T | undefined {
  	if(this._store.length > 0) {
  		return this._store[0];
  	}
  	return undefined;
  }
  clear(): void {
  	this._store = [];
  }
  length(): number {
  	return this._store.length;
  }
}