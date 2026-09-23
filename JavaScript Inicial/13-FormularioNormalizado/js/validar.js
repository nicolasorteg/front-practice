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
    return validarSoloNumeros(codigo, 5) && codigo < 52006 && codigo > 1000;
}