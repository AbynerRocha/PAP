export function isValidEmail(email: string) {
    // Expressão regular para verificar o formato básico de um email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    return emailRegex.test(email);
}