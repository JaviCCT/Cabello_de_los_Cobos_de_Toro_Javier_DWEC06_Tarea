import { RentalManager } from './RentalManager.js';
import { Category }      from './Category.js';
import { Location }      from './Location.js';
import { Customer }      from './Customer.js';
import { Car }           from './Vehicle.js';

$(document).ready(function() {
  const rentalManager = RentalManager.getInstance();
  const windowsOpened = [];
  let modalIterator = null;

  // Objetos iniciales
  function initData() {
    rentalManager.addCategory(
      new Category("SUV",      "Todoterreno"),
      new Category("Berlina",  "Clasico"),
      new Category("Deportivo","Alta gama")
    );

    const vehicles = [
      new Car("123ABC","Xceed","Xceed",   30000,"KIA","./images/image1.jpg",5),
      new Car("234BCD","Model X","Model X",     60000,"Tesla","./images/image2.jpg",5),
      new Car("345CDE","Ateca","Ateca",  45000,"Seat","./images/image3.jpg",5),
      new Car("456DEF","3008","3008",          35000,"Peugeot","./images/image4.jpg",5),

      new Car("567EFG","A4",       "Berlina ejecutiva",40000,"Audi","./images/image5.jpg",5),
      new Car("678FGH","C-Class",  "Berlina media",    42000,"Mercedes","./images/image6.jpg",5),
      new Car("789GHI","3 Series", "Berlina deportiva",45000,"BMW","./images/image7.jpg",5),
      new Car("890HIJ","Megane",   "Berlina compacta", 22000,"Renault","./images/image8.jpg",5),

      new Car("901IJK","911",      "Deportivo clasico",90000,"Porsche","./images/image9.jpg",2),
      new Car("012JKL","Huracan",  "Deportivo exotico",200000,"Lamborghini","./images/image10.jpg",2),
      new Car("123KLM","Mustang",  "Deportivo americano",35000,"Ford","./images/image11.jpg",4),
      new Car("234LMN","GT",       "Deportivo coupe",   70000,"McLaren","./images/image12.jpg",2)
    ];
    rentalManager.addVehicle(...vehicles);

    vehicles.slice(0,4).forEach(v => rentalManager.assignCategoryToVehicle("SUV", v));
    vehicles.slice(4,8).forEach(v => rentalManager.assignCategoryToVehicle("Berlina", v));
    vehicles.slice(8,12).forEach(v => rentalManager.assignCategoryToVehicle("Deportivo", v));

    const locs = [
      new Location("Madrid",   "Sucursal", "Calle Mayor 1"),
      new Location("Barcelona","Sucursal","La Rambla 2"),
      new Location("Ciudad Real", "Sucursal","Toledo 30"),
      new Location("Toledo",  "Sucursal","CC Luz del tajo")
    ];
    rentalManager.addLocation(...locs);
    vehicles.forEach((v,i) =>
      rentalManager.assignLocationToVehicle(locs[i%4].name, v)
    );

    const customers = [
      new Customer("12345678A","Javier Cabello"),
      new Customer("87654321B","Luis Cabello"),
      new Customer("11223344C","Maria Cabello")
    ];
    rentalManager.addCustomer(...customers);

    for (let i = 0; i < 6; i++) {
      rentalManager.rentVehicle(vehicles[i], customers[i % 3], new Date());
    }
  }
 
  initData();

  function renderCategories() {
    $("#content").html(`
      <h2>Categorias</h2>
      <div id="categories-list" class="row"></div>
    `);
    let html = "";
    for (let c of rentalManager.getCategories()) {
      html += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${c.name}</h5>
            <p class="card-text">${c.description}</p>
            <a href="#" class="btn btn-primary view-category" data-category="${c.name}">
              Ver vehiculos
            </a>
            <button class="btn btn-outline-secondary modal-category ms-2" 
                    data-category="${c.name}">
              Lista
            </button>
          </div>
        </div>
      </div>`;
    }
    $("#categories-list").html(html);
  }

  function renderLocations() {
    $("#content").html(`
      <h2>Localizaciones</h2>
      <ul id="locations-list" class="list-group"></ul>
    `);
    let html = "";
    for (let loc of rentalManager.getLocations()) {
      html += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>${loc.name}</strong><br>
          <small>${loc.address}</small>
        </div>
        <div>
          <a href="#" class="btn btn-sm btn-primary view-location" 
             data-location="${loc.name}">
            Ver vehiculos
          </a>
          <button class="btn btn-sm btn-outline-secondary modal-location ms-2"
                  data-location="${loc.name}">
            Lista
          </button>
        </div>
      </li>`;
    }
    $("#locations-list").html(html);
  }

  function renderVehicles(arr, title) {
    $("#content").html(`
      <h2>${title}</h2>
      <div id="vehicles-list" class="row"></div>
    `);
    if (arr.length === 0) {
      $("#vehicles-list").html("<p>No hay vehiculos.</p>");
      return;
    }
    let html = "";
    arr.forEach(v => {
      html += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <img src="${v.image}" class="card-img-top" alt="${v.model}">
          <div class="card-body">
            <h5 class="card-title">${v.model}</h5>
            <p class="card-text">Precio: ${v.price}</p>
            <a href="#" class="btn btn-secondary view-vehicle" 
               data-license="${v.license}">
              Ver ficha
            </a>
          </div>
        </div>
      </div>`;
    });
    $("#vehicles-list").html(html);
  }

  function renderVehiclesByCategory(cat) {
    renderVehicles(
      Array.from(rentalManager.getVehiclesInCategory(cat)),
      `Vehiculos en ${cat}`
    );
  }

  function renderVehiclesByLocation(loc) {
    renderVehicles(
      Array.from(rentalManager.getVehiclesInLocation(loc)),
      `Vehiculos en ${loc}`
    );
  }

  function renderVehicleDetail(lic) {
    const v = rentalManager.vehicles.get(lic);
    if (!v) return;
    const cats = Array.from(rentalManager.vehicleCategories.get(lic) || [])
      .map(c => `
        <a href="#" class="badge bg-info me-1 view-category" 
           data-category="${c}">${c}</a>`)
      .join("");
    const loc = rentalManager.vehicleLocations.get(lic) || "";
    $("#content").html(`
      <div class="card">
        <div class="card-header">Detalle del Vehiculo</div>
        <div class="card-body">
          <h5 class="card-title">${v.model}</h5>
          <p class="card-text">Descripcion: ${v.description}</p>
          <p class="card-text">Precio: ${v.price}</p>
          <p class="card-text">Estado: ${v.isRented ? "Alquilado" : "Disponible"}</p>
          <p class="card-text">Categorias: ${cats}</p>
          <p class="card-text">Ubicacion: <strong>${loc}</strong></p>
          <button class="btn btn-outline-primary" id="openWindow">
            Abrir en ventana
          </button>
          <a href="#" class="btn btn-primary ms-2 back-to-categories">
            Volver
          </a>
        </div>
      </div>
    `);
  }

  function renderRandomVehicles() {
    const all = Array.from(rentalManager.getVehicles());
    const picks = all.sort(() => 0.5 - Math.random()).slice(0,3);
    renderVehicles(picks, "Vehiculos destacados");
  }

  function renderCustomers() {
    $("#content").html(`
      <h2>Clientes</h2>
      <ul id="customers-list" class="list-group"></ul>
    `);
    let html = "";
    for (let c of rentalManager.getCustomers()) {
      html += `<li class="list-group-item">${c.name} (${c.id})</li>`;
    }
    $("#customers-list").html(html);
  }

  function renderRentals() {
    $("#content").html(`
      <h2>Alquileres</h2>
      <ul id="rentals-list" class="list-group"></ul>
    `);
    let html = "";
    for (let r of rentalManager.getRentals()) {
      html += `
        <li class="list-group-item">
          Vehículo ${r.vehicle.license} — ${r.customer.name} ${r.customer.id} — 
          Inicio ${r.startRental.toLocaleDateString()}
        </li>`;
    }
    $("#rentals-list").html(html);
  }

  function renderSearch() {
    $("#content").html(`
      <h2>Buscador</h2>
      <form id="searchForm" class="row g-3 mb-4">
        <div class="col-md-4">
          <label for="search-date" class="form-label">Fecha alquiler</label>
          <input type="date" id="search-date" class="form-control">
        </div>
        <div class="col-md-4">
          <label for="search-status" class="form-label">Estado</label>
          <select id="search-status" class="form-select">
            <option value="all">Todos</option>
            <option value="rented">Alquilados</option>
            <option value="available">Disponibles</option>
          </select>
        </div>
        <div class="col-md-4 d-flex align-items-end">
          <button type="submit" class="btn btn-primary">Buscar</button>
        </div>
      </form>
      <div id="search-results" class="row"></div>
    `);
  }


  $("#content")
    .on("click", ".view-category", function(e) {
      e.preventDefault();
      const cat = $(this).data("category");
      renderVehiclesByCategory(cat);
      history.pushState({view:"category",category:cat},`Vehiculos ${cat}`,`#category-${cat}`);
    })
    .on("click", ".view-location", function(e) {
      e.preventDefault();
      const loc = $(this).data("location");
      renderVehiclesByLocation(loc);
      history.pushState({view:"location",location:loc},`Vehiculos ${loc}`,`#location-${loc}`);
    })
    .on("click", ".view-vehicle", function(e) {
      e.preventDefault();
      const lic = $(this).data("license");
      renderVehicleDetail(lic);
      history.pushState({view:"vehicle",license:lic},`Vehiculo ${lic}`,`#vehicle-${lic}`);
    })
    .on("click", ".back-to-categories", function(e) {
      e.preventDefault();
      renderCategories();
      history.pushState({view:"home"},"Inicio","#home");
    });

  // Abrir en ventana nueva
  $(document).on("click", "#openWindow", function() {
    const html = $("#content").html();
    const win = window.open("", "_blank", "width=600,height=400");
    win.document.write(`
      <!DOCTYPE html>
      <html><head><title>Detalle Vehiculo</title></head>
      <body>${html}</body></html>
    `);
    windowsOpened.push(win);
  });

  // Modal iterador categoria
  $(document).on("click", ".modal-category", function() {
    const cat = $(this).data("category");
    modalIterator = rentalManager.getVehiclesInCategory(cat);
    $("#itemModalLabel").text(`Recorriendo ${cat}`);
    showNextInModal();
    new bootstrap.Modal(document.getElementById("itemModal")).show();
  });
  // Modal iterador ubicacion
  $(document).on("click", ".modal-location", function() {
    const loc = $(this).data("location");
    modalIterator = rentalManager.getVehiclesInLocation(loc);
    $("#itemModalLabel").text(`Recorriendo ${loc}`);
    showNextInModal();
    new bootstrap.Modal(document.getElementById("itemModal")).show();
  });
  function showNextInModal() {
    const next = modalIterator.next();
    if (next.done) {
      $("#itemModalBody").html("<p>Fin de la lista.</p>");
    } else {
      const v = next.value;
      $("#itemModalBody").html(`
        <h5>${v.model} (${v.license})</h5>
        <p>Precio: ${v.price}</p>
        <p>${v.description}</p>
      `);
    }
  }
  $("#modalNext").on("click", showNextInModal);

  //Menu principal
  $(".nav-link").on("click", function(e) {
    e.preventDefault();
    const tgt = $(this).attr("href");
    switch (tgt) {
      case "#categories":
        renderCategories();
        history.pushState({view:"home"},"Categorias",tgt);
        break;
      case "#locations":
        renderLocations();
        history.pushState({view:"locations"},"Localizaciones",tgt);
        break;
      case "#vehicles":
        renderRandomVehicles();
        history.pushState({view:"random"},"Vehiculos destacados",tgt);
        break;
      case "#customers":
        renderCustomers();
        history.pushState({view:"customers"},"Clientes",tgt);
        break;
      case "#rentals":
        renderRentals();
        history.pushState({view:"rentals"},"Alquileres",tgt);
        break;
      case "#search":
        renderSearch();
        history.pushState({view:"search"},"Buscador",tgt);
        break;
      case "#close-windows":
        windowsOpened.forEach(w => w.close());
        windowsOpened.length = 0;
        break;
    }
  });

  //Busqueda
  $(document).on("submit", "#searchForm", function(e) {
    e.preventDefault();
    const date = $("#search-date").val();
    const status = $("#search-status").val();
    let results = Array.from(rentalManager.getVehicles());

    if (status === "rented")        results = results.filter(v => v.isRented);
    else if (status === "available") results = results.filter(v => !v.isRented);

    if (date) {
      const byDate = Array.from(rentalManager.getRentals())
        .filter(r => r.startRental.toISOString().slice(0,10) === date)
        .map(r => r.vehicle);
      results = byDate;
      if (status==="available") {
        results = results.filter(v => !v.isRented);
      }
    }

    if (results.length === 0) {
      $("#search-results").html("<p>No se encontraron vehiculos.</p>");
    } else {
      let html = "";
      results.forEach(v => {
        html += `
        <div class="col-md-4 mb-3">
          <div class="card">
            <img src="${v.image}" class="card-img-top" alt="${v.model}">
            <div class="card-body">
              <h5 class="card-title">${v.model}</h5>
              <p class="card-text">Precio: ${v.price}</p>
              <a href="#" class="btn btn-secondary view-vehicle" data-license="${v.license}">
                Ver ficha
              </a>
            </div>
          </div>
        </div>`;
      });
      $("#search-results").html(html);
    }
  });

  renderCategories();
  window.onpopstate = function(ev) {
    const s = ev.state || {};
    switch (s.view) {
      case "category": renderVehiclesByCategory(s.category); break;
      case "location": renderVehiclesByLocation(s.location); break;
      case "vehicle":  renderVehicleDetail(s.license);      break;
      case "random":   renderRandomVehicles();               break;
      case "customers":renderCustomers();                    break;
      case "rentals":  renderRentals();                      break;
      case "search":   renderSearch();                       break;
      default:         renderCategories();                   break;
    }
  };
});
