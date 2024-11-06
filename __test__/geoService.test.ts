import { GeoServiceSwitcher } from '../src/index'; 

describe('GeoServiceSwitcher - Cálculo de distancia con ciudades válidas', () => {
  let geoServiceSwitcher: GeoServiceSwitcher;

  beforeAll(() => {
    geoServiceSwitcher = new GeoServiceSwitcher('CSV');
  });

  test('Debería calcular correctamente la distancia entre Cali y Lima usando el servicio CSV', async () => {
    const distance = await geoServiceSwitcher.getDistance('Cali', 'Colombia', 'Lima', 'Peru');
    expect(Math.round(distance)).toBeCloseTo(7327); 
  });
});



describe('GeoServiceSwitcher - Cálculo de distancia con nombres de ciudades inválidos', () => {
    let geoServiceSwitcher: GeoServiceSwitcher;
  
    beforeAll(() => {
      geoServiceSwitcher = new GeoServiceSwitcher('CSV');
    });
  
    test('Debería lanzar un error al intentar calcular la distancia entre ciudades inválidas', async () => {
      await expect(geoServiceSwitcher.getDistance('Atlantis', 'Desconocido', 'El Dorado', 'Desconocido'))
        .rejects
        .toThrow('City not found');
    });
});
describe('GeoServiceSwitcher - Cálculo de distancia con nombres de ciudades vacios', () => {
    let geoServiceSwitcher: GeoServiceSwitcher;
  
    beforeAll(() => {
      geoServiceSwitcher = new GeoServiceSwitcher('CSV');
    });
  
    test('Debería lanzar un error al intentar calcular la distancia entre ciudades inválidas', async () => {
      await expect(geoServiceSwitcher.getDistance('', '', '', ''))
        .rejects
        .toThrow('We need real city names');
    });
});


describe('GeoServiceSwitcher - Cálculo de distancia con ciudades iguales', () => {
    let geoServiceSwitcher: GeoServiceSwitcher;
  
    beforeAll(() => {
      geoServiceSwitcher = new GeoServiceSwitcher('CSV');
    });
  
    test('Debería calcular correctamente la distancia entre Cali y Lima usando el servicio CSV', async () => {
      const distance = await geoServiceSwitcher.getDistance('Lima', 'Peru', 'Lima', 'Peru');
      expect(Math.round(distance)).toBeCloseTo(0); 
    });
  });

