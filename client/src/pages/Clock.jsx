import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { fetchClockIn, fetchClockOut } from '../services/shiftRecordServices';

const Clock = () => {
    const { authToken } = useContext(AuthContext);
    const [registros, setRegistros] = useState([]);
    const [mapaActual, setMapaActual] = useState(null);
    const { shiftRecordId } = useParams();

    const obtenerUbicacion = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) =>
                        resolve({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }),
                    (error) => reject(error)
                );
            } else {
                reject(toast.error('Geolocalización no soportada'));
            }
        });
    };

    const registrarEntrada = async () => {
        try {
            const ubicacion = await obtenerUbicacion();

            const ahora = new Date();
            setRegistros([
                ...registros,
                {
                    entrada: { tiempo: ahora, ubicacion: ubicacion },
                    salida: null,
                    total: null,
                },
            ]);

            const data = await fetchClockIn(
                authToken,
                ubicacion,
                ahora,
                shiftRecordId
            );

            toast.success(data.message);
        } catch (error) {
            toast.error('No se pudo obtener la ubicación: ' + error.message);
        }
    };

    const registrarSalida = async () => {
        if (registros.length === 0 || registros[registros.length - 1].salida) {
            toast.error('Primero debes registrar una entrada.');
            return;
        }

        try {
            const ubicacion = await obtenerUbicacion();
            const ahora = new Date();
            const nuevosRegistros = [...registros];
            const ultimoRegistro = nuevosRegistros[nuevosRegistros.length - 1];
            ultimoRegistro.salida = { tiempo: ahora, ubicacion: ubicacion };
            ultimoRegistro.total = calcularTiempoTotal(
                ultimoRegistro.entrada.tiempo,
                ahora
            );

            setRegistros(nuevosRegistros);

            const data = await fetchClockOut(authToken, ahora, shiftRecordId);

            toast.success(data.message);
        } catch (error) {
            toast.error('No se pudo obtener la ubicación: ' + error.message);
        }
    };

    const calcularTiempoTotal = (entrada, salida) => {
        const diff = salida - entrada;
        const horas = Math.floor(diff / 3600000);
        const minutos = Math.floor((diff % 3600000) / 60000);
        return `${horas}h ${minutos}m`;
    };

    const formatearHora = (fecha) => {
        return fecha.toLocaleTimeString();
    };

    const mostrarMapa = (ubicacion) => {
        setMapaActual(ubicacion);
    };

    const mapContainerStyle = {
        width: '80%',
        height: '250px',
        margin: '15px auto',
    };

    return (
        <div>
            <h2>Registro de Fichaje</h2>
            <button onClick={registrarEntrada}>Registrar Entrada</button>
            <button onClick={registrarSalida}>Registrar Salida</button>

            <h3>Registros:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Tiempo Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((registro, index) => (
                        <tr key={index}>
                            <td>
                                {formatearHora(registro.entrada.tiempo)}
                                <button
                                    onClick={() =>
                                        mostrarMapa({
                                            entrada: registro.entrada.ubicacion,
                                        })
                                    }
                                >
                                    Ver mapa
                                </button>
                            </td>
                            <td>
                                {registro.salida ? (
                                    <>
                                        {formatearHora(registro.salida.tiempo)}
                                        <button
                                            onClick={() =>
                                                mostrarMapa({
                                                    salida: registro.salida
                                                        .ubicacion,
                                                })
                                            }
                                        >
                                            Ver mapa
                                        </button>
                                    </>
                                ) : (
                                    '-'
                                )}
                            </td>
                            <td>{registro.total || '-'}</td>
                            <td>
                                {registro.salida && (
                                    <button
                                        onClick={() =>
                                            mostrarMapa({
                                                entrada:
                                                    registro.entrada.ubicacion,
                                                salida: registro.salida
                                                    .ubicacion,
                                            })
                                        }
                                    >
                                        Ver ruta
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mapaActual && (
                <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                >
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapaActual.entrada || mapaActual}
                        zoom={15}
                    >
                        {mapaActual.entrada && (
                            <Marker position={mapaActual.entrada} />
                        )}
                        {mapaActual.salida && (
                            <Marker position={mapaActual.salida} />
                        )}
                    </GoogleMap>
                </LoadScript>
            )}
        </div>
    );
};

export default Clock;
