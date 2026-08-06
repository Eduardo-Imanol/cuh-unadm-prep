const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/configuration-not-found':
    'Firebase Authentication no está activo. Actívalo en Firebase Console (Build → Authentication) y vuelve a intentar.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Correo electrónico inválido.',
  'auth/user-not-found': 'No existe una cuenta con este correo. Crea una cuenta.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/email-already-in-use': 'Ya existe una cuenta con este correo. Inicia sesión.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/missing-password': 'Ingresa tu contraseña.',
  'auth/user-disabled': 'La cuenta fue deshabilitada.',
  'auth/network-request-failed': 'Sin conexión: no se pudo verificar la sesión.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  'auth/unauthorized-domain':
    'Este dominio no está autorizado para autenticar. Agrégalo en Firebase Console → Authentication → Configuración.',
  'auth/operation-not-allowed': 'Este método de acceso no está habilitado. Actívalo en Firebase Console.',
  'auth/popup-closed-by-user': 'Cerraste la ventana de inicio de sesión antes de terminar.',
  'auth/cancelled-popup-request': 'La solicitud de acceso fue cancelada.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana. Permite pop-ups e inténtalo de nuevo.',
  'auth/account-exists-with-different-credential':
    'Ya existe una cuenta con este correo usando otro método. Usa ese método de acceso.',
  'auth/operation-not-supported-in-this-environment':
    'El inicio de sesión con Google no está habilitado para este proyecto. Actívalo en Firebase Console.',
};

export function mapAuthErrorMessage(code: string): string {
  return AUTH_ERROR_MESSAGES[code] ?? 'Ocurrió un error al autenticar.';
}
