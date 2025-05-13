'use strict';
import {
    InvalidValueException,
    EmptyValueException
} from './Exceptions.js';
import { Category } from './Category.js';
import { Location } from './Location.js';
import { Customer } from './Customer.js';
import { Vehicle } from './Vehicle.js';
import { Rental } from './Rental.js';

class RentalManager {
    constructor() {
        
        if (RentalManager.instance) {
            return RentalManager.instance;
        }
        this.systemName = "UT04- Javier Cabello de los Cobos- Alquiler";
        // Arrays
        this.vehicles = new Map();      
        this.categories = new Map();    
        this.locations = new Map();     
        this.customers = new Map();     
        this.rentals = new Map();       

        
        this.vehicleCategories = new Map();
        
        this.vehicleLocations = new Map();

        RentalManager.instance = this;
    }

    // Metodo estatico para obtener la unica instancia
    static getInstance() {
        if (!RentalManager.instance) {
            RentalManager.instance = new RentalManager();
        }
        return RentalManager.instance;
    }

    //----- Metodos Getter-----
    getCategories() {
        return this.categories.values();
    }

    getLocations() {
        return this.locations.values();
    }

    getVehicles() {
        return this.vehicles.values();
    }

    getCustomers() {
        return this.customers.values();
    }

    getRentals() {
        return this.rentals.values();
    }

    addCategory(...categories) {
        for (let category of categories) {
            if (!category) throw new InvalidValueException("category", category);
            if (typeof category === 'string') {
                category = new Category(category);
            }
            if (this.categories.has(category.name)) 
                throw new InvalidValueException("category", "La categoria ya existe");
            this.categories.set(category.name, category);
        }
        return this;
    }

    removeCategory(...categories) {
        for (let category of categories) {
            if (!category) throw new InvalidValueException("category", category);
            let catName = (typeof category === 'string') ? category : category.name;
            if (!this.categories.has(catName))
                throw new InvalidValueException("category", "La categoria no esta registrada");
            this.categories.delete(catName);
            // Eliminar la relacion en vehiculos
            for (let [vehLicense, catSet] of this.vehicleCategories.entries()) {
                if (catSet.has(catName)) {
                    catSet.delete(catName);
                }
            }
        }
        return this;
    }

    addLocation(...locations) {
        for (let location of locations) {
            if (!location) throw new InvalidValueException("location", location);
            if (typeof location === 'string') {
                location = new Location(location, "N/D", "N/A");
            }
            if (this.locations.has(location.name))
                throw new InvalidValueException("location", "La ubicacion ya existe");
            this.locations.set(location.name, location);
        }
        return this;
    }

    removeLocation(...locations) {
        for (let location of locations) {
            if (!location) throw new InvalidValueException("location", location);
            let locName = (typeof location === 'string') ? location : location.name;
            if (!this.locations.has(locName))
                throw new InvalidValueException("location", "La ubicacion no esta registrada");
            this.locations.delete(locName);
            // Eliminar la asignacion en vehiculos
            for (let [vehLicense, assignedLoc] of this.vehicleLocations.entries()) {
                if (assignedLoc === locName) {
                    this.vehicleLocations.delete(vehLicense);
                }
            }
        }
        return this;
    }

    addVehicle(...vehicles) {
        for (let vehicle of vehicles) {
            if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
            if (this.vehicles.has(vehicle.license))
                throw new InvalidValueException("vehicle", "El vehiculo ya existe");
            this.vehicles.set(vehicle.license, vehicle);
        }
        return this;
    }

    removeVehicle(...vehicles) {
        for (let vehicle of vehicles) {
            if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
            let license = vehicle.license;
            if (!this.vehicles.has(license))
                throw new InvalidValueException("vehicle", "El vehiculo no esta registrado");
            // Comprobar que no existe un alquiler activo con el vehiculo
            for (let rental of this.rentals.values()) {
                if (rental.vehicle.license === license && !rental.isFinished) {
                    throw new InvalidValueException("vehicle", "El vehiculo tiene un alquiler activo");
                }
            }
            this.vehicles.delete(license);
            this.vehicleCategories.delete(license);
            this.vehicleLocations.delete(license);
        }
        return this;
    }

    addCustomer(...customers) {
        for (let customer of customers) {
            if (!customer) throw new InvalidValueException("customer", customer);
            if (this.customers.has(customer.id))
                throw new InvalidValueException("customer", "El cliente ya existe");
            this.customers.set(customer.id, customer);
        }
        return this;
    }

    removeCustomer(...customers) {
        for (let customer of customers) {
            if (!customer) throw new InvalidValueException("customer", customer);
            if (!this.customers.has(customer.id))
                throw new InvalidValueException("customer", "El cliente no esta registrado");
            // Comprobar que el cliente no tenga un alquiler activo
            for (let rental of this.rentals.values()) {
                if (rental.customer.id === customer.id && !rental.isFinished) {
                    throw new InvalidValueException("customer", "El cliente tiene un alquiler activo");
                }
            }
            this.customers.delete(customer.id);
        }
        return this;
    }

    assignCategoryToVehicle(...args) {
        if (args.length < 2)
            throw new InvalidValueException("assignCategoryToVehicle", "Se requieren al menos 2 argumentos");
        let vehicle = args[args.length - 1];
        let categories = args.slice(0, args.length - 1);
        if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
        if (!this.vehicles.has(vehicle.license)) {
            this.addVehicle(vehicle);
        }
        for (let category of categories) {
            if (!category) throw new InvalidValueException("category", category);
            if (typeof category === 'string') {
                category = new Category(category);
            }
            if (!this.categories.has(category.name)) {
                this.addCategory(category);
            }
            let catSet = this.vehicleCategories.get(vehicle.license);
            if (!catSet) {
                catSet = new Set();
                this.vehicleCategories.set(vehicle.license, catSet);
            }
            catSet.add(category.name);
        }
        return this;
    }

    // Para desasignar categorias a un vehiculo: se reciben uno o mas categorias y como ultimo argumento el vehiculo.
    deassignCategoryToVehicle(...args) {
        if (args.length < 2)
            throw new InvalidValueException("deassignCategoryToVehicle", "Se requieren al menos 2 argumentos");
        let vehicle = args[args.length - 1];
        let categories = args.slice(0, args.length - 1);
        if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
        for (let category of categories) {
            if (!category) throw new InvalidValueException("category", category);
            let catName = (typeof category === 'string') ? category : category.name;
            let catSet = this.vehicleCategories.get(vehicle.license);
            if (catSet && catSet.has(catName)) {
                catSet.delete(catName);
            }
        }
        return this;
    }

    assignLocationToVehicle(location, vehicle) {
        if (!location) throw new InvalidValueException("location", location);
        if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
        if (typeof location === 'string') {
            location = new Location(location, "N/D", "N/A");
        }
        if (!this.locations.has(location.name)) {
            this.addLocation(location);
        }
        if (!this.vehicles.has(vehicle.license)) {
            this.addVehicle(vehicle);
        }
        this.vehicleLocations.set(vehicle.license, location.name);
        return this;
    }

    deassignLocationToVehicle(vehicle) {
        if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
        this.vehicleLocations.delete(vehicle.license);
        return this;
    }

    //----- Metodos de busqueda que devuelven iteradores (con opcional ordenacion) -----
    getVehiclesInCategory(category, sortFn) {
        if (!category) throw new InvalidValueException("category", category);
        let catName = (typeof category === 'string') ? category : category.name;
        if (!this.categories.has(catName))
            throw new InvalidValueException("category", "La categoria no esta registrada");
        let result = [];
        for (let [vehLicense, catSet] of this.vehicleCategories.entries()) {
            if (catSet.has(catName)) {
                let veh = this.vehicles.get(vehLicense);
                if (veh) result.push(veh);
            }
        }
        if (sortFn && typeof sortFn === 'function') {
            result.sort(sortFn);
        }
        return result[Symbol.iterator]();
    }

    getVehiclesInLocation(location, sortFn) {
        if (!location) throw new InvalidValueException("location", location);
        let locName = (typeof location === 'string') ? location : location.name;
        if (!this.locations.has(locName))
            throw new InvalidValueException("location", "La ubicacion no esta registrada");
        let result = [];
        for (let [vehLicense, assignedLoc] of this.vehicleLocations.entries()) {
            if (assignedLoc === locName) {
                let veh = this.vehicles.get(vehLicense);
                if (veh) result.push(veh);
            }
        }
        if (sortFn && typeof sortFn === 'function') {
            result.sort(sortFn);
        }
        return result[Symbol.iterator]();
    }

    findVehicles(criteriaFn, sortFn) {
        let result = Array.from(this.vehicles.values()).filter(criteriaFn);
        if (sortFn && typeof sortFn === 'function') {
            result.sort(sortFn);
        }
        return result[Symbol.iterator]();
    }

    getRentals(criteriaFn = () => true, sortFn) {
        let result = Array.from(this.rentals.values()).filter(criteriaFn);
        if (sortFn && typeof sortFn === 'function') {
            result.sort(sortFn);
        }
        return result[Symbol.iterator]();
    }

    filterVehiclesInCategory(category, criteriaFn, sortFn) {
        if (!category) throw new InvalidValueException("category", category);
        let catName = (typeof category === 'string') ? category : category.name;
        if (!this.categories.has(catName))
            throw new InvalidValueException("category", "La categoria no esta registrada");
        let result = [];
        for (let [vehLicense, catSet] of this.vehicleCategories.entries()) {
            if (catSet.has(catName)) {
                let veh = this.vehicles.get(vehLicense);
                if (veh && criteriaFn(veh)) {
                    result.push(veh);
                }
            }
        }
        if (sortFn && typeof sortFn === 'function') {
            result.sort(sortFn);
        }
        return result[Symbol.iterator]();
    }

    filterVehiclesInLocation(location, criteriaFn, sortFn) {
        if (!location) throw new InvalidValueException("location", location);
        let locName = (typeof location === 'string') ? location : location.name;
        if (!this.locations.has(locName))
            throw new InvalidValueException("location", "La ubicacion no esta registrada");
        let result = [];
        for (let [vehLicense, assignedLoc] of this.vehicleLocations.entries()) {
            if (assignedLoc === locName) {
                let veh = this.vehicles.get(vehLicense);
                if (veh && criteriaFn(veh)) {
                    result.push(veh);
                }
            }
        }
        if (sortFn && typeof sortFn === 'function') {
            result.sort(sortFn);
        }
        return result[Symbol.iterator]();
    }

    //----- Metodos create -----
    createVehicle(...args) {
        let temp = new Vehicle(...args);
        if (this.vehicles.has(temp.license)) {
            return this.vehicles.get(temp.license);
        }
        return temp;
    }

    createLocation(...args) {
        let temp = new Location(...args);
        if (this.locations.has(temp.name)) {
            return this.locations.get(temp.name);
        }
        return temp;
    }

    createCustomer(...args) {
        let temp = new Customer(...args);
        if (this.customers.has(temp.id)) {
            return this.customers.get(temp.id);
        }
        return temp;
    }

    createCategory(...args) {
        let temp = new Category(...args);
        if (this.categories.has(temp.name)) {
            return this.categories.get(temp.name);
        }
        return temp;
    }

    //----- Gestion de alquileres -----
    rentVehicle(vehicle, customer, startDate) {
        if (!vehicle) throw new InvalidValueException("vehicle", vehicle);
        if (!customer) throw new InvalidValueException("customer", customer);
        if (!startDate) throw new InvalidValueException("startDate", startDate);
        if (!this.vehicles.has(vehicle.license))
            throw new InvalidValueException("vehicle", "El vehiculo no esta registrado");
        if (!this.customers.has(customer.id))
            throw new InvalidValueException("customer", "El cliente no esta registrado");
        if (vehicle.isRented)
            throw new InvalidValueException("vehicle", "El vehiculo ya esta alquilado");
        let rental = new Rental(vehicle, customer, startDate);
        this.rentals.set(rental.id, rental);
        vehicle.rent();
        return rental;
    }

    returnVehicle(rental, days) {
        if (!rental) throw new InvalidValueException("rental", rental);
        if (rental.isFinished)
            throw new InvalidValueException("rental", "El alquiler ya esta finalizado");
        if (typeof days !== 'number' || days <= 0)
            throw new InvalidValueException("days", days);
        rental.isFinished = true;
        rental.price = days * (rental.vehicle.price || 0);
        rental.vehicle.returnVehicle();
        return rental.price;
    }
}

export { RentalManager };
