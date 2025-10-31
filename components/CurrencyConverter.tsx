import React, { useState, useEffect } from 'react';
import ResultCard from './ResultCard';
import { CurrencyExchangeIcon, CameraIcon } from './Icons';
import Spinner from './Spinner';

// 擴充的貨幣列表
const currencies = ['TWD', 'JPY', 'USD', 'KRW', 'CNY', 'THB', 'EUR', 'GBP', 'VND', 'MYR', 'HKD', 'SGD'];

// 備用匯率 (以 TWD 為基準)
const fallbackRates: { [key: string]: number } = {
  'TWD': 1, 'JPY': 4.9, 'USD': 0.031, 'KRW': 42.8, 'CNY': 0.22, 'THB': 1.14, 'EUR': 0.029, 'GBP': 0.025, 'VND': 787, 'MYR': 0.14, 'HKD': 0.24, 'SGD': 0.042,
};

interface CurrencyConverterProps {
    t: any;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ t }) => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('JPY');
    const [toCurrency, setToCurrency] = useState('TWD');
    const [tax, setTax] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        const fetchRates = async () => {
            const today = new Date().toISOString().split('T')[0];
            try {
                const cachedData = localStorage.getItem('exchangeRatesCache');
                if (cachedData) {
                    const { date, rates: cachedRates } = JSON.parse(cachedData);
                    if (date === today) {
                        setRates(cachedRates);
                        setLastUpdated(date);
                        setIsLoading(false);
                        return;
                    }
                }

                const response = await fetch('https://open.er-api.com/v6/latest/TWD');
                if (!response.ok) throw new Error('API request failed');
                const data = await response.json();
                
                if (data.result === 'success') {
                    setRates(data.rates);
                    setLastUpdated(today);
                    localStorage.setItem('exchangeRatesCache', JSON.stringify({ date: today, rates: data.rates }));
                } else {
                    throw new Error('API returned error');
                }
            } catch (err) {
                console.error("Failed to fetch rates:", err);
                setError(t.ratesUpdateError);
                setRates(fallbackRates); // 使用備用匯率
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() -1);
                setLastUpdated(yesterday.toISOString().split('T')[0]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRates();
    }, [t.ratesUpdateError]);

    useEffect(() => {
        if (!rates) return;
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const numAmount = parseFloat(amount);

        if (!isNaN(numAmount) && fromRate && toRate) {
            // 所有匯率都以TWD為基準，所以先換算成TWD再換算成目標貨幣
            const amountInTWD = numAmount / fromRate;
            const convertedAmount = amountInTWD * toRate;
            const taxRate = parseFloat(tax);
            const final = !isNaN(taxRate) ? convertedAmount * (1 - taxRate / 100) : convertedAmount;
            setResult(final);
        } else {
            setResult(null);
        }
    }, [amount, fromCurrency, toCurrency, tax, rates]);
    
    return (
        <ResultCard title={t.currencyConverter} icon={<CurrencyExchangeIcon />}>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Spinner />
                    <p className="ml-2">{t.updatingRates}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.localPrice}</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" className="input-primary" disabled={isLoading} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.taxRefundRate}</label>
                            <input type="number" value={tax} onChange={e => setTax(e.target.value)} placeholder="10" className="input-primary" disabled={isLoading} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.sourceCurrency}</label>
                            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="input-primary" disabled={isLoading}>
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.targetCurrency}</label>
                            <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="input-primary" disabled={isLoading}>
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    {result !== null && (
                        <div className="mt-4 p-4 bg-black/20 rounded-lg text-center">
                            <span className="text-lg font-medium opacity-80">{t.finalPrice}: </span>
                            <span className="text-2xl font-bold text-cyan-400">{result.toFixed(2)} {toCurrency}</span>
                        </div>
                    )}
                    <a href="https://images.google.com/" target="_blank" rel="noopener noreferrer" className="button-secondary w-full mt-4 flex items-center justify-center gap-2 text-center">
                        <CameraIcon /> {t.snapshotPriceCheck}
                    </a>
                    <div className="text-xs text-center mt-4 opacity-60">
                        {error && <p className="text-yellow-400 mb-1">{error}</p>}
                        {lastUpdated && <p>{t.ratesLastUpdated}: {lastUpdated}</p>}
                    </div>
                </>
            )}
        </ResultCard>
    );
};

export default CurrencyConverter;