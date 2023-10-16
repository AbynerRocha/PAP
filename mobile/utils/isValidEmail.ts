export function isValidEmail(email: string) {
    // Expressão regular para verificar o formato básico de um email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    return emailRegex.test(email);
}