import { useEffect, useState } from "react";
import { getTypes } from "../../requests";

export default function AddCargo({ setShown, requestFunction, dataAll, sumCargos }) {
    const [newData, setNewData] = useState({
        name: '',
        type_id: '',
        trip_id: '',
    })
    const [types, setTypes] = useState([]);

    useEffect(() => {
        getTypes(setTypes);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "type_id") {
            const tripData = dataAll.find((element) => element.trip_id === parseInt(newData.trip_id));

            const selectedType = types.find((element) => element.id === parseInt(value));

            const { size } = selectedType; 

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
                    alert(`Ваш груз не помещается. В этом рейсе осталось свободных машиномест: ${parkings}`);
                }
            }
        } else {
            setNewData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await requestFunction(newData);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h2>Добавление груза</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-select-block">
                    <label htmlFor="trip_id">Рейс</label>
                    <select
                        name='trip_id'
                        value={newData.trip_id}
                        onChange={(e) => handleChange(e)}
                        required
                    >
                        <option value="" disabled>
                            Выберите рейс
                        </option>
                        {dataAll.map((element) => (
                            <option key={element.trip_id} value={element.trip_id}>
                                Рейс №{element.trip_id}
                            </option>
                        ))}
                    </select>
                </div>
                {newData.trip_id?(
                    <>
                        <div className="form-select-block">
                            <label htmlFor="type_id">Тип груза</label>
                            <select
                                name='type_id'
                                value={newData.type_id}
                                onChange={(e) => handleChange(e)}
                                required
                            >
                                <option value="" disabled>
                                    Выберите тип
                                </option>
                                {types.map((element) => (
                                    <option key={element.id} value={element.id}>
                                        {element.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-input-block">
                            <label htmlFor="name">Название груза</label>
                            <input
                                name="name"
                                type="text"
                                value={newData.name}
                                placeholder="Например: грузовик Volvo"
                                onChange={(e) => handleChange(e)}
                                required
                            />
                        </div>
                    </>
                ):("")}

                <div className="buttons-block">
                    <button className="grey-button" type="button" onClick={() => setShown(false)}>Отменить</button>
                    {newData.trip_id?(<button className="filed-button" type="submit">Создать</button>):("")}
                </div>
            </form>
        </div>
    );
}