import {ChangeEvent, useState} from 'react';

const App = () => {
  const [inputValue, setInputValue] = useState(0);
  const [started, setStarted] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);

  const inputValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = +e.target.value;

    if (newValue > 100) {
      setInputValue(100);

      return;
    }

    if (newValue < 1) {
      setInputValue(1);

      return;
    }

    setInputValue(newValue);
  }

  const handleStart = () => {
    setStarted(true);
    const concurrencyLimit = inputValue;
    const totalRequests = 1000;
    const delayBetweenRequests = 1000 / concurrencyLimit;

    const sendRequest = async (index: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          const response = await fetch('http://localhost:4000/api', {
            method: 'POST',
            body: JSON.stringify({ index }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json()
          setResponses((prevResponses) => [...prevResponses, data]);
          resolve();
        }, index * delayBetweenRequests);
      });
    };

    const sendRequests = () => {
      const promises = [];
      for (let i = 0; i < totalRequests; i++) {
        promises.push(sendRequest(i + 1));
        if (i % concurrencyLimit === 0) {
          Promise.all(promises);
        }
      }
    };

    sendRequests();
  };

  return (
    <div>
      <input
        type="number"
        min="0"
        max="100"
        required
        value={inputValue}
        onChange={inputValueHandler}
      />
      <button onClick={handleStart} disabled={started}>
        Start
      </button>
      <ul>
        {responses.map((response, index) => (
          <li key={index}>Response: {`${response}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
