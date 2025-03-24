import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from './Card'; // We'll need to export the Card component separately
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Mock spring animations
vi.mock('@react-spring/web', () => ({
  useSpring: () => ({ transform: 'rotateY(0deg)' }),
  animated: {
    div: ({ children, style }) => (
      <div data-testid="animated-div" style={style}>
        {children}
      </div>
    ),
  },
}));

describe('Card Component', () => {
  const mockCard = {
    id: 1,
    image: '/images/meteor.png',
  };
  
  const mockHandleClick = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  test('renders correctly with default props', () => {
    const { getByTestId, getByAltText } = render(
      <Card 
        card={mockCard} 
        handleClick={mockHandleClick}
        flipped={false}
        matched={false}
      />
    );
    
    // Check that the card is rendered
    expect(getByTestId('animated-div')).toBeInTheDocument();
    expect(getByAltText('Card back')).toBeInTheDocument();
  });
  
  test('calls handleClick when card is clicked', () => {
    const { getByTestId } = render(
      <Card 
        card={mockCard} 
        handleClick={mockHandleClick}
        flipped={false}
        matched={false}
      />
    );
    
    // Click the card
    fireEvent.click(getByTestId('animated-div').parentElement);
    
    // Check that handleClick was called
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
  
  test('shows front face when card is flipped', () => {
    const { getByAltText } = render(
      <Card 
        card={mockCard} 
        handleClick={mockHandleClick}
        flipped={true}
        matched={false}
      />
    );
    
    // Check that the front face is visible
    expect(getByAltText('Card front')).toBeInTheDocument();
  });
  
  test('shows front face when card is matched', () => {
    const { getByAltText } = render(
      <Card 
        card={mockCard} 
        handleClick={mockHandleClick}
        flipped={false}
        matched={true}
      />
    );
    
    // Check that the front face is visible when matched
    expect(getByAltText('Card front')).toBeInTheDocument();
  });
}); 