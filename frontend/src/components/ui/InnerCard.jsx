import { useState } from "react"
import { moveCargo, deleteCargo } from "../../requests";
import Close from "../../images/icon-close.png"
import Change from "../../images/icon-change.png"

export default function InnerCard({data, dataAll, setDataAll, tripData, sumCargos}) {
    const {cargo_id, cargo_name, size, cargo_type} = data;
    const {trip_id, destination_id} = tripData;
    const [shown, setShown] = useState(false);
    const [newData, setNewData] = useState({
        trip_id: null,
    });

    const dataAllFiltered = dataAll.filter((element) => {
        return parseInt(element.destination_id) === parseInt(destination_id);
    }).filter((element) => {
        return parseInt(element.trip_id) !== parseInt(trip_id)
    })

    const removeCargoById = (cargo_id) => {
        const updatedDataAll = dataAll.map(trip => {
        const updatedCargos = trip.cargos.filter(cargo => cargo.cargo_id !== cargo_id);
          
          return {
            ...trip,
            cargos: updatedCargos
          };
        });
      
        setDataAll(updatedDataAll);
      };

    const handleDeleteCargo = async (id) => {
        if (window.confirm(`Вы уверены, что хотите удалить груз №${id}?`)) {
            const res = await deleteCargo(id);
            if(res){
                alert(res.message);
                removeCargoById(id);
            }
            
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await moveCargo(cargo_id, newData);
    
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const tripData = dataAllFiltered.find((element) => parseInt(element.trip_id) === parseInt(value));
        console.log(tripData);

        if (parseInt(value) === 4) { 
            if (parseInt(tripData.max_cargos - sumCargos(tripData.cargos, 1)) >= size) {
                setNewData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                alert("В этом рейсе больше нет мест для грузов.");
            }
        } else {
            let parkings = parseInt(tripData.max_cars - sumCargos(tripData.cargos, 0));
            if ( parkings >= size) {
                setNewData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                alert(`Ваш груз не помещается. В выбранном рейсе осталось свободных машиномест: ${parkings}`);
            }
        }
    };

    const handleChancel = (e) => {
        e.preventDefault();
        setShown(false);
    }

    

    return (
        <div id={cargo_id} className="inner-card-block">
            <div className="inner-card-block-title">
                <span className="inner-card-block-name">
                    №{cargo_id} {cargo_name} | занимает мест: {size}
                </span>
                {shown?(
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="form-input-block">
                                <label htmlFor="trip_id">Новый рейс:</label>
                                <select
                                    name="trip_id"
                                    value={newData.trip_id || ""}
                                    onChange={(e) => handleChange(e)}
                                    required
                                >
                                    <option value="" disabled>
                                        Выберите рейс
                                    </option>
                                    {dataAllFiltered.map((element) => (
                                        <option key={element.trip_id} value={element.trip_id}>
                                            Рейс №{element.trip_id} → {element.destination_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="buttons-block">
                                <button className="grey-button" type="chancel" onClick={(e) => handleChancel(e)}>Отменить</button>
                                <button className="filed-button" type="submit">Перенаправить</button>
                            </div>
                        </form>
                    </>
                ):("")}
            </div>

            <div className="inner-card-block-buttons">
                {!shown && (<img src={Change} alt="Перенаправить" onClick={() => setShown(true)}/>)}
                <img src={Close} alt="Удалить" onClick={() => handleDeleteCargo(cargo_id)}/>
            </div>
        </div>
    )
}