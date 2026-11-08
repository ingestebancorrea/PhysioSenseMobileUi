/**
 * @format
 *
 * El aviso flotante queda montado aunque esté oculto para poder animar su
 * salida. Si esa tarjeta transparente sigue recibiendo toques, bloquea los
 * botones que caen en su franja (por ejemplo, "Marcar todas como leídas").
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { AppToast } from '../src/components/common/toast/AppToast';

const renderToast = (
  visible: boolean,
): ReactTestRenderer.ReactTestRenderer => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;

  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <AppToast visible={visible} title="Listo" message="Aviso de prueba" />,
    );
  });

  return tree as ReactTestRenderer.ReactTestRenderer;
};

test('oculto no intercepta los toques de la pantalla', () => {
  const tree = renderToast(false);

  const touchBlockers = tree.root.findAll(
    node => node.props?.pointerEvents === 'none',
  );

  expect(touchBlockers.length).toBeGreaterThan(0);

  ReactTestRenderer.act(() => {
    tree.unmount();
  });
});

test('visible deja interactuar con su tarjeta', () => {
  const tree = renderToast(true);

  const wrappers = tree.root.findAll(
    node => node.props?.pointerEvents === 'box-none',
  );

  expect(wrappers.length).toBeGreaterThan(0);

  ReactTestRenderer.act(() => {
    tree.unmount();
  });
});
