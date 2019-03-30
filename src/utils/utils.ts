/**
 * 一些零碎的玩意
 */

export function formatPrice(price: number): string[] {
  const hundred = Math.round(price * 100);
  if (hundred < 100) {
    return ['0', (hundred < 10 ? '0' : '') + String(hundred)];
  } else {
    const str = String(hundred);
    const splitIndex = str.length - 2;
    return [str.substring(0, splitIndex), str.substr(splitIndex, 2)];
  }
}

