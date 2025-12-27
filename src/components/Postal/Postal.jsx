import { useContext, useState } from "react"
import { PostalContext } from "../../context/PostalProvider"
import { Select } from "./Select"

export const Postal = () => {
    const [inputValue, setInputValue] = useState("")
    const [labelMsg, setLabelMsg] = useState("")

    const { getAdress } = useContext(PostalContext)

    const onInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const onInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            return false;
        }
    }

    const onClickCP = async (e) => {
        e.preventDefault()
        const trimData = inputValue.trim()
        if (trimData !== '' && trimData.length === 5) {
            setLabelMsg("Cargando datos ...")
            await getAdress(trimData)
            setLabelMsg("")
        } else {
            setLabelMsg("Debe introducir un código postal correcto")
        }
    }

    const onSubmit = () => {
        console.log('submit')
    }

    return (
        <>
            <h2>Dirección</h2>
            <form onSubmit={onSubmit}>
                <label>Introducir código postal</label><br />
                <input
                    type="text"
                    placeholder="código postal"
                    value={inputValue}
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown}
                /><br />
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
                    <div className="grid-item"><input type="text" id="nCalle" name="nCalle" onKeyDown={onInputKeyDown} style={{ "textAlign": "left" }}></input></div>
                    <div className="grid-item">Piso</div>
                    <div className="grid-item"><input type="text" id="piso" name="piso" onKeyDown={onInputKeyDown} style={{ "textAlign": "left" }}></input></div>
                    <div className="grid-item">Número de puerta</div>
                    <div className="grid-item"><input type="text" id="nPuerta" name="nPuerta" onKeyDown={onInputKeyDown} style={{ "textAlign": "left" }}></input></div>
                    <div className="grid-item">Notas y aclaraciones</div>
                    <div className="grid-item"><textarea id="notas" name="notas" rows="4" cols="50" style={{ "textAlign": "left" }}></textarea></div>
                </div>
                <button type="submit">Enviar información</button>
            </form>
        </>
    )
}