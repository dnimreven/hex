import { Hex } from '../Hex';

describe('Hex instance', () => {
  test('to be defined', () => {
    const instance = new Hex(0, 0, 0);

    expect(instance).toBeDefined();
  });

  test('should have correct coordinates', () => {
    const hex1 = Hex.at(0.5, 0.5);

    expect(hex1.q).toEqual(0);
    expect(hex1.r).toEqual(0);
    expect(hex1.s).toEqual(0);

    const hex2 = Hex.at(1, 1);

    expect(hex2.q).toEqual(0);
    expect(hex2.r).toEqual(-1);
    expect(hex2.s).toEqual(1);

    const hex3 = Hex.at(1, 1, 2);

    expect(hex3.q).toEqual(0);
    expect(hex3.r).toEqual(0);
    expect(hex3.s).toEqual(0);

    
    const hex4 = Hex.at(10, 10, 2);

    expect(hex4.q).toEqual(1);
    expect(hex4.r).toEqual(-4);
    expect(hex4.s).toEqual(3);
  });
});
