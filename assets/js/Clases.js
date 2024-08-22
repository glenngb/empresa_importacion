export class Empresa {
    constructor(id,name,rut) {
        this._id = id;
        this._name = name;
        this._rut = rut;
        this._importaciones = [];
    }

    //Getters
    get id() { return this._id; };
    get name() { return this._name};
    get rut() { return this._rut};
    get imports() {return this._importaciones}

    //Setters
    set id(newId) {
        this._id = newId;
    }
    set name(newName){
        this._name = newName;
    }
    set rut(newRut) {
        this._rut = newRut;
    }

    addImport(importacion) {
        this._importaciones.push(importacion);
    }
    removeImport(id) {
        this._importaciones = this._importaciones.filter(importacion => importacion.id !== id);
    };

    get TotalImports(){
        return this._importaciones.length;
    };

    get TotalProducts(){
        return this._importaciones.reduce((total, importacion) => total + importacion.quantity, 0)
    };

    get totalPrice(){
        return this._importaciones.reduce((total,importacion) => total + importacion.total,0);
    }
    get importacionesInfo() {
        return {
            id: this.id,
            nombre: this.name,
            rut: this.rut,
            totalImportaciones: this.TotalImports,
            totalProductos: this.TotalProducts,
            totalPrecio: this.totalPrice,
            rubro: this.rubro,
            tamanio: this.size,
            importaciones: this.imports.map(importacion =>({
                id: importacion.id,
                producto: importacion.product,
                cantidad: importacion.quantity,
                precioUnitario: importacion.unitPrice,
                total: importacion.total
            }))
        }
    }  
};

export class Importacion {
    constructor(id,product,quantity,unitPrice){
        this._id = id;
        this._product = product;
        this._quantity = quantity;
        this._unitPrice = unitPrice;
    }

    //Getters
    get id() {return this._id};
    get product() {return this._product};
    get quantity() {return this._quantity};
    get unitPrice() {return this._unitPrice};

    //Setters

    set id(newId){
        this._id = newId;
    }
    set product(newProduct){
        this._product = newProduct;
    }
    set quantity(newQuantity){
        this._quantity = newQuantity
    };
    set unitPrice(newUnitPrice){
        this._unitPrice = newUnitPrice;
    }

    get total() {
        return this._quantity * this._unitPrice
    }
}

//Agregando sub-clase para requisito del trabajo 3
export class Importador extends Empresa {
    constructor(id,name,rut,rubro,size){
        super(id,name,rut);
        this._rubro =rubro;
        this._size = size;
    };

    //Getters
    get rubro() {return this._rubro};
    get size() {return this._size};

    //Setters
    set rubro(newRubro){
        this._rubro = newRubro;
    };
    set size(newSize){
        this._size = newSize;
    }
}