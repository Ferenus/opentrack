import React, {useState} from 'react';
import './App.css';

interface Container {
    container_id: string;
    port_name: string;
    terminal_name: string;
    firms_code: string;
    vessel_name: string;
    imo: string;
}

function App() {
    const [query, setQuery] = useState("");
    const [output, setOutput] = useState<Container[]>([]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        async function fetchContainers() {
            const response = await fetch('https://t6bpo2ljra.execute-api.us-east-2.amazonaws.com/prod/?q=' + query, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'GET',
            });
            if (response.status !== 400) {
                const data = await response.json();
                const a = data.map((r: any) => r._source);
                console.log(a);
                setOutput(a);
            }
        };
        fetchContainers();
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Search for containers'
                    onChange={onChange}
                    required
                />

                <button type='submit'>Search</button>
            </form>
            {output.map((container, i) => <div key={i}>{JSON.stringify(container)}</div>)}
        </div>
    );
}

export default App;
