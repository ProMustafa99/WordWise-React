import React from 'react';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import Cityitem from './Cityitem';
import CountryItem from './CountryItem';
import { useCities } from '../../contexts/CiteisContext';

export default function CountryList() {

    const { cities, isLoading } = useCities();

    if (isLoading) return <Spinner />;

    const countries = cities.reduce((arr, city) => {
        if (!arr.map(el => el.country).includes(city.country)) {
            return [...arr, { country: city.country, emoji: city.emoji }];
        } else {
            return arr;
        }
    }, []);

    return (
        <ul className={styles.countryList}>
            {countries.map((coutrie) => (
                <CountryItem key={coutrie.id} country={coutrie} />
            ))}
        </ul>
    );
}
