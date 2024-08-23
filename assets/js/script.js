import { Empresa,Importacion,Importador } from "./Clases.js";
import { currentFormatter } from "./currentFormat.js";

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

//Parte 2 de trabajo manejo de formularios

document.addEventListener('DOMContentLoaded',()=>{
    const itemTipo = document.getElementById('itemTipo');
    const empresaFields = document.getElementById('empresaFields');
    const importacionFields = document.getElementById('importacionFields');
    const formulario = document.getElementById('formulario');
    const empresaSelect = document.getElementById('empresaSelect');
    const empresaTableBody = document.getElementById('empresaTableBody');

    let empresas = [];


    //Detectando los cambios de tipo en select
    itemTipo.addEventListener('change', () =>{
        const selectdType = itemTipo.value;

        //Mostrar u ocultar campos basados en la selección
        if(selectdType === 'empresa'){
            empresaFields.classList.remove('d-none');
            importacionFields.classList.add('d-none');
        } else if(selectdType === 'importacion'){
            empresaFields.classList.add('d-none');
            importacionFields.classList.remove('d-none');
        }else{
            empresaFields.classList.add('d-none');
            importacionFields.classList.add('d-none');
        }
    });

    //Manejo del formulario
    formulario.addEventListener('submit', (event) =>{
        event.preventDefault();

        const selectdType = itemTipo.value;

        if(selectdType === 'empresa'){
            //Obtener los valores del campo empresa
            const id = generateId();
            const nombre = document.getElementById('empresaNombre').value;
            const rut = document.getElementById('empresaRut').value;
            const rubro = document.getElementById('empresaRubro').value;
            const tamanio = document.getElementById('empresaSize').value;

            //Validar los inputs
            if(!validateEmpresaInputs(nombre, rut, rubro, tamanio)) return;
            //Crear una nueva instancia de empresa
           // const nuevaEmpresa = new Empresa(generateId(), nombre, rut)
           const nuevaEmpresa = new Importador(id, nombre, rut, rubro, tamanio);
           empresas.push(nuevaEmpresa);

            console.log("Empresa agregada:", nuevaEmpresa);
            console.log('lista de empresas:', empresas);

            //Actualizar el select de empresas
            actualizarEmpresaSelect();

            //Actualizar la tabla
            actualizarTablaEmpresas()


            //Limpiar el formulario
            formulario.reset();
            empresaFields.classList.add('d-none');
            Swal.fire({
                title: `Empresa ${nuevaEmpresa.name} agregada con exito`,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true
            })
        }else if (selectdType === 'importacion'){
            //Obtenemos los valores de los campos de importación
            const producto = document.getElementById('importacionProducto').value;
            const cantidad = parseInt(document.getElementById('importacionCantidad').value);
            const precio = parseFloat(document.getElementById('importacionPrecio').value);
            const empresaId = empresaSelect.value;

            //Buscamos la empresa seleccionada
            const empresaSeleccionada = empresas.find(empresa => empresa.id === empresaId);

            if(empresaSeleccionada) {
                //Creamos una nueva instancia de importación
                const nuevaImportacion = new Importacion(generateId(),producto,cantidad,precio);

                //añadimos la importación a la empresa
                empresaSeleccionada.addImport(nuevaImportacion);

                console.log("Importación agregada:",nuevaImportacion);
                console.log('Importacioones de la empresa:', empresaSeleccionada.imports);

                //Actualizar la tabla
                actualizarTablaEmpresas()

                //Limpiamos los campos del formulario y damos info al usuario de que agrego una importación
                formulario.reset();
                importacionFields.classList.add('d-none');
                Swal.fire({
                    title: `Importación ${nuevaImportacion.product} agregada con exito`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true
                })
            } else{
                Swal.fire({
                    title:'Error: Empresa no seleccionada o no encontrada.',
                    icon: 'error',
                })
            }
        }
    });


    //Función para actualizar el select de empresas
    function actualizarEmpresaSelect(){
        empresaSelect.innerHTML = `<option value="" disabled selected>Seleccione una empresa</option>`;
        empresas.forEach(empresa =>{
            const option = document.createElement('option');
            option.value = empresa.id;
            option.textContent = `${empresa.name} (${empresa.rut})`;
            empresaSelect.appendChild(option);
        });

        //console.log("Select de empresas actualizado:", empresaSelect.innerHTML);
    };

    //Función para actualizar la tabla de empresas.
    function actualizarTablaEmpresas(){
        empresaTableBody.innerHTML = ''; //Limpiamos la tabla

        empresas.forEach(empresa =>{
            const fila = document.createElement('tr');

            //Dar formato de moneda
            const currency = 'CLP';
            const locale = 'es-CL';

            fila.innerHTML = `
                <td>${empresa.id}</td>
                <td>${empresa.name}</td>
                <td>${empresa.rut}</td>
                <td>${empresa.TotalImports}</td>
                <td>${empresa.TotalProducts}</td>
                <td>${currentFormatter(empresa.totalPrice,currency,locale)}</td>
                <td>${empresa.rubro}</td>
                <td>${empresa.size}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-empresa" data-id="${empresa.id}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-empresa" data-id="${empresa.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            empresaTableBody.appendChild(fila);
        });

        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.edit-empresa').forEach(btn => {
            btn.addEventListener('click', editarEmpresa);
        });

        document.querySelectorAll('.delete-empresa').forEach(btn => {
            btn.addEventListener('click', eliminarEmpresa);
        });

        

        console.log("Tabla de empresas actualizada.");
    };


    // función para editar 
    function editarEmpresa(event) {

        const empresaId = event.target.getAttribute('data-id');
        const empresa = empresas.find(empresa => empresa.id === empresaId);

        if (empresa) {
            Swal.fire({
                title: 'Editar Empresa',
                html: `
                    <div class="form-group">
                        <label for="editEmpresaNombre">Nombre de la Empresa</label>
                        <input type="text" id="editEmpresaNombre" class="form-control" value="${empresa.name}">
                    </div>
                    <div class="form-group mt-2">
                        <label for="editEmpresaRut">RUT de la Empresa</label>
                        <input type="text" id="editEmpresaRut" class="form-control" value="${empresa.rut}">
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Guardar cambios',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const newName = document.getElementById('editEmpresaNombre').value;
                    const newRut = document.getElementById('editEmpresaRut').value;
    
                    if (!newName || !newRut) {
                        Swal.showValidationMessage('Por favor, complete todos los campos.');
                    }
    
                    return { newName, newRut };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { newName, newRut } = result.value;
                    empresa.name = newName;
                    empresa.rut = newRut;
    
                    actualizarTablaEmpresas();
    
                    Swal.fire(
                        'Actualizado!',
                        'Los detalles de la empresa han sido actualizados.',
                        'success'
                    );
                }
            });
        }

    };

    // función para eliminar una empresa
    function eliminarEmpresa(event) {
        const empresaId = event.target.getAttribute('data-id');
        const empresa = empresas.find(emp => emp.id === empresaId);
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Quieres eliminar la empresa ${empresa.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                empresas = empresas.filter(empresa => empresa.id !== empresaId);

                //Actualizando la tabla
                actualizarTablaEmpresas();

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'La empresa ha sido eliminada.',
                    showConfirmButton: false,
                    timer: 1500
                });

                console.log("Empresa eliminada:", empresaId);
            }
        });
    };

    function validateEmpresaInputs(name, rut, rubro, tamanio) {
        if (!name.trim() || !rut.trim() || !rubro.trim() || !tamanio.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'Por favor, complete todos los campos antes de continuar.',
            });
            return false;
        }
        return true;
    }

    
})