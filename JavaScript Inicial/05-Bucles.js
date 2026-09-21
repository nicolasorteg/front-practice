let sum = 0;
for (let i = 1; i <= 100; i++) {
    sum += i;
}
console.log(`Suma de todos los números del 1 - 100: ${sum}`);

console.log(`Números pares del 1 - 20:`)
let i = 1;
while (i <= 20) {
    if (i % 2 === 0) {
        console.log(i)
    }
    i++;
}