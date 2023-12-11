export function dummy_success(): boolean {
  return true;
}

export function dummy_fail(): boolean {
  return false;
}

export function dummy_error(): boolean {
  throw new Error('This is an expected Error!');
}
