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

    return (
        <CitiesContext.Provider value={{ cities, isLoading, currentCity ,getCity}}>
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


