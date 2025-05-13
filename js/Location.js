'use strict';
import {
    InvalidAccessConstructorException,
    EmptyValueException,
} from './Exceptions.js';
//Coordenadas
class Location {
    //Atributos
    #name;
    #description;
    #address;
    #location;
    //constructor
    constructor(name,description = "N/D",address, location = null) {
        //Validacion
        if (!new.target) throw new InvalidAccessConstructorException(); //new
        if (!name) throw new EmptyValueException("name");
        if (!description) throw new EmptyValueException("description");
        if (!address) throw new EmptyValueException("address");

        //Asginacion
        this.#name = name;
        this.#description = description ;
        this.#address = address;
        this.#location = location;
    }
    //Propiedades de acceso
    
    get name() {
        return this.#name;
    }

    set name(value) {
        if (!value) throw new EmptyValueException("name");
        this.#name = value;
    }

    get description(){
        return this.#description;
    }

    set description(value){
        this.#description = value || "N/D" ;
    }

    get address() {
        return this.#address;
    }
    set address(value) {
        if (!value) throw new EmptyValueException("address");
        this.#address = value;
    }

    get location() {
        return this.#location;
    }
    set location(value) {
        this.#location = value ;
    }
}

export {Location};