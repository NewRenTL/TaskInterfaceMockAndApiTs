import fs from 'fs' 
import axios from 'axios';

interface IGeoService {
    getCoordinates(city: string, country: string): Promise<{ lat: number, lon: number }>;
}

class CSVGeoService implements IGeoService {
    private cities: Array<{ city: string, country: string, lat: number, lon: number }> = [];

    constructor() {
        this.loadCSV();
    }

    private loadCSV(): void {
        const matches = fs.readFileSync('src/worldcities.csv',{encoding:'utf-8'}).split('\n').forEach((row:any): string[] => {
            const cleanedRow = row.replace(/"/g, '').replace(/\r/g, '');

            
            const values = cleanedRow.split(',');
            this.cities.push({
                city: values[0],
                country: values[4], 
                lat: parseFloat(values[2]), 
                lon: parseFloat(values[3])  
            });
            return values;
        })
       
    }

    async getCoordinates(city: string, country: string): Promise<{ lat: number, lon: number }> {
        const result = this.cities.find(
            (entry) => entry.city.toLowerCase() === city.toLowerCase() && entry.country.toLowerCase() === country.toLowerCase()
        );
        if (!result) {
            throw new Error('City not found');
        }
        return { lat: result.lat, lon: result.lon };
    }
}


class APIGeoService implements IGeoService {
    async getCoordinates(city: string, country: string): Promise<{ lat: number, lon: number }> {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${city},${country}&format=json`
        );

        const data = response.data[0];
        if (!data) {
            throw new Error('City not found');
        }

        return { lat: parseFloat(data.lat), lon: parseFloat(data.lon) };
    }
}

class MockGeoService implements IGeoService {
    async getCoordinates(city: string, country: string): Promise<{ lat: number, lon: number }> {
        return { lat: -12.06, lon: -77.0375}; 
    }
}


function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; 
}


class GeoServiceSwitcher {
    private service: IGeoService;
    private isMock:boolean = false;

    constructor(serviceType: 'CSV' | 'API' | 'MOCK') {
        if (serviceType === 'CSV') {
            this.service = new CSVGeoService();
        } else if (serviceType === 'API') {
            this.service = new APIGeoService();
        } else {
            this.isMock = true;
            this.service = new MockGeoService();
        }
    }

    async getDistance(city1: string, country1: string, city2: string, country2: string): Promise<number> {
        const coords1 = await this.service.getCoordinates(city1, country1);
        const coords2 = await this.service.getCoordinates(city2, country2);

        return haversineDistance(coords1.lat, coords1.lon, this.isMock?coords2.lat+100:coords2.lat, this.isMock?coords2.lon+200:coords2.lat);
    }

}
    console.log("Student1: Diego Orlando Bustamante Palomino")
    console.log("Student2: Brigitte Rojas León")


    const service1 = new GeoServiceSwitcher('API');
    service1.getDistance('Lima', 'Peru', 'Arequipa', 'Peru').then(distance => {
        console.log("API")
        console.log(`Distancia: ${distance} km`);
    });

    const service2 = new GeoServiceSwitcher('CSV');
    service2.getDistance('Lima', 'Peru', 'Arequipa', 'Peru').then(distance => {
        console.log("CSV")
        console.log(`Distancia: ${distance} km`);
    });

    const service3 = new GeoServiceSwitcher('MOCK');
    service3.getDistance('Lima', 'Peru', 'Arequipa', 'Peru').then(distance => {
        console.log("Mock (Simulation using MockPropertyExtra")
        console.log(`Distancia: ${distance} km`);
    });


