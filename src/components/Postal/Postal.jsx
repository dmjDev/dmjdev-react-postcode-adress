import { useContext, useState } from "react"
import { PostalContext } from "../../context/PostalProvider"
import { Select } from "./Select"

export const Postal = () => {
    const [inputValue, setInputValue] = useState("")
    const { getAdress, selectedValues, setSelectedValues, emptyData, updateSelection, labelMsg, setLabelMsg } = useContext(PostalContext)

    const onInputChange = (e) => {
        if (/^[0-9]*$/.test(e.target.value) || e.key === 'Backspace') {
            setInputValue(e.target.value)
        }
    }
    const onInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            return false;
        }
    }
    
    const handleInputChange = (e) => {
        updateSelection(e.target.id, e.target.value, '')
    }

    const onClickCP = async (e) => {
        e.preventDefault()
        const trimData = inputValue.trim()
        if (trimData !== '' && trimData.length === 5) {
            setSelectedValues(emptyData)
            setLabelMsg("Cargando datos ...")
            await getAdress(trimData)
        } else {
            setLabelMsg("Debe introducir un código postal correcto")
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(selectedValues)
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <h4 className="modal-title">Obtener Dirección Postal</h4>
                <input
                    type="text"
                    placeholder="Código Postal"
                    value={inputValue}
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown} 
                    style={{ "width": "150px" }}
                    maxLength="5"
                    required
                />
                <button type="button" onClick={onClickCP}>Acceder a los datos</button>
                <label>{labelMsg}</label>

                <div className="grid-container">
                    <div className="grid-item">Comunidad Autónoma</div>
                    <div className="grid-item"><Select selectPointer={0} /></div>
                    <div className="grid-item">Provincia</div>
                    <div className="grid-item"><Select selectPointer={1} /></div>
                    <div className="grid-item">Municipio</div>
                    <div className="grid-item"><Select selectPointer={2} /></div>
                    <div className="grid-item">Población</div>
                    <div className="grid-item"><Select selectPointer={3} /></div>
                    <div className="grid-item">Núcleo urbano</div>
                    <div className="grid-item"><Select selectPointer={4} /></div>
                    <div className="grid-item">Via</div>
                    <div className="grid-item"><Select selectPointer={5} /></div>
                    <div className="grid-item">Número de calle</div>
                    <div className="grid-item"><input required
                        type="text"
                        id="6"
                        name="nCalle"
                        value={selectedValues.nCalle}
                        onChange={handleInputChange}
                        onKeyDown={onInputKeyDown}
                        style={{ "textAlign": "left" }}
                    ></input></div>
                    <div className="grid-item">Piso</div>
                    <div className="grid-item"><input
                        type="text"
                        id="7"
                        name="piso"
                        value={selectedValues.piso}
                        onChange={handleInputChange}
                        onKeyDown={onInputKeyDown}
                        style={{ "textAlign": "left" }}
                    ></input></div>
                    <div className="grid-item">Número de puerta</div>
                    <div className="grid-item"><input
                        type="text"
                        id="8"
                        name="nPuerta"
                        value={selectedValues.nPuerta}
                        onChange={handleInputChange}
                        onKeyDown={onInputKeyDown}
                        style={{ "textAlign": "left" }}
                    ></input></div>
                    <div className="grid-item">Notas y aclaraciones</div>
                    <div className="grid-item"><textarea
                        id="9"
                        name="notas"
                        value={selectedValues.notas}
                        onChange={handleInputChange}
                        rows="4"
                        cols="50"
                        style={{ "textAlign": "left" }}
                    ></textarea></div>
                </div>
                <button type="submit">Enviar información</button>
            </form>
        </>
    )
}