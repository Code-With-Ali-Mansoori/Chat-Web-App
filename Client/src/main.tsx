// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ContextHanlder_Function } from './Context/ContectFunction.tsx';
import SocketProvider from './Context/SocketProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ContextHanlder_Function>
                    <SocketProvider>
                        <App />
                    </SocketProvider>
                </ContextHanlder_Function>
            </QueryClientProvider>
        </BrowserRouter>
)
