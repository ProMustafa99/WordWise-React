import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPostion } from "../hooks/useUrlPostion";
import Message from './Message';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../../contexts/CiteisContext";
import { useNavigate } from "react-router-dom";


const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {

  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [isLoadingGeocoding, SetisLoadingGeocoding] = useState(false);
  const [lat, lng] = useUrlPostion();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();


  useEffect(function () {
    async function fetchCityData() {
      try {
        SetisLoadingGeocoding(true);
        setGeocodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error("That doesn't seem to be a city. Click somewhere else 😉");

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));

      } catch (error) {
        setGeocodingError(err.message);
      } finally {
        SetisLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  if (geocodingError) return <Message message={geocodingError} />;
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;


  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form className={`${styles.form}`} onSubmit={handleSubmit}>

      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}> {emoji} </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          onChange={date => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>

    </form>
  );
}

export default Form;
