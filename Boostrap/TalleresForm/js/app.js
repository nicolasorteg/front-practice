/* =====================================================
   1) FUNCIONES AUXILIARES
   ===================================================== */
const $ = id => document.getElementById(id);

// Redondea a 2 decimales
const redondear = n => Math.round(n * 100) / 100;

// Convierte "12,5" o "12.5" en número
const aNumero = texto => parseFloat(texto.replace(',', '.'));

// Marca un campo como válido/inválido y escribe el mensaje
function marcar(campo, error) {
    campo.classList.toggle('is-invalid', error !== '');
    campo.classList.toggle('is-valid', error === '');
    const feedback = campo.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = error;
}

/* =====================================================
   2) VALIDACIONES DEL CLIENTE (devuelven '' si es correcto)
   ===================================================== */
function validarNIF(v) {
    v = v.toUpperCase();
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // NIF: 8 cifras + letra
    if (/^\d{8}[A-Z]$/.test(v)) {
        return letras[parseInt(v.slice(0, 8)) % 23] === v[8];
    }
    // NIE: X/Y/Z + 7 cifras + letra
    if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
        const numero = v.replace('X', '0').replace('Y', '1').replace('Z', '2').slice(0, 8);
        return letras[parseInt(numero) % 23] === v[8];
    }
    // CIF: letra + 7 cifras + dígito/letra de control
    if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(v)) {
        let pares = 0, impares = 0;
        for (let i = 0; i < 7; i++) {
            const d = parseInt(v[i + 1]);
            if (i % 2 === 0) {            // posiciones impares (1ª, 3ª...): se doblan
                const doble = d * 2;
                impares += Math.floor(doble / 10) + (doble % 10);
            } else {
                pares += d;
            }
        }
        const control = (10 - ((pares + impares) % 10)) % 10;
        return v[8] === String(control) || v[8] === 'JABCDEFGHI'[control];
    }
    return false;
}

const reglas = {
    numFactura: v => v.trim() === '' ? 'Número de factura obligatorio' : '',

    fecha: v => v === '' ? 'Fecha obligatoria' : '',

    nombre: v => (v.trim() === '' || v.length > 50) ? 'Nombre obligatorio, máximo 50 caracteres' : '',

    nif: v => validarNIF(v) ? '' : 'NIF/CIF/NIE incorrecto (ej. 12345678Z)',

    direccion: v => v.trim() === '' ? 'Dirección obligatoria' : '',

    cp: v => (/^\d{5}$/.test(v) && v >= 1001 && v <= 52006) ? '' : 'Código postal erróneo: 5 dígitos entre 01001 y 52006',

    provincia: v => (v.trim() === '' || v.length > 50) ? 'Provincia obligatoria (1 a 50 caracteres)' : '',

    ciudad: v => (v.trim() === '' || v.length > 30) ? 'Ciudad obligatoria (máximo 30 caracteres)' : '',

    // El teléfono es opcional: si está vacío no da error
    telefono: v => (v === '' || /^[6789]\d{8}$/.test(v)) ? '' : 'Teléfono erróneo: 9 cifras empezando por 6, 7, 8 o 9',

    email: v => /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(v) ? '' : 'Email obligatorio y con formato válido (nombre@dominio.es)',

    captcha: v => (parseInt(v) === captchaResultado) ? '' : 'Captcha incorrecto'
};

// Valida un campo concreto del cliente
function validarCampo(id) {
    const campo = $(id);
    const error = reglas[id](campo.value);
    marcar(campo, error);
    // Teléfono vacío: sin color
    if (id === 'telefono' && campo.value === '') campo.classList.remove('is-valid');
    return error;
}

// Validación MIENTRAS se escribe (inside)
Object.keys(reglas).forEach(id => {
    $(id).addEventListener('input', () => validarCampo(id));
    $(id).addEventListener('change', () => validarCampo(id));
});

/* =====================================================
   3) CAPTCHA (suma de dos dígitos)
   ===================================================== */
let captchaResultado = 0;

function nuevoCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    captchaResultado = a + b;
    $('textoCaptcha').textContent = a + ' + ' + b;
    $('captcha').value = '';
    $('captcha').classList.remove('is-valid', 'is-invalid');
}
nuevoCaptcha();

/* =====================================================
   4) LÍNEAS DE FACTURA
   ===================================================== */
const tbody = $('lineas');

// Crea una fila nueva
function crearLinea() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="num fw-bold"></td>
        <td><input type="text" class="form-control form-control-sm cantidad" maxlength="6"></td>
        <td><input type="text" class="form-control form-control-sm precio" maxlength="6"></td>
        <td><input type="text" class="form-control form-control-sm descripcion" maxlength="50"></td>
        <td>
            <select class="form-select form-select-sm iva">
                <option value="4">4%</option>
                <option value="10">10%</option>
                <option value="21" selected>21%</option>
            </select>
        </td>
        <td class="importe imp-linea">0.00</td>
        <td class="importe imp-iva">0.00</td>
        <td class="importe imp-total">0.00</td>
        <td><button type="button" class="btn btn-sm btn-outline-danger borrar"><i class="bi bi-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
    numerarLineas();
}

// Pone Nº de línea automático (1, 2, 3...)
function numerarLineas() {
    tbody.querySelectorAll('tr').forEach((tr, i) => {
        tr.querySelector('.num').textContent = i + 1;
    });
}

// Valida una fila. Devuelve '' si es correcta o el mensaje de error.
function validarLinea(tr) {
    const cantidad = tr.querySelector('.cantidad');
    const precio = tr.querySelector('.precio');
    const desc = tr.querySelector('.descripcion');
    const n = tr.querySelector('.num').textContent;
    const patron = /^\d{1,3}([.,]\d{1,2})?$/;     // máx. 3 dígitos enteros y 2 decimales

    const okCantidad = patron.test(cantidad.value) && aNumero(cantidad.value) > 0;
    const okPrecio = patron.test(precio.value) && aNumero(precio.value) > 0;
    const okDesc = desc.value.trim() !== '' && desc.value.length <= 50;

    cantidad.classList.toggle('is-invalid', !okCantidad);
    precio.classList.toggle('is-invalid', !okPrecio);
    desc.classList.toggle('is-invalid', !okDesc);

    if (!okCantidad) return `Línea ${n}: cantidad incorrecta (máx. 3 dígitos y 2 decimales)`;
    if (!okPrecio) return `Línea ${n}: precio incorrecto (máx. 3 dígitos y 2 decimales)`;
    if (!okDesc) return `Línea ${n}: descripción obligatoria (máx. 50 caracteres)`;
    return '';
}

// Recalcula importes de cada línea y los totales
function recalcular() {
    const base = { 4: 0, 10: 0, 21: 0 };
    const iva = { 4: 0, 10: 0, 21: 0 };

    tbody.querySelectorAll('tr').forEach(tr => {
        const cantidad = tr.querySelector('.cantidad').value;
        const precio = tr.querySelector('.precio').value;
        const patron = /^\d{1,3}([.,]\d{1,2})?$/;

        // Si la línea no es válida, sus importes quedan a 0
        if (!patron.test(cantidad) || !patron.test(precio)) {
            tr.querySelector('.imp-linea').textContent = '0.00';
            tr.querySelector('.imp-iva').textContent = '0.00';
            tr.querySelector('.imp-total').textContent = '0.00';
            return;
        }
        const porcentaje = parseInt(tr.querySelector('.iva').value);
        const importe = redondear(aNumero(cantidad) * aNumero(precio));
        const importeIva = redondear(importe * porcentaje / 100);

        tr.querySelector('.imp-linea').textContent = importe.toFixed(2);
        tr.querySelector('.imp-iva').textContent = importeIva.toFixed(2);
        tr.querySelector('.imp-total').textContent = redondear(importe + importeIva).toFixed(2);

        base[porcentaje] += importe;
        iva[porcentaje] += importeIva;
    });

    let total = 0;
    [4, 10, 21].forEach(p => {
        $('base' + p).textContent = redondear(base[p]).toFixed(2);
        $('iva' + p).textContent = redondear(iva[p]).toFixed(2);
        total += base[p] + iva[p];
    });
    $('totalFactura').textContent = redondear(total).toFixed(2);
}

// El botón "Añadir" solo funciona si la última línea es correcta
function actualizarBoton() {
    const filas = tbody.querySelectorAll('tr');
    let habilitado = true;
    if (filas.length > 0) {
        const ultima = filas[filas.length - 1];
        const patron = /^\d{1,3}([.,]\d{1,2})?$/;
        habilitado = patron.test(ultima.querySelector('.cantidad').value)
                  && patron.test(ultima.querySelector('.precio').value)
                  && ultima.querySelector('.descripcion').value.trim() !== '';
    }
    $('btnAnadir').disabled = !habilitado;
}

// Botón añadir línea
$('btnAnadir').addEventListener('click', () => {
    crearLinea();
    $('errorLinea').textContent = '';
    actualizarBoton();
});

// Modificar una línea (se escucha en el tbody: delegación de eventos)
tbody.addEventListener('input', e => {
    const tr = e.target.closest('tr');
    $('errorLinea').textContent = validarLinea(tr);
    recalcular();
    actualizarBoton();
});
tbody.addEventListener('change', e => {      // cambio del select de IVA
    recalcular();
});

// Borrar una línea
tbody.addEventListener('click', e => {
    const boton = e.target.closest('.borrar');
    if (!boton) return;
    boton.closest('tr').remove();
    numerarLineas();
    $('errorLinea').textContent = '';
    recalcular();
    actualizarBoton();
});

// Empezamos con una línea vacía
crearLinea();
actualizarBoton();

/* =====================================================
   5) GENERAR FACTURA
   ===================================================== */
$('formulario').addEventListener('submit', e => {
    e.preventDefault();
    const errores = [];

    // Datos del cliente + captcha
    Object.keys(reglas).forEach(id => {
        const error = validarCampo(id);
        if (error) errores.push(error);
    });

    // Líneas
    const filas = tbody.querySelectorAll('tr');
    if (filas.length === 0) errores.push('La factura debe tener al menos una línea');
    filas.forEach(tr => {
        const error = validarLinea(tr);
        if (error) errores.push(error);
    });

    const resumen = $('resumenErrores');

    if (errores.length > 0) {
        resumen.innerHTML = '<strong>La factura no se ha generado. Corrige los errores:</strong><ul class="mb-0">'
            + errores.map(er => `<li>${er}</li>`).join('') + '</ul>';
        resumen.classList.remove('d-none');
        resumen.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Todo correcto
    resumen.classList.add('d-none');
    mostrarModal();
    nuevoCaptcha();
});

function mostrarModal() {
    let html = `
        <p><strong>Factura nº:</strong> ${$('numFactura').value} &nbsp; <strong>Fecha:</strong> ${$('fecha').value}</p>
        <p>
            <strong>Cliente:</strong> ${$('nombre').value} (${$('nif').value.toUpperCase()})<br>
            ${$('direccion').value}, ${$('cp').value} ${$('ciudad').value} (${$('provincia').value})<br>
            Tel: ${$('telefono').value || '-'} · ${$('email').value}
        </p>
        <table class="table table-sm table-striped">
            <thead><tr><th>Nº</th><th>Descripción</th><th>Cant.</th><th>Precio</th><th>IVA</th><th class="text-end">Importe</th><th class="text-end">Imp. IVA</th><th class="text-end">Total</th></tr></thead>
            <tbody>`;

    tbody.querySelectorAll('tr').forEach(tr => {
        html += `<tr>
            <td>${tr.querySelector('.num').textContent}</td>
            <td>${tr.querySelector('.descripcion').value}</td>
            <td>${tr.querySelector('.cantidad').value}</td>
            <td>${tr.querySelector('.precio').value}</td>
            <td>${tr.querySelector('.iva').value}%</td>
            <td class="text-end">${tr.querySelector('.imp-linea').textContent}</td>
            <td class="text-end">${tr.querySelector('.imp-iva').textContent}</td>
            <td class="text-end">${tr.querySelector('.imp-total').textContent}</td>
        </tr>`;
    });

    html += `</tbody></table>
        <table class="table table-bordered w-auto ms-auto">
            <tr><th>IVA</th><th>Base imponible</th><th>Total IVA</th></tr>
            <tr><td>4%</td><td class="text-end">${$('base4').textContent}</td><td class="text-end">${$('iva4').textContent}</td></tr>
            <tr><td>10%</td><td class="text-end">${$('base10').textContent}</td><td class="text-end">${$('iva10').textContent}</td></tr>
            <tr><td>21%</td><td class="text-end">${$('base21').textContent}</td><td class="text-end">${$('iva21').textContent}</td></tr>
            <tr class="table-dark"><th colspan="2">TOTAL FACTURA</th><th class="text-end">${$('totalFactura').textContent} €</th></tr>
        </table>`;

    $('contenidoModal').innerHTML = html;
    bootstrap.Modal.getOrCreateInstance('#modalFactura').show();
}
