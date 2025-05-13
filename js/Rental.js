'use strict';
import {
    InvalidAccessConstructorException,
    EmptyValueException,
    InvalidValueException,
} from './Exceptions.js';

class Rental {
    // contador estático privado
    static #lastId = 0;

    #id;
    #vehicle;
    #customer;
    #startRental;
    #isFinished;
    #price;

    constructor(vehicle, customer, startRental, isFinished = false, price = null) {
        if (!new.target) throw new InvalidAccessConstructorException();
        if (!vehicle)       throw new EmptyValueException("vehicle");
        if (!customer)      throw new EmptyValueException("customer");
        if (!startRental)   throw new EmptyValueException("startRental");

        // incrementamos el contador sin resetearlo
        Rental.#lastId++;
        this.#id = Rental.#lastId;

        this.#vehicle     = vehicle;
        this.#customer    = customer;
        this.#startRental = startRental;
        this.#isFinished  = isFinished;
        this.#price       = price;
    }

    get id() {
        return this.#id;
    }

    get vehicle() {
        return this.#vehicle;
    }
    set vehicle(v) {
        if (!v) throw new EmptyValueException("vehicle");
        this.#vehicle = v;
    }

    get customer() {
        return this.#customer;
    }
    set customer(c) {
        if (!c) throw new EmptyValueException("customer");
        this.#customer = c;
    }

    get startRental() {
        return this.#startRental;
    }
    set startRental(d) {
        if (!d) throw new EmptyValueException("startRental");
        this.#startRental = d;
    }

    get isFinished() {
        return this.#isFinished;
    }
    set isFinished(f) {
        if (typeof f !== 'boolean') throw new InvalidValueException("isFinished", f);
        this.#isFinished = f;
    }

    get price() {
        return this.#price;
    }
    set price(p) {
        if (p !== null && typeof p !== 'number') throw new InvalidValueException("price", p);
        this.#price = p;
    }
}

export { Rental };
