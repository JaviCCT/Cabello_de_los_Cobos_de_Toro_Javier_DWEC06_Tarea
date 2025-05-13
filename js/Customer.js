'use strict';
import { 
    InvalidAccessConstructorException,
    EmptyValueException,
} from './Exceptions.js';
//Categoria
class Customer {
    //Atributos
    #name;
    #id;
    //Constructor
    constructor(id, name) {
        //Validacion
        if (!new.target) throw new InvalidAccessConstructorException(); //new
        if (!name) throw new EmptyValueException("name");
        //Asignacion
        this.#name = name;
        this.#id = id;
    }
    //Propiedades de acceso
    get name() {
        return this.#name;
    }

    set name(value) {
        if (!value) throw new EmptyValueException("name");
        this.#name = value;
    }

    get id(){
        return this.#id;
    }

    set id(value){
        if (!value) throw new EmptyValueException("id");
        this.#id = value;
    }
}

export {Customer};