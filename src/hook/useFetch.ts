import { useState, useEffect } from "react";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  redirect?: RequestRedirect;
  headers?: HeadersInit;
}

export const useFetch = (): ((
  url: string,
  requestOptions: any
) => Promise<any>) => {
  const fetchData = (
    url: string,
    requestOptions: RequestOptions
  ): Promise<any> => {
    // Add dynamic values to the request headers
    const headers = new Headers(requestOptions.headers || {});

    const selectedMode = localStorage.getItem("model");

    headers.append("X-Ai-Model", selectedMode || "gpt-4");

    // Update requestOptions with the new headers
    requestOptions.headers = headers;

    return fetch(url, requestOptions);
  };
  return fetchData;
};
