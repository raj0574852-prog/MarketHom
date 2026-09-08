import { describe, it, expect } from 'vitest';
import { calculateContentPlacementSellingPrice } from '../contentPlacement';

describe('calculateContentPlacementSellingPrice', () => {
  it('should correctly calculate selling prices for boundaries and exact values', () => {
    const testCases = [
      { original: 2, expectedMarkup: 125, expectedSelling: 5 }, // 2 * 2.25 = 4.5 -> 5
      { original: 3, expectedMarkup: 125, expectedSelling: 7 }, // 3 * 2.25 = 6.75 -> 7
      { original: 5, expectedMarkup: 125, expectedSelling: 12 }, // 5 * 2.25 = 11.25 -> 12
      { original: 5.01, expectedMarkup: 100, expectedSelling: 11 }, // 5.01 * 2 = 10.02 -> 11
      { original: 9.90, expectedMarkup: 100, expectedSelling: 20 }, // 9.90 * 2 = 19.8 -> 20
      { original: 10, expectedMarkup: 100, expectedSelling: 20 }, // 10 * 2 = 20 -> 20
      { original: 10.01, expectedMarkup: 85, expectedSelling: 19 }, // 10.01 * 1.85 = 18.5185 -> 19
      { original: 20, expectedMarkup: 85, expectedSelling: 37 }, // 20 * 1.85 = 37 -> 37
      { original: 25, expectedMarkup: 85, expectedSelling: 47 }, // 25 * 1.85 = 46.25 -> 47
      { original: 25.01, expectedMarkup: 75, expectedSelling: 44 }, // 25.01 * 1.75 = 43.7675 -> 44
      { original: 40, expectedMarkup: 75, expectedSelling: 70 }, // 40 * 1.75 = 70 -> 70
      { original: 50, expectedMarkup: 75, expectedSelling: 88 }, // 50 * 1.75 = 87.5 -> 88
      { original: 50.01, expectedMarkup: 60, expectedSelling: 81 }, // 50.01 * 1.6 = 80.016 -> 81
      { original: 80, expectedMarkup: 60, expectedSelling: 128 }, // 80 * 1.6 = 128 -> 128
      { original: 100, expectedMarkup: 60, expectedSelling: 160 }, // 100 * 1.6 = 160 -> 160
      { original: 100.01, expectedMarkup: 50, expectedSelling: 151 }, // 100.01 * 1.5 = 150.015 -> 151
      { original: 150, expectedMarkup: 50, expectedSelling: 225 }, // 150 * 1.5 = 225 -> 225
      { original: 250, expectedMarkup: 50, expectedSelling: 375 }, // 250 * 1.5 = 375 -> 375
      { original: 250.01, expectedMarkup: 40, expectedSelling: 351 }, // 250.01 * 1.4 = 350.014 -> 351
      { original: 400, expectedMarkup: 40, expectedSelling: 560 }, // 400 * 1.4 = 560 -> 560
      { original: 500, expectedMarkup: 40, expectedSelling: 700 }, // 500 * 1.4 = 700 -> 700
      { original: 500.01, expectedMarkup: 30, expectedSelling: 651 }, // 500.01 * 1.3 = 650.013 -> 651
      { original: 800, expectedMarkup: 30, expectedSelling: 1040 }, // 800 * 1.3 = 1040 -> 1040
      { original: 1000, expectedMarkup: 30, expectedSelling: 1300 }, // 1000 * 1.3 = 1300 -> 1300
      { original: 1000.01, expectedMarkup: 25, expectedSelling: 1251 }, // 1000.01 * 1.25 = 1250.0125 -> 1251
      { original: 2000, expectedMarkup: 25, expectedSelling: 2500 }, // 2000 * 1.25 = 2500 -> 2500
      { original: 2500, expectedMarkup: 25, expectedSelling: 3125 }, // 2500 * 1.25 = 3125 -> 3125
      { original: 2500.01, expectedMarkup: 20, expectedSelling: 3001 }, // 2500.01 * 1.2 = 3000.012 -> 3001
      { original: 4000, expectedMarkup: 20, expectedSelling: 4800 }, // 4000 * 1.2 = 4800 -> 4800
      { original: 5000, expectedMarkup: 20, expectedSelling: 6000 }, // 5000 * 1.2 = 6000 -> 6000
      { original: 5000.01, expectedMarkup: 15, expectedSelling: 5751 }, // 5000.01 * 1.15 = 5750.0115 -> 5751
      { original: 8000, expectedMarkup: 15, expectedSelling: 9200 }, // 8000 * 1.15 = 9200 -> 9200
      { original: 10000, expectedMarkup: 15, expectedSelling: 11500 }, // 10000 * 1.15 = 11500 -> 11500
      { original: 10000.01, expectedMarkup: 10, expectedSelling: 11001 }, // 10000.01 * 1.1 = 11000.011 -> 11001
      { original: 12000, expectedMarkup: 10, expectedSelling: 13200 }, // 12000 * 1.1 = 13200 -> 13200
      { original: 50000, expectedMarkup: 10, expectedSelling: 55000 } // 50000 * 1.1 = 55000 -> 55000
    ];

    testCases.forEach(({ original, expectedMarkup, expectedSelling }) => {
      const result = calculateContentPlacementSellingPrice(original);
      expect(result).not.toBeNull();
      expect(result?.originalPrice).toBe(original);
      expect(result?.markupPercentage).toBe(expectedMarkup);
      expect(result?.sellingPrice).toBe(expectedSelling);
    });
  });

  it('should handle invalid string cases gracefully', () => {
    const invalidCases = [
      null,
      undefined,
      '',
      ' ',
      'N/A',
      'NA',
      '-',
      'Not Available',
      'Contact for price'
    ];

    invalidCases.forEach(invalidValue => {
      expect(calculateContentPlacementSellingPrice(invalidValue)).toBeNull();
    });
  });

  it('should parse valid string prices including currency symbols and commas', () => {
    const stringCases = [
      { original: '$100', expectedSelling: 160 },
      { original: '€100.50', expectedSelling: 151 }, // 100.50 is between 100 and 250 -> 50% markup -> 100.5 * 1.5 = 150.75 -> 151
      { original: '1,000', expectedSelling: 1300 },
      { original: '$2,500.00', expectedSelling: 3125 }
    ];

    stringCases.forEach(({ original, expectedSelling }) => {
      const result = calculateContentPlacementSellingPrice(original);
      expect(result).not.toBeNull();
      expect(result?.sellingPrice).toBe(expectedSelling);
    });
  });

  it('should always round UP to the nearest whole dollar', () => {
    // 87.45 -> 88
    // 87.01 -> 88
    // 87.99 -> 88
    // 100.00 -> 100
    // 159.10 -> 160

    // Original price 54.65 -> tier 60% -> 54.65 * 1.6 = 87.44 -> 88
    let result = calculateContentPlacementSellingPrice(54.65);
    expect(result?.sellingPrice).toBe(88);

    // Original price 54.38 -> tier 60% -> 54.38 * 1.6 = 87.008 -> 88
    result = calculateContentPlacementSellingPrice(54.38);
    expect(result?.sellingPrice).toBe(88);

    // Original price 54.99 -> tier 60% -> 54.99 * 1.6 = 87.984 -> 88
    result = calculateContentPlacementSellingPrice(54.99);
    expect(result?.sellingPrice).toBe(88);

    // 62.5 -> 60% -> 100
    result = calculateContentPlacementSellingPrice(62.5);
    expect(result?.sellingPrice).toBe(100);

    // 99.43 -> 60% -> 159.088 -> 160
    result = calculateContentPlacementSellingPrice(99.43);
    expect(result?.sellingPrice).toBe(160);
  });
});
