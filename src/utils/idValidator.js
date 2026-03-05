/**
 * Validates Spanish NIF, NIE and CIF
 * NIF: Personal ID for Spaniards (8 digits + 1 control letter)
 * NIE: Personal ID for foreigners (X, Y, Z prefix + 7 digits + 1 control letter)
 * CIF: Business Tax ID (1 letter prefix + 7/8 digits + control digit/letter)
 */

const validateSpanishId = (id) => {
    if (!id) return false;
    const cleanId = id.trim().toUpperCase();

    // NIF / NIE Regex
    const nifNieRegex = /^[XYZ\d]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;

    if (nifNieRegex.test(cleanId)) {
        let text = cleanId;
        if (text.startsWith('X')) text = text.replace('X', '0');
        if (text.startsWith('Y')) text = text.replace('Y', '1');
        if (text.startsWith('Z')) text = text.replace('Z', '2');

        const dni = text.substring(0, 8);
        const letter = cleanId.charAt(8);
        const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        return validLetters.charAt(parseInt(dni) % 23) === letter;
    }

    // Simple CIF check (basic format)
    const cifRegex = /^[ABCDEFGHJNPQRSUVW]\d{7}[\dA-J]$/;
    return cifRegex.test(cleanId);
};

module.exports = { validateSpanishId };
