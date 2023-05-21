package inf.infsusbackend.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OibValidator implements ConstraintValidator<ValidOib, String> {

    private static final int asciiDigitsOffset = '0';

    @Override
    public void initialize(ValidOib constraintAnnotation) {
        // No initialization required
    }

    @Override
    public boolean isValid(String oib, ConstraintValidatorContext context) {
        return isValidOib(oib);
    }

    private boolean isValidOib(String oib) {
        if (oib.length() != 11) {
            return false;
        }

        char[] chars = oib.toCharArray();

        int a = 10;
        for (int i = 0; i < 10; i++) {
            char c = chars[i];
            if (c < '0' || c > '9') {
                return false;
            }
            a = a + (c - asciiDigitsOffset);
            a = a % 10;
            if (a == 0) {
                a = 10;
            }
            a *= 2;
            a = a % 11;
        }
        int kontrolni = 11 - a;
        kontrolni = kontrolni % 10;

        return kontrolni == (chars[10] - asciiDigitsOffset);
    }
}