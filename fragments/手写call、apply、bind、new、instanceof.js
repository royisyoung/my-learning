((window) => {
  /**
   * Function.prototype.call()
   *
   * call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
   * function.call(thisArg, arg1, arg2, ...)
   * call() 允许为不同的对象分配和调用属于一个对象的函数/方法。
   *
   * call() 提供新的 this 值给当前调用的函数/方法。你可以使用 call 来实现继承：写一个方法，然后让另外一个新的对象来继承它（而不是在新对象中再写一次这个方法）
   *
   */

  Function.prototype.myCall = function (target, ...args) {
    const ctx = target || window;
    const fn = Symbol('fn');
    ctx[fn] = this;
    const res = ctx[fn](...args);
    delete ctx[fn];
    return res;
  };

  function Product(name, price) {
    this.name = name;
    this.price = price;
  }

  function Food(name, price) {
    // Product.call(this, name, price);
    Product.myCall(this, name, price);
    this.category = 'food';
  }

  console.log(new Food('cheese', 5));
  // expected output: { name: 'cheese', price: 5, category: 'food' }

  /**
   * Function.prototype.apply()
   *
   * apply() 方法调用一个具有给定 this 值的函数，以及以一个数组（或一个类数组对象）的形式提供的参数。
   *
   */

  Function.prototype.myApply = function (target, argArr = []) {
    const ctx = target || window;
    const fn = Symbol('fn');
    ctx[fn] = this;
    const res = ctx[fn](...argArr);
    delete ctx[fn];
    return res;
  };

  const numbers = [5, 6, 2, 3, 7];
  //  const max = Math.max.apply(null, numbers);
  const max = Math.max.myApply(null, numbers);

  console.log(max);
  // expected output: 7

  //  const min = Math.min.apply(null, numbers);
  const min = Math.min.myApply(null, numbers);

  console.log(min);
  // expected output: 2

  /**
   * Function.prototype.bind()
   *
   * bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
   *  1. bind返回一个新的函数并绑定this
   *  2. 新函数可以再次接收参数
   *  3. 新函数可以作为构造函数
   *
   */

  Function.prototype.mybind = function (target, ...args) {
    const self = this;
    const fn = function (...argsAgain) {
      return self.apply(this instanceof fn ? this : target, args.concat(argsAgain));
    };
    fn.prototype = this.prototype;
    return fn;
  };

  const block = {
    x: 42,
    getX: function () {
      return this.x;
    },
  };

  const unboundGetX = block.getX;
  console.log(unboundGetX()); // The function gets invoked at the global scope
  // expected output: undefined

  // const boundGetX = unboundGetX.bind(block);
  const boundGetX = unboundGetX.mybind(block);
  console.log(boundGetX());
  // expected output: 42

  const instance = new boundGetX();
  console.log(instance);
  // expected output: getX {}

  /**
   * new 运算符
   * new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。
   *  1. 从构造函数的原型创建对象
   *  2. 绑定this并执行构造函数
   *
   */

  Function.prototype.myNew = function (...args) {
    const obj = Object.create(this.prototype);
    const res = this.apply(obj, args);
    // 若返回值是基本类型，则实例化的时候会被忽略。仅当返回值为对象的时候，才有效
    return typeof res === 'object' ? res : obj;
  };

  function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    return 'sadfsd';
  }

  // const car1 = new Car('Eagle', 'Talon TSi', 1993);
  const car1 = Car.myNew('Eagle', 'Talon TSi', 1993);

  console.log(car1);
  // expected output: { make: 'Eagle', model: 'Talon TSi', year: 1993 }

  /**
   * instanceof
   * 用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
   */

  function isInstanceof(obj, target) {
    let current = Object.getPrototypeOf(obj);
    const targetPrototype = target?.prototype;
    while(current) {
      if (current === targetPrototype) return true;
      current = Object.getPrototypeOf(obj);
    }
    return false
  };

  function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  const auto = new Car('Honda', 'Accord', 1998);

  console.log(isInstanceof('sdf', String));
  // expected output: true
  console.log(isInstanceof(auto, Car));
  // console.log(auto instanceof Car);
  // expected output: true

  console.log(isInstanceof(auto, Object));
  // console.log(auto instanceof Object);
  // expected output: true
})(global);
