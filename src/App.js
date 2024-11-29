import { useState, useEffect } from "react";

// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInputChange = (e) => {
    // console.log(e.target.value);
    setUserInput(e.target.value);
  };

  const handleCurrencyFromChange = (e) => {
    // console.log(e.target.value, "C Fr");
    setCurrencyFrom(e.target.value);
  };

  const handleCurrencyToChange = (e) => {
    // console.log(e.target.value, "C To");
    setCurrencyTo(e.target.value);
  };

  useEffect(
    function () {
      if (!userInput) return;
      if (currencyFrom === currencyTo) {
        setOutput(userInput);
        return;
      }

      const controller = new AbortController();

      const fetchExchange = async () => {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${+userInput}&from=${currencyFrom}&to=${currencyTo}`,
            { signal: controller.signal }
          );
          const data = await res.json();

          // console.log(Object.values(data.rates).at(0));
          setOutput(Object.values(data.rates).at(0));
          setIsLoading(false);
        } catch (err) {
          console.log(err.message);
        }
      };

      fetchExchange();

      return () => {
        controller.abort();
      };
    },
    [userInput, currencyFrom, currencyTo]
  );

  return (
    <div>
      <input
        type="text"
        value={userInput}
        onChange={handleUserInputChange}
        disabled={isLoading}
      />
      <select
        value={currencyFrom}
        onChange={handleCurrencyFromChange}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={currencyTo}
        onChange={handleCurrencyToChange}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{isLoading ? "Loading..." : `OUTPUT ${output}`}</p>
    </div>
  );
}
