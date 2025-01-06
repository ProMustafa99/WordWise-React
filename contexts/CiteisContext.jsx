import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = 'http://localhost:8000';


function CitiesProvider({ children }) {

    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentCity, SetcurrentCity] = useState({});

    useEffect(function () {
        async function featchCities() {
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            }
            catch (error) {
                alert('There was an error loading data...');
            } finally {
                setIsLoading(false);
            }
        }
        featchCities();
    }, []);

    async function getCity(id) {
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            SetcurrentCity(data);
        }
        catch (error) {
            alert('There was an error loading data...');
        } finally {
            setIsLoading(false);
        }
    }

    async function createCity(newCity) {
        // dispatch({ type: "loading" });
        try {
            setIsLoading(true);
            const res = await fetch(`${BASE_URL}/cities`, {
                method: "POST",
                body: JSON.stringify(newCity),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            setCities((cities) => [...cities, data]);
            // dispatch({ type: "city/created", payload: data });
        } catch {
            // dispatch({
            //     type: "rejected",
            //     payload: "There was an error creating the city...",
            // });
        }
    }

    async function deleteCity(id) {

        try {
            setIsLoading(true);
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: "DELETE",
            });

            setCities((cities) => cities.filter((city) => city.id !== id));

        } catch {
            alert("There was an error dleteing city.")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity, createCity ,deleteCity }}>
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error(`CitiesContext was used outside the CititesProvider`);
    return context;
}


export { CitiesProvider, useCities };


