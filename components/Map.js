import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useCallback, useRef, useEffect } from "react";
import { mapStyles } from "./mapstyles.js";
import { restaurantLocations } from "./restaurants";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
const locator = "/pics/location.svg";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};
const libraries = ["places"];

const center = { lat: 50.013615, lng: 36.32684 };

const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function Map({ setCustAddress, custAddress, cart }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY,
    libraries,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [closestRestaurant, setClosestRestaurant] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  async function getDeliveryRate() {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: closestRestaurant,
      destination: custAddress,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    if (directionsResponse) {
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    }
  }

  function getNearRestaurant() {
    if (cart.length > 0) {
      restaurantLocations.map((restaurant) => {
        if (restaurant.name === cart[0].restaurant) {
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${restaurant.lat},${restaurant.lng}&key=${process.env.REACT_APP_GMAPS_API_KEY}`
          )
            .then((response) => response.json())
            .then((results) =>
              setClosestRestaurant(results.results[0].formatted_address)
            );
        }
      });
    }
  }

  function handleGetAddress(lat, lng) {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GMAPS_API_KEY}`
    )
      .then((response) => response.json())
      .then((results) => setCustAddress(results.results[0].formatted_address));
  }

  const [myLocation, setMyLocation] = useState(null);

  function onMapClick(event) {
    handleGetAddress(event.latLng.lat(), event.latLng.lng());
    setMyLocation({
      name: "Your location",
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);

  const [selected, setSelected] = useState(null);
  useEffect(() => {
    getNearRestaurant();
    getDeliveryRate();
  }, [custAddress]);

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <>
      <div className="Map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          options={options}
          onClick={(event) => {
            onMapClick(event);
            getDeliveryRate();
          }}
          onLoad={onMapLoad}
        >
          {restaurantLocations.map((restaurant) => {
            return (
              <Marker
                key={restaurant.id}
                position={{ lat: restaurant.lat, lng: restaurant.lng }}
                onClick={() => setSelected(restaurant)}
              />
            );
          })}
          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div>
                <h3>{selected.name}</h3>
              </div>
            </InfoWindow>
          ) : null}
          {myLocation ? (
            <>
              <Marker
                position={{ lat: myLocation.lat, lng: myLocation.lng }}
                onClick={() => setSelected(myLocation)}
              />
              <DirectionsRenderer directions={directionsResponse} />
            </>
          ) : null}
        </GoogleMap>
        <Search
          panTo={panTo}
          setCustAddress={setCustAddress}
          setMyLocation={setMyLocation}
          handleGetAddress={handleGetAddress}
        />
        {directionsResponse ? (
          <>
            <p>
              Distance to the closest restaurant:
              {distance ? (
                <b> {distance}</b>
              ) : (
                <b> Loading failed. Try again</b>
              )}
            </p>
            <p>
              Approximate delivery time:
              {duration ? (
                <b> {duration} + 45 mins to produce a meal</b>
              ) : (
                <b> Loading failed. Try again</b>
              )}
            </p>
          </>
        ) : null}
      </div>
    </>
  );
}

function Locate({ panTo, handleGetAddress, setMyLocation }) {
  return (
    <button
      className="LocatorButton"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setMyLocation({
              name: "Your location",
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            handleGetAddress(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          () => null
        );
      }}
    >
      <img
        className="Locator"
        src={locator}
        alt="Locate position on your location"
      />
    </button>
  );
}

function Search({ panTo, setCustAddress, setMyLocation, handleGetAddress }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  return (
    <>
      <Combobox
        onSelect={async (address) => {
          try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
            setMyLocation({
              name: "Your location",
              lat: lat,
              lng: lng,
            });
          } catch (error) {
            console.log(error);
          }
          setValue(address, false);
          setCustAddress(address);
          clearSuggestions();
        }}
      >
        <ComboboxInput
          className="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Enter your address"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption
                  className="SearchSuggestion"
                  key={place_id}
                  value={description}
                ></ComboboxOption>
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <Locate
        panTo={panTo}
        setMyLocation={setMyLocation}
        handleGetAddress={handleGetAddress}
      />
    </>
  );
}
