import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const Todos = () => {
    const [text, setText] = useState({
        email: '',
        password: '',
    });
    const [token, setToken] = useState({
        access: '',
        refresh: '',
    });

    const { email, password } = text;

    const queryClient = useQueryClient();

    const fetchTooList = async () => {
        // axios으로 로그인 요청 (post)
        let res = await axios({
            method: 'POST',
            url: '/auth/api/v1/token/login',
            data: {
                login_id: email,
                login_pswd: password,
                login_type: 'BASIC',
            },
        });
        return res;
    };

    const {
        mutate: login,
        isLoading,
        isError,
        error,
    } = useMutation('todos', fetchTooList, {
        refetchOnWindowFocus: false,
        retry: 0,
        onSuccess: data => {
            console.log(data);
            setToken({
                ...token,
                access: data.data.tokeninfo.access_token,
                refresh: data.data.tokeninfo.refresh_token,
            });
            // If the login is successful, invalidate the todos query to force it to refetch
            queryClient.invalidateQueries();
            queryClient.invalidateQueries('todos');
        },
        onError: e => {
            console.log(e.message);
        },
        enabled: false,
    });

    const onChange = e => {
        const { name, value } = e.target;
        setText({
            ...text,
            [name]: value,
        });
    };

    const onSubmit = e => {
        e.preventDefault();
        login();
    };
    return (
        <>
            <form onSubmit={onSubmit}>
                <label>
                    <h5>로그인해주세요</h5>
                    <input type="email" name="email" value={email} placeholder="아이디" required onChange={onChange} />
                    <input type="password" name="password" value={password} placeholder="비밀번호" required onChange={onChange} />
                    <button>제출</button>
                </label>
            </form>

            {isLoading && <span>Loading...</span>}
            {isError && <span>Error: {error.message}</span>}
            <div>access_token : {token.access}</div>
            <div>refresh_token : {token.refresh}</div>
        </>
    );
};

export default Todos;
