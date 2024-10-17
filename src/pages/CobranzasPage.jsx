import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthProvider";
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import LayoutsAdminPages from "../layouts/LayoutsAdminPages";
import { ValidateErrorComponent } from "../components/ValidateErrorComponent";
import { getAllCabecera, removeCab, storeCab } from "../api/cabeceraApi";
import { getAllDetalle, removeDet, storeDet } from "../api/detalleApi";
import { getAll, getAllHabitantes, store } from "../api/habitanteApi";
import { getAllInmuebles } from "../api/inmuebleApi";
import { getAllGastos } from "../api/GastoApi";


const data = [

    {
        id: 1,
        nombre: 'Juan Perez',
        dni: 32233325,
        inmueble: {
            edificio: {
                id: 1,
                nombre: 'Edificios Murano',
                direccion: 'Santa Fe 2020',
                telefono: '3794-327082'
            },
            porcentaje: '10',
            ubicacion: 'Primer piso departamento 3A'
        }
    },
    {
        id: 2,
        nombre: 'Ana Gomez',
        dni: 40124567,
        inmueble: {
            edificio: {
                id: 2,
                nombre: 'Torre Central',
                direccion: 'Alem 345',
                telefono: '3794-123456'
            },
            porcentaje: '15',
            ubicacion: 'Segundo piso departamento 2B'
        }
    },
    {
        id: 3,
        nombre: 'Carlos Fernandez',
        dni: 27456389,
        inmueble: {
            edificio: {
                id: 3,
                nombre: 'Residencias Vista',
                direccion: 'Mitre 789',
                telefono: '3794-654321'
            },
            porcentaje: '20',
            ubicacion: 'Tercer piso departamento 5C'
        }
    },
    {
        id: 4,
        nombre: 'Lucia Martinez',
        dni: 35874623,
        inmueble: {
            edificio: {
                id: 4,
                nombre: 'Condominio Las Palmas',
                direccion: 'Belgrano 1250',
                telefono: '3794-789012'
            },
            porcentaje: '25',
            ubicacion: 'Cuarto piso departamento 4D'
        }
    },
    {
        id: 5,
        nombre: 'Mario Lopez',
        dni: 38659412,
        inmueble: {
            edificio: {
                id: 5,
                nombre: 'Torres del Sol',
                direccion: 'Rivadavia 658',
                telefono: '3794-876543'
            },
            porcentaje: '30',
            ubicacion: 'Quinto piso departamento 6E'
        }
    }
]


const CobranzasPage = () => {
    const { t } = useTranslation();
    const [selectedInmueble, setSelectedInmueble] = useState(null); // Estado para almacenar el inmueble seleccionado
    const [term, setTerm] = useState('');
    //Estados para habitante
    const [searchTerm, setSearchTerm] = useState('');// Estado para termino de busqueda de habitantes
    const [filteredData, setFilteredData] = useState(data);

    const [habitantes, setHabitantes] = useState([]);// Estado para almacenar los habitantes
    const [selectedHabitante, setSelectedHabitante] = useState(null);
    const [currentDate, setCurrentDate] = useState('');// Estado para almacenar fecha del sistema
    //Estados para Gastos
    //const [searchGastoTerm, setSearchGastoTerm] = useState(''); // Estado para el término de búsqueda de gastos
    const [searchTermGasto, setSearchTermGasto] = useState(''); // Agrega esta línea para definir el estado de búsqueda de gastos
    const [gastos, setGastos] = useState([]); // Estado para almacenar los gastos
    const [selectedGastos, setSelectedGastos] = useState([]); // Estado para almacenar los gastos seleccionados
    const [total, setTotal] = useState(0); // Estado para almacenar el total de los gastos

    const [cobranza, setCobranza] = useState({
        nombre: '',
        dni: '',
        porcentaje: '',
        ubicacion: '',
        direccion: '',
        telefono: ''
    })


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
    const handleSelectHabitante1 = async (habitante) => {
        setSelectedHabitante(habitante);
        //console.log("Habitante seleccionado:", habitante);
        setSearchTerm('');  // Opcional: Limpiar el campo de búsqueda después de seleccionar

        // Obtener los detalles del inmueble del habitante seleccionado
        try {
            const inm = await getInmueble(habitante.id);
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
            console.log(response.gastos)
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


    useEffect(() => {
        if (term.trim() !== '') {  // Evitar buscar si el término está vacío
            const timeoutId = setTimeout(() => {
                searchGastos(term);  // Llamada a la búsqueda con un pequeño retraso
            }, 500); // Espera 500ms antes de hacer la búsqueda para evitar demasiadas peticiones

            return () => clearTimeout(timeoutId); // Limpia el timeout si el usuario sigue escribiendo
        }
    }, [term]);


    const handleSelectGasto = (gasto) => {
        setSelectedGastos([...selectedGastos, gasto]);
        setTotal(total + parseFloat(gasto.importe)); // Sumar el importe al total
        setSearchTermGasto(''); // Limpiar el campo de búsqueda
    };


    const handleSearch = (event) => {
        const { value } = event.target;
        setSearchTerm(value); // Actualizamos el valor de búsqueda
        filterData(value); // Llamamos a la función para filtrar
    };

    const handleReset = (event) => {
        event.preventDefault();
        setSearchTerm(""); // Actualizamos el valor de búsqueda
        setFilteredData(data);
    };

    const filterData = (value) => {
        const lowerCaseValue = value.toLowerCase(); // Convertimos todo a minúsculas para facilitar la búsqueda

        if (lowerCaseValue === "") {
            setFilteredData(data);
            return;
        }

        const filtered = data.filter((cobranza) =>
            cobranza.nombre.toLowerCase().includes(lowerCaseValue) ||
            cobranza.dni.toString().includes(lowerCaseValue) ||
            cobranza.inmueble.edificio.nombre.toLowerCase().includes(lowerCaseValue) ||
            cobranza.inmueble.edificio.direccion.toLowerCase().includes(lowerCaseValue)
        );
        setFilteredData(filtered); // Actualizamos los datos filtrados
    };

    const handleSelectedHabitante = (event, cobranza) => {
        event.preventDefault()
        const { id, nombre, dni, inmueble } = cobranza
        const { edificio, porcentaje, ubicacion } = inmueble
        const { direccion, telefono } = edificio
        const data = {
            nombre,
            dni,
            porcentaje,
            ubicacion,
            direccion,
            telefono
        }
        setCobranza(data)
    }




    return (
        <LayoutsAdminPages>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="flex flex-col">
                            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                        <div className="flex bg-white px-4 py-3 sm:px-6">
                                            <input
                                                className="form-input rounded-md shadow-sm mt-1 block w-full text-gray-500 py-3 px-2"
                                                type="text"
                                                name="search"
                                                placeholder="Buscar..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                            />
                                            <div className="form-input rounded-md shadow-sm mt-1 ml-6 block py-3 px-2">
                                                <select className="bg-white outline-none text-gray-500 text-sm">
                                                    <option value="5"> 5 por página</option>
                                                    <option value="10"> 10 por página</option>
                                                    <option value="15"> 15 por página</option>
                                                    <option value="25"> 25 por página</option>
                                                    <option value="50"> 50 por página</option>
                                                    <option value="100"> 100 por página</option>
                                                </select>
                                            </div>
                                            <button onClick={handleReset} className="form-input rounded-md shadow-sm mt-1 ml-6 block hover:bg-gray-100 p-3">
                                                <svg className="flex-shrink-0 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </button>
                                        </div>

                                        {selectedGastos ? (
                                            <>
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Nombre
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Domicilio
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Porcentaje %
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Telefono
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Ubicación
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Estado
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {filteredData.length ? (
                                                            filteredData.map((cobranza) => (
                                                                <tr key={cobranza.id} className="hover:bg-gray-50 hover:cursor-pointer" onClick={(event) => { handleSelectedHabitante(event, cobranza) }}>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="flex-shrink-0">
                                                                                <img className="h-10 w-10 rounded-full object-cover" src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${cobranza.nombre.replaceAll(" ", "+")}`} alt="avatar" />
                                                                            </div>
                                                                            <div className="ml-4">
                                                                                <div className="text-sm font-medium text-gray-900">
                                                                                    {cobranza.nombre}
                                                                                </div>
                                                                                <div className="text-sm text-gray-500">
                                                                                    {cobranza.dni}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="text-sm text-gray-900">{cobranza.inmueble.edificio.nombre}</div>
                                                                        <div className="text-sm text-gray-500">{cobranza.inmueble.edificio.direccion}</div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                                        {cobranza.inmueble.porcentaje} %
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {cobranza.inmueble.edificio.telefono}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                        {cobranza.inmueble.ubicacion}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                            Activo
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <p className="text-base font-semibold leading-5 tracking-normal text-gray-600 p-5">No hay resultados con la busqueda <span className="text-dark font-bold italic">{searchTerm}</span></p>
                                                        )}
                                                    </tbody>
                                                </table>
                                                {/* <div className="bg-white px-4 py-3 border-gray-200 sm:px-6">
                                                    {{ $pacientes-> links()}}
                                                </div> */}
                                            </>
                                        ) : (
                                            <div className="bg-white px-4 py-3 border-gray-200  text-gray-500 sm:px-6">
                                                No hay resultado para la búsqueda tal en la página 1 al mostrar 8 por página
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {cobranza.dni !== '' && (
                        <>

                            <section className="py-6 bg-gray-100 text-gray-900">
                                <div className="container mx-auto flex flex-col justify-center p-4 space-y-8 md:p-10 lg:space-y-0 lg:space-x-12 lg:justify-between lg:flex-col">
                                    <div className="flex flex-col space-y-4 text-center lg:text-left">
                                        <h4 className="text-4xl font-bold leading-none">Información</h4>
                                        <div >
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <div className="border rounded-lg p-4 shadow-md bg-white">
                                                    <ul>
                                                        <li className="text-gray-700 italic"><span className="font-semibold leading-5 uppercase">Señor/a:</span> {cobranza.nombre}</li>
                                                        <li className="text-gray-700 italic"><span className="font-semibold leading-5 uppercase">DNI:</span> {cobranza.dni}</li>
                                                        <li className="text-gray-700 italic"><span className="font-semibold leading-5 uppercase">Porcentaje:</span> {cobranza.porcentaje}</li>
                                                        <li className="text-gray-700 italic"><span className="font-semibold leading-5 uppercase">Ubicación:</span> {cobranza.ubicacion}</li>
                                                        <li className="text-gray-700 italic"><span className="font-semibold leading-5 uppercase">Dirección:</span> {cobranza.direccion}</li>
                                                        <li className="text-gray-700 italic"><span className="font-semibold leading-5 uppercase">Telefono:</span> {cobranza.telefono}</li>

                                                    </ul>
                                                </div>
                                            </div>


                                            <div>
                                                <div className="flex flex-col">
                                                    <fieldset className="w-full space-y-1 text-gray-800">
                                                        <label htmlFor="gastos" className="block text-sm font-medium">Buscar Gastos</label>
                                                        <div className="flex">
                                                            <input type="text" name="gastos" id="gastos" placeholder="Buscar por descripcion" value={term}
                                                                onChange={(e) => setTerm(e.target.value)} className="flex flex-1 p-3 text-right border sm:text-sm rounded-l-md focus:ring-inset border-gray-300 text-gray-800 bg-gray-100 focus:ring-cyan-600" />
                                                            <span className="flex items-center px-3 pointer-events-none sm:text-sm rounded-r-md bg-gray-300">$</span>
                                                        </div>
                                                    </fieldset>

                                                    <div>
                                                        {!!gastos.length && (
                                                            <ul>
                                                                {gastos.map((gasto) => (
                                                                    <li key={gasto.id_gasto}>
                                                                        <p>
                                                                            <input type="checkbox" />{gasto.descripcion_gasto} - Monto: $ {gasto.importe}
                                                                        </p>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>

        </LayoutsAdminPages >
    )
}

export default CobranzasPage