'use strict';

function BaseException(message = "Default Message", fileName, lineNumber) {
	let instance = new Error(message, fileName, lineNumber);
	instance.name = "MyError";
	Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
	if (Error.captureStackTrace) {
		Error.captureStackTrace(instance, BaseException);
	}
	return instance;
}
BaseException.prototype = Object.create(Error.prototype, {
	constructor: {
		value: BaseException,
		enumerable: false,
		writable: false,
		configurable: false
	}
});

//Excepcion acceso invalido a constructor
function InvalidAccessConstructorException() {
	let instance = BaseException.call(this, "Constructor can’t be called as a function.");
	instance.name = "InvalidAccessConstructorException";
	return instance;
}
InvalidAccessConstructorException.prototype = Object.create(BaseException.prototype, {
	constructor: {
		value: InvalidAccessConstructorException,
		enumerable: false,
		writable: false,
		configurable: false
	}
});

//Excepcion personalizada para indicar valores vacios.
function EmptyValueException(param) {
	let instance = BaseException.call(this, "Error: The parameter " + param + " can't be empty.");
	instance.name = "EmptyValueException";
	instance.param = param;
	return instance;
}
EmptyValueException.prototype = Object.create(BaseException.prototype, {
	constructor: {
		value: EmptyValueException,
		enumerable: false,
		writable: false,
		configurable: false
	}
});
//El parametro ya existe
function AlreadyExist(param) {
	let instance = BaseException.call(this, "Error: The parameter " + param + " already exist.");
	instance.name = "AlreadyExist";
	instance.param = param;
	return instance;
}
AlreadyExist.prototype = Object.create(BaseException.prototype, {
	constructor: {
		value: AlreadyExist,
		enumerable: false,
		writable: false,
		configurable: false
	}
});
//No existe el parametro
function DontExist(param) {
	let instance = BaseException.call(this, "Error: The parameter " + param + " dont exist.");
	instance.name = "DontExist";
	instance.param = param;
	return instance;
}
DontExist.prototype = Object.create(BaseException.prototype, {
	constructor: {
		value: DontExist,
		enumerable: false,
		writable: false,
		configurable: false
	}
});

//Excepcion de valor invalido
function InvalidValueException(param, value) {
	let instance = BaseException.call(this, "Error: The paramenter " + param + " has an invalid value. (" + param + ": " + value + ")");
	instance.name = "InvalidValueException";
	instance.param = param;
	instance.value = value;
	return instance;
}
InvalidValueException.prototype = Object.create(BaseException.prototype, {
	constructor: {
		value: InvalidValueException,
		enumerable: false,
		writable: false,
		configurable: false
	}
});

//Excepcion personalizada para clases abstractas.
function AbstractClassException(className) {
	let instance = BaseException.call(this, "Error: The class " + className + " is abstract.");
	instance.name = "AbstractClassException";
	instance.className = className;
	return instance;
}
AbstractClassException.prototype = Object.create(BaseException.prototype, {
	constructor: {
		value: AbstractClassException,
		enumerable: false,
		writable: false,
		configurable: false
	}
});

export {BaseException,
	InvalidAccessConstructorException,
	EmptyValueException,
	InvalidValueException,
	AbstractClassException,
	AlreadyExist,
	DontExist
  };