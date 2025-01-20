import { useState } from "react"
import AddTrip from "./AddTrip";
import { deleteTrip, updateTrip} from "../../requests";
import InnerCard from "./InnerCard";
import Ship from "../../images/icon-ship.png"

export default function Card({data, sumCargos, dataAll, setDataAll}) {
    const { trip_id, destination_name, destination_id, max_cars, max_cargos, cargos, ferry_name} = data;
    const title = `Рейс №${trip_id} → `;
    const [edit, setEdit] = useState(false);
    const [shown, setShown] = useState(false);
    const tripData = {
        trip_id: trip_id,
        destination_id: destination_id,
    }

    const handleDeleteTrip = async (id, title) => {
        if (window.confirm(`Вы уверены, что хотите удалить "${title}${destination_name}"?`)) {
            const res = await deleteTrip(id);
            if(res){
                setDataAll(dataAll.filter((element) => element.trip_id !== id));
            }
            alert(res.message);
        }
    };

    return (
        <div id={trip_id} className={`card-block`}>
            {edit?(
                <AddTrip setShown={setEdit} requestFunction={updateTrip} initialData={data}/>
            ):(
                <>
                    <div className="card-block-title">
                        <div className="card-block-title-inner">
                            <h2 className="card-block-title-name">
                                {title}
                            </h2>
                            <div className="card-block-title-additional">
                                <img src={Ship} alt="Иконка корабля" />
                                <h2>«{ferry_name}»</h2>
                            </div>                            
                        </div>
                        {shown?(
                            <button className="text-button" onClick={() => setShown(false)}>Свернуть</button>
                        ):(
                            <button className="text-button" onClick={() => setShown(true)}>Подробнее</button>
                        )}
                    </div>
                    <div className="card-block-subtitle">
                        Следует до порта «{destination_name}»
                    </div>
                    <div className="card-block-subtitle no-bg">Загруженность: {sumCargos(cargos, 1)}/{max_cargos} грузов и {sumCargos(cargos, 0)}/{max_cars} машиномест</div>
                    {shown?(
                        <div className="card-block-hidden">
                            <div className="card-block-subitems">
                                <h3>{cargos.length > 0?"Грузы":"Пока что нет грузов"}</h3>
                                {cargos.length > 0?(
                                    <div className="card-block-subitems-list">
                                        {cargos.map((element, index) => {
                                            return (
                                                <InnerCard key={index} data={element} tripData={tripData} dataAll={dataAll} setDataAll={setDataAll} sumCargos={sumCargos}/>
                                            )
                                        })}
    
                                    </div>
                                ):("")}
                            </div>
    
                            <div className="buttons-block">
                                <button className="grey-button" onClick={() => setEdit(true)}>Изменить</button>
                                <button className="delete-button" onClick={() => handleDeleteTrip(trip_id, title)}>Удалить</button>
                            </div>
                        </div>
                    ):("")}

                </>
            )}
        </div>
    )
}