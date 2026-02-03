// Kakao Maps SDK Type Declarations

// Kakao Maps SDK Type Declarations
declare namespace kakao.maps {
  class Map {
    constructor(container: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    getCenter(): LatLng;
    setLevel(level: number): void;
    getLevel(): number;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
    getMap(): Map | null;
  }

  class CustomOverlay {
    constructor(options: CustomOverlayOptions);
    setMap(map: Map | null): void;
    getMap(): Map | null;
    setPosition(position: LatLng): void;
    getPosition(): LatLng;
    setContent(content: string | HTMLElement): void;
    getContent(): string | HTMLElement;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    setZIndex(zIndex: number): void;
    getZIndex(): number;
  }

  interface CustomOverlayOptions {
    position: LatLng;
    content: string | HTMLElement;
    map?: Map;
    clickable?: boolean;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
  }

  interface MapOptions {
    center: LatLng;
    level?: number;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
  }

  interface InfoWindowOptions {
    content: string;
    removable?: boolean;
  }

  namespace services {
    class Geocoder {
      addressSearch(
        address: string,
        callback: (result: GeocoderResult[], status: Status) => void
      ): void;
    }

    class Places {
      keywordSearch(
        keyword: string,
        callback: (result: PlaceResult[], status: Status, pagination: Pagination) => void
      ): void;
    }

    interface GeocoderResult {
      address_name: string;
      road_address?: {
        address_name: string;
      };
      x: string;
      y: string;
    }

    interface PlaceResult {
      id: string;
      place_name: string;
      address_name: string;
      road_address_name?: string;
      x: string;
      y: string;
    }

    interface Pagination {
      totalCount: number;
      hasNextPage: boolean;
      nextPage(): void;
    }

    enum Status {
      OK = "OK",
      ZERO_RESULT = "ZERO_RESULT",
      ERROR = "ERROR",
    }
  }

  namespace event {
    function addListener(
      target: Marker | Map,
      type: string,
      callback: () => void
    ): void;
  }

  function load(callback: () => void): void;
}

declare global {
  interface Window {
    kakao: {
      maps: typeof kakao.maps & {
        load: (callback: () => void) => void;
        Map: typeof kakao.maps.Map;
        LatLng: typeof kakao.maps.LatLng;
        Marker: typeof kakao.maps.Marker;
        InfoWindow: typeof kakao.maps.InfoWindow;
        CustomOverlay: typeof kakao.maps.CustomOverlay;
        services: {
          Geocoder: typeof kakao.maps.services.Geocoder;
          Places: typeof kakao.maps.services.Places;
          Status: typeof kakao.maps.services.Status;
        };
        event: typeof kakao.maps.event;
      };
    };
  }
}

export {};
