import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Customer } from './customer';

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
            firstName: '',
            lastName: '',
            email: '',
            sendCatalog: false
        });
    }

    fillValues() {
        this.customerForm.setValue({
            firstName: 'wsdsa',
            lastName: 'asds',
            email: 'asd!@a'
        });
    }
}
