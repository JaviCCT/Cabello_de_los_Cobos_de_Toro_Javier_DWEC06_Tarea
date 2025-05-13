'use strict';
import {
    InvalidAccessConstructorException,
    EmptyValueException,
} from './Exceptions.js';
//Coordenadas
class Coordinate {
    //Atributos
    #latitude;
    #longitude;
    //constructor
    constructor(latitude, longitude) {
        //Validacion
        if (!new.target) throw new InvalidAccessConstructorException(); //new
        if (!latitude) throw new EmptyValueException("latitude");
        if (!longitude) throw new EmptyValueException("longitude");
        //Asginacion
        this.#latitude = latitude;
        this.#longitude = longitude;
    }
    //Propiedades de acceso
    get latitude() {
        return this.#latitude;
    }
    set latitude(value) {
        if (!value) throw new EmptyValueException("latitude");
        this.#latitude = value;
    }

    get longitude() {
        return this.#longitude;
    }
    set longitude(value) {
        if (!value) throw new EmptyValueException("longitude");
        this.#longitude = value;
    }
}

export {Coordinate};