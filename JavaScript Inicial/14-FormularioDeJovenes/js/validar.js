// funciones de validacion

function esDigito(caracter) {
    return caracter >= "0" && caracter <= "9";
}

function esLetraMayuscula(caracter) {
    return caracter >= "A" && caracter <= "Z";
}

function esLetraMinusculas(caracter) {
    return caracter >= "a" && caracter <= "z";
}

function esLetraONumero(caracter) {
    return esDigito(caracter) || esLetraMayuscula(caracter) || esLetraMinusculas(caracter);
}

function validarSoloNumeros(texto, longitud) {
    if (texto.length !== longitud) {
        return false;
    }

    for (let i = 0; i < texto.length; i++) {
        if (!esDigito(texto.charAt(i))) {
            return false;
        }
    }

    return true; 
}

function validarLongitud(texto, min, max) {
    return texto.length >= min && texto.length <= max;
}

function validarTelefono(telefono) {
  // debe tener 9 dígitos y empezar por 6, 7, 8 o 9
  if (!validarSoloNumeros(telefono, 9)) {
    return false;
  }

  const primerDigito = telefono.charAt(0);
  return primerDigito === "6" || primerDigito === "7" || primerDigito === "8" || primerDigito === "9";
}

function validarCodigoPostal(codigo) {
    return validarSoloNumeros(codigo, 5) && codigo < 52007 && codigo > 1000;
}

function validarRadioMarcado(nombreGrupo) {
    const opciones = document.getElementsByName(nombreGrupo); // array

    for (let i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            return true;
        }
    }
    return false; // si no hay ninguno marcado
}

function validarDNI(dni) {
    // eliminar espacios y pasar la letra a mayúsculas
    dni = dni.trim().toUpperCase();

    // exacamente 9 caracteres
    if (dni.length !== 9) {
        return false;
    }

    const numeroStr = dni.substring(0, 8);
    const letraDada = dni.charAt(8);

    // validar que los primeros 8 caracteres sean números
    if (!validarSoloNumeros(numeroStr, 8)) {
        return false;
    }

    // secuencia de letras
    const letrasControl = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(numeroStr, 10);
    const letraCalculada = letrasControl.charAt(numero % 23);

    // comprobar si la letra introducida coincide con la calculada
    return letraCalculada === letraDada;
}

function validarRadioMarcado(nombreGrupo) {
    const opciones = document.getElementsByName(nombreGrupo);
    for (let i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            return true;
        }
    }
    return false;
}

function validarFecha(fechaStr) {
    if (!fechaStr) return false;
    const fechaNacimiento = new Date(fechaStr);
    const hoy = new Date();

    return !isNaN(fechaNacimiento.getTime()) && fechaNacimiento <= hoy;
}

function validarImagenDni(inputArchivo) {
    if (!inputArchivo.files || inputArchivo.files.length === 0) {
        return false;
    }
    const archivo = inputArchivo.files[0];
    const nombreArchivo = archivo.name.toLowerCase();
    return nombreArchivo.endsWith(".png") || nombreArchivo.endsWith(".jpg") || nombreArchivo.endsWith(".jpeg");
}

function validarIntereses(select) {
    return select.value !== "selecciona" && select.value !== "";
}

function validarSelect(select) {
    return select.value !== "selecciona" && select.value !== "";
}