import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';

import styles from './Map.module.css';
import { useCities } from '../../contexts/CiteisContext';
import { useGeolocation } from '../hooks/useGeoLocation';
import Button from './Button';

export default function Map() {

  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const { cities } = useCities();
  const [mapPosition, SetmapPosition] = useState([30, 0]);
  const { isLoading: isLoadingPostion, position: geolocationPostion, getPosition } = useGeolocation();

  useEffect(function () {
    if (lat && lng)
      SetmapPosition([lat, lng]);

  }, [lat, lng])


  useEffect(function () {
    if (geolocationPostion)
      SetmapPosition([geolocationPostion.lat, geolocationPostion.lng]);

  }, [geolocationPostion])


  return (
    <div className={styles.mapContainer}>


      {!geolocationPostion &&
        <Button type='position' onClick={getPosition}>
          {isLoadingPostion ? 'Loading...' : 'Use your postion'}
        </Button>}

      <MapContainer center={mapPosition} zoom={8} scrollWheelZoom={true} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker position={[city.position.lat, city.position.lng]}>
            <Popup>
              <span>
                {city.emoji}
              </span>

              <span>
                {city.cityName}
              </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>


    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}


function DetectClick() {
  const navigate = useNavigate();

  useMapEvent({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  });
}
