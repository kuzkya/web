import React, { useState, useEffect } from 'react';
import { getDestinations } from '../../requests';

export default function AddDestination({setShown, requestFunction}) {
    const [newData, setNewData] = useState({
        name: '',
    })

    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        getDestinations(setDestinations);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isDuplicate = destinations.some(destination => destination.name.toLowerCase() === newData.name.toLowerCase());
    
        if (isDuplicate) {
            alert(`Пункт назначения "${newData.name}" уже существует.`);
            return;
        }
    
        const res = await requestFunction(newData);
    
        if (res === 200) {
            setShown(false);
        }
    };

    return (
        <div className="form-block">
            <h2>Добавление пункта назначения</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-block">
                    <label htmlFor="name">Название</label>
                    <input
                        name="name"
                        type="text"
                        value={newData.name}
                        placeholder="Например: Мурманск"
                        onChange={(e) => handleChange(e)}
                        required
                    />
                </div>

                <div className="buttons-block">
                    <button className="grey-button" type="chancel" onClick={() => setShown(false)}>Отменить</button>
                    <button className="filed-button" type="submit">Добавить</button>
                </div>
            </form>
        </div>
    );
}