'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Converter = ({ symbol, icon, priceList }: ConverterProps) => {
  const [currency, setCurrency] = useState('usd');
  const [amount, setAmount] = useState('10');

  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0);

  return (
    <div className="w-full space-y-5">
      <h4 className="text-2xl font-semibold">{symbol.toUpperCase()} Converter</h4>

      <div className="space-y-2 bg-dark-500 px-5 py-7 rounded-lg">
        <div className="bg-dark-400 h-12 w-full rounded-md flex items-center justify-between py-4 pr-4">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 text-lg! border-none font-medium bg-dark-400! focus-visible:ring-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="flex items-center gap-1">
            <Image src={icon} alt={symbol} width={20} height={20} />
            <p className="font-semibold text-base text-purple-100">{symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="relative flex justify-center items-center my-4">
          <div className="h-px z-10 w-full bg-dark-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <Image
            src="/converter.svg"
            alt="converter"
            width={32}
            height={32}
            className="size-8 z-20 bg-dark-400 rounded-full p-2 text-green-500"
          />
        </div>

        <div className="bg-dark-400 h-12 w-full rounded-md flex items-center justify-between py-4 pl-4">
          <p className="text-base font-medium">
            {formatCurrency(convertedPrice, 2, currency, false)}
          </p>

          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger
              className="w-fit! border-none! cursor-pointer! h-12! bg-dark-400! hover:bg-dark-400! focus-visible:ring-0!"
              value={currency}
            >
              <SelectValue
                placeholder="Select"
                className="font-semibold! text-xs! text-purple-100!"
              >
                {currency.toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-dark-400 max-h-125">
              {Object.keys(priceList).map((currencyCode) => (
                <SelectItem
                  value={currencyCode}
                  key={currencyCode}
                  className="cursor-pointer hover:bg-dark-500!"
                >
                  {currencyCode.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
export default Converter;
