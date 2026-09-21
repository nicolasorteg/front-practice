function calcularAreaRectangulo(base, altura) {
    return base * altura;
}

function calcularPerimetroRectangulo(base, altura) {
    return base * 2 + altura * 2;
}

console.log(`- Área Rectangulo: ${calcularAreaRectangulo(5, 3)} m2`);
console.log(`- Perímetro Rectangulo: ${calcularPerimetroRectangulo(5, 3)} m`);