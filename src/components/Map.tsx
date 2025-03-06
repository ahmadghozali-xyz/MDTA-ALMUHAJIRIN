import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import { BookOpen, MapPin, Phone, Mail, Clock } from 'lucide-react';

// Data lokasi MDA
const locationData = {
  id: 1,
  nama: "MDA Al Muhajirin",
  latitude: 0.482909,
  longitude: 101.350490,
  kategori: "Pendidikan",
  deskripsi: "Jl. Uka, Perumahan Garuda Permai II, Kec. Tampan",
  telepon: "(0761) 1234567",
  email: "info@almuhajirin.ac.id",
  jamOperasional: "Senin - Sabtu: 08:00 - 17:00"
};

// Kustomisasi marker
const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function Map() {
  return (
    <div className="map-container relative">
      <div className="absolute top-4 left-4 z-[400] bg-white p-3 rounded-lg shadow-md">
        <h4 className="text-sm font-semibold text-gray-800 mb-1">MDA Al Muhajirin</h4>
        <p className="text-xs text-gray-600">Klik marker untuk detail lengkap</p>
      </div>
      
      <MapContainer 
        center={[locationData.latitude, locationData.longitude]} 
        zoom={19}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
        className="rounded-xl shadow-elegant"
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        
        {/* Layer Peta Standar */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={20}
          minZoom={17}
        />
        
        {/* Area radius */}
        <Circle
          center={[locationData.latitude, locationData.longitude]}
          radius={50}
          pathOptions={{
            color: '#15803d',
            fillColor: '#15803d',
            fillOpacity: 0.1,
            weight: 1
          }}
        />
        
        {/* Marker lokasi */}
        <Marker position={[locationData.latitude, locationData.longitude]} icon={customIcon}>
          <Popup className="custom-popup">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-semibold text-gray-800 text-lg">{locationData.nama}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{locationData.deskripsi}</p>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{locationData.telepon}</p>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{locationData.email}</p>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{locationData.jamOperasional}</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400 text-center">
                  Koordinat: {locationData.latitude}, {locationData.longitude}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}