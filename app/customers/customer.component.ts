import {
    Component,
    OnInit
} from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    AbstractControl,
    ValidatorFn,
    FormArray
} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { Customer } from './customer';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
    let emailControl = c.get('email');
    let confirmEmailControl = c.get('confirmEmail');
    if (emailControl.pristine || confirmEmailControl.pristine) {
        return null;
    }
    if (emailControl.value === confirmEmailControl.value) {
        return null;
    }
    return { 'match': true };
}

function ratingRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value != undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        }
        return null;
    }
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customer: Customer = new Customer();
    customerForm: FormGroup;
    emailMessage: string;

    get addresses(): FormArray {
        return <FormArray>this.customerForm.get('addresses');
    }

    private validationMessages = {
        required: 'Enter your email address',
        pattern: 'Please enter a valid email address'
    };

    constructor(private fb: FormBuilder) { }

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm.value));
    }

    ngOnInit(): void {
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmEmail: ['', [Validators.required]]
            }, { validator: emailMatcher }),
            phone: '',
            notification: 'email',
            rating: ['', [ratingRange(1, 5)]],
            sendCatalog: true,
            addresses: this.fb.array([this.buildAddress()])
        });

        this.customerForm.get('notification').valueChanges
            .subscribe(value => this.setNotification(value));

        var emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges
            .debounceTime(1000)
            .subscribe(value => this.setMessage(emailControl));
    }

    buildAddress(): FormGroup {
        return this.fb.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    }

    addAddress(): void {
        this.addresses.push(this.buildAddress());
    }

    fillValues() {
        this.customerForm.patchValue({
            firstName: 'wsdsa',
            lastName: 'asds'
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

    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors)
                .map(key => this.validationMessages[key])
                .join(' ');
        }
    }
}
