import {memo, useEffect, useState} from 'react';

import {load} from '@2gis/mapgl';

export const IS_ONLINE = [
  {
    id: 'event_is_online_true',
    value: 'true',
    label: 'Онлайн',
  },
  {
    id: 'event_is_online_false',
    value: 'false',
    label: 'Офлайн',
  },
];

export const IS_2GIS = [
  {
    id: 'event_is_2gis_false',
    value: 'false',
    label: 'Изображение карты',
  },
  {
    id: 'event_is_2gis_true',
    value: 'true',
    label: 'Карта 2ГИС',
  },
];

export const MAP_ID = 'map-container1';
export const DEFAULT_COORDINATES = {
  lat: 55.773884,
  lon: 37.60469,
};
export const DEFAULT_ZOOM = 8;
export const DEFAULT_BOUNDS = {
  northEast: {
    lat: 55.774326352999026,
    lon: 37.60749614025437,
  },
  southWest: {
    lat: 55.772515968161066,
    lon: 37.602936377804255,
  },
};

export const WHITE_LIST = ['2gis.ru'];


const MapWrapper = memo(
  ({id}) => <div id={id} style={{width: '100%', height: '300px'}}/>,
  () => true,
);

export const MapComponent = ({id}) => {
  const [coordinates, setCoordinates] = useState (DEFAULT_COORDINATES);
  const [bounds, setBounds] = useState(DEFAULT_BOUNDS);
  const [map, setMap] = useState();
  const [marker, setMarker] = useState();
  const doubleGisKey = "e158163c-e701-46c5-a5df-2bd83352b1fc";


  useEffect(() => {
    if (!map) {
      load().then(mapglAPI => {
        setMap(
          new mapglAPI.Map(id, {
            center: [DEFAULT_COORDINATES.lon, DEFAULT_COORDINATES.lat],
            zoom: DEFAULT_ZOOM,
            key: doubleGisKey,
          }),
        );
      });
    }

    // Удаляем карту при размонтировании компонента
    return () => map && map.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, id]);

  useEffect(() => {
    if (map && coordinates) {
      load().then(mapglAPI => {
        const mapBounds = map.getBounds();

        // setMarker(new mapglAPI.Marker(map, {coordinates: [coordinates.lon, coordinates.lat]}));

        map.setCenter([coordinates.lon, coordinates.lat]);
        map.on('moveend', () =>
          setBounds({
            northEast: {
              lat: mapBounds.northEast[1],
              lon: mapBounds.northEast[0],
            },
            southWest: {
              lat: mapBounds.southWest[1],
              lon: mapBounds.southWest[0],
            },
          }),
        );
        map.on('click', e => {
          if (marker) {
            marker.destroy();
          }
          setCoordinates({
            lon: e.lngLat[0],
            lat: e.lngLat[1],
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, map, setBounds, setCoordinates]);

  useEffect(() => {
    if (map && coordinates) {
      load().then(() => {
        const mapBounds = map.getBounds();

        map.on('moveend', () =>
          setBounds({
            northEast: {
              lat: mapBounds.northEast[1],
              lon: mapBounds.northEast[0],
            },
            southWest: {
              lat: mapBounds.southWest[1],
              lon: mapBounds.southWest[0],
            },
          }),
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds]);

  useEffect(() => {
    const parent = document.getElementById(id);
    const children = document.getElementById(id)?.childNodes;

    if (children?.length === 2) {
      const firstChild = children[0];

      if (parent && firstChild) {
        parent.removeChild(firstChild);
      }
    }
  }, [map, id]);

  useEffect(() => {
    const buttons = document.getElementById(id)?.querySelectorAll('button');

    buttons?.[0]?.setAttribute('type', 'button');
    buttons?.[1]?.setAttribute('type', 'button');
  }, [map, id]);

  return (
    <div data-testid="map-embed" style={{width: '100%', height: '100%'}}>
      <MapWrapper id={id}/>
    </div>
  );
};