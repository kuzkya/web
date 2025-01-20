// ---------- Адрес сервера ----------

const URL = "http://localhost:5000";

// ---------- Запрос на получение всех рейсов и их грузов ----------

export const fetchAllData = async (setData) => {
    try {
      const response = await fetch(`${URL}/trips`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      
      setData(data);
    } catch (error) {
      console.error('Ошибка при первичной загрузке данных:', error.message);
      alert('Ошибка при первичной загрузке данных: ' + error.message);
    }
  };

// ---------- Запрос на удаление рейса по его ID ----------

export const deleteTrip = async (id) => {
    try {
        const response = await fetch(`${URL}/trips/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка при удалении рейса');
        }

        const result = await response.json();
        return result; 
    } catch (error) {
        console.error('Ошибка:', error.message);
        alert('Ошибка при удалении рейса: ' + error.message);
    }
};

// ---------- Запрос на добавление рейса ----------

export const addTrip = async (data) => {
  try {

    const response = await fetch(`${URL}/trips/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении рейса');
    }

    alert('Рейс успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении рейса: ' + error.message);
  }
};

// ---------- Запрос на обновление данных о рейсе ----------

export const updateTrip = async (data, id) => {
  try {

    const response = await fetch(`${URL}/trips/update/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении данных рейса');
    }

    alert('Данные успешно обновлены!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при обновлении данных рейса: ' + error.message);
  }
};

// ---------- Запрос на добавление груза ----------

export const addCargo = async (data) => {
  try {

    const response = await fetch(`${URL}/cargos/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении груза');
    }

    alert('Груз успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении груза: ' + error.message);
  }
};

// ---------- Запрос на удаление груза ----------

export const deleteCargo = async (id) => {
  try {
      const response = await fetch(`${URL}/cargos/delete/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при удалении груза');
      }

      const result = await response.json();
      return result; 
  } catch (error) {
      console.error('Ошибка:', error.message);
      alert('Ошибка при удалении груза: ' + error.message);
  }
};

// ---------- Запрос на перенаправление груза ----------

export const moveCargo = async (id, data) => {
  try {

    const response = await fetch(`${URL}/cargos/move/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при перенаправлении груза');
    }

    alert('Груз успешно перенаправлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошшибка при перенаправлении груза: ' + error.message);
  }
};

// ---------- Запрос на получение всех судов ----------

export const getFerries = async (setData) => {
  try {
      const response = await fetch(`${URL}/ferries`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении судов');
      }

      const data = await response.json();
      setData(data)
  } catch (error) {
      console.error('Ошибка при загрузке судов:', error.message);
      alert('Ошибка при загрузке судов: ' + error.message);
  }
};

// ---------- Запрос на получение всех пунктов назначения ----------

export const getDestinations = async (setData) => {
  try {
      const response = await fetch(`${URL}/destinations`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении пунктов назначения');
      }

      const data = await response.json();
      setData(data)
  } catch (error) {
      console.error('Ошибка при загрузке пунктов назначения:', error.message);
      alert('Ошибка при загрузке пунктов назначения: ' + error.message);
  }
};

// ---------- Запрос на добавление пункта назначения ----------

export const addDestination = async (data) => {
  try {

    const response = await fetch(`${URL}/destinations/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ошибка при добавлении пункта назанчения');
    }

    alert('Пункт назанчения успешно добавлен!');
    return 200;

  } catch (error) {
    console.error('Ошибка:', error.message);
    alert('Ошибка при добавлении пункта назанчения: ' + error.message);
  }
};

// ---------- Запрос на получение всех пунктов назначения ----------

export const getTypes = async (setData) => {
  try {
      const response = await fetch(`${URL}/cargo-types`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Ошибка при получении типов грузов');
      }

      const data = await response.json();
      setData(data)
  } catch (error) {
      console.error('Ошибка при загрузке типов грузов:', error.message);
      alert('Ошибка при загрузке типов грузов: ' + error.message);
  }
};

