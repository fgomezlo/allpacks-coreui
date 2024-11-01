import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function samePasswords(): ValidatorFn {

    return (form: AbstractControl): ValidationErrors | null => {

        const clave:string | null = form.get("clave")?.value;

        const claveconfirm:string | null = form.get("claveConfirmar")?.value;

        if(claveconfirm != clave) {
            form.get("claveConfirmar")?.setErrors({ missmatchclave : true});
            return { missmatchclave : true}
        }

        form.get("claveConfirmar")?.setErrors(null);
        return null;
    }
}