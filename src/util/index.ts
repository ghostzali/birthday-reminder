export function encodeURIParams(params: object): string {
  let uri = "";
  Object.entries(params).forEach(([key, value]) => {
    uri += `${uri ? "&" : ""}${key}=${encodeURIComponent(value)}`;
  });

  return uri;
}
