import { createContext, useState, useEffect, useRef } from "react"

export const PostalContext = createContext()
export const PostalProvider = (props) => {
    const abortControllerRef = useRef(null);
    const emptyData = {
        comunidad: '',
        provincia: '',
        municipio: '',
        poblacion: '',
        nucleo: '',
        via: '',
        nCalle: '',
        piso: '',
        nPuerta: '',
        notas: ''
    }
    const [labelMsg, setLabelMsg] = useState("")
    const [codigoPostal, setCodigoPostal] = useState("")
    const [adressData, setAdressData] = useState([])
    const [arraySelect, setArraySelect] = useState([[], [], [], [], [], []])
    const [selectedValues, setSelectedValues] = useState(emptyData)

    const API_KEY = import.meta.env.VITE_KEY_GEOAPI;
    const BASE_URL = 'https://apiv1.geoapi.es'

    // Fetch inicial con código postal
    const getAdress = async (codigoPostal) => {
        try {
            const params = `CPOS=${codigoPostal}&key=${API_KEY}&format=json&version=2024`

            const [comunidades, provincias, municipios, poblaciones, nucleos, vias] = await Promise.all([
                fetch(`${BASE_URL}/comunidades?${params}`),
                fetch(`${BASE_URL}/provincias?${params}`),
                fetch(`${BASE_URL}/municipios?${params}`),
                fetch(`${BASE_URL}/poblaciones?${params}`),
                fetch(`${BASE_URL}/nucleos?${params}`),
                fetch(`${BASE_URL}/vias?${params}`)
            ])

            const [
                dataComunidades,
                dataProvincias,
                dataMunicipios,
                dataPoblaciones,
                dataNucleos,
                dataVias
            ] = await Promise.all([
                comunidades.json(),
                provincias.json(),
                municipios.json(),
                poblaciones.json(),
                nucleos.json(),
                vias.json()
            ])

            setCodigoPostal(codigoPostal)
            const arrayData = [dataComunidades, dataProvincias, dataMunicipios, dataPoblaciones, dataNucleos, dataVias]
            setAdressData(arrayData)
            setSelectedValues(emptyData)

            if (dataComunidades.data.length == 0) {
                setLabelMsg("Este Código Postal no pertenece a ninguna zona")
            } else {
                setLabelMsg("")
            }

        } catch (error) {
            console.log('Error fetching address data:', error)
        }
    }

    // Fetch en cascada cuando se selecciona un nivel
    const fetchCascade = async (level, selectedId, selectedData) => {
        // Si hay una petición en curso, la cancelamos
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Creamos un nuevo controlador para la nueva petición
        abortControllerRef.current = new AbortController();
        try {
            let nextLevelData = null

            // Determinar qué fetch hacer según el nivel
            switch (level) {
                case 0: // Comunidad seleccionada -> fetch provincias
                    if (selectedId) {
                        const response = await fetch(`${BASE_URL}/provincias?CCOM=${selectedId}&key=${API_KEY}&format=json&version=2024`, { signal: abortControllerRef.current.signal })
                        nextLevelData = await response.json()
                        if (nextLevelData?.data) {
                            const newArray = [...arraySelect]
                            newArray[1] = nextLevelData.data.map(({ CPRO: id, PRO: name }) => ({ id, name }))
                            // Limpiar niveles siguientes
                            newArray[2] = []
                            newArray[3] = []
                            newArray[4] = []
                            newArray[5] = []
                            setArraySelect(newArray)
                        }
                    }
                    break

                case 1: // Provincia seleccionada -> fetch municipios
                    if (selectedId) {
                        const response = await fetch(`${BASE_URL}/municipios?CPOS=${codigoPostal}&CPRO=${selectedId}&key=${API_KEY}&format=json&version=2024`, { signal: abortControllerRef.current.signal })
                        nextLevelData = await response.json()
                        if (nextLevelData?.data) {
                            const newArray = [...arraySelect]
                            newArray[2] = nextLevelData.data.map(({ CMUN: id, DMUN50: name }) => ({ id, name }))
                            // Limpiar niveles siguientes
                            newArray[3] = []
                            newArray[4] = []
                            newArray[5] = []
                            setArraySelect(newArray)
                        }
                    }
                    break

                case 2: // Municipio seleccionado -> fetch poblaciones
                    if (selectedId) {
                        const response = await fetch(`${BASE_URL}/poblaciones?CPOS=${codigoPostal}&CMUN=${selectedId}&key=${API_KEY}&format=json&version=2024`, { signal: abortControllerRef.current.signal })
                        nextLevelData = await response.json()
                        if (nextLevelData?.data) {
                            const newArray = [...arraySelect]
                            newArray[3] = nextLevelData.data.map(({ CPOB: id, NENTSI50: name }) => ({ id, name }))
                            // Limpiar niveles siguientes
                            newArray[4] = []
                            newArray[5] = []
                            setArraySelect(newArray)
                        }
                    }
                    break

                case 3: // Población seleccionada -> fetch núcleos
                    if (selectedId) {
                        const response = await fetch(`${BASE_URL}/nucleos?CPOS=${codigoPostal}&CPOB=${selectedId}&key=${API_KEY}&format=json&version=2024`, { signal: abortControllerRef.current.signal })
                        nextLevelData = await response.json()
                        if (nextLevelData?.data) {
                            const newArray = [...arraySelect]
                            newArray[4] = nextLevelData.data.map(({ CNUC: id, NENTSIC: nucleo, NNUCLE: name }) => ({ id, nucleo, name }))
                            // Limpiar nivel siguiente
                            newArray[5] = []
                            setArraySelect(newArray)
                        }
                    }
                    break

                case 4: // Núcleo seleccionado -> fetch vías  //  https://apiv1.geoapi.es/vias?CPOS=10000&CNUC=01010003710&key=6aae3c560d307405b0b9d65a48841a995bff7752b35253bf65d17e9811da3df6&format=json&version=2024
                    if (selectedId) {
                        const response = await fetch(`${BASE_URL}/vias?CPOS=${codigoPostal}&CNUC=${selectedId}&key=${API_KEY}&format=json&version=2024`, { signal: abortControllerRef.current.signal })
                        nextLevelData = await response.json()
                        if (nextLevelData?.data) {
                            const newArray = [...arraySelect]
                            newArray[5] = nextLevelData.data.map(({ CVIA: id, TVIA: tipo, NVIAC: name }) => ({ id, tipo, name }))
                            setArraySelect(newArray)
                        }
                    }
                    break

                case 5: // Vía seleccionada (último nivel, no hay fetch)
                    break

                default:
                    break
            }
        } catch (error) {
            console.log(`Error in cascade fetch, level ${level}:`, error)
            if (error.name === 'AbortError') return;
            throw error;
        }
    }

    // Actualizar selección de un nivel
    const updateSelection = (level, valueName, tipoVia) => {
        const keys = ['comunidad', 'provincia', 'municipio', 'poblacion', 'nucleo', 'via', 'nCalle', 'piso', 'nPuerta', 'notas']
        setSelectedValues(prev => ({
            ...prev,
            [keys[level]]: tipoVia != '' && tipoVia != undefined ? `${tipoVia} ${valueName}` : valueName
        }))
    }

    // Procesar datos iniciales cuando llega adressData
    useEffect(() => {
        let myData = [[], [], [], [], [], []]
        if (adressData.some(v => typeof v === 'object' && v !== null)) {
            try {
                myData[0] = adressData[0]?.data?.map(({ CCOM: id, COM: name }) => ({ id, name })) || []
                myData[1] = adressData[1]?.data?.map(({ CPRO: id, PRO: name }) => ({ id, name })) || []
                myData[2] = adressData[2]?.data?.map(({ CMUN: id, DMUN50: name }) => ({ id, name })) || []
                myData[3] = adressData[3]?.data?.map(({ CPOB: id, NENTSI50: name }) => ({ id, name })) || []
                myData[4] = adressData[4]?.data?.map(({ CNUC: id, NENTSIC: nucleo, NNUCLE: name }) => ({ id, nucleo, name })) || []
                myData[5] = adressData[5]?.data?.map(({ CVIA: id, TVIA: tipo, NVIAC: name }) => ({ id, tipo, name })) || []

                let five = myData[5]
                const modifiedFive = five.map(via => ({
                    ...via,
                    id: `${via.id}${Math.floor(Math.random() * 99)}`
                }));
                myData[5] = modifiedFive

            } catch (error) {
                console.log(error, "Datos no encontrados")
            }
        }
        setArraySelect(myData)
    }, [adressData])

    return (
        <PostalContext.Provider value={{
            codigoPostal,
            adressData,
            arraySelect,
            selectedValues,
            labelMsg,
            emptyData, 
            setLabelMsg,
            getAdress,
            fetchCascade,
            updateSelection,
            setSelectedValues
        }}>
            {props.children}
        </PostalContext.Provider>
    )
}