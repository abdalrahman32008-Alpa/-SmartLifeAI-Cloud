import { cn } from './utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('bg-red-500', { 'text-white': true })).toBe('bg-red-500 text-white');
    expect(cn('bg-red-500', { 'text-white': false })).toBe('bg-red-500');
  });

  it('should override conflicting classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});
