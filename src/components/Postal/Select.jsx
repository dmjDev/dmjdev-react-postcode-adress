import { useContext, useState, useEffect } from "react"
import { PostalContext } from "../../context/PostalProvider"

export const Select = ({ selectPointer }) => {
    const [selected, setSelected] = useState('')
    const { arraySelect, fetchCascade, updateSelection, selectedValues } = useContext(PostalContext)

    // Obtener el valor seleccionado actual del contexto
    const keys = ['comunidad', 'provincia', 'municipio', 'poblacion', 'nucleo', 'via']
    const currentKey = keys[selectPointer]

    const handleChange = async (e) => {
        const selectedId = e.target.value

        // Obtener el objeto completo si es necesario
        const selectedItem = arraySelect[selectPointer]?.find(
            item => item.id === selectedId
        )

        console.log('Selected ID:', selectedId)
        console.log('Selected Item:', selectedItem)

        // Actualizar el estado local
        setSelected(selectedId)

        // Actualizar el contexto
        updateSelection(selectPointer, selectedId)

        // Disparar fetch en cascada para el siguiente nivel
        await fetchCascade(selectPointer, selectedId, selectedItem)
        console.log("export select")
    }

    // Resetear selección cuando las opciones cambian (por cascada)
    useEffect(() => {
        const currentOptions = arraySelect[selectPointer]

        if (currentOptions?.length === 1 && currentOptions?.length != null) {
            // Si solo hay una opción, seleccionarla automáticamente
            const singleOption = currentOptions[0]
            setSelected(singleOption.id)
            updateSelection(selectPointer, singleOption.id)
            fetchCascade(selectPointer, singleOption.id, singleOption)
        } else if (currentOptions?.length === 0) {
            // Si no hay opciones, limpiar selección
            setSelected('')
            updateSelection(selectPointer, '')
        }

    }, [arraySelect[selectPointer]])

    return (
        <div>
            <select
                id={selectPointer}
                size="1"
                value={selected}
                onChange={handleChange}
                disabled={arraySelect[selectPointer]?.length === 0}
            >
                <option value="">Selecciona una opción</option>
                {arraySelect[selectPointer]?.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.tipo ? `${item.tipo} ${item.name}`
                            : item.nucleo && item.nucleo !== item.name ? `${item.nucleo} ${item.name}`
                                : item.name}
                    </option>
                ))}
            </select>
        </div>
    )
}    
