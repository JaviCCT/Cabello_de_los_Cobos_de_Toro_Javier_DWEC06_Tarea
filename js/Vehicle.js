'use strict';
//RegExp= /^\d{3}[A-Z]{3}$/ //Matriculas del tipo 123ABC
import {
    InvalidAccessConstructorException,
    EmptyValueException,
 } from './Exceptions.js';

class Vehicle {
    //Atributos
    #license
    #description
    #brand
    #model
    #price
    #image
    #isRented = false
    //Constructor
    constructor(license,model,description = "N/D",price,brand,image){
        if (!new.target) throw new InvalidAccessConstructorException();
        if (!license) throw new EmptyValueException("license");
        if (!model) throw new EmptyValueException("model");
        if (!price) throw new EmptyValueException("price");

    //Validacion de la expresion regular
    const licenseRegex = /^\d{3}[A-Z]{3}$/;
    if (!licenseRegex.test(license)) throw new InvalidValueException("license", license);


    //Asignacion
        this.#license = license;
        this.#model = model;
        this.#description = description;
        this.#price = price;
        this.#brand = brand;
        this.#image = image;
    }

    get license(){
        return this.#license;
    }

    get model(){
        return this.#model;
    }

    set model(value){
        if (!value) throw new EmptyValueException("model")
        this.#model = value;
    }

    get description(){
        return this.#description;
    }

    set description(value){
        if (!value) throw new EmptyValueException("description")
        this.#description = value;
    }

    get price(){
        return this.#price;
    }

    set price(value){
        if (typeof value !== "number" || value <= 0) throw new EmptyValueException("price")
        this.#price = value;
    }

    get brand(){
        return this.#brand;
    }

    get image(){
        return this.#image;
    }

    set image(value){
        if (!value) throw new EmptyValueException("image")
        this.#image = value;
    }
    
    get isRented(){
         return this.#isRented;
    }
    
    //Añado para saber si han alquilado el coche
    rent() { 
        this.#isRented = true;
     }
    returnVehicle() {
         this.#isRented = false; 
        }

    toString(){
		return "Serial: " + this.#license + " model: " + this.#model + " Price: " + this.#price;
	}
    
}

class Car extends Vehicle{
    //Atributos
    #passengers;
    constructor(license,model,description = "N/D",price,brand,image,passengers){
        if (!new.target) throw new InvalidAccessConstructorException();
        super(license,model,description,price,brand,image);
        //Validacion
        if (!passengers) throw new EmptyValueException("passengers");
        //Asignacion
        this.#passengers = passengers;
    }
    //Propiedades de acceso
    get passengers (){
        return this.#passengers
    }

    set passengers(value){
        if (!value) throw new EmptyValueException("passengers");
        this.#passengers = value;
    }

    toString (){
		return super.toString() +  " passengers: " + this.#passengers;
	}

}

class Bike extends Vehicle{
    //Atributos
    #engine;
    constructor(license,model,description = "N/D",price,brand,image,engine){
        if (!new.target) throw new InvalidAccessConstructorException();
        super(license,model,description,price,brand,image);
        //Validacion
        if (!engine) throw new EmptyValueException("engine");

        //Asignacion
        this.#engine = engine;
    }
    //Propiedades de acceso
    get engine (){
        return this.#engine
    }

    set engine(value){
        if (!value) throw new EmptyValueException("engine");
        this.#engine = value;
    }

    toString (){
		return super.toString() + " Engine: " + this.#engine;
	}
}

class Van extends Vehicle{
    //Atributos
    #payload;
    constructor(license,model,description = "N/D",price,brand,image,payload){
        if (!new.target) throw new InvalidAccessConstructorException();
        super(license,model,description,price,brand,image);
        //Validacion
        if (!payload) throw new EmptyValueException("payload");
        //Asignacion
        this.#payload = payload;
        
    }
    //Propiedades de acceso
    get payload (){
        return this.#payload
    }

    set payload(value){
        if (!value) throw new EmptyValueException("payload");
        this.#payload = value;
    }

    toString (){
		return super.toString() + " payload: " + this.#payload;
	}
}

export {Vehicle,Car,Bike,Van}