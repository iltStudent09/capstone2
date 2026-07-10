import { useCallback, useMemo } from 'react'
import { useAuth } from './useAuth'

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown
}

function normalizeApiError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while calling the API.'
}

export function useApi(baseUrl = '/api') {
  const { currentUser } = useAuth()

  const request = useCallback(
    async <TResponse>(
      path: string,
      init: ApiRequestInit = {},
    ): Promise<TResponse> => {
      const { body, headers, ...rest } = init

      try {
        const response = await fetch(`${baseUrl}${path}`, {
          ...rest,
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser
              ? {
                  'x-user-id': String(currentUser.id),
                  'x-user-role': currentUser.role,
                }
              : {}),
            ...(headers ?? {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        if (response.status === 204) {
          return undefined as TResponse
        }

        return (await response.json()) as TResponse
      } catch (error) {
        throw new Error(normalizeApiError(error))
      }
    },
    [baseUrl, currentUser],
  )

  const get = useCallback(
    <TResponse,>(path: string) => request<TResponse>(path),
    [request],
  )

  const post = useCallback(
    <TResponse, TBody>(path: string, body: TBody) =>
      request<TResponse>(path, {
        method: 'POST',
        body,
      }),
    [request],
  )

  const put = useCallback(
    <TResponse, TBody>(path: string, body: TBody) =>
      request<TResponse>(path, {
        method: 'PUT',
        body,
      }),
    [request],
  )

  const remove = useCallback(
    <TResponse,>(path: string) =>
      request<TResponse>(path, {
        method: 'DELETE',
      }),
    [request],
  )

  return useMemo(
    () => ({
      get,
      post,
      put,
      remove,
    }),
    [get, post, put, remove],
  )
}