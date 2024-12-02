import { AbstractControl, FormGroup, ValidationErrors }  from '@angular/forms'
import * as _ from 'lodash-es';

export class UsuarioValidators {
    
    static matchPasswords(control: AbstractControl) : ValidationErrors | null {

        let form = control as FormGroup;
        
        let pass =form.controls['password'];
        let passconfirmed =form.controls['passwordconfirmed'];
        
        // check password validation
        if(!_.isEmpty(pass.value) || !_.isEmpty(passconfirmed.value)) {

            if(pass.value != passconfirmed.value) {
                pass.setErrors({matchpass : true});
                passconfirmed.setErrors({matchpass : true});
                return {matchpass : true} ;
            }
        } 

        pass.setErrors(null);
        passconfirmed.setErrors(null);

        return null;
    }
}