export function setHashValue(name: string, value: string) {
  const hash = window.location.hash.replace(/^#/, "");
  const params  = new URLSearchParams(hash);
  if(value) {
    params.set(name, value);
  } else {
    params.delete(name);
  }
  window.location.hash = params.toString();
};

export function getHashValue(name: string) {
  const hash = window.location.hash.replace(/^#/, "");
  const params  = new URLSearchParams(hash);
  return params.get(name);
};
