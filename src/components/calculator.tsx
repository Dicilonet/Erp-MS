
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalculatorIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Calculator() {
  const { t } = useTranslation('dashboard');
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleDigitClick = (digit: string) => {
    if (display.length >= 15) return;
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleOperatorClick = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setCurrentValue(result);
      setDisplay(String(result).slice(0, 15));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (): number => {
    const inputValue = parseFloat(display);
    if (currentValue === null || operator === null) return inputValue;

    switch (operator) {
      case '+':
        return currentValue + inputValue;
      case '-':
        return currentValue - inputValue;
      case '*':
        return currentValue * inputValue;
      case '/':
        return currentValue / inputValue;
      default:
        return inputValue;
    }
  };

  const handleEqualClick = () => {
    if (operator && !waitingForOperand) {
      const result = performCalculation();
      setDisplay(String(result).slice(0, 15));
      setCurrentValue(null); // Reset for new calculation chain
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };
  
  const handleDecimalClick = () => {
    if (!display.includes('.')) {
        setDisplay(display + '.');
        setWaitingForOperand(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    if (key >= '0' && key <= '9') {
        handleDigitClick(key);
    } else if (key === '.') {
        handleDecimalClick();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperatorClick(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Prevent form submission if inside one
        handleEqualClick();
    } else if (key === 'Escape') {
        handleClear();
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, operator, currentValue, waitingForOperand]); // Re-bind listener if state handling changes

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  const handleButtonClick = (btn: string) => {
    if (!isNaN(parseInt(btn))) {
      handleDigitClick(btn);
    } else if (btn === '.') {
      handleDecimalClick();
    } else if (btn === '=') {
      handleEqualClick();
    } else {
      handleOperatorClick(btn);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{t('calculator.title')}</CardTitle>
        <CalculatorIcon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <Input 
                type="text" 
                readOnly 
                value={display} 
                className="text-right text-2xl font-mono h-12"
            />
            <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="col-span-4" onClick={handleClear}>C</Button>
                 {buttons.map(btn => (
                    <Button 
                        key={btn} 
                        variant={btn === '=' ? 'default' : 'outline'}
                        onClick={() => handleButtonClick(btn)}
                    >
                        {btn}
                    </Button>
                 ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
