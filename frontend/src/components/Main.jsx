import { useEffect, useState } from "react"
import { fetchAllData, addTrip, addCargo, addDestination } from "../requests";

import Card from "./ui/Card";
import AddTrip from "./ui/AddTrip";
import AddCargo from "./ui/AddCargo";
import AddDestination from "./ui/AddDestination";

export default function Main() {
    const [data, setData] = useState([]);
    const [shown, setShown] = useState(false);
    const [shown2, setShown2] = useState(false);
    const [shown3, setShown3] = useState(false);

    useEffect(() => {
        fetchAllData(setData);
    }, [])

    const sumCargos = (arr, value) => {
        return arr
          .filter(cargo => cargo.is_cargo === value)
          .reduce((sum, cargo) => sum + cargo.size, 0);
    }

    return (
        <main className="main-block">
            <div className="main-block-menu">
                {!shown && (<button className="filed-button" onClick={() => setShown(true)}>Добавить рейс</button>)}
                {!shown2 && (<button className="filed-button" onClick={() => setShown2(true)}>Добавить груз</button>)} 
                {!shown3 && (<button className="filed-button" onClick={() => setShown3(true)}>Добавить пункт назначения</button>)} 
            </div>
            {(shown || shown2 || shown3) && (
                <div className="main-block-form">
                    {shown && (
                        <AddTrip setShown={setShown} requestFunction={addTrip} />
                    )}
                    {shown2 && (
                        <AddCargo setShown={setShown2} requestFunction={addCargo} dataAll={data} sumCargos={sumCargos} />
                    )}
                    {shown3 && (
                        <AddDestination setShown={setShown3} requestFunction={addDestination}/>
                    )}
                </div>
            )}

            <div className="main-block-cards-list">
                {data.map((element, index) => {
                    return (
                        <Card key={index} data={element} sumCargos={sumCargos} dataAll={data} setDataAll={setData}/>
                    )
                })}
            </div>
        </main>
    )
}