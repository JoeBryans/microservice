// 'use client';

// import { AuthProvider } from '@/context/auth/provider';
// import { authInitialState, authReducer } from '@/context/auth/reducer';
// import { useEffect, useReducer } from 'react';

// export function AuthProviders({ children }: { children: React.ReactNode }) {
//     const [state, dispatch] = useReducer(authReducer, authInitialState);
     
//     useEffect(() => {
//         // Add your auth provider here
//         if (state.accessToken === null) {
//             const resfresh = async () => {
//                 console.log("resfresh");
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh_token`, {
//                     method: 'GET',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     credentials: 'include',

//                 });
//                 console.log("res: ", res);
//                 if (res.ok) {
//                     const data = await res.json();
//                     console.log("data: ", data);
//                     dispatch({
//                         type: 'LOGIN',
//                         payload: {
//                             user: {
//                                 id: data.id,
//                                 email: data.email,
//                                 phone: data.phone,
//                                 name: data.name,
//                                 role: data.role,
//                             },
//                             accessToken: data.accessToken,
//                         },
//                     });
//                 }

//             }
//             resfresh()
//         }
//     }, [state.accessToken]);
//     return <AuthProvider>{children}</AuthProvider>;
// }
