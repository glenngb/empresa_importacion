import { Empresa,Importacion  } from "./Clases.js";

function generateId(){
    return Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15)
}

//Creando Empresas
const empresa1 = new Empresa(generateId(), 'Las Cabras', '12.345.678-3');
const importacion1 = new Importacion(generateId(), 'Queso Gauda', 10, 1000);
const importacion2 = new Importacion(generateId(), 'Queso Chanco', 50,2000);
const importacion3 = new Importacion(generateId(), 'Tomates', 100,1000);

empresa1.addImport(importacion1);
empresa1.addImport(importacion2);
empresa1.addImport(importacion3);

//Mostrando resultados
console.log('Total de importaciones: ', empresa1.TotalImports);
console.log('Total de Productos: ', empresa1.TotalProducts);
console.log('Total Precio: ', empresa1.totalPrice);
console.log('Importaciones',empresa1.importacionesInfo);