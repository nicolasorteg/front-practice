function clasificarNumero(num) {
    // par o impar
    if (num % 2 === 0) {
        console.log(`El nº ${num} es par.`);
    } else {
        console.log(`El nº ${num} es impar.`);
    }
    // positivo, negativo o 0
    if (num === 0) {
        console.log(`El nº es 0`);
    } else if (num > 0) {
        console.log(`El ${num} es positivo.`);
    } else {
        console.log(`El ${num} es negativo.`);
    }
}

console.log(`- Nº 7 -`);
clasificarNumero(7);
console.log(`- Nº 52 -`);
clasificarNumero(52);
console.log(`- Nº 0 -`);
clasificarNumero(0);
console.log(`- Nº -3 -`);
clasificarNumero(-3);