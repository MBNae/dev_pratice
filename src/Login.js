import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const { email, password } = credentials;

    const queryClient = useQueryClient();

    const fetchLogin = async () => {
        // try {
        const response = await axios.post('https://reqres.in/api/login', {
            email: email,
            password: password,
        });
        //     return response.data;
        // } catch (error) {
        //     throw new Error(error.message);
        // }
        // return response;
    };

    const { isLoading, isError, data, error } = useQuery('login', fetchLogin, {
        refetchOnWindowFocus: false,
        retry: 0,
        enabled: false,
        onSuccess: data => {
            console.log(data.data);
        },
        onError: e => {
            console.log(e, e.message);
        },
    });

    const handleSubmit = event => {
        event.preventDefault();
        fetchLogin();
        // Call the login API
        setCredentials({ email: '', password: '' });
        // queryClient.invalidateQueries('login');
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setCredentials({ ...credentials, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={handleChange} />
            </div>
            <button type="submit">Submit</button>
            {isLoading && <p>Loading...</p>}
            {isError && <p>{error.message}</p>}
            {data && <p>Login successful!</p>}
        </form>
    );
};

export default Login;
