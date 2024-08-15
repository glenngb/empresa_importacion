$(document).ready(function() {
    let table = $('#resultadosTable').DataTable();
    let empresas = [];
    let contadorEmpresaId = 1;
    let contadorImportacionId = 1;
    let empresaEditando = null;
    let importacionEditando = null;

    class Empresa {
        constructor(id, nombre, rut) {
            this.id = id;
            this.nombre = nombre;
            this.rut = rut;
            this.importaciones = [];
        }

        agregarImportacion(importacion) {
            this.importaciones.push(importacion);
        }

        sumaTotalImportaciones() {
            return this.importaciones.reduce((total, imp) => total + (imp.precioUnitario * imp.numeroProductos), 0);
        }

        sumaTotalProductos() {
            return this.importaciones.reduce((total, imp) => total + imp.numeroProductos, 0);
        }

        getNombre() {
            return this.nombre;
        }
        setNombre(nombre) {
            this.nombre = nombre;
        }
        getRut() {
            return this.rut;
        }
        setRut(rut) {
            this.rut = rut;
        }
    }

    class Importacion {
        constructor(id, producto, numeroProductos, precioUnitario) {
            this.id = id;
            this.producto = producto;
            this.numeroProductos = numeroProductos;
            this.precioUnitario = precioUnitario;
        }

        getProducto() {
            return this.producto;
        }
        setProducto(producto) {
            this.producto = producto;
        }
        getNumeroProductos() {
            return this.numeroProductos;
        }
        setNumeroProductos(numeroProductos) {
            this.numeroProductos = numeroProductos;
        }
        getPrecioUnitario() {
            return this.precioUnitario;
        }
        setPrecioUnitario(precioUnitario) {
            this.precioUnitario = precioUnitario;
        }
    }

    function rutExiste(rut) {
        return empresas.some(empresa => empresa.getRut() === rut);
    }

    $('#itemTipo').change(function() {
        const tipo = $(this).val();
        if (tipo === 'empresa') {
            $('#empresaFields').removeClass('d-none');
            $('#importacionFields').addClass('d-none');
            $('#empresaSelect').addClass('d-none');
        } else if (tipo === 'importacion') {
            $('#empresaFields').addClass('d-none');
            $('#importacionFields').removeClass('d-none');
            $('#empresaSelect').removeClass('d-none');
            $('#empresaSelect').empty();  // Limpiar el select de empresas
            empresas.forEach(emp => {
                $('#empresaSelect').append(`<option value="${emp.id}">${emp.nombre}</option>`);
            });
        }
    });

    $('#formulario').on('submit', function(e) {
        e.preventDefault();



        const tipo = $('#itemTipo').val();
        if (tipo === 'empresa') {
            const nombre = $('#empresaNombre').val();
            const rut = $('#empresaRut').val();
        
        //validar si rut existe
        if (empresaEditando === null && rutExiste(rut)){
            alert('El RUT ingresado ya existe. Por favore, ingrese un RUT diferente. ');
            return; // asi no se agrega nada 
        }


            if (nombre && rut) {
                if (empresaEditando) {
                    empresaEditando.setNombre(nombre);
                    empresaEditando.setRut(rut);
                    empresaEditando = null;
                } else {
                    const nuevaEmpresa = new Empresa(contadorEmpresaId++, nombre, rut);
                    empresas.push(nuevaEmpresa);
                }
                $('#empresaNombre').val('');
                $('#empresaRut').val('');
            } else {
                alert('Por favor, complete todos los campos de la empresa.');
                return;
            }
        } else if (tipo === 'importacion') {
            const producto = $('#importacionProducto').val();
            const cantidad = parseInt($('#importacionCantidad').val(), 10);
            const precio = parseFloat($('#importacionPrecio').val());
            const empresaId = $('#empresaSelect').val();
            const id = $('#itemId').val();

            if (!producto || isNaN(cantidad) || isNaN(precio)) {
                alert('Por favor, complete todos los campos de la importación.');
                return;
            }

            const empresa = empresas.find(emp => emp.id == empresaId);
            if (empresa) {
                if (id) {
                    const importacion = empresa.importaciones.find(imp => imp.id == id);
                    if (importacion) {
                        importacion.setProducto(producto);
                        importacion.setNumeroProductos(cantidad);
                        importacion.setPrecioUnitario(precio);
                    }
                } else {
                    const nuevaImportacion = new Importacion(contadorImportacionId++, producto, cantidad, precio);
                    empresa.agregarImportacion(nuevaImportacion);
                }
                $('#importacionProducto').val('');
                $('#importacionCantidad').val('');
                $('#importacionPrecio').val('');
                $('#empresaSelect').val('');
                $('#itemId').val('');
            } else {
                alert('Por favor, seleccione una empresa para la importación.');
                return;
            }
        }
        actualizarTabla();
    });

    function actualizarTabla() {
        table.clear().draw();

        empresas.forEach(empresa => {
            table.row.add([
                empresa.id,
                empresa.getNombre(),
                empresa.getRut(),
                empresa.sumaTotalImportaciones(),
                empresa.sumaTotalProductos(),
                `<a href="#" class="edit-empresa" data-id="${empresa.id}"><i class="fas fa-edit"></i></a>
                 <a href="#" class="delete-empresa" data-id="${empresa.id}"><i class="fas fa-trash"></i></a>`
            ]).draw();

            empresa.importaciones.forEach(importacion => {
                table.row.add([
                    importacion.id,
                    importacion.producto,
                    '',
                    '',
                    importacion.numeroProductos,
                    `<a href="#" class="edit-importacion" data-id="${importacion.id}"><i class="fas fa-edit"></i></a>
                     <a href="#" class="delete-importacion" data-id="${importacion.id}"><i class="fas fa-trash"></i></a>`
                ]).draw();
            });
        });
    }

    $('#resultadosTable').on('click', '.edit-empresa', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        empresaEditando = empresas.find(emp => emp.id == id);
        if (empresaEditando) {
            $('#itemTipo').val('empresa').change();
            $('#empresaNombre').val(empresaEditando.getNombre());
            $('#empresaRut').val(empresaEditando.getRut());
            $('#itemId').val(empresaEditando.id);
        }
    });

    $('#resultadosTable').on('click', '.delete-empresa', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
            empresas = empresas.filter(emp => emp.id !== id);
            actualizarTabla();
        }
    });

    $('#resultadosTable').on('click', '.edit-importacion', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const empresa = empresas.find(emp => emp.importaciones.some(imp => imp.id == id));
        if (empresa) {
            importacionEditando = empresa.importaciones.find(imp => imp.id == id);
            if (importacionEditando) {
                $('#itemTipo').val('importacion').change();
                $('#importacionProducto').val(importacionEditando.getProducto());
                $('#importacionCantidad').val(importacionEditando.getNumeroProductos());
                $('#importacionPrecio').val(importacionEditando.getPrecioUnitario());
                $('#empresaSelect').val(empresa.id);
                $('#itemId').val(importacionEditando.id);
            }
        }
    });

    $('#resultadosTable').on('click', '.delete-importacion', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const empresa = empresas.find(emp => emp.importaciones.some(imp => imp.id == id));
        if (empresa) {
            empresa.importaciones = empresa.importaciones.filter(imp => imp.id !== id);
            actualizarTabla();
        }
    });
});

