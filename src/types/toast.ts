/**
 * Contrato del aviso flotante (toast).
 *
 * Vive aparte de la implementación para que el componente y el provider no
 * mezclen los tipos con la lógica de animación y de estado.
 */

/** Tono del aviso: define el color pastel de fondo y el color fuerte. */
export type AppToastVariant = 'success' | 'error' | 'warning' | 'info';

/** Lo que se pide al provider para mostrar un aviso. */
export interface AppToastOptions {
  message: string;
  title?: string;
  variant?: AppToastVariant;
  /** Milisegundos que permanece visible antes de salir solo. */
  duration?: number;
}

/** Props del componente que dibuja el aviso. */
export interface AppToastProps {
  visible: boolean;
  message: string;
  title?: string;
  variant?: AppToastVariant;
  /** Milisegundos que permanece visible antes de salir solo. */
  duration?: number;
  /**
   * Cambia en cada aviso nuevo. Fuerza a reiniciar la animación aunque el
   * aviso anterior siga en pantalla.
   */
  id?: number;
  onHide?: () => void;
}
