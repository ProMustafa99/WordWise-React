import React from 'react';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import Cityitem from './Cityitem';
import { useCities } from '../../contexts/CiteisContext';

export default function CityList() {

    const {cities , isLoading} = useCities(); 

    if (isLoading) return <Spinner />;

    return (
        <ul className={styles.cityList}>
            {cities.map((city) => (
                <Cityitem key={city.id} city={city} />
            ))}
        </ul>
    );
}
