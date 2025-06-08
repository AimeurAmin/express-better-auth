import { IncomingHttpHeaders } from "http"


export default (headers: IncomingHttpHeaders) => 
  new Headers(
    Object.entries(headers)
      .map(([key, value]) => [key, value as string])
  )