import { RentalManager } from './RentalManager.js';
import { Category } from './Category.js';
import { Location } from './Location.js';
import { Car, Bike, Van } from './Vehicle.js';


$(document).ready(function () {
  const rm = RentalManager.getInstance();

  function showMessage(type, text) {

    const alert = $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${text}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
    $('#content').prepend(alert);
    setTimeout(() => alert.alert('close'), 4000);
  }

  function refreshCategoryMenu() {
    // Elimina enlaces de categorias existentes y genera de nuevo
    $("nav a.nav-link[data-category-link]").remove();
    const $nav = $("nav");
    [...rm.getCategories()].forEach(cat => {
      const link = $(`<a class="nav-link text-white" href="#" data-category-link data-category="${cat.name}">${cat.name}</a>`);
      $nav.append(link);
    });
  }

  // Inicializa menu
  function injectAdminMenu() {
    if ($('#adminMenu').length) return; 
    const adminMenu = `<div class="dropdown nav-item ms-auto">
      <a class="nav-link dropdown-toggle text-white" href="#" id="adminMenu" role="button" data-bs-toggle="dropdown" aria-expanded="false">Gestion</a>
      <ul class="dropdown-menu" aria-labelledby="adminMenu">
        <li><a class="dropdown-item" href="#" id="nav-new-vehicle">Crear vehiculo</a></li>
        <li><a class="dropdown-item" href="#" id="nav-delete-vehicle">Eliminar vehiculo</a></li>
        <li><a class="dropdown-item" href="#" id="nav-edit-vehicle-cat">Modificar categorias de vehiculo</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="nav-new-category">Crear categoria</a></li>
        <li><a class="dropdown-item" href="#" id="nav-delete-category">Eliminar categoria</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="nav-new-location">Crear localizacion</a></li>
      </ul>
    </div>`;
    $('header .nav').append(adminMenu);
  }


  //Formularios 

  // Crear vehiculo
  function renderCreateVehicleForm() {
    const catOptions = [...rm.getCategories()]
      .map(c => `<div class="form-check form-check-inline">
          <input class="form-check-input" type="checkbox" id="cat-${c.name}" value="${c.name}">
          <label class="form-check-label" for="cat-${c.name}">${c.name}</label>
        </div>`).join('');

    $('#content').html(`<h2>Nuevo vehiculo</h2>
      <form id="form-create-veh" class="needs-validation" novalidate>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Matricula</label>
            <input type="text" class="form-control" id="license" required pattern="^\\d{3}[A-Z]{3}$">
            <div class="invalid-feedback">Introduce una matricula valida (123ABC).</div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Modelo</label>
            <input type="text" class="form-control" id="model" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Precio (€ / dia)</label>
            <input type="number" class="form-control" id="price" required min="1">
          </div>
          <div class="col-12">
            <label class="form-label">Descripcion</label>
            <textarea class="form-control" id="description"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Marca</label>
            <input type="text" class="form-control" id="brand">
          </div>
          <div class="col-md-6">
            <label class="form-label">Imagen (URL)</label>
            <input type="text" class="form-control" id="image">
          </div>
          <div class="col-12">
            <label class="form-label d-block">Categorias</label>
            ${catOptions || '<p>No hay categorias aun</p>'}
          </div>
          <div class="col-12 mt-3">
            <button class="btn btn-primary" type="submit">Guardar vehiculo</button>
          </div>
        </div>
      </form>`);

    (function () {
      const form = document.querySelector('#form-create-veh');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }

        try {
          const license = $('#license').val().trim().toUpperCase();
          const model = $('#model').val().trim();
          const price = parseFloat($('#price').val());
          const description = $('#description').val().trim() || 'N/D';
          const brand = $('#brand').val().trim() || 'N/D';
          const image = $('#image').val().trim() || './images/image1.jpg';

          // Creamos coche por defecto 
          const vehicle = new Car(license, model, description, price, brand, image, 5);
          rm.addVehicle(vehicle);

          // Categorias seleccionadas
          $("#form-create-veh input[type='checkbox']:checked").each(function () {
            rm.assignCategoryToVehicle($(this).val(), vehicle);
          });

          showMessage('success', 'Vehiculo creado correctamente.');
          refreshCategoryMenu();
        } catch (e) {
          showMessage('danger', e.message);
        }
      }, false);
    })();
  }

  // Eliminar vehiculo
  function renderDeleteVehicleForm() {
    const vehOptions = [...rm.getVehicles()].map(v => `<option value="${v.license}">${v.license} - ${v.model}</option>`).join('');
    $('#content').html(`<h2>Eliminar vehiculo</h2>
      <form id="form-del-veh">
        <div class="mb-3">
          <label class="form-label">Vehiculo</label>
          <select class="form-select" id="veh-select" required>${vehOptions || '<option value="">No hay vehiculos</option>'}</select>
        </div>
        <button class="btn btn-danger" type="submit">Eliminar</button>
      </form>`);

    $('#form-del-veh').on('submit', function (e) {
      e.preventDefault();
      const license = $('#veh-select').val();
      const veh = rm.vehicles.get(license);
      if (!veh) return showMessage('danger', 'Vehiculo no encontrado.');
      try {
        rm.removeVehicle(veh);
        showMessage('success', 'Vehiculo eliminado');
        this.reset();
        refreshCategoryMenu();
      } catch (err) {
        showMessage('danger', err.message);
      }
    });
  }

  // Modificar categorias de vehiculos
  function renderEditVehicleCategoriesForm() {
    const vehOptions = [...rm.getVehicles()].map(v => `<option value="${v.license}">${v.license} - ${v.model}</option>`).join('');
    const catCheckboxes = [...rm.getCategories()].map(c => `<div class="form-check">
        <input class="form-check-input" type="checkbox" value="${c.name}" id="edit-cat-${c.name}">
        <label class="form-check-label" for="edit-cat-${c.name}">${c.name}</label>
      </div>`).join('');

    $('#content').html(`<h2>Modificar categorias del vehiculo</h2>
      <form id="form-edit-veh-cat">
        <div class="mb-3">
          <label class="form-label">Vehiculo</label>
          <select class="form-select" id="edit-veh-select" required>${vehOptions}</select>
        </div>
        <div id="cat-container" class="mb-3">
          <label class="form-label d-block">Categorias</label>
          ${catCheckboxes || '<p>No hay categorias.</p>'}
        </div>
        <button class="btn btn-primary" type="submit">Actualizar</button>
      </form>`);

    $('#edit-veh-select').on('change', function () {
      const license = $(this).val();
      const current = rm.vehicleCategories.get(license) || new Set();
      $('#cat-container input[type="checkbox"]').each(function () {
        $(this).prop('checked', current.has($(this).val()));
      });
    }).trigger('change');

    $('#form-edit-veh-cat').on('submit', function (e) {
      e.preventDefault();
      const license = $('#edit-veh-select').val();
      const veh = rm.vehicles.get(license);
      if (!veh) return;
      try {
        // Desasignamos todas primero
        const currentCats = rm.vehicleCategories.get(license) || new Set();
        currentCats.forEach(cn => rm.deassignCategoryToVehicle(cn, veh));
        // Asignamos las seleccionadas
        $('#cat-container input[type="checkbox"]:checked').each(function () {
          rm.assignCategoryToVehicle($(this).val(), veh);
        });
        showMessage('success', 'Categorias actualizadas.');
        refreshCategoryMenu();
      } catch (err) {
        showMessage('danger', err.message);
      }
    });
  }

  //Crear categoria
  function renderCreateCategoryForm() {
    $('#content').html(`<h2>Nueva categoria</h2>
      <form id="form-new-cat" class="needs-validation" novalidate>
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-control" id="cat-name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Descripcion</label>
          <input type="text" class="form-control" id="cat-desc">
        </div>
        <button class="btn btn-primary" type="submit">Crear</button>
      </form>`);

    $('#form-new-cat').on('submit', function (e) {
      e.preventDefault();
      const name = $('#cat-name').val().trim();
      const desc = $('#cat-desc').val().trim() || 'N/D';
      try {
        rm.addCategory(new Category(name, desc));
        showMessage('success', 'Categoria creada.');
        refreshCategoryMenu();
        this.reset();
      } catch (err) {
        showMessage('danger', err.message);
      }
    });
  }

  // Eliminar categoria
  function renderDeleteCategoryForm() {
    const catOptions = [...rm.getCategories()].map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    $('#content').html(`<h2>Eliminar categoria</h2>
      <form id="form-del-cat">
        <div class="mb-3">
          <label class="form-label">Categoria</label>
          <select class="form-select" id="cat-select" required>${catOptions}</select>
        </div>
        <button class="btn btn-danger" type="submit">Eliminar</button>
      </form>`);

    $('#form-del-cat').on('submit', function (e) {
      e.preventDefault();
      const catName = $('#cat-select').val();
      try {
        rm.removeCategory(catName);
        showMessage('success', 'Categoria eliminada.');
        refreshCategoryMenu();
        this.reset();
      } catch (err) {
        showMessage('danger', err.message);
      }
    });
  }

  // Crear localizacion
  function renderCreateLocationForm() {
    $('#content').html(`<h2>Nueva localizacion</h2>
      <form id="form-new-loc" class="needs-validation" novalidate>
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-control" id="loc-name" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Descripcion</label>
          <input type="text" class="form-control" id="loc-desc">
        </div>
        <div class="mb-3">
          <label class="form-label">Direccion</label>
          <input type="text" class="form-control" id="loc-address" required>
        </div>
        <button class="btn btn-primary" type="submit">Crear</button>
      </form>`);

    $('#form-new-loc').on('submit', function (e) {
      e.preventDefault();
      const name = $('#loc-name').val().trim();
      const desc = $('#loc-desc').val().trim() || 'N/D';
      const addr = $('#loc-address').val().trim();
      try {
        rm.addLocation(new Location(name, desc, addr));
        showMessage('success', 'Localizacion creada');
        this.reset();
      } catch (err) {
        showMessage('danger', err.message);
      }
    });
  }


  injectAdminMenu();
  refreshCategoryMenu();

  $('header').on('click', '#nav-new-vehicle', e => { e.preventDefault(); renderCreateVehicleForm(); });
  $('header').on('click', '#nav-delete-vehicle', e => { e.preventDefault(); renderDeleteVehicleForm(); });
  $('header').on('click', '#nav-edit-vehicle-cat', e => { e.preventDefault(); renderEditVehicleCategoriesForm(); });
  $('header').on('click', '#nav-new-category', e => { e.preventDefault(); renderCreateCategoryForm(); });
  $('header').on('click', '#nav-delete-category', e => { e.preventDefault(); renderDeleteCategoryForm(); });
  $('header').on('click', '#nav-new-location', e => { e.preventDefault(); renderCreateLocationForm(); });


  $('header').on('click', 'a[data-category-link]', function (e) {
    e.preventDefault();
    const cat = $(this).data('category');

    if (typeof window.renderVehiclesByCategory === 'function') {
      window.renderVehiclesByCategory(cat);
    } else {
      $('#content').text('Funcionalidad de listado de categoria no disponible');
    }
  });
});
