'use strict';
import {
    InvalidAccessConstructorException,
    EmptyValueException,
} from './Exceptions.js';
//Categoria
class Category {
    //Atributos
    #name;
    #description;
    //Constructor
    constructor(name, description = "N/D") {
        //Validacion
        if (!new.target) throw new InvalidAccessConstructorException(); //new
        if (!name) throw new EmptyValueException("name");
        //Asignacion
        this.#name = name;
        this.#description = description;
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
        if (!value) throw new EmptyValueException("description");
        this.#description = value;
    }
}

export {Category};