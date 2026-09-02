import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// Small hook harness keeps these component tests in the project's Node-only suite.
const hooks = vi.hoisted(() => ({
  refs: [] as { current: unknown }[],
  index: 0,
  state: 'ready',
  effect: undefined as undefined | (() => () => void),
}));
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  useRef: (initial: unknown) => {
    const i = hooks.index++;
    return hooks.refs[i] ?? (hooks.refs[i] = { current: initial });
  },
  useState: () => [
    hooks.state,
    (value: string) => {
      hooks.state = value;
    },
  ],
  useEffect: (effect: () => () => void) => {
    hooks.effect = effect;
  },
}));
import { UnsubscribeForm } from '@/components/unsubscribe-form';
const first = 'a'.repeat(64);
const second = 'b'.repeat(64);
let location: { hash: string; pathname: string };
let listeners: Set<() => void>;
let cleanup: (() => void) | undefined;
const fetchMock = vi.fn();
function render() {
  hooks.index = 0;
  return UnsubscribeForm();
}
function mount(hash = '') {
  location.hash = hash;
  render();
  cleanup = hooks.effect!();
}
function change(hash: string) {
  location.hash = hash;
  for (const listener of listeners) listener();
}
async function confirm() {
  const tree = render() as ReactElement<{
    children: [ReactElement, ReactElement<{ onClick: () => Promise<void> }>];
  }>;
  await tree.props.children[1].props.onClick();
}
beforeEach(() => {
  hooks.refs = [];
  hooks.index = 0;
  hooks.state = 'ready';
  hooks.effect = undefined;
  cleanup = undefined;
  location = { hash: '', pathname: '/unsubscribe' };
  listeners = new Set();
  vi.stubGlobal('window', {
    location,
    history: {
      replaceState: vi.fn(() => {
        location.hash = '';
      }),
    },
    addEventListener: (name: string, callback: () => void) => {
      if (name === 'hashchange') listeners.add(callback);
    },
    removeEventListener: (name: string, callback: () => void) => {
      if (name === 'hashchange') listeners.delete(callback);
    },
  });
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(Response.json({ ok: true, status: 'unsubscribed' }));
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup?.();
  vi.unstubAllGlobals();
});
it('captures a fresh valid fragment, scrubs the URL and waits for confirmation', async () => {
  mount('#token=' + first);
  expect(hooks.state).toBe('ready');
  expect(location.hash).toBe('');
  expect(fetchMock).not.toHaveBeenCalled();
  await confirm();
  expect(hooks.state).toBe('unsubscribed');
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ token: first });
});
it('initializes when an already-open page receives a valid hash', async () => {
  mount();
  expect(hooks.state).toBe('invalid_token');
  change('#token=' + first);
  expect(hooks.state).toBe('ready');
  await confirm();
  expect(hooks.state).toBe('unsubscribed');
});
it('replaces the token and resets a prior result to confirmation', async () => {
  mount('#token=' + first);
  await confirm();
  change('#token=' + second);
  expect(hooks.state).toBe('ready');
  await confirm();
  expect(JSON.parse(fetchMock.mock.calls[1][1].body).token).toBe(second);
});
it('clears retained credentials on an empty hashchange', () => {
  mount('#token=' + first);
  change('');
  expect(hooks.state).toBe('invalid_token');
  expect(hooks.refs[0].current).toBe('');
  expect(fetchMock).not.toHaveBeenCalled();
});
it.each([
  '#token=bad',
  '#token=' + 'A'.repeat(64),
  '#token=' + first + '&token=' + second,
  '#unrelated=value',
])('rejects malformed or ambiguous fragments', (hash) => {
  mount('#token=' + first);
  change(hash);
  expect(hooks.state).toBe('invalid_token');
  expect(hooks.refs[0].current).toBe('');
  expect(location.hash).toBe('');
  expect(fetchMock).not.toHaveBeenCalled();
});
it('retains captured token across Strict Mode effect replay and removes listeners', async () => {
  mount('#token=' + first);
  cleanup!();
  expect(listeners.size).toBe(0);
  cleanup = hooks.effect!();
  expect(listeners.size).toBe(1);
  await confirm();
  expect(hooks.state).toBe('unsubscribed');
});
it('ignores stale success after the fragment changes during processing', async () => {
  let resolve!: (r: Response) => void;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise<Response>((r) => {
        resolve = r;
      }),
  );
  mount('#token=' + first);
  const task = confirm();
  expect(hooks.state).toBe('processing');
  change('#token=' + second);
  expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  resolve(Response.json({ ok: true, status: 'unsubscribed' }));
  await task;
  expect(hooks.state).toBe('ready');
  await confirm();
  expect(JSON.parse(fetchMock.mock.calls[1][1].body).token).toBe(second);
});
it('ignores stale failure after fragment removal', async () => {
  let reject!: (e: Error) => void;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise((_r, rej) => {
        reject = rej;
      }),
  );
  mount('#token=' + first);
  const task = confirm();
  change('');
  reject(new Error('aborted'));
  await task;
  expect(hooks.state).toBe('invalid_token');
});
it.each(['already_unsubscribed', 'invalid_token', 'temporary_error'])(
  'preserves the %s response state',
  async (state) => {
    fetchMock.mockResolvedValue(
      Response.json(
        state === 'already_unsubscribed'
          ? { ok: true, status: state }
          : { ok: false, error: state },
        { status: state === 'already_unsubscribed' ? 200 : 400 },
      ),
    );
    mount('#token=' + first);
    await confirm();
    expect(hooks.state).toBe(state);
  },
);
it('never renders tokens or includes them in request URLs or console output', async () => {
  const log = vi.spyOn(console, 'log');
  const error = vi.spyOn(console, 'error');
  const warn = vi.spyOn(console, 'warn');
  mount('#token=' + first);
  expect(renderToStaticMarkup(render())).not.toContain(first);
  expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/unsubscribe');
  await confirm();
  expect(renderToStaticMarkup(render())).not.toContain(first);
  expect(fetchMock.mock.calls[0][0]).toBe('/api/unsubscribe');
  expect(log).not.toHaveBeenCalled();
  expect(error).not.toHaveBeenCalled();
  expect(warn).not.toHaveBeenCalled();
});
