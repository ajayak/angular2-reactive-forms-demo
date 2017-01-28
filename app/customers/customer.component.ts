import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl
} from '@angular/forms';

import { Customer } from './customer';

function ratingRange(c: AbstractControl): { [key: string]: boolean } | null {
    if (c.value != undefined && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
        return { 'range': true };
    }
    return null;
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customer: Customer = new Customer();
    customerForm: FormGroup;

    constructor(private fb: FormBuilder) { }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
            phone: '',
            notification: 'email',
            rating: ['', [ratingRange]],
            sendCatalog: false
        });
    }

    fillValues() {
        this.customerForm.patchValue({
            firstName: 'wsdsa',
            lastName: 'asds',
            email: 'asd@a.com'
        });
    }

    setNotification(notifyBy: string) {
        var phone = this.customerForm.get('phone');
        if (notifyBy === 'text') {
            phone.setValidators([Validators.required]);
        } else {
            phone.clearValidators();
        }
        phone.updateValueAndValidity();
    }
}
