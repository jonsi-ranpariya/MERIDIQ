import api from "@configs/api";
import { AuthUserResponse, User } from "@interface/model/user";
import strings from "@lang/Lang";
import FullPageLoading from "@partials/Loadings/FullPageLoading";
import { LoginFormValues } from "@validations/login";
import React, { createContext } from "react";
import useSWR, { KeyedMutator } from "swr";

export interface AuthProviderProps {
  user?: User | null,
  mutate: KeyedMutator<AuthUserResponse>,
  loading: boolean,
  error: Error | null,
  loggedOut: boolean,
  sessionOut: boolean,
  userType: {
    isMasterAdmin: boolean;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isUser: boolean;
  }
  loginUser: (data: LoginFormValues) => any,
}

export const AuthContext = createContext<AuthProviderProps>({
  error: null,
  loading: true,
  mutate: async () => { return undefined },
  loggedOut: false,
  sessionOut: false,
  userType: {
    isMasterAdmin: false,
    isSuperAdmin: false,
    isAdmin: false,
    isUser: false,
  },
  loginUser: () => {}
});


const userFetcher = async (url: RequestInfo, init?: RequestInit): Promise<any> => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": 'application/json',
        'X-App-Locale': strings.getLanguage() || 'en',
      },
      credentials: "include",
    });

    const json = await res.json();

    if (res.status === 200 && json?.status === '1') {
      return json;
    } else if (res.status === 401 && json?.status === '0') {
      const error = new Error("Not authorized!") as Error;
      // @ts-ignore
      error.status = 401;
      throw error;
    } else {
      const error = new Error(json?.message || "Not authorized!") as Error;
      // @ts-ignore
      error.status = res.status || 500;
      throw error;
    }

  } catch (error) {
    // @ts-ignore
    const err = new Error(error.message || "Not authorized!") as Error;
    // @ts-ignore
    err.status = error.status || 500;
    throw err;
  }
};


const loginUser = async (data: LoginFormValues): Promise<AuthUserResponse> => {
  const res = await fetch(api.login, {
    method: "POST",
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json',
      'X-App-Locale': strings.getLanguage() || 'en',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  return await res.json();
}

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children, ...props }) => {

  const { data, mutate, error } = useSWR<AuthUserResponse>(api.user, userFetcher, {
    errorRetryCount: 3,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    refreshInterval: 10000,
  });

  const isLoading = !data && !error;

  const loggedOut = error && (error.status === 401 || error.status === 410);

  const sessionOut = error && error.status === 410;
  const userType = {
    isMasterAdmin: data?.data.user_role === "master_admin",
    isSuperAdmin: data?.data.user_role === "admin" && data?.data?.email === data?.data?.company?.email,
    isAdmin: data?.data.user_role === "admin",
    isUser: data?.data.user_role === "user",
  }

  return (
    <AuthContext.Provider value={{
      user: data?.data,
      mutate,
      userType,
      loading: isLoading,
      error,
      sessionOut,
      loggedOut,
      loginUser: loginUser,
    }}>
      {isLoading ? <FullPageLoading /> : children}
    </AuthContext.Provider>
  );
}