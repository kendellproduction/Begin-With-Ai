import { navigateAfterAuth } from '../utils/navigationUtils';

describe('navigateAfterAuth', () => {
  test('redirects to /lessons by default', () => {
    const calls = [];
    const navigate = (path, opts) => { calls.push({ path, opts }); };
    navigateAfterAuth(navigate);
    expect(calls[0].path).toBe('/lessons');
    expect(calls[0].opts?.replace).toBe(true);
  });

  test('respects replace=false', () => {
    const calls = [];
    const navigate = (path, opts) => { calls.push({ path, opts }); };
    navigateAfterAuth(navigate, false);
    expect(calls[0].path).toBe('/lessons');
    expect(calls[0].opts?.replace).toBe(false);
  });
});


