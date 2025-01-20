import React, { useState, useEffect } from 'react';
import { getFerries, getDestinations } from '../../requests';

export default function AddTrip({setShown, requestFunction, initialData={}}) {
    const {trip_id, destination_id, ferry_id} = initialData;
    const [newData, setNewData] = useState({
        destination_id: destination_id || '',
        ferry_id: ferry_id || '',
    })

    const [ferries, setFerries] = useState([]);
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        getFerries(setFerries);
        getDestinations(setDestinations);
    }, []);

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await requestFunction(newData, trip_id);
        if (res === 200) {
            setShown(false);
            window.location.reload();
        }
    };

    return (
        <div className="form-block">
            <h2>{trip_id?`Редактирование рейса №${trip_id}`:"Добавление рейса"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-select-block">
                    <label htmlFor="destination_id">Пункт назначения</label>
                        <select
                            name='destination_id'
                            value={newData.destination_id}
                            onChange={(e) => handleSelectChange(e)}
                            required
                        >
                            <option value="" disabled>
                                Выберите пункт
                            </option>
                            {destinations.map((element) => (
                                <option key={element.id} value={element.id}>
                                    {element.name}
                                </option>
                            ))}
                        </select>
                </div>
                <div className="form-select-block">
                    <label htmlFor="ferry_id">Паром</label>
                        <select
                            name='ferry_id'
                            value={newData.ferry_id}
                            onChange={(e) => handleSelectChange(e)}
                            required
                        >
                            <option value="" disabled>
                                Выберите паром
                            </option>
                            {ferries.map((element) => (
                                <option key={element.id} value={element.id}>
                                    {element.name}
                                </option>
                            ))}
                        </select>
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="chancel" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">{trip_id?"Сохранить":"Добавить"}</button>
                </div>
            </form>
        </div>
    );
}