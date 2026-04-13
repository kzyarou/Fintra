import React from 'react';
import { Card } from '../types/finance';
import { useFinance } from '../context/FinanceContext';
const cardStyles = [
{
  bg: 'bg-gradient-to-br from-[#0D6B4B] to-[#0A4D36]',
  text: 'text-white',
  accent: 'bg-white/10'
},
{
  bg: 'bg-gradient-to-br from-[#D4AF37] to-[#AA8C2C]',
  text: 'text-white',
  accent: 'bg-white/20'
},
{
  bg: 'bg-gradient-to-br from-[#1C1C1E] to-[#3A3A3C]',
  text: 'text-white',
  accent: 'bg-white/10'
}];

export function CreditCard({
  card,
  index = 0



}: {card: Card;index?: number;}) {
  const { currencySymbol } = useFinance();
  const style = cardStyles[index % cardStyles.length];
  return (
    <div
      className={`${style.bg} ${style.text} rounded-[2rem] p-7 shadow-card relative overflow-hidden w-full h-[220px] flex flex-col justify-between`}>
      
      {/* Decorative elements */}
      <div
        className={`absolute top-0 right-0 w-48 h-48 rounded-full mix-blend-overlay opacity-40 -mr-16 -mt-16 pointer-events-none ${style.accent} blur-2xl`}>
      </div>
      <div
        className={`absolute bottom-0 left-0 w-32 h-32 rounded-full mix-blend-overlay opacity-40 -ml-12 -mb-12 pointer-events-none ${style.accent} blur-xl`}>
      </div>

      {/* Geometric circles */}
      <div className="absolute top-8 right-8 flex gap-1 opacity-80">
        <div className="w-8 h-8 rounded-full border border-white/30"></div>
        <div className="w-8 h-8 rounded-full border border-white/30 -ml-4 bg-white/10 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-medium opacity-90 tracking-wide">
          {card.name}
        </h3>
      </div>

      <div className="relative z-10 mt-auto mb-6">
        <p className="text-sm opacity-80 mb-1">Available Balance</p>
        <p className="text-4xl font-bold tracking-tight">
          {currencySymbol}
          {card.balance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      <div className="relative z-10 flex justify-between items-end">
        <p className="font-mono text-sm tracking-[0.2em] opacity-90">
          {card.cardNumber}
        </p>
        <div className="text-lg font-bold italic tracking-tighter opacity-90">
          {card.type === 'visa' ? 'VISA' : 'mastercard'}
        </div>
      </div>
    </div>);

}