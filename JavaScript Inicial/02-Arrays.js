const frutas = ["Pera", "Manzana", "Plátano", "Naranja", "Melón"];
console.log(`Nº de Frutas: ${frutas.length}`);

console.log("Frutas:")
for (const fruta of frutas) {
    console.log(`- ${fruta}`);
}
frutas.push("Sandía");
console.log("Frutas tras añadir Sandía:")
for (const fruta of frutas) {
    console.log(`- ${fruta}`);
}
