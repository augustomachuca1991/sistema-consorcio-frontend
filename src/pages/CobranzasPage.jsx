import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import LayoutsAdminPages from "../layouts/LayoutsAdminPages";
import { ValidateErrorComponent } from "../components/ValidateErrorComponent";
import { getAllCabecera, removeCab, storeCab } from "../api/cabeceraApi";
import { getAllDetalle, removeDet, storeDet } from "../api/detalleApi";
import { getAll,getAllHabitantes, store } from "../api/habitanteApi";
import { getAllInmuebles} from "../api/inmuebleApi";
import { getAllGastos} from "../api/GastoApi";

import ModalComponent from "../components/ModalComponent";

const { VITE_API_URL } = import.meta.env


const CobranzasPage = () => {
    const [selectedInmueble, setSelectedInmueble] = useState(null); // Estado para almacenar el inmueble seleccionado
    //Estados para habitante
    const [searchTerm, setSearchTerm] = useState('');// Estado para termino de busqueda de habitantes
    const [habitantes, setHabitantes] = useState([]);// Estado para almacenar los habitantes
    const [selectedHabitante, setSelectedHabitante] = useState(null);
    const [currentDate, setCurrentDate] = useState('');// Estado para almacenar fecha del sistema
    //Estados para Gastos
    //const [searchGastoTerm, setSearchGastoTerm] = useState(''); // Estado para el término de búsqueda de gastos
    const [searchTermGasto, setSearchTermGasto] = useState(''); // Agrega esta línea para definir el estado de búsqueda de gastos
    const [gastos, setGastos] = useState([]); // Estado para almacenar los gastos
    const [selectedGastos, setSelectedGastos] = useState([]); // Estado para almacenar los gastos seleccionados
    const [total, setTotal] = useState(0); // Estado para almacenar el total de los gastos


    useEffect(() => {
        // Obtener la fecha actual
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
        const year = today.getFullYear();

        // Formatear la fecha como DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`;
        setCurrentDate(formattedDate);
    }, []);

    // Función para manejar la búsqueda en la base de datos
    const searchHabitantes = async (term) => {
        console.log("Buscando habitantes con término:", term); // Registro de depuración
        try {
            const response = await getAllHabitantes(term);  // Asegúrate de que getAll permita filtrar por el término de búsqueda
            setHabitantes(response.habitante);
            console.log("Habitantes encontrados:", response.habitante); // Registro de la respuesta
        } catch (error) {
            console.error("Error buscando habitantes:", error);
        }
    };

    // Llama a la API cada vez que cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm.length > 1) {  // Buscar solo si hay al menos 3 caracteres
            searchHabitantes(searchTerm);
        } else {
            setHabitantes([]);
        }
    }, [searchTerm]);

    // Maneja la selección de un habitante
    const handleSelectHabitante = async(habitante) => {
        setSelectedHabitante(habitante);
        //console.log("Habitante seleccionado:", habitante);
        setSearchTerm('');  // Opcional: Limpiar el campo de búsqueda después de seleccionar

           // Obtener los detalles del inmueble del habitante seleccionado
           try {
            const inmuebleResponse = await getAllInmuebles();
            console.log("Respuesta de la API de inmuebles:", inmuebleResponse);
    
            // Accede al array de inmuebles dentro de la propiedad inmueble
            const inmuebles = inmuebleResponse.inmueble;
    
            const selectedInmueble = inmuebles.find(inmueble => inmueble.id_inmueble === habitante.id_inmueble_id);
            setSelectedInmueble(selectedInmueble);
    
            console.log("Inmueble seleccionado:", selectedInmueble);
        } catch (error) {
            console.error("Error obteniendo inmueble:", error);
        }
    
        setSearchTerm('');  // Opcional: Limpiar el campo de búsqueda 
    };

      // Búsqueda de gastos
      const searchGastos = async (term) => {
        console.log("Buscando gastos con término:", term);
        try {
            const response = await getAllGastos(term); // Llama a la API para obtener gastos
            setGastos(response.gastos);
            console.log("Gastos encontrados:", response.gastos);
        } catch (error) {
            console.error("Error buscando gastos:", error);
        }
    };

    useEffect(() => {
        if (searchTermGasto.length > 1) {
            searchGastos(searchTermGasto);
        } else {
            setGastos([]);
        }
    }, [searchTermGasto]);

    const handleSelectGasto = (gasto) => {
        setSelectedGastos([...selectedGastos, gasto]);
        setTotal(total + parseFloat(gasto.importe)); // Sumar el importe al total
        setSearchTermGasto(''); // Limpiar el campo de búsqueda
    };
   



    return (
        <LayoutsAdminPages>
         
            {/* Fecha actual */}
            <div className="current-date">
               <strong> Fecha:</strong> {currentDate}
            </div>
            <strong>Informe para: </strong>
            <input 
                type="text" 
                placeholder="Buscar por nombre o DNI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {habitantes.length > 0 && (
                <ul>
                    {habitantes.map((habitante) => (
                         
                        <li key={habitante.id_habitante} onClick={() => handleSelectHabitante(habitante)}>
                            {habitante.nombre} - DNi: {habitante.dni}
                        </li>
                    ))}
                </ul>
            )}
            
            {selectedHabitante && (
                <div>
                    <p>Señor/a: {selectedHabitante.nombre}</p>
                    <p>DNI: {selectedHabitante.dni}</p>
                    <p>Inmueble: {selectedHabitante.id_inmueble_id}</p>
                    {selectedInmueble && (
                        <div>
                            <p>Ubicación del inmueble: {selectedInmueble.ubicacion}</p>
                            <p>ID del edificio: {selectedInmueble.id_edificio_id}</p>
                        </div>
                    )}
                </div>
            )}
            {/* Campo de búsqueda para gastos */}
            <strong>Buscar Gasto:</strong>
            <input 
                type="text" 
                placeholder="Buscar por descripción del gasto"
                value={searchTermGasto}
                onChange={(e) => setSearchTermGasto(e.target.value)}
            />
            {gastos.length > 0 && (
                <ul>
                    {gastos.map((gasto) => (
                        <li key={gasto.id_gasto} onClick={() => handleSelectGasto(gasto)}>
                            {gasto.descripcion_gasto} - Monto: ${gasto.importe}
                        </li>
                    ))}
                </ul>
            )}

            
            <div>
                <h3>Gastos Seleccionados:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedGastos.map((gasto, index) => (
                            <tr key={index}>
                                <td>{gasto.descripcion_gasto}</td>
                                <td>${gasto.importe}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <strong>Total: ${total.toFixed(2)}</strong>
            </div>
       
        </LayoutsAdminPages>
    )
}

export default CobranzasPage